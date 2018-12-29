import { MappedDataSource } from "./MappedDataSource";
import { OperationResolver } from "./OperationResolver";
import { pick } from "lodash";
import { QueryOperationResolver } from ".";
import { MemoizeGetter } from "./utils";
import { OperationMapping } from "./MappedOperation";
import { Dict } from "./util-types";

/**
 * Opinionated resolver for deletion operations
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
 */
export class DeletionOperationResolver<
    TSrc extends MappedDataSource,
    TArgs extends object,
    TMapping extends OperationMapping<TSrc, TArgs>
> extends OperationResolver<TSrc, TArgs, TMapping> {
    @MemoizeGetter
    get queryResolver() {
        return new QueryOperationResolver(
            this.operation,
            this.source,
            this.context,
            pick(this.args, "where"),
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
        await this.rootSource
            .rootQuery(this.aliasHierarchyVisitor)
            .where(this.storeParams.whereParams)
            .del();
        return mappedRows;
    }
}
