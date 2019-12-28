import { pick, forEach } from "lodash";
import { SingleSourceQueryOperationResolver } from "./SingleSourceQueryOperationResolver";
import { MemoizeGetter } from "./utils";
import { MappedSingleSourceQueryOperation } from "./MappedSingleSourceQueryOperation";
import { MappedField } from "./MappedField";
import { Maybe, Dict } from "./util-types";
import { ResolverContext } from "./ResolverContext";
import { MappedSingleSourceUpdateOperation } from "./MappedSingleSourceUpdateOperation";
import { MappedDataSource } from "./MappedDataSource";
import { isPresetUpdateParams } from "./operation-presets";
import { expectedOverride } from "./errors";
import { SourceAwareOperationResolver } from "./SourceAwareOperationResolver";
import { SourceAwareResolverContext } from "./SourceAwareResolverContext";
import { MutationType } from "./MappedSingleSourceMutationOperation";

/**
 * Implements update operation resolution on a single data source
 *
 * Sample GraphQL Request:
 *
 * ```graphql
 * mutation {
 *     updateOneUser(where: { id: 5 }, update: { name: "Rahman" }) {
 *         id
 *         name
 *     }
 * }
 * ```
 *
 * Assumes that:
 *
 * 1. Fields used to query the data-source are available through a where argument
 * 2. Fields to be updated are available through an update argument
 * 3. result fields in query correspond to fields of the data sources.
 *
 * @api-category CRUDResolvers
 */
export class SingleSourceUpdateOperationResolver<
    TCtx extends SourceAwareResolverContext<MappedSingleSourceUpdateOperation<TSrc, TArgs>, TSrc, TArgs>,
    TSrc extends MappedDataSource,
    TArgs extends {},
    TResolved
> extends SourceAwareOperationResolver<TCtx, TSrc, TArgs, TResolved> {
    @MemoizeGetter
    get queryResolver(): SingleSourceQueryOperationResolver<
        SourceAwareResolverContext<any, TSrc, TArgs, any, any>,
        TSrc,
        MappedSingleSourceQueryOperation<TSrc, TArgs>,
        TArgs,
        TResolved
    > {
        const { resolver: _oldResolver, ...mapping } = this.operation.mapping;
        const operation = new MappedSingleSourceQueryOperation<TSrc, TArgs>(mapping);
        const resolverContext = SourceAwareResolverContext.derive<any, TSrc, TArgs>(
            operation,
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

    get delegatedResolvers(): SourceAwareOperationResolver<any, TSrc, TArgs, TResolved>[] {
        return [this.queryResolver];
    }

    @MemoizeGetter
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
                    `Key ${key} used in update does not correspond to a registered field in data source: ${this.rootSource.mappedName}`,
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
        let primaryKeyValues: Dict[];
        const result = await this.wrapInTransaction(async () => {
            this.queryResolver.resolveFields(
                [],
                this.aliasHierarchyVisitor,
                this.rootSource,
                this.resolverContext.primaryResolveInfoVisitor,
            );
            primaryKeyValues = await this.resolvePrimaryKeyValues();
            let queryBuilder = this.createRootQueryBuilder(this.rootSource);
            this.queryByPrimaryKeyValues(queryBuilder, primaryKeyValues!);
            queryBuilder = this.queryResolver.operation.interceptQueryByArgs(queryBuilder, this.resolverContext.args);
            if (this.operation.singular) queryBuilder.limit(1);
            if (this.supportsReturning) queryBuilder.returning(this.rootSource.storedColumnNames);
            const results = await queryBuilder.clone().update<Dict[]>(this.mappedUpdate);
            if (this.supportsReturning) return this.rootSource.mapRowsToShallowEntities(results);
            const fetchedRows = await queryBuilder.select(this.rootSource.storedColumnNames);
            const mappedRows = this.rootSource.mapRowsToShallowEntities(fetchedRows);
            return mappedRows;
        });
        this.operation.publish({
            source: this.rootSource.mappedName,
            type: MutationType.Update,
            primary: this.rootSource.mapRowsToShallowEntities(primaryKeyValues!),
        });
        return result;
    }
}
