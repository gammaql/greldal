import { MappedDataSource } from "./MappedDataSource";
import * as t from "io-ts";
import { GraphQLObjectType, GraphQLFieldConfig, GraphQLFieldConfigMap, GraphQLInputObjectType, GraphQLInputFieldConfigMap, GraphQLInputFieldConfig, GraphQLOutputType, GraphQLScalarType, GraphQLInputType } from "graphql";
import { MappedField } from "./MappedField";
import { Maybe } from "./util-types";
export declare const deriveDefaultOutputType: <T extends MappedDataSource<any>>(mappedDataSource: T) => GraphQLObjectType;
export declare const deriveDefaultShallowInputType: <T extends MappedDataSource<any>>(mappedDataSource: T) => GraphQLInputObjectType;
export declare const deriveDefaultShallowOutputType: <T extends MappedDataSource<any>>(mappedDataSource: T) => GraphQLObjectType;
export declare const mapInputFields: (ds: MappedDataSource<any>, result?: GraphQLInputFieldConfigMap) => import("lodash").Dictionary<GraphQLInputFieldConfig>;
export declare const mapOutputFields: (ds: MappedDataSource<any>, result?: GraphQLFieldConfigMap<any, any>) => import("lodash").Dictionary<GraphQLFieldConfig<any, any, {
    [argName: string]: any;
}>>;
export declare const mapOutputAssociationFields: (ds: MappedDataSource<any>, result?: GraphQLFieldConfigMap<any, any>) => import("lodash").Dictionary<GraphQLFieldConfig<any, any, {
    [argName: string]: any;
}>>;
export declare function ioToGraphQLOutputType(type: t.Type<any>, id: string): GraphQLOutputType;
export declare function ioToGraphQLScalarType(type: t.Type<any>): Maybe<GraphQLScalarType>;
export declare function ioToGraphQLInputType(type: t.Type<any>, id: string): GraphQLInputType;
export declare const deriveFieldOutputType: (field: MappedField<MappedDataSource<any>, any>) => GraphQLOutputType;
export declare const deriveFieldInputType: (field: MappedField<MappedDataSource<any>, any>) => GraphQLInputType;
export declare function normalizeResultsForSingularity(result: any, singular: boolean): any;
