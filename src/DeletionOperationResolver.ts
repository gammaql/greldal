import { MappedDataSource } from "./MappedDataSource";
import { OperationResolver } from "./OperationResolver";
import { pick, isEqual, uniqWith, compact } from "lodash";
import { QueryOperationResolver } from ".";
import { MemoizeGetter } from "./utils";
import { OperationMapping } from "./OperationMapping";
import { MappedQueryOperation } from "./MappedQueryOperation";
import _debug from "debug";
import { Dict } from "./util-types";

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
    TSrc extends MappedDataSource,
    TArgs extends object,
    TMapping extends OperationMapping<TSrc, TArgs>
> extends OperationResolver<TSrc, TArgs, TMapping> {
    @MemoizeGetter
    get queryResolver() {
        const resolver = new QueryOperationResolver<TSrc, TArgs, TMapping>(
            new MappedQueryOperation<TSrc, TArgs, TMapping>(this.operation.mapping),
            this.source,
            this.context,
            this.args,
            this.resolveInfoRoot,
            this.resolveInfoVisitor,
        );
        resolver.isDelegated = true;
        return resolver;
    }

    get delegatedResolvers() {
        return [this.queryResolver];
    }

    get aliasHierarchyVisitor() {
        return this.queryResolver.aliasHierarchyVisitor;
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
            let queryBuilder = this.createRootQueryBuilder().where(pkVals.shift()!);
            let whereParam;
            while ((whereParam = pkVals.shift())) {
                queryBuilder.orWhere(whereParam);
            }
            queryBuilder = this.queryResolver.operation.interceptQueryByArgs(queryBuilder, this.args);
            await queryBuilder.del();
            return mappedRows;
        });
    }
}
