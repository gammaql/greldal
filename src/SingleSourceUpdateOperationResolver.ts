import { SingleSourceOperationResolver } from "./SingleSourceOperationResolver";
import { pick, forEach } from "lodash";
import { SingleSourceQueryOperationResolver } from "./SingleSourceQueryOperationResolver";
import { MemoizeGetter } from "./utils";
import { MappedSingleSourceQueryOperation } from "./MappedSingleSourceQueryOperation";
import { MappedField } from "./MappedField";
import { Maybe, Dict } from "./util-types";
import { ResolverContext } from "./ResolverContext";
import { MappedSingleSourceUpdateOperation } from "./MappedSingleSourceUpdateOperation";
import { MappedDataSource } from "./MappedDataSource";
import { isPresetUpdateParams } from './operation-presets';
import { expectedOverride } from "./errors";

/**
 * @api-category CRUDResolvers
 */
export class SingleSourceUpdateOperationResolver<
    TCtx extends ResolverContext<MappedSingleSourceUpdateOperation<TSrc, TArgs>, TSrc, TArgs>,
    TSrc extends MappedDataSource,
    TArgs extends {},
    TResolved
> extends SingleSourceOperationResolver<TCtx, TSrc, TArgs, TResolved> {
    @MemoizeGetter
    get queryResolver(): SingleSourceQueryOperationResolver<
        ResolverContext<any, TSrc, TArgs, any, any>,
        TSrc,
        MappedSingleSourceQueryOperation<TSrc, TArgs>,
        TArgs,
        TResolved
    > {
        const {resolver: _oldResolver, ...mapping} = this.operation.mapping;
        const operation = new MappedSingleSourceQueryOperation<TSrc, TArgs>(mapping);
        const resolverContext = ResolverContext.derive<
            any,
            TSrc,
            TArgs
        >(
            operation as any,
            this.resolverContext.selectedDataSources,
            this.resolverContext.source,
            this.resolverContext.args,
            this.resolverContext.context,
            this.resolverContext.resolveInfoRoot,
            this.resolverContext.primaryResolveInfoVisitor,
        );
        const resolver = new SingleSourceQueryOperationResolver<
            typeof resolverContext,
            TSrc,
            typeof operation,
            TArgs,
            TResolved
        >(resolverContext);
        resolver.isDelegated = true;
        return resolver;
    }

    get delegatedResolvers(): SingleSourceOperationResolver<any, TSrc, TArgs, TResolved>[] {
        return [this.queryResolver];
    }

    get aliasHierarchyVisitor() {
        return this.queryResolver.getAliasHierarchyVisitorFor(this.rootSource);
    }
    get rootSource() {
        return this.resolverContext.primaryDataSource;
    }

    get storeParams() {
        return pick(this.queryResolver.storeParams, "whereParams");
    }

    get updateEntityArg() {
        const { args } = this.resolverContext;
        if (!isPresetUpdateParams(args)) {
            throw expectedOverride();
        }
        let updateEntity = args.update;
        const passedArgs = this.operation.args;
        if (passedArgs && isPresetUpdateParams(passedArgs)) {
            updateEntity = passedArgs.interceptEntity(passedArgs.update) || updateEntity;
        }
        return updateEntity;
    }

    get mappedUpdate() {
        let mappedUpdate: Dict = {};
        const { args } = this.resolverContext;
        if (!isPresetUpdateParams(args)) {
            throw expectedOverride();
        }
        forEach(args.update, (val: any, key: string) => {
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
                this.resolverContext.primaryResolveInfoVisitor,
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
