import { GraphQLResolveInfo } from "graphql";
import * as Knex from "knex";

import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { supportsReturning } from "./connector";
import { MappedDataSource } from "./MappedDataSource";
import { MappedOperation, OperationMapping } from "./MappedOperation";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { MemoizeGetter } from "./utils";

export interface BaseStoreParams {
    queryBuilder: Knex.QueryBuilder;
}

export interface StoreUpdateParams<T extends MappedDataSource> extends BaseStoreParams {
    readonly whereParams: Partial<T["ShallowRecordType"]>;
}
export interface StoreCreateParams extends BaseStoreParams {}
export interface StoreDeleteParams extends BaseStoreParams {}

export abstract class OperationResolver<
    TDataSource extends MappedDataSource,
    TArgs extends {},
    TMapping extends OperationMapping<TDataSource, TArgs> = OperationMapping<TDataSource, TArgs>,
    TGQLArgs extends TArgs = any,
    TGQLSource = any,
    TGQLContext = any
> {
    constructor(
        public operation: MappedOperation<TDataSource, TArgs, TMapping>,
        public source: TGQLSource,
        public context: TGQLContext,
        public args: TGQLArgs,
        public resolveInfoRoot: GraphQLResolveInfo,
        private _resolveInfoVisitor?: ResolveInfoVisitor<TDataSource, any>,
    ) {}

    abstract async resolve(): Promise<any>;
    abstract get aliasHierarchyVisitor(): AliasHierarchyVisitor;

    @MemoizeGetter
    get resolveInfoVisitor() {
        return (
            this._resolveInfoVisitor ||
            new ResolveInfoVisitor<TDataSource, any>(this.resolveInfoRoot, this.operation.rootSource)
        );
    }

    get rootSource() {
        return this.operation.rootSource;
    }

    get connector(): Knex {
        return this.rootSource.connector;
    }

    @MemoizeGetter
    get supportsReturning() {
        return supportsReturning(this.connector);
    }

    get name() {
        return this.operation.name;
    }
}
