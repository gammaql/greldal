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
        const resolver = new QueryOperationResolver(
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

    get updateEntityArg() {
        let updateEntity = this.args.update;
        if (this.operation.args) {
            updateEntity = this.operation.args.interceptEntity(this.args.update) || updateEntity;
        }
        return updateEntity;
    }

    get mappedUpdate() {
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
        return mappedUpdate;
    }

    private async resolvePrimaryKeyValues() {
        await this.queryResolver.resolve();
        const pkVals = this.extractPrimaryKeyValues(
            this.queryResolver.primaryFieldMappers,
            this.queryResolver.resultRows!,
        );
        if (pkVals.length === 0) {
            throw new Error("Refusing to execute unbounded update operation");
        }
        return pkVals;
    }

    async resolve(): Promise<any> {
        return this.wrapDBOperations(async () => {
            this.queryResolver.resolveFields([], this.aliasHierarchyVisitor, this.rootSource, this.resolveInfoVisitor);
            let pkVals: Dict[];
            if (!this.supportsReturning) {
                pkVals = await this.resolvePrimaryKeyValues();
            }
            let queryBuilder = this.createRootQueryBuilder();
            if (!this.supportsReturning) {
                this.queryByPrimaryKeyValues(queryBuilder, pkVals!);
            } else {
                queryBuilder.where(this.storeParams.whereParams);
            }
            queryBuilder = this.queryResolver.operation.interceptQueryByArgs(queryBuilder, this.args);
            if (this.operation.singular) queryBuilder.limit(1);
            if (this.supportsReturning) queryBuilder.returning(this.rootSource.storedColumnNames);
            const results = await queryBuilder.clone().update(this.mappedUpdate);
            if (this.supportsReturning) return this.rootSource.shallowMapResults(results);
            const fetchedRows = await queryBuilder.select(this.rootSource.storedColumnNames);
            const mappedRows = this.rootSource.shallowMapResults(fetchedRows);
            return mappedRows;
        });
    }
}
