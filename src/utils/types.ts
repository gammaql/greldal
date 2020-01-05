import {
    GraphQLString,
    GraphQLInputType,
    GraphQLOutputType,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLList,
    GraphQLScalarType,
    GraphQLObjectType,
    GraphQLObjectTypeConfig,
    GraphQLUnionType,
    GraphQLUnionTypeConfig,
    GraphQLInt,
    GraphQLInputObjectType,
    GraphQLFieldConfigMap,
    GraphQLInputFieldConfigMap,
    GraphQLID,
    GraphQLNonNull,
} from "graphql";
import { getTypeAccessorError } from "./errors";
import { Dict, Maybe } from "./util-types";
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from "graphql-iso-date";

export class TypeSpec<
    TBase,
    TGraphQLInputType extends GraphQLInputType = GraphQLInputType,
    TGraphQLOutputType extends GraphQLOutputType = GraphQLOutputType
> {
    constructor(
        readonly name: string,
        readonly graphQLInputType: TGraphQLInputType,
        readonly graphQLOutputType: TGraphQLOutputType,
    ) {}
    get Type(): TBase {
        throw getTypeAccessorError("Type", "TypeSpec");
    }
    get GraphQLInputType(): TGraphQLInputType {
        throw getTypeAccessorError("GraphQLInputType", "TypeSpec");
    }
    get GraphQLOutputType(): TGraphQLOutputType {
        throw getTypeAccessorError("GraphQLOutputType", "TypeSpec");
    }
}

export type AnyTypeSpec = TypeSpec<any>;

export class ScalarTypeSpec<TBase, TGraphQLType extends GraphQLScalarType> extends TypeSpec<
    TBase,
    TGraphQLType,
    TGraphQLType
> {
    constructor(readonly graphQLType: TGraphQLType) {
        super(graphQLType.name, graphQLType, graphQLType);
    }
}

export const wrapScalar = <TBase, TGraphQLType extends GraphQLScalarType = GraphQLScalarType>(scalar: TGraphQLType) =>
    new ScalarTypeSpec<TBase, TGraphQLType>(scalar);

class NonNullTypeSpec<
    TBase,
    TGraphQLInputType extends GraphQLInputType,
    TGraphQLOutputType extends GraphQLOutputType
> extends TypeSpec<NonNullable<TBase>, GraphQLNonNull<TGraphQLInputType>, GraphQLNonNull<TGraphQLOutputType>> {
    constructor(readonly wrapped: TypeSpec<TBase, TGraphQLInputType, TGraphQLOutputType>) {
        super(
            `${wrapped.name}!`,
            GraphQLNonNull(wrapped.graphQLInputType) as GraphQLNonNull<TGraphQLInputType>,
            GraphQLNonNull(wrapped.graphQLOutputType) as GraphQLNonNull<TGraphQLOutputType>,
        );
    }
}

export const nonNull = <
    TBase,
    TGraphQLInputType extends GraphQLInputType,
    TGraphQLOutputType extends GraphQLOutputType
>(
    wrapped: TypeSpec<TBase, TGraphQLInputType, TGraphQLOutputType>,
) => new NonNullTypeSpec(wrapped);

export const string = wrapScalar<Maybe<string>>(GraphQLString);
export const integer = wrapScalar<Maybe<number>>(GraphQLInt);
export const float = wrapScalar<Maybe<number>>(GraphQLFloat);
export const number = wrapScalar<Maybe<number>>(GraphQLFloat);
export const boolean = wrapScalar<Maybe<boolean>>(GraphQLBoolean);
export const isoDateStr = wrapScalar<Maybe<string>>(GraphQLDate);
export const isoTimeStr = wrapScalar<Maybe<string>>(GraphQLTime);
export const isoDateTimeStr = wrapScalar<Maybe<string>>(GraphQLDateTime);
export const isoDate = wrapScalar<Maybe<Date>>(GraphQLDate);
export const isoTime = wrapScalar<Maybe<Date>>(GraphQLTime);
export const isoDateTime = wrapScalar<Maybe<Date>>(GraphQLDateTime);
export const stringId = wrapScalar<Maybe<string>>(GraphQLID);
export const intId = wrapScalar<Maybe<number>>(GraphQLID);

export type SourceFromTypeSpecMapping<TSpec extends Dict<TypeSpec<any, any, any>>> = {
    [Key in keyof TSpec]: TSpec[Key]["Type"];
};

export type ObjectTypeSpecConfig<TSource, TContext> = Omit<
    GraphQLObjectTypeConfig<TSource, TContext>,
    "name" | "fields"
