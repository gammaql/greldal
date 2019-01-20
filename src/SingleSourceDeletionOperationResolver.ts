import { pick, omit } from "lodash";
import { MemoizeGetter } from "./utils";
import { MappedSingleSourceQueryOperation } from "./MappedSingleSourceQueryOperation";
import _debug from "debug";
import { ResolverContext } from "./ResolverContext";
import { MappedSingleSourceDeletionOperation } from "./MappedSingleSourceDeletionOperation";
import { SingleSourceQueryOperationResolver } from "./SingleSourceQueryOperationResolver";
import { MappedDataSource } from "./MappedDataSource";
import { Omit } from "./util-types";
import { SourceAwareOperationResolver } from "./SourceAwareOperationResolver";

/**
 * Opinionated resolver for deletion of one or more entities from a single data source.
 *
 * Note: The built-in resolver currently doesn't support atomic deletion over multiple joined data sources.
 *
 * Sample GraphQL request:
 *
 * ```graphql
 * mutation {
 *     deleteManyUser(where: {id: 1}) {
 *         id, name
 *     }
 * }
 * ```
 *
 * ```graphql
 * mutation {
 *     deleteOneUser(where: {id: 1}) {
 *         id, name
 *     }
 * }
 * ```
 *
 * Assumes that:
 *
 * 1. Fields used to query the data-source are available through a where argument
 * 2. result fields in query correspond to mapped field names in data source
 *
 * 1 is not a hard assumption and custom argument mapping can be specified through args property in the OperationMapping.
 *
 * See ArgMapping.interceptQuery
 *
 * @api-category CRUDResolvers
 */
export class SingleSourceDeletionOperationResolver<
    TCtx extends ResolverContext<MappedSingleSourceDeletionOperation<TSrc, TArgs>, TSrc, TArgs>,
    TSrc extends MappedDataSource,
    TArgs extends {},
    TResolved
> extends SourceAwareOperationResolver<TCtx, TSrc, TArgs, TResolved> {
    @MemoizeGetter
    get queryResolver(): SingleSourceQueryOperationResolver<
        ResolverContext<any, TSrc, TArgs, any, any>,
        TSrc,
        MappedSingleSourceQueryOperation<TSrc, TArgs>,
        TArgs,
        TResolved
    > {
        const { resolver: _oldResolver, ...mapping } = this.resolverContext.operation.mapping;
        const operation = new MappedSingleSourceQueryOperation<TCtx["DataSourceType"], TCtx["GQLArgsType"]>(mapping);
        const resolverContext = ResolverContext.derive(
            operation,
            this.resolverContext.selectedDataSources,
            this.resolverContext.source,
            this.resolverContext.args,
            this.resolverContext.context,
            this.resolverContext.resolveInfoRoot,
            this.resolverContext.primaryResolveInfoVisitor,
        );
        const resolver = new SingleSourceQueryOperationResolver<
            typeof resolverContext,
            TSrc,
            typeof operation,
            TArgs,
            TResolved
        >(resolverContext);
        resolver.isDelegated = true;
        return resolver;
    }

    get delegatedResolvers(): SourceAwareOperationResolver<any, TSrc, TArgs, TResolved>[] {
        return [this.queryResolver];
    }

    get aliasHierarchyVisitor() {
        return this.queryResolver.getAliasHierarchyVisitorFor(this.resolverContext.primaryDataSource);
    }

    get storeParams() {
        return pick(this.queryResolver.storeParams, "whereParams");
    }

    async resolve() {
        return this.wrapDBOperations(async () => {
            const mappedRows = await this.queryResolver.resolve();
            const pkVals = this.extractPrimaryKeyValues(
                this.queryResolver.primaryFieldMappers,
                this.queryResolver.resultRows!,
            );
            if (pkVals.length === 0) {
                throw new Error("Refusing to execute unbounded delete operation");
            }
            let queryBuilder = this.createRootQueryBuilder(this.resolverContext.primaryDataSource).where(
                pkVals.shift()!,
            );
            let whereParam;
            while ((whereParam = pkVals.shift())) {
                queryBuilder.orWhere(whereParam);
            }
            queryBuilder = this.queryResolver.operation.interceptQueryByArgs(queryBuilder, this.resolverContext.args);
            await queryBuilder.del();
            return mappedRows;
        });
    }
}
