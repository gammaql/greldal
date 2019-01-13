import _debug from "debug";

import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { OperationResolver } from "./OperationResolver";
import { Dict } from "./util-types";
import { MemoizeGetter } from "./utils";
import { pick, isEqual, uniqWith } from "lodash";
import { ResolverContext } from "./ResolverContext";
import { MappedInsertionOperation } from "./MappedInsertionOperation";

const debug = _debug("greldal:InsertionOperationResolver");

/**
 * Opinionated resolver for insertion operation
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
export class InsertionOperationResolver<
    TCtx extends ResolverContext<MappedInsertionOperation<any, any>>
> extends OperationResolver<TCtx> {
    @MemoizeGetter
    get entities(): Dict[] {
        let entities: Dict[];
        const { args } = this.resolverContext;
        if (this.resolverContext.operation.singular) {
            entities = [args.entity || {}];
        } else {
            entities = args.entities;
        }
        const argsSpec = this.resolverContext.operation.args;
        if (!argsSpec) return entities;
        return entities.map(entity => argsSpec.interceptEntity(entity));
    }

    get rootSource() {
        return this.resolverContext.getOnlySource("InsertionOperationResolver");
    }

    get aliasHierarchyVisitor() {
        return new AliasHierarchyVisitor().visit(this.rootSource.storedName)!;
    }

    async resolve(): Promise<any> {
        return this.wrapDBOperations(async () => {
            let queryBuilder = this.createRootQueryBuilder(this.rootSource);
            const mappedRows = this.rootSource.mapEntitiesToDBRows(this.entities);
            debug("Mapped entities to rows:", this.entities, mappedRows);
            if (this.supportsReturning) queryBuilder.returning(this.rootSource.storedColumnNames);
            const results = await queryBuilder.clone().insert(mappedRows);
            // When returning is available we map from returned values to ensure that database level defaults etc. are correctly
            // accounted for:
            if (this.supportsReturning) return this.rootSource.mapDBRowsToShallowEntities(results);
            const pkSourceCols = this.rootSource.primaryFields.map(f => f.sourceColumn!);
            const pkVals = uniqWith(mappedRows.map(r => pick(r, pkSourceCols)), isEqual);
            this.queryByPrimaryKeyValues(queryBuilder, pkVals);
            const fetchedRows = await queryBuilder.select(this.rootSource.storedColumnNames);
            return this.rootSource.mapDBRowsToShallowEntities(fetchedRows);
        });
    }
}
