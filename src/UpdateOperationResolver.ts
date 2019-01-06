import { MappedDataSource, DataSourceMapping } from "./MappedDataSource";
import { OperationResolver } from "./OperationResolver";
import { pick, forEach } from "lodash";
import { QueryOperationResolver } from "./QueryOperationResolver";
import { MemoizeGetter } from "./utils";
import { OperationMapping } from "./MappedOperation";
import { MappedQueryOperation } from "./MappedQueryOperation";
import { MappedField } from "./MappedField";
import { Maybe, Dict } from "./util-types";

/**
 * @api-category CRUDResolvers
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

        let pkVals: Dict[];
        if (!this.supportsReturning) {
            await this.queryResolver.resolve();
            pkVals = this.extractPrimaryKeyValues(this.queryResolver.primaryMappers, this.queryResolver.resultRows!);
            if (pkVals.length === 0) {
                throw new Error("Refusing to execute unbounded update operation");
            }
        }

        let queryBuilder = this.rootSource.rootQuery(this.aliasHierarchyVisitor);

        if (!this.supportsReturning) {
            queryBuilder.where(pkVals!.shift()!);
            let whereParam;
            while ((whereParam = pkVals!.shift())) {
                queryBuilder.orWhere(whereParam);
            }
        } else {
            queryBuilder.where(this.storeParams.whereParams);
        }

        queryBuilder = this.queryResolver.operation.interceptQueryByArgs(queryBuilder, this.args);
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

        const results = await queryBuilder.clone().update(mappedUpdate);
        if (this.supportsReturning) return this.rootSource.shallowMapResults(results);
        const fetchedRows = await queryBuilder.select(this.rootSource.storedColumnNames);
        const mappedRows = this.rootSource.shallowMapResults(fetchedRows);
        return mappedRows;
    }
}
