import _debug from "debug";

import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { MappedDataSource } from "./MappedDataSource";
import { OperationMapping } from "./MappedOperation";
import { OperationResolver } from "./OperationResolver";
import { Dict } from "./util-types";
import { MemoizeGetter } from "./utils";

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
 * 1. Mapped record being inserted is available through an entity/entities argument
 * 2. result fields in query correspond to mapped field names in data source
 */
export class InsertionOperationResolver<
    TSrc extends MappedDataSource,
    TArgs extends object,
    TMapping extends OperationMapping<TSrc, TArgs> = OperationMapping<TSrc, TArgs>
> extends OperationResolver<TSrc, TArgs, TMapping> {
    @MemoizeGetter
    get entities(): Dict[] {
        let entities: Dict[];
        if (this.operation.singular) {
            entities = [this.args.entity || {}];
        } else {
            entities = this.args.entities;
        }
        const { args } = this.operation;
        if (!args) return entities;
        return entities.map(record => args.interceptRecord(record));
    }

    get aliasHierarchyVisitor() {
        return new AliasHierarchyVisitor().visit(this.rootSource.storedName)!;
    }

    async resolve(): Promise<any> {
        let queryBuilder = this.rootSource.rootQuery(this.aliasHierarchyVisitor);
        const mappedRows = this.rootSource.mapEntities(this.entities);
        debug("Mapped entities to rows:", this.entities, mappedRows);
        if (this.supportsReturning) queryBuilder.returning(this.rootSource.storedColumnNames);
        const results = await queryBuilder.insert(mappedRows);
        // When returning is available we map from returned values to ensure that database level defaults etc. are correctly
        // accounted for:
        if (this.supportsReturning) return this.rootSource.shallowMapResults(results);
        // TODO: Is an extra query worth having here for the sake of consistency ?
        return this.entities;
    }
}
