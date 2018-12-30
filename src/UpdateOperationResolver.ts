import { MappedDataSource } from "./MappedDataSource";
import { OperationResolver, BaseStoreParams } from "./OperationResolver";
import { Dict } from "./util-types";
import { pick } from "lodash";
import { QueryOperationResolver } from "./QueryOperationResolver";
import { MemoizeGetter } from "./utils";
import { OperationMapping } from "./MappedOperation";

export interface StoreUpdateParams extends BaseStoreParams {
    readonly whereParams: Dict;
}

export class UpdateOperationResolver<
    TSrc extends MappedDataSource,
    TArgs extends {},
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

    async resolve(): Promise<any> {
        this.queryResolver.resolveFields([], this.aliasHierarchyVisitor, this.rootSource, this.resolveInfoVisitor);
        const queryBuilder = this.rootSource.rootQuery(this.aliasHierarchyVisitor);
        queryBuilder.where(this.storeParams.whereParams);
        if (this.operation.singular) queryBuilder.limit(1);
        if (this.supportsReturning) queryBuilder.returning(this.rootSource.storedColumnNames);
        let update = this.args.update;
        if (this.operation.args) {
            this.operation.args.interceptRecord(update);
        }
        const results = await queryBuilder.update(update);
        if (this.supportsReturning) return this.rootSource.shallowMapResults(results);
        return this.queryResolver.resolve();
    }
}
