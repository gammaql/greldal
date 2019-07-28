import { MappedDataSource } from "./MappedDataSource";
import _debug from "debug";
import * as types from "./types";
import * as t from "io-ts";
import {
    GraphQLObjectType,
    GraphQLFieldConfigMap,
    GraphQLInputObjectType,
    GraphQLInputFieldConfigMap,
    GraphQLString,
    GraphQLFloat,
    GraphQLList,
    GraphQLBoolean,
    GraphQLOutputType,
    GraphQLScalarType,
    GraphQLInputType,
    GraphQLInt,
} from "graphql";
import { transform, uniqueId, isArray, first, isNil, memoize, camelCase, upperFirst } from "lodash";
import { MappedField } from "./MappedField";
import { Maybe } from "./util-types";
import { JSONType } from "./json";
import { MaybeType } from "./maybe";
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from "graphql-iso-date";

const debug = _debug("greldal:graphql-type-mapper");

/**
 * Utilities to create GraphQL type descriptors from various GRelDAL specific inputs
 */

/**
 * GraphQL type representing information about current page in a paginated query
 */
export const pageInfoType = memoize(
    () =>
        new GraphQLObjectType({
            name: "GRelDALPageInfo",
            fields: {
                prevCursor: {
                    type: GraphQLString,
                },
                nextCursor: {
                    type: GraphQLString,
                },
                totalCount: {
                    type: GraphQLInt,
                },
            },
        }),
);

/**
 * Derive default GraphQL output type for specified data source
 */
export const deriveDefaultOutputType = <TSrc extends MappedDataSource>(mappedDataSource: TSrc) =>
    new GraphQLObjectType({
        name: mappedDataSource.mappedName,
        fields: () => mapOutputAssociationFields(mappedDataSource, mapOutputFields(mappedDataSource)),
    });

/**
 * Derive output type for a paginated query
 *
 * @param pageContainerName Name of page container type
 * @param pageName Name of page type
 * @param wrappedType GraphQL output type of the entity being queried
 */
export const derivePaginatedOutputType = (
    pageContainerName: string,
    pageName: string,
    wrappedType: GraphQLOutputType,
) =>
    new GraphQLObjectType({
        name: pageContainerName,
        fields: {
            page: {
                type: new GraphQLObjectType({
                    name: pageName,
                    fields: {
                        pageInfo: {
                            type: pageInfoType(),
                        },
                        entities: {
                            type: GraphQLList(wrappedType),
                        },
                    },
                }),
                args: {
                    cursor: { type: GraphQLString },
                    pageSize: { type: GraphQLInt },
                },
            },
        },
    });

/**
 * Derive the default GraphQL input type for specified data source excluding associations
 */
export const deriveDefaultShallowInputType = <TSrc extends MappedDataSource>(mappedDataSource: TSrc) =>
    new GraphQLInputObjectType({
        name: `${mappedDataSource.mappedName}Input`,
        fields: () => mapInputFields(mappedDataSource),
    });

/**
 * Derive the GraphQL Input type for union of fields from multiple specified data sources
 */
export const deriveDefaultShallowUnionInputType = <TSrc extends MappedDataSource>(mappedDataSources: TSrc[]) =>
    new GraphQLInputObjectType({
        name: `UnionOf${mappedDataSources.map(d => d.mappedName).join("And")}Input`,
        fields: () => {
            const result: GraphQLInputFieldConfigMap = {};
            mappedDataSources.forEach(d => mapInputFields(d, result));
            return result;
        },
    });

/**
 * Derive the GraphQL output type for a data source including only the (primary and computed) fields and not the associations
 */
export const deriveDefaultShallowOutputType = <TSrc extends MappedDataSource>(mappedDataSource: TSrc) =>
    new GraphQLObjectType({
        name: `Shallow${mappedDataSource.mappedName}`,
        fields: () => mapOutputFields(mappedDataSource),
    });

export const deriveDefaultIdOutputType = <TSrc extends MappedDataSource>(source: TSrc) => {
    const fields = source.primaryFields;
    const predicate = (field: MappedField) => fields.indexOf(field) >= 0;
    return new GraphQLObjectType({
        name: `${source.mappedName}Id`,
        fields: () => mapOutputFields(source, {}, predicate),
    });
};

