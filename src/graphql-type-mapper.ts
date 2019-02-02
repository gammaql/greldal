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
import { transform, uniqueId, isArray, first, isNil, reduce } from "lodash";
import { MappedField } from "./MappedField";
import { Maybe } from "./util-types";
import { MappedAssociation } from "./MappedAssociation";
import { JSONType } from "./json";

const debug = _debug("greldal:graphql-type-mapper");

export const deriveDefaultOutputType = <TSrc extends MappedDataSource>(mappedDataSource: TSrc) =>
    new GraphQLObjectType({
        name: mappedDataSource.mappedName,
        fields: () => mapOutputAssociationFields(mappedDataSource, mapOutputFields(mappedDataSource)),
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
                resolve: source => normalizeResultsForSingularity(source[name], association.singular),
            };
        },
        result,
    );

export function interfaceTypeToGraphQLFields(
    type: t.InterfaceType<any>,
    id: string,
    result: GraphQLFieldConfigMap<any, any> = {},
): GraphQLFieldConfigMap<any, any> {
    return transform(
        type.props,
        (result: GraphQLFieldConfigMap<any, any>, val: t.Type<any>, key: string) => {
            result[key] = {
                type: ioToGraphQLOutputType(val, `${id}[${key}]`),
            };
        },
        result,
    );
}
export function ioToGraphQLOutputType(type: t.Type<any>, id: string, objectTypeName?: string): GraphQLOutputType {
    const scalar = ioToGraphQLScalarType(type);
    if (scalar) return scalar;
    if (type instanceof JSONType) return ioToGraphQLOutputType(type.type, id, objectTypeName);
    if (type instanceof t.ArrayType) return GraphQLList(ioToGraphQLOutputType(type.type, `${id}[]`));
    if (type instanceof t.IntersectionType) {
        return new GraphQLObjectType({
            name: objectTypeName || uniqueId("GrelDALAutoDerivedOutputType"),
            fields: type.types.reduce((fields: GraphQLFieldConfigMap<any, any>, type: t.Mixed) => {
                if (!(type instanceof t.InterfaceType)) {
                    throw new Error(
                        "Currently auto-derivation of types doesn't support advanced intersection types" +
                            "You will need to specify mapped types yourself",
                    );
                }
                interfaceTypeToGraphQLFields(type, `${id}[<intersection-members>]`, fields);
                return fields;
            }, {}),
        });
    }
    if (type instanceof t.InterfaceType)
        return new GraphQLObjectType({
            name: objectTypeName || uniqueId("GrelDALAutoDerivedOutputType"),
            fields: interfaceTypeToGraphQLFields(type, id),
        });
    throw new Error(
        `GraphQL type for ${id} could not be auto-derived. You will need to specify the mapped types yourself.`,
    );
}

export function ioToGraphQLScalarType(type: t.Type<any>): Maybe<GraphQLScalarType> {
    if (type === t.Integer) return GraphQLInt;
    if (type instanceof t.StringType) return GraphQLString;
    if (type instanceof t.NumberType) return GraphQLFloat;
    if (type instanceof t.BooleanType) return GraphQLBoolean;
    if (type instanceof t.RefinementType) return ioToGraphQLScalarType(type.type);
    return null;
}

export function ioToGraphQLInputType(type: t.Type<any>, id: string): GraphQLInputType {
    const scalar = ioToGraphQLScalarType(type);
    if (scalar) return scalar;
    if (type instanceof JSONType) return ioToGraphQLInputType(type.type, id);
    if (type instanceof t.ArrayType) return GraphQLList(ioToGraphQLInputType(type.type, `${id}[]`));
    if (type instanceof t.InterfaceType)
        return new GraphQLInputObjectType({
            name: uniqueId("GrelDALAutoDerivedInputType"),
            fields: transform(
                type.props,
                (result: GraphQLInputFieldConfigMap, val: t.Type<any>, key: string) => {
                    result[key] = {
                        type: ioToGraphQLInputType(val, `${id}[${key}]`),
                    };
                },
                {},
            ),
        });
    throw new Error(
        `GraphQL type for ${id} could not be auto-derived. You will need to specify the mapped types yourself.`,
    );
}

export const deriveFieldOutputType = (field: MappedField) => ioToGraphQLOutputType(field.type, field.keyPath);

export const deriveFieldInputType = (field: MappedField) => ioToGraphQLInputType(field.type, field.keyPath);

export function normalizeResultsForSingularity(result: any, singular: boolean) {
    if (singular) {
        if (isArray(result)) return first(result);
    } else {
        if (isNil(result)) return [];
        if (!isArray(result)) return [result];
    }
    return result;
}
