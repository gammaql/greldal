import { MappedDataSource } from "./MappedDataSource";
import { SingleSourceOperationResolver } from "./SingleSourceOperationResolver";
import { pick, forEach } from "lodash";
import { SingleSourceQueryOperationResolver } from "./SingleSourceQueryOperationResolver";
import { MemoizeGetter } from "./utils";
import { SingleSourceOperationMapping } from "./SingleSourceOperationMapping";
import { MappedSingleSourceQueryOperation } from "./MappedSingleSourceQueryOperation";
import { MappedField } from "./MappedField";
import { Maybe, Dict } from "./util-types";
import { ResolverContext } from "./ResolverContext";
import { MappedSingleSourceUpdateOperation } from "./MappedSingleSourceUpdateOperation";

/**
 * @api-category CRUDResolvers
 */
export class SingleSourceUpdateOperationResolver<
    TCtx extends ResolverContext<MappedSingleSourceUpdateOperation<any, any>>
> extends SingleSourceOperationResolver<TCtx> {
    @MemoizeGetter
    get queryResolver() {
        const resolver = new SingleSourceQueryOperationResolver(
            new ResolverContext(
                new MappedSingleSourceQueryOperation<
                    TCtx["DataSourceType"],
                    TCtx["GQLArgsType"],
                    TCtx["MappedOperationType"]["MappingType"]
                >(this.operation.mapping),
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

    get aliasHierarchyVisitor() {
        return this.queryResolver.getAliasHierarchyVisitorFor(this.rootSource);
    }
    get rootSource() {
        return this.resolverContext.getOnlySource("DeletionOperationResolver");
    }

    get storeParams() {
        return pick(this.queryResolver.storeParams, "whereParams");
    }

    get updateEntityArg() {
        let updateEntity = this.resolverContext.args.update;
        if (this.operation.args) {
            updateEntity = this.operation.args.interceptEntity(this.resolverContext.args.update) || updateEntity;
        }
        return updateEntity;
    }

    get mappedUpdate() {
        let mappedUpdate: Dict = {};
        forEach(this.resolverContext.args.update, (val: any, key: string) => {
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
            this.queryResolver.resolveFields(
                [],
                this.aliasHierarchyVisitor,
                this.rootSource,
                this.resolverContext.resolveInfoVisitor,
            );
            let primaryKeyValues: Dict[];
            if (!this.supportsReturning) {
                primaryKeyValues = await this.resolvePrimaryKeyValues();
            }
            let queryBuilder = this.createRootQueryBuilder(this.rootSource);
            if (!this.supportsReturning) {
                this.queryByPrimaryKeyValues(queryBuilder, primaryKeyValues!);
            } else {
                queryBuilder.where(this.storeParams.whereParams);
            }
            queryBuilder = this.queryResolver.operation.interceptQueryByArgs(queryBuilder, this.resolverContext.args);
            if (this.operation.singular) queryBuilder.limit(1);
            if (this.supportsReturning) queryBuilder.returning(this.rootSource.storedColumnNames);
            const results = await queryBuilder.clone().update(this.mappedUpdate);
            if (this.supportsReturning) return this.rootSource.mapDBRowsToShallowEntities(results);
            const fetchedRows = await queryBuilder.select(this.rootSource.storedColumnNames);
            const mappedRows = this.rootSource.mapDBRowsToShallowEntities(fetchedRows);
            return mappedRows;
        });
    }
}
