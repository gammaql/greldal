import * as Knex from "knex";
import { MappedOperation, OperationMapping } from "./MappedOperation";
import { MappedDataSource } from "./MappedDataSource";
import { MemoizeGetter } from "./utils";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { Memoize } from "lodash-decorators";
import { GraphQLResolveInfo } from "graphql";
import { Dict } from "./util-types";
import { supportsReturning } from "./connector";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";

export interface BaseStoreParams {
    queryBuilder: Knex.QueryBuilder;
}

export interface StoreUpdateParams<T extends MappedDataSource> extends BaseStoreParams {
    readonly whereParams: Partial<T["ShallowRecordType"]>;
}
export interface StoreCreateParams extends BaseStoreParams {}
export interface StoreDeleteParams extends BaseStoreParams {}

export abstract class OperationResolver<
    TDataSource extends MappedDataSource = MappedDataSource,
    TGQLArgs = any,
    TGQLSource = any,
    TGQLContext = any
> {
    constructor(
        public operation: MappedOperation<OperationMapping<TDataSource>>,
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
