import { MappedDataSource } from "./MappedDataSource";
import { OperationResolver, BaseStoreParams } from "./OperationResolver";
import { Dict } from "./util-types";
import { pick } from "lodash";
import { QueryOperationResolver } from "./QueryOperationResolver";
import { MemoizeGetter } from "./utils";
import { OperationMapping } from "./MappedOperation";

/**
 * @api-category PrimaryAPI
 */
export class UpdateOperationResolver<
    TSrc extends MappedDataSource,
    TArgs extends {},
    TMapping extends OperationMapping<TSrc, TArgs>
> extends OperationResolver<TSrc, TArgs, TMapping> {
    @MemoizeGetter
    get queryResolver() {
        return new QueryOperationResolver(
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

    async resolve(): Promise<any> {
        this.queryResolver.resolveFields([], this.aliasHierarchyVisitor, this.rootSource, this.resolveInfoVisitor);
        let queryBuilder = this.queryResolver.operation.interceptQueryByArgs(
            this.rootSource.rootQuery(this.aliasHierarchyVisitor).where(this.storeParams.whereParams),
            this.args,
        );
        if (this.operation.singular) queryBuilder.limit(1);
        if (this.supportsReturning) queryBuilder.returning(this.rootSource.storedColumnNames);
        let update = this.args.update;
        if (this.operation.args) {
            this.operation.args.interceptEntity(update);
        }
        const results = await queryBuilder.update(update);
        if (this.supportsReturning) return this.rootSource.shallowMapResults(results);
        return this.queryResolver.resolve();
    }
}
