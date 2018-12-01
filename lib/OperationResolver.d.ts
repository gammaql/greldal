import * as Knex from "knex";
import { MappedOperation, OperationMapping } from "./MappedOperation";
import { MappedDataSource } from "./MappedDataSource";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { GraphQLResolveInfo } from "graphql";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
export interface BaseStoreParams {
    queryBuilder: Knex.QueryBuilder;
}
export interface StoreUpdateParams<T extends MappedDataSource> extends BaseStoreParams {
    readonly whereParams: Partial<T["ShallowRecordType"]>;
}
export interface StoreCreateParams extends BaseStoreParams {
}
export interface StoreDeleteParams extends BaseStoreParams {
}
export declare abstract class OperationResolver<TDataSource extends MappedDataSource = MappedDataSource, TGQLArgs = any, TGQLSource = any, TGQLContext = any> {
    operation: MappedOperation<OperationMapping<TDataSource>>;
    source: TGQLSource;
    context: TGQLContext;
    args: TGQLArgs;
    resolveInfoRoot: GraphQLResolveInfo;
    private _resolveInfoVisitor?;
    constructor(operation: MappedOperation<OperationMapping<TDataSource>>, source: TGQLSource, context: TGQLContext, args: TGQLArgs, resolveInfoRoot: GraphQLResolveInfo, _resolveInfoVisitor?: ResolveInfoVisitor<TDataSource, any> | undefined);
    abstract resolve(): Promise<any>;
    abstract readonly aliasHierarchyVisitor: AliasHierarchyVisitor;
    readonly resolveInfoVisitor: ResolveInfoVisitor<TDataSource, any>;
    readonly rootSource: TDataSource;
    readonly connector: Knex;
    readonly supportsReturning: boolean;
    readonly name: string;
}
