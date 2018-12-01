import { GraphQLOutputType, GraphQLInputType, GraphQLResolveInfo, GraphQLFieldConfig, GraphQLFieldConfigArgumentMap } from "graphql";
import * as t from "io-ts";
import * as Knex from "knex";
import { MappedDataSource } from "./MappedDataSource";
import { Dict } from "./util-types";
import { OperationResolver } from "./OperationResolver";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { MappedAssociation } from "./MappedAssociation";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
export declare const OperationMapping: t.InterfaceType<{
    name: t.StringType;
    description: t.UnionType<(t.Type<any, any, unknown> | t.NullType | t.UndefinedType)[], any, any, unknown>;
    singular: t.UnionType<(t.Type<any, any, unknown> | t.NullType | t.UndefinedType)[], any, any, unknown>;
    shallow: t.UnionType<(t.Type<any, any, unknown> | t.NullType | t.UndefinedType)[], any, any, unknown>;
}, t.TypeOfProps<{
    name: t.StringType;
    description: t.UnionType<(t.Type<any, any, unknown> | t.NullType | t.UndefinedType)[], any, any, unknown>;
    singular: t.UnionType<(t.Type<any, any, unknown> | t.NullType | t.UndefinedType)[], any, any, unknown>;
    shallow: t.UnionType<(t.Type<any, any, unknown> | t.NullType | t.UndefinedType)[], any, any, unknown>;
}>, t.OutputOfProps<{
    name: t.StringType;
    description: t.UnionType<(t.Type<any, any, unknown> | t.NullType | t.UndefinedType)[], any, any, unknown>;
    singular: t.UnionType<(t.Type<any, any, unknown> | t.NullType | t.UndefinedType)[], any, any, unknown>;
    shallow: t.UnionType<(t.Type<any, any, unknown> | t.NullType | t.UndefinedType)[], any, any, unknown>;
}>, unknown>;
export interface OperationResolverClass {
    new (operation: MappedOperation, source: any, context: any, args: any, resolveInfoRoot: GraphQLResolveInfo, resolveInfoVisitor?: ResolveInfoVisitor<any>): OperationResolver;
}
export interface OperationMapping<TSrc extends MappedDataSource = MappedDataSource> extends t.TypeOf<typeof OperationMapping> {
    rootSource: TSrc;
    returnType?: GraphQLOutputType;
    rootQuery?: (this: MappedOperation<OperationMapping<any>>, args: Dict, aliasHierarchyVisitor: AliasHierarchyVisitor) => Knex.QueryBuilder;
    deriveWhereParams?: (this: MappedOperation<OperationMapping<any>>, args: Dict, association?: MappedAssociation) => Dict;
    args?: GraphQLFieldConfigArgumentMap;
    resolver?: OperationResolverClass;
}
export interface ArgMapping<TMapped extends t.Type<any>> {
    type: TMapped;
    to?: GraphQLInputType;
    description?: string;
    defaultValue?: t.TypeOf<TMapped>;
}
export declare type MappedOperationArgs<TMapping extends OperationMapping> = Dict;
export declare abstract class MappedOperation<TMapping extends OperationMapping = any> {
    protected mapping: OperationMapping;
    constructor(mapping: OperationMapping);
    abstract opType: "query" | "mutation";
    readonly graphQLOperation: GraphQLFieldConfig<any, any>;
    readonly ArgsType: MappedOperationArgs<TMapping>;
    readonly rootSource: TMapping["rootSource"];
    readonly name: string;
    readonly shallow: boolean;
    readonly singular: boolean;
    readonly args: GraphQLFieldConfigArgumentMap;
    readonly type: GraphQLOutputType;
    abstract readonly defaultArgs: GraphQLFieldConfigArgumentMap;
    abstract defaultResolver: OperationResolverClass;
    rootQuery(args: Dict, aliasHierachyVisitor: AliasHierarchyVisitor): Knex.QueryBuilder;
    resolve(source: any, args: MappedOperationArgs<TMapping>, context: any, resolveInfo: GraphQLResolveInfo, resolveInfoVisitor?: ResolveInfoVisitor<any>): Promise<any>;
    deriveWhereParams(args: Dict, association?: MappedAssociation): Dict;
}
