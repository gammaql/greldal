import { GraphQLResolveInfo } from "graphql";
import * as Knex from "knex";

import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { supportsReturning } from "./connector";
import { MappedDataSource } from "./MappedDataSource";
import { MappedOperation, OperationMapping } from "./MappedOperation";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { MemoizeGetter } from "./utils";
import { PrimaryRowMapper } from "./QueryOperationResolver";
import { Dict, Maybe } from "./util-types";
import { uniqWith, compact, isEqual } from "lodash";

export interface BaseStoreParams {
    queryBuilder: Knex.QueryBuilder;
}

export interface StoreUpdateParams<T extends MappedDataSource> extends BaseStoreParams {
    readonly whereParams: Partial<T["ShallowEntityType"]>;
}
export interface StoreCreateParams extends BaseStoreParams {}
export interface StoreDeleteParams extends BaseStoreParams {}

/**
 * @api-category PriamryAPI
 */
export abstract class OperationResolver<
    TDataSource extends MappedDataSource,
    TArgs extends {},
    TMapping extends OperationMapping<TDataSource, TArgs> = OperationMapping<TDataSource, TArgs>,
    TGQLArgs extends TArgs = any,
    TGQLSource = any,
    TGQLContext = any
> {
    isDelegated: boolean | undefined;

    protected _activeTransaction?: Maybe<Knex.Transaction>;

    constructor(
        public operation: MappedOperation<TDataSource, TArgs, TMapping>,
        public source: TGQLSource,
        public context: TGQLContext,
        public args: TGQLArgs,
        public resolveInfoRoot: GraphQLResolveInfo,
        private _resolveInfoVisitor?: ResolveInfoVisitor<TDataSource, any>,
    ) {}

    abstract async resolve(): Promise<any>;

    get delegatedResolvers(): OperationResolver<any, any, any, any, any, any>[] {
        return [];
    }

    get activeTransaction(): Maybe<Knex.Transaction> {
        return this._activeTransaction;
    }

    set activeTransaction(transaction: Maybe<Knex.Transaction>) {
        this._activeTransaction = transaction;
        this.delegatedResolvers.forEach(r => (r.activeTransaction = transaction));
    }

    @MemoizeGetter
    get aliasHierarchyVisitor() {
        return new AliasHierarchyVisitor().visit(this.rootSource.storedName)!;
    }

    @MemoizeGetter
    get resolveInfoVisitor(): ResolveInfoVisitor<TDataSource, any> {
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

    createRootQueryBuilder() {
        const queryBuilder = this.operation.rootQuery(this.args, this.aliasHierarchyVisitor);
        if (this.activeTransaction) return queryBuilder.transacting(this.activeTransaction);
        return queryBuilder;
    }

    @MemoizeGetter
    get supportsReturning() {
        return supportsReturning(this.connector);
    }

    get name() {
        return this.operation.name;
    }

    protected extractPrimaryKeyValues(primaryMappers: PrimaryRowMapper[], rows: Dict[]) {
        return uniqWith(
            compact(
                rows.map(r => {
                    let queryItem: Dict = {};
                    for (const primaryMapper of primaryMappers) {
                        queryItem[primaryMapper.field.sourceColumn!] = r[primaryMapper.columnAlias!];
                    }
                    return queryItem;
                }),
            ),
            isEqual,
        );
    }

    protected queryByPrimaryKeyValues(queryBuilder: Knex.QueryBuilder, primaryKeyValues: Dict[]) {
        queryBuilder.where(primaryKeyValues.shift()!);
        let whereParam;
        while ((whereParam = primaryKeyValues.shift())) {
            queryBuilder.orWhere(whereParam);
        }
        return queryBuilder;
    }

    protected async wrapDBOperations<T>(cb: () => Promise<T>): Promise<T> {
        if (this.isDelegated) {
            return cb();
        }
        let returned: T;
        await this.rootSource.connector.transaction(async trx => {
            this.activeTransaction = trx;
            returned = await cb();
            this.activeTransaction = undefined;
        });
        return returned!;
    }
}
