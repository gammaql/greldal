import { MappedDataSource } from "./MappedDataSource";
import { OperationResolver } from "./OperationResolver";
import { pick, isEqual, uniqWith, compact } from "lodash";
import { QueryOperationResolver } from ".";
import { MemoizeGetter } from "./utils";
import { OperationMapping } from "./OperationMapping";
import { MappedQueryOperation } from "./MappedQueryOperation";
import _debug from "debug";
import { Dict } from "./util-types";
import { ResolverContext } from "./ResolverContext";
import { MappedDeletionOperation } from "./MappedDeletionOperation";

const debug = _debug("greldal:DeletionOperationResolver");

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
export class DeletionOperationResolver<
    TCtx extends ResolverContext<MappedDeletionOperation<any, any>>
> extends OperationResolver<TCtx> {
    @MemoizeGetter
    get queryResolver() {
        const resolver = new QueryOperationResolver(
            new ResolverContext(
                new MappedQueryOperation<
                    TCtx["DataSourceType"],
                    TCtx["GQLArgsType"],
                    TCtx["MappedOperationType"]["MappingType"]
                >(this.resolverContext.operation.mapping),
                this.resolverContext.dataSources,
                this.resolverContext.source,
                this.resolverContext.args,
                this.resolverContext.context,
                this.resolverContext.resolveInfoRoot,
                this.resolverContext.resolveInfoVisitor,
            ),
        );
        resolver.isDelegated = true;
        return resolver;
    }

    get delegatedResolvers() {
        return [this.queryResolver];
    }

    get rootSource() {
        return this.resolverContext.getOnlySource("DeletionOperationResolver");
    }

    get aliasHierarchyVisitor() {
        return this.queryResolver.getAliasHierarchyVisitorFor(this.rootSource);
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
            let queryBuilder = this.createRootQueryBuilder(this.rootSource).where(pkVals.shift()!);
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