/**
 * Build GraphQLInputFieldConfig dictionary from field definitions of a data source
 *
 * This is primarily useful for deriving GraphQL input type for a data source.
 */
export const mapInputFields = (
    dataSource: MappedDataSource,
    result: GraphQLInputFieldConfigMap = {},
): GraphQLInputFieldConfigMap =>
    transform(
        dataSource.fields,
        (fields: GraphQLInputFieldConfigMap, field, name) => {
            fields[name] = {
                type: field.inputType,
                description: field.description,
            };
        },
        result,
    );

/**
 * Build GraphQLFieldConfig dictionary from field definitions of a data source.
 *
 * This is primarily useful for deriving GraphQL output type for a data source.
 */
export const mapOutputFields = (
    dataSource: MappedDataSource,
    result: GraphQLFieldConfigMap<any, any> = {},
    predicate = (field: MappedField) => field.exposed,
): GraphQLFieldConfigMap<any, any> =>
    transform(
        dataSource.fields,
        (fields: GraphQLFieldConfigMap<any, any>, field, name) => {
            if (!predicate(field)) {
                debug("Field failed predicate match:", name);
                return;
            }
            debug("mapping output field from data source field: ", name, field);
            fields[name] = {
                type: field.outputType,
                description: field.description,
            };
        },
        result,
    );

/**
 * Build GraphQLFieldConfig dictionary from association definitions of a data source.
 *
 * This is primarily useful for deriving GraphQL output type for a data source.
 */
export const mapOutputAssociationFields = (
    dataSource: MappedDataSource,
    result: GraphQLFieldConfigMap<any, any> = {},
) =>
    transform(
        dataSource.associations,
        (fields: GraphQLFieldConfigMap<any, any>, association, name) => {
            if (!association.exposed) {
                debug("Association not exposed:", name);
                return;
            }
            debug("mapping output field from association: ", name, association);
            const outputType = association.target.defaultOutputType;
            fields[name] = {
                type: association.singular ? outputType : GraphQLList(outputType),
                args: {
                    where: {
                        type: association.target.defaultShallowInputType,
                    },
                },
                description: association.description,
                resolve: source =>
                    normalizeResultsForSingularity(source[name], association.singular, association.isPaginated),
            };
        },
        result,
    );

/**
 * Derive a GraphQLFieldConfigMap from an io-ts runtime type through reflection based heuristics.
 */
export function interfaceTypeToGraphQLFields(
    type: t.InterfaceType<any> | t.PartialType<any>,
    id: string,
    result: GraphQLFieldConfigMap<any, any> = {},
    parentName: string,
): GraphQLFieldConfigMap<any, any> {
    return transform(
        type.props,
        (result: GraphQLFieldConfigMap<any, any>, val: t.Type<any>, key: string) => {
            result[key] = {
                type: ioToGraphQLOutputType(val, `${id}[${key}]`, `${parentName}${upperFirst(camelCase(key))}`),
            };
        },
        result,
    );
}

/**
 * Derive a GrpahQL Output type from an io-ts runtime type through reflection based heuristics.
 */
export function ioToGraphQLOutputType(type: t.Type<any>, id: string, objectTypeName?: string): GraphQLOutputType {
    const scalar = ioToGraphQLScalarType(type);
    if (scalar) return scalar;
    if (type instanceof JSONType || type instanceof MaybeType)
        return ioToGraphQLOutputType(type.type, id, objectTypeName);
    if (type instanceof t.ArrayType)
        return GraphQLList(
            ioToGraphQLOutputType(type.type, `${id}[]`, objectTypeName ? `${objectTypeName}Item` : undefined),
        );
    if (type instanceof t.IntersectionType) {
        const name = objectTypeName || uniqueId("GrelDALAutoDerivedOutputType");
        return new GraphQLObjectType({
            name,
            fields: type.types.reduce((fields: GraphQLFieldConfigMap<any, any>, type: t.Mixed) => {
                if (!(type instanceof t.InterfaceType)) {
                    throw new Error(
                        "Currently auto-derivation of types doesn't support advanced intersection types" +
                            "You will need to specify mapped types yourself",
                    );
                }
                interfaceTypeToGraphQLFields(type, `${id}[<intersection-members>]`, fields, name);
                return fields;
            }, {}),
        });
    }
    if (type instanceof t.InterfaceType || type instanceof t.PartialType) {
        const name = objectTypeName || uniqueId("GrelDALAutoDerivedOutputType");
        return new GraphQLObjectType({
            name,
            fields: interfaceTypeToGraphQLFields(type, id, undefined, name),
        });
    }
    throw new Error(
        `GraphQL type for ${id} could not be auto-derived. You will need to specify the mapped types yourself.`,
    );
}

