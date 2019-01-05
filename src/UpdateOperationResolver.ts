import { MappedDataSource, DataSourceMapping } from "./MappedDataSource";
import { OperationResolver } from "./OperationResolver";
import { pick, forEach } from "lodash";
import { QueryOperationResolver } from "./QueryOperationResolver";
import { MemoizeGetter } from "./utils";
import { OperationMapping } from "./MappedOperation";
import { MappedQueryOperation } from "./MappedQueryOperation";
import { MappedField } from "./MappedField";
import { Maybe, Dict } from './util-types';

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

        let updateEntity = this.args.update;
        if (this.operation.args) {
            updateEntity = this.operation.args.interceptEntity(this.args.update) || updateEntity;
        }
        
        let mappedUpdate: Dict = {};
        forEach(this.args.update, (val: any, key: string) => {
            const field: Maybe<MappedField> = this.rootSource.fields[key];
            if (!field)
                throw new Error(
                    `Key ${key} used in update does not correspond to a registered field in data source: ${
                        this.rootSource.mappedName
                    }`,
                );
            mappedUpdate[field.sourceColumn!] = val;
        });

        const results = await queryBuilder.update(mappedUpdate);
        if (this.supportsReturning) return this.rootSource.shallowMapResults(results);
        return this.queryResolver.resolve();
    }
}
