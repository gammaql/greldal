import { pick } from "lodash";
import { MemoizeGetter } from "./utils";
import { MappedSingleSourceQueryOperation } from "./MappedSingleSourceQueryOperation";
import _debug from "debug";
import { MappedSingleSourceDeletionOperation } from "./MappedSingleSourceDeletionOperation";
import { SingleSourceQueryOperationResolver } from "./SingleSourceQueryOperationResolver";
import { MappedDataSource } from "./MappedDataSource";
import { SourceAwareOperationResolver } from "./SourceAwareOperationResolver";
import { Dict } from "./util-types";
import { SourceAwareResolverContext } from "./SourceAwareResolverContext";
import { MutationType } from "./MappedSingleSourceMutationOperation";

/**
 * Opinionated resolver for deletion of one or more entities from a single data source.
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
    TCtx extends SourceAwareResolverContext<MappedSingleSourceDeletionOperation<TSrc, TArgs>, TSrc, TArgs>,
    TSrc extends MappedDataSource,
    TArgs extends {},
    TResolved
> extends SourceAwareOperationResolver<TCtx, TSrc, TArgs, TResolved> {
    @MemoizeGetter
    get queryResolver(): SingleSourceQueryOperationResolver<
        SourceAwareResolverContext<any, TSrc, TArgs, any, any>,
        TSrc,
        MappedSingleSourceQueryOperation<TSrc, TArgs>,
        TArgs,
        TResolved
    > {
        const { resolver: _oldResolver, ...mapping } = this.resolverContext.operation.mapping;
        const operation = new MappedSingleSourceQueryOperation<TCtx["DataSourceType"], TCtx["GQLArgsType"]>(mapping);
        const resolverContext = SourceAwareResolverContext.derive(
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
        let primaryKeyValues: Dict[];
        const rootSource = this.resolverContext.primaryDataSource;
        const result = await this.wrapInTransaction(async () => {
            const mappedRows = await this.queryResolver.resolve();
            primaryKeyValues = this.extractPrimaryKeyValues(
                this.queryResolver.primaryFieldMappers,
                this.queryResolver.resultRows!,
            );
            if (primaryKeyValues.length === 0) {
                throw new Error("Refusing to execute unbounded delete operation");
            }
            let queryBuilder = this.createRootQueryBuilder(rootSource, false);
            this.queryByPrimaryKeyValues(queryBuilder, primaryKeyValues);
            queryBuilder = this.queryResolver.operation.interceptQueryByArgs(queryBuilder, this.resolverContext.args);
            await queryBuilder.del();
            return mappedRows;
        });
        this.operation.publish({
            source: rootSource.mappedName,
            type: MutationType.Delete,
            primary: rootSource.mapRowsToShallowEntities(primaryKeyValues!),
        });
        return result;
    }
}
