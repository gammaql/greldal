import * as Knex from "knex";

import { memoize } from "lodash";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { supportsReturning } from "./connector";
import { MemoizeGetter } from "./utils";
import { PrimaryRowMapper } from "./SingleSourceQueryOperationResolver";
import { Dict, Maybe } from "./util-types";
import { uniqWith, compact, isEqual, every } from "lodash";
import { ResolverContext } from "./ResolverContext";
import { expectedOverride } from "./errors";
import { decorate } from "core-decorators";
import { OperationResolver } from "./OperationResolver";
import { MappedDataSource } from "./MappedDataSource";
import { MappedSingleSourceOperation } from "./MappedSingleSourceOperation";
import { MappedMultiSourceOperation } from "./MappedMultiSourceOperation";

export interface BaseStoreParams {
    queryBuilder: Knex.QueryBuilder;
}

/**
 * Base class for operation resolvers that need to interact with one or more mapped data sources
 * 
 * @api-category CRUDResolvers
 */
export class SourceAwareOperationResolver<
    TCtx extends ResolverContext<
        MappedMultiSourceOperation<TSrc, TArgs> | MappedSingleSourceOperation<TSrc, TArgs>,
        TSrc,
        TArgs
    >,
    TSrc extends MappedDataSource,
    TArgs extends {},
    TResolved
> implements OperationResolver<TCtx, TSrc, TArgs, TResolved> {
    isDelegated: boolean | undefined;

    protected _activeTransaction?: Maybe<Knex.Transaction>;

    constructor(public resolverContext: TCtx) {}

    /**
     * Parsed arguments received from the API client
     */
    get args() {
        return this.resolverContext.args;
    }

    /**
     * Should be overriden in sub-class with the logic of resolution
     */
    async resolve(): Promise<any> {
        throw expectedOverride();
    }

    /**
     * The operation being resolved
     * 
     * @type MappedOperation
     */
    get operation(): TCtx["MappedOperationType"] {
        return this.resolverContext.operation;
    }

    /**
     * Can be overriden to return a collection of resolver instances that we are delegating to.
     * 
     * This is required for sharing the same transactions across the root resolver and all the 
     * delegated resolvers
     */
    get delegatedResolvers(): SourceAwareOperationResolver<TCtx, TSrc, TArgs, TResolved>[] {
        return [];
    }

    /**
     * Currently active Knex transaction instance
     */
    get activeTransaction(): Maybe<Knex.Transaction> {
        return this._activeTransaction;
    }

    /**
     * Set a transaction as currently active
     */
    set activeTransaction(transaction: Maybe<Knex.Transaction>) {
        this._activeTransaction = transaction;
        this.delegatedResolvers.forEach(r => (r.activeTransaction = transaction));
    }

    /**
     * Get AliasHeirarchyVisitor for specified data source
     */
    @decorate(memoize)
    getAliasHierarchyVisitorFor(dataSource: TCtx["DataSourceType"]) {
        return new AliasHierarchyVisitor().visit(dataSource.storedName)!;
    }

    /**
     * Use associated operation's primary data source to construct the root query builder
     * and wrap it in active transaction.
     * 
     * Currently this can be used only if the operation is a single source operation, and throws otherwise.
     */
    createRootQueryBuilder(dataSource: TCtx["DataSourceType"]) {
        const operation = this.resolverContext.operation;
        if (!(operation instanceof MappedSingleSourceOperation)) {
            throw new Error("rootQuery is not applicable in this context");
        }
        const queryBuilder = operation.rootQuery(
            dataSource,
            this.resolverContext.args,
            this.getAliasHierarchyVisitorFor(dataSource),
        );
        if (this.activeTransaction) return queryBuilder.transacting(this.activeTransaction);
        return queryBuilder;
    }

    /**
     * Check if all the involved data sources support SQL returning statement
     */
    @MemoizeGetter
    get supportsReturning() {
        return every(this.resolverContext.connectors, supportsReturning);
    }

    /**
     * Get name of current operation
     */
    get name() {
        return this.resolverContext.operation.name;
    }

    /**
     * Use columnAlias mappings to reverse map retrieved rows to fields of entities
     */
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

    /**
     * Wrap database operations in a transaction
     * 
     * Creates a new transaction only if the operation is not delegated from some other operation. Reuses 
     * parent operation transaction for delegated transactions.
     */
    protected async wrapInTransaction<T>(cb: () => Promise<T>): Promise<T> {
        if (this.isDelegated) {
            return cb();
        }
        let returned: T;
        const connectors = this.resolverContext.connectors;
        if (connectors.length === 0) throw new Error("Unable to find a connector for creating transaction");
        if (connectors.length > 1)
            throw new Error("Unable to wrap operations on sources having different connectors in single transaction");
        await connectors[0].transaction(async trx => {
            this.activeTransaction = trx;
            returned = await cb();
            this.activeTransaction = undefined;
        });
        return returned!;
    }
}