>;

export class ObjectTypeSpec<
    TSpecMapping extends Dict<TypeSpec<any, any, any>>,
    TSource = SourceFromTypeSpecMapping<TSpecMapping>,
    TContext = any
> extends TypeSpec<TSource, GraphQLInputObjectType, GraphQLObjectType<TSource, TContext>> {
    constructor(
        readonly name: string,
        readonly fields: TSpecMapping,
        readonly config?: ObjectTypeSpecConfig<TSource, TContext>,
    ) {
        super(
            name,
            new GraphQLInputObjectType({
                name: `${name}Input`,
                description: config?.description,
                fields: Object.keys(fields).reduce(
                    (partialFields, key) =>
                        Object.assign(partialFields, {
                            [key]: {
                                type: fields[key].graphQLInputType,
                            },
                        }),
                    {} as GraphQLInputFieldConfigMap,
                ),
            }),
            new GraphQLObjectType<TSource, TContext>({
                ...config,
                name,
                fields: Object.keys(fields).reduce(
                    (partialFields, key) =>
                        Object.assign(partialFields, {
                            [key]: {
                                type: fields[key].graphQLOutputType,
                            },
                        }),
                    {} as GraphQLFieldConfigMap<TSource, TContext>,
                ),
            }),
        );
    }
    get Source(): TSource {
        throw getTypeAccessorError("Source", "TypeSpec");
    }
    get Context(): TContext {
        throw getTypeAccessorError("Context", "TypeSpec");
    }
}

export function object<
    TSpecMapping extends Dict<TypeSpec<any, any, any>>,
    TSource = SourceFromTypeSpecMapping<TSpecMapping>,
    TContext = any
>(name: string, typeMapping: TSpecMapping) {
    return new ObjectTypeSpec<TSpecMapping, TSource, TContext>(name, typeMapping);
}

export class ArrayTypeSpec<TSpec extends TypeSpec<any, any, any>> extends TypeSpec<
    TSpec["Type"][],
    GraphQLList<TSpec["GraphQLInputType"]>,
    GraphQLList<TSpec["GraphQLOutputType"]>
> {
    constructor(readonly type: TSpec) {
        super(`Array<${type.name}>`, GraphQLList(type.graphQLInputType), GraphQLList(type.graphQLOutputType));
    }
}

export const array = <TSpec extends TypeSpec<any, any, any>>(type: TSpec) => new ArrayTypeSpec(type);

export type UnionTypeSpecConfig<TSource, TContext> = Omit<GraphQLUnionTypeConfig<TSource, TContext>, "name" | "fields">;

export class UnionTypeSpec<TSpec extends TypeSpec<any, any, any>> extends TypeSpec<
    TSpec["Type"],
    TSpec["GraphQLInputType"],
    TSpec["GraphQLOutputType"]
> {
    constructor(readonly name: string, readonly types: TSpec[]) {
        super(
            name,
            new GraphQLUnionType({
                name: `${name}Input`,
                types: types.map(t => t.graphQLInputType),
            }),
            new GraphQLUnionType({
                name,
                types: types.map(t => t.graphQLOutputType),
            }),
        );
    }
}

export const union = <TSpec extends TypeSpec<any, any, any>>(name: string, types: TSpec[]) =>
    new UnionTypeSpec(name, types);

export class ObjIntersectionTypeSpec<TSpec extends ObjectTypeSpec<any>> extends TypeSpec<
    TSpec["Type"],
    TSpec["GraphQLInputType"],
    TSpec["GraphQLOutputType"]
> {
    constructor(readonly name: string, readonly types: TSpec[]) {
        super(
            name,
            new GraphQLInputObjectType({
                name: `${name}Input`,
                fields: types.reduce((r, t) => {
                    const fields: any = t.fields;
                    Object.keys(fields).forEach(k => {
                        r[k] = {
                            type: fields[k].graphQLInputType,
                        };
                    });
                    return r;
                }, {} as GraphQLInputFieldConfigMap),
            }),
            new GraphQLObjectType({
                name,
                fields: types.reduce((r, t) => {
                    const fields: any = t.fields;
                    Object.keys(fields).forEach(k => {
                        r[k] = {
                            type: fields[k].graphQLOutputType,
                        };
                    });
                    return r;
                }, {} as GraphQLFieldConfigMap<TSpec["Source"], TSpec["Context"]>),
            }),
        );
    }
}

export const intersection = <TSpec extends ObjectTypeSpec<any>>(name: string, types: TSpec[]) =>
    new ObjIntersectionTypeSpec(name, types);
