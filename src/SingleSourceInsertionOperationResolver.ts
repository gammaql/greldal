import _debug from "debug";

import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { Dict } from "./util-types";
import { MemoizeGetter } from "./utils";
import { pick, isEqual, uniqWith } from "lodash";
import { ResolverContext } from "./ResolverContext";
import { MappedSingleSourceInsertionOperation } from "./MappedSingleSourceInsertionOperation";
import { MappedDataSource } from "./MappedDataSource";
import { isPresetSingleInsertionParams, isPresetMultiInsertionParams } from "./operation-presets";
import { expectedOverride } from "./errors";
import { SourceAwareOperationResolver } from "./SourceAwareOperationResolver";
import { SourceAwareResolverContext } from "./SourceAwareResolverContext";

const debug = _debug("greldal:InsertionOperationResolver");

/**
 * Implements resolution of insertion operation on a single data source
 *
 * Sample GraphQL request:
 *
 * ```graphql
 * mutation {
 *     insertManyUsers(entities: [{id: 1, name: "John Doe"}]) {
 *         id, name
 *     }
 * }
 * ```
 *
 * ```graphql
 * mutation {
 *     insertOneUser(entity: {id: 1, name: "Jane Doe"}) {
 *         id, name
 *     }
 * }
 * ```
 *
 * Assumes that:
 *
 * 1. Mapped entity being inserted is available through an entity/entities argument
 * 2. result fields in query correspond to mapped field names in data source
 *
 * 1 is not a hard assumption and custom argument mapping can be specified through args property in the OperationMapping.
 *
 * @see ArgMapping.interceptEntity
 *
 * @api-category CRUDResolvers
 */
export class SingleSourceInsertionOperationResolver<
    TCtx extends SourceAwareResolverContext<MappedSingleSourceInsertionOperation<TSrc, TArgs>, TSrc, TArgs>,
    TSrc extends MappedDataSource,
    TArgs extends {},
    TResolved
> extends SourceAwareOperationResolver<TCtx, TSrc, TArgs, TResolved> {
    @MemoizeGetter
    get entities(): Dict[] {
        let entities: Dict[];
        const { args } = this.resolverContext;
        if (this.resolverContext.operation.singular) {
            if (!isPresetSingleInsertionParams(args)) throw expectedOverride();
            entities = [args.entity || {}];
        } else {
            if (!isPresetMultiInsertionParams(args)) throw expectedOverride();
            entities = args.entities;
        }
        const argsSpec = this.resolverContext.operation.args;
        if (!argsSpec) return entities;
        return entities.map(entity => argsSpec.interceptEntity(entity));
    }

    get aliasHierarchyVisitor() {
        return new AliasHierarchyVisitor().visit(this.resolverContext.primaryDataSource.storedName)!;
    }

    async resolve(): Promise<any> {
        let primaryKeyValues: Dict[];
        const source = this.resolverContext.primaryDataSource;
        const result = await this.wrapInTransaction(async () => {
            let queryBuilder = this.createRootQueryBuilder(source);
            const mappedRows = source.mapEntitiesToRows(this.entities);
            const pkSourceCols = source.primaryFields.map(f => f.sourceColumn!);
            primaryKeyValues = uniqWith(mappedRows.map(r => pick(r, pkSourceCols)), isEqual);
            debug("Mapped entities to rows:", this.entities, mappedRows);
            if (this.supportsReturning) queryBuilder = queryBuilder.returning(source.storedColumnNames);
            const results = await queryBuilder.clone().insert<Dict[]>(mappedRows);
            // When returning is available we map from returned values to ensure that database level defaults etc. are correctly
            // accounted for:
            if (this.supportsReturning) return source.mapRowsToShallowEntities(results);
            this.queryByPrimaryKeyValues(queryBuilder, primaryKeyValues);
            const fetchedRows = await queryBuilder.select(source.storedColumnNames);
            return source.mapRowsToShallowEntities(fetchedRows);
        });
        this.operation.publish({
            source: source.mappedName,
            type: "INSERT",
            primary: source.mapRowsToShallowEntities(primaryKeyValues!),
        });
        return result;
    }
}
