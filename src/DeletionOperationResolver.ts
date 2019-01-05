import { MappedDataSource } from "./MappedDataSource";
import { OperationResolver } from "./OperationResolver";
import { pick } from "lodash";
import { QueryOperationResolver } from ".";
import { MemoizeGetter } from "./utils";
import { OperationMapping } from "./MappedOperation";

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
 * @see ArgMapping.interceptQuery
 */
export class DeletionOperationResolver<
    TSrc extends MappedDataSource,
    TArgs extends object,
    TMapping extends OperationMapping<TSrc, TArgs>
> extends OperationResolver<TSrc, TArgs, TMapping> {
    @MemoizeGetter
    get queryResolver() {
        return new QueryOperationResolver<TSrc, TArgs, TMapping>(
            new MappedQueryOperation<TSrc, TArgs, TMapping>(this.operation.mapping),
            this.source,
            this.context,
            this.args,
            this.resolveInfoRoot,
            this.resolveInfoVisitor,
        );
    }

    get aliasHierarchyVisitor() {
        return this.queryResolver.aliasHierarchyVisitor;
    }

    get storeParams() {
        return pick(this.queryResolver.storeParams, "whereParams");
    }

    async resolve() {
        const mappedRows = await this.queryResolver.resolve();
        await this.queryResolver.operation
            .interceptQueryByArgs(
                this.rootSource.rootQuery(this.aliasHierarchyVisitor).where(this.storeParams.whereParams),
                this.args,
            )
            .del();
        return mappedRows;
    }
}
