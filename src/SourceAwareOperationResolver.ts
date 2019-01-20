import * as Knex from "knex";

import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { supportsReturning } from "./connector";
import { MemoizeGetter } from "./utils";
import { PrimaryRowMapper } from "./SingleSourceQueryOperationResolver";
import { Dict, Maybe } from "./util-types";
import { uniqWith, compact, isEqual, every } from "lodash";
import { ResolverContext } from "./ResolverContext";
import { expectedOverride } from "./errors";
import { memoize } from "core-decorators";
import { Resolver } from "./Resolver";
import { MappedDataSource } from "./MappedDataSource";
import { MappedSingleSourceOperation } from "./MappedSingleSourceOperation";
import { MappedMultiSourceOperation } from "./MappedMultiSourceOperation";

export interface BaseStoreParams {
    queryBuilder: Knex.QueryBuilder;
}

export class SourceAwareOperationResolver<
    TCtx extends ResolverContext<
        MappedMultiSourceOperation<TSrc, TArgs> | MappedSingleSourceOperation<TSrc, TArgs>,
        TSrc,
        TArgs
    >,
    TSrc extends MappedDataSource,
    TArgs extends {},
    TResolved
> implements Resolver<TCtx, TSrc, TArgs, TResolved> {
    isDelegated: boolean | undefined;

    protected _activeTransaction?: Maybe<Knex.Transaction>;

    constructor(public resolverContext: TCtx) {}

    get args() {
        return this.resolverContext.args;
    }

    async resolve(): Promise<any> {
        throw expectedOverride();
    }

    get operation(): TCtx["MappedOperationType"] {
        return this.resolverContext.operation;
    }

    get delegatedResolvers(): SourceAwareOperationResolver<TCtx, TSrc, TArgs, TResolved>[] {
        return [];
    }

    get activeTransaction(): Maybe<Knex.Transaction> {
        return this._activeTransaction;
    }

    set activeTransaction(transaction: Maybe<Knex.Transaction>) {
        this._activeTransaction = transaction;
        this.delegatedResolvers.forEach(r => (r.activeTransaction = transaction));
    }

    @memoize
    getAliasHierarchyVisitorFor(dataSource: TCtx["DataSourceType"]) {
        return new AliasHierarchyVisitor().visit(dataSource.storedName)!;
    }

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

    @MemoizeGetter
    get supportsReturning() {
        return every(this.resolverContext.connectors, supportsReturning);
    }

    get name() {
        return this.resolverContext.operation.name;
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
