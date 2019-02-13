import { MappedDataSource } from "./MappedDataSource";
import _debug from "debug";
import * as t from "io-ts";
import {
    GraphQLObjectType,
    GraphQLFieldConfig,
    GraphQLFieldConfigMap,
    GraphQLInputObjectType,
    GraphQLInputFieldConfigMap,
    GraphQLInputFieldConfig,
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
import { MappedAssociation } from "./MappedAssociation";
import { JSONType } from "./json";

const debug = _debug("greldal:graphql-type-mapper");

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

export const deriveDefaultOutputType = <TSrc extends MappedDataSource>(mappedDataSource: TSrc) =>
    new GraphQLObjectType({
        name: mappedDataSource.mappedName,
        fields: () => mapOutputAssociationFields(mappedDataSource, mapOutputFields(mappedDataSource)),
    });

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

export const deriveDefaultShallowInputType = <TSrc extends MappedDataSource>(mappedDataSource: TSrc) =>
    new GraphQLInputObjectType({
        name: `${mappedDataSource.mappedName}Input`,
        fields: () => mapInputFields(mappedDataSource),
    });

export const deriveDefaultShallowUnionInputType = <TSrc extends MappedDataSource>(mappedDataSources: TSrc[]) =>
    new GraphQLInputObjectType({
        name: `UnionOf${mappedDataSources.map(d => d.mappedName).join("And")}Input`,
        fields: () => {
            const result: GraphQLInputFieldConfigMap = {};
            mappedDataSources.forEach(d => mapInputFields(d, result));
            return result;
        },
    });

export const deriveDefaultShallowOutputType = <TSrc extends MappedDataSource>(mappedDataSource: TSrc) =>
    new GraphQLObjectType({
        name: `Shallow${mappedDataSource.mappedName}`,
        fields: () => mapOutputFields(mappedDataSource),
    });

export const mapInputFields = (dataSource: MappedDataSource, result: GraphQLInputFieldConfigMap = {}) =>
    transform<MappedField, GraphQLInputFieldConfig>(
        dataSource.fields,
        (fields, field, name) => {
            fields[name] = {
                type: field.inputType,
                description: field.description,
            };
        },
        result,
    );

export const mapOutputFields = (dataSource: MappedDataSource, result: GraphQLFieldConfigMap<any, any> = {}) =>
    transform<MappedField, GraphQLFieldConfig<any, any>>(
        dataSource.fields,
        (fields, field, name) => {
            if (!field.exposed) {
                debug("Field not exposed:", name);
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

export const mapOutputAssociationFields = (
    dataSource: MappedDataSource,
    result: GraphQLFieldConfigMap<any, any> = {},
) =>
    transform<MappedAssociation, GraphQLFieldConfig<any, any>>(
        dataSource.associations,
        (fields, association, name) => {
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
                resolve: source => normalizeResultsForSingularity(source[name], association.singular, association.isPaginated),
            };
        },
        result,
    );

export function interfaceTypeToGraphQLFields(
    type: t.InterfaceType<any>,
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
export function ioToGraphQLOutputType(type: t.Type<any>, id: string, objectTypeName?: string): GraphQLOutputType {
    const scalar = ioToGraphQLScalarType(type);
    if (scalar) return scalar;
    if (type instanceof JSONType) return ioToGraphQLOutputType(type.type, id, objectTypeName);
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
    if (type instanceof t.InterfaceType) {
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

export const isOrRefinedFrom = (type: t.Type<any>) => (targetType: t.Type<any>): boolean => {
    if (type === targetType) return true;
    if (targetType instanceof t.RefinementType) return isOrRefinedFrom(type)(targetType.type);
    return false;
};

export function ioToGraphQLScalarType(type: t.Type<any>): Maybe<GraphQLScalarType> {
    if (type === t.Integer) return GraphQLInt;
    if (type instanceof t.StringType) return GraphQLString;
    if (type instanceof t.NumberType) return GraphQLFloat;
    if (type instanceof t.BooleanType) return GraphQLBoolean;
    if (type instanceof t.RefinementType) return ioToGraphQLScalarType(type.type);
    return null;
}

export function ioToGraphQLInputType(type: t.Type<any>, id: string, objectTypeName?: string): GraphQLInputType {
    const scalar = ioToGraphQLScalarType(type);
    if (scalar) return scalar;
    if (type instanceof JSONType) return ioToGraphQLInputType(type.type, id, objectTypeName);
    if (type instanceof t.ArrayType)
        return GraphQLList(
            ioToGraphQLInputType(
                type.type,
                `${id}[]`,
                objectTypeName ? objectTypeName.replace(/Input$/, "") + "ItemInput" : undefined,
            ),
        );
    if (type instanceof t.InterfaceType) {
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

export const deriveFieldOutputType = (field: MappedField) =>
    ioToGraphQLOutputType(
        field.type,
        field.keyPath,
        `${field.dataSource.mappedName}${upperFirst(camelCase(field.mappedName))}`,
    );

export const deriveFieldInputType = (field: MappedField) =>
    ioToGraphQLInputType(
        field.type,
        field.keyPath,
        `${field.dataSource.mappedName}${upperFirst(camelCase(field.mappedName))}Input`,
    );

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