/**
 * Check if one io-ts type is a refinement of another
 */
export const isOrRefinedFrom = (type: t.Type<any>) => (targetType: t.Type<any>): boolean => {
    if (type === targetType) return true;
    if (targetType instanceof t.RefinementType) return isOrRefinedFrom(type)(targetType.type);
    return false;
};

/**
 * Translate primitive io-ts types to equivalent GraphQL scalar types
 */
export function ioToGraphQLScalarType(type: t.Type<any>): Maybe<GraphQLScalarType> {
    if (type === t.Integer) return GraphQLInt;
    if (type === types.date) return GraphQLDate;
    if (type === types.dateTime) return GraphQLDateTime;
    if (type === types.time) return GraphQLTime;
    if (type instanceof t.StringType) return GraphQLString;
    if (type instanceof t.NumberType) return GraphQLFloat;
    if (type instanceof t.BooleanType) return GraphQLBoolean;
    if (type instanceof t.RefinementType) return ioToGraphQLScalarType(type.type);
    return null;
}

/**
 * Derive a GrpahQL input type from an io-ts runtime type through reflection based heuristics.
 */
export function ioToGraphQLInputType(type: t.Type<any>, id: string, objectTypeName?: string): GraphQLInputType {
    const scalar = ioToGraphQLScalarType(type);
    if (scalar) return scalar;
    if (type instanceof JSONType || type instanceof MaybeType)
        return ioToGraphQLInputType(type.type, id, objectTypeName);
    if (type instanceof t.ArrayType)
        return GraphQLList(
            ioToGraphQLInputType(
                type.type,
                `${id}[]`,
                objectTypeName ? objectTypeName.replace(/Input$/, "") + "ItemInput" : undefined,
            ),
        );
    if (type instanceof t.InterfaceType || type instanceof t.PartialType) {
        const name = objectTypeName || uniqueId("GrelDALAutoDerivedInputType");
        return new GraphQLInputObjectType({
            name,
            fields: transform(
                type.props,
                (result: GraphQLInputFieldConfigMap, val: t.Type<any>, key: string) => {
                    result[key] = {
                        type: ioToGraphQLInputType(
                            val,
                            `${id}[${key}]`,
                            `${name.replace(/Input$/, "")}${upperFirst(camelCase(key))}Input`,
                        ),
                    };
                },
                {},
            ),
        });
    }
    throw new Error(
        `GraphQL type for ${id} could not be auto-derived. You will need to specify the mapped types yourself.`,
    );
}

/**
 * Auto-derive GraphQL output type for a mapped field
 */
export const deriveFieldOutputType = (field: MappedField) =>
    ioToGraphQLOutputType(
        field.type,
        field.keyPath,
        `${field.dataSource.mappedName}${upperFirst(camelCase(field.mappedName))}`,
    );

/**
 * Auto-derive GraphQL input type for a mapped field
 */
export const deriveFieldInputType = (field: MappedField) =>
    ioToGraphQLInputType(
        field.type,
        field.keyPath,
        `${field.dataSource.mappedName}${upperFirst(camelCase(field.mappedName))}Input`,
    );

/**
 * For singular operations, unwraps first result if result set is a collection
 * For non-singular operations, wraps result set into a collection (if not already)
 *
 * This utility liberates resolver authors from worrying about whether or not an operation is singular
 * when returning the results.
 */
export function normalizeResultsForSingularity(result: any, singular: boolean, paginated: boolean) {
    if (singular) {
        if (isArray(result)) return first(result);
    } else {
        if (isNil(result)) return [];
        if (paginated) {
            if (!result.page) result.page = {};
            if (!result.page.entities) result.page.entities = [];
            if (!isArray(result.page.entities)) result.page.entities = [result.page.entities];
        } else {
            if (!isArray(result)) return [result];
        }
    }
    return result;
}
