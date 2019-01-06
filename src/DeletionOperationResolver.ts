import { MappedDataSource } from "./MappedDataSource";
import { OperationResolver } from "./OperationResolver";
import { pick, isEqual, uniqWith, compact } from 'lodash';
import { QueryOperationResolver } from ".";
import { MemoizeGetter } from "./utils";
import { OperationMapping } from "./MappedOperation";
import { MappedQueryOperation } from "./MappedQueryOperation";
import _debug from "debug"
import { Dict } from './util-types';

const debug = _debug("greldal:DeletionOperationResolver");

/**
 * Opinionated resolver for deletion of one or more entities from a single data source.
 *
 * Note: The built-in resolver currently doesn't support atomic deletion over multiple joined data sources.
 *
 * Sample GraphQL request:
 *
 * ```graphql
 * mutation {
 *     deleteManyUser(where: {id: 1}) {
 *         id, name
 *     }
 * }
 * ```
 *
 * ```graphql
 * mutation {
 *     deleteOneUser(where: {id: 1}) {
 *         id, name
 *     }
 * }
 * ```
 *
 * Assumes that:
 *
 * 1. Fields used to query the data-source are available through a where argument
 * 2. result fields in query correspond to mapped field names in data source
 *
 * 1 is not a hard assumption and custom argument mapping can be specified through args property in the OperationMapping.
 *
 * See ArgMapping.interceptQuery
 * 
 * @api-category CRUDResolvers
 */
export class DeletionOperationResolver<
    TSrc extends MappedDataSource,
    TArgs extends object,
    TMapping extends OperationMapping<TSrc, TArgs>
> extends OperationResolver<TSrc, TArgs, TMapping> {
    @MemoizeGetter
    get queryResolver() {
        return new QueryOperationResolver<TSrc, TArgs, TMapping>(
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

    async resolve() {
        const mappedRows = await this.queryResolver.resolve();
        const {primaryFields} = this.operation.rootSource;
        if (primaryFields.length === 0) {
            throw new Error('DeletionPreset requires some fields to be marked as primary');
        }
        const primaryMappers = this.queryResolver.storeParams.primaryMappers.filter((pm) => pm.field.isPrimary);
        if (primaryMappers.length !== primaryFields.length) {
            throw new Error('Not all primary keys included in query');
        }
        const rows = this.queryResolver.resultRows!
        const pkVals = uniqWith(compact(rows.map(r => {
            let queryItem: Dict = {};
            for (const pm of primaryMappers) {
                queryItem[pm.field.sourceColumn!] = r[pm.columnAlias!];
            }
            return queryItem;
        })), isEqual);
        debug("Extracted pkVals %O from %O", pkVals, rows)
        if (pkVals.length === 0) {
            throw new Error('Refusing to execute unbounded delete operation');
        }
        let queryBuilder = this.rootSource.rootQuery(this.aliasHierarchyVisitor).where(pkVals.shift()!);
        let whereParam;
        while (whereParam = pkVals.shift()) {
            queryBuilder.orWhere(whereParam);
        }
        queryBuilder = this.queryResolver.operation.interceptQueryByArgs(
            queryBuilder,
            this.args,
        );
        await queryBuilder.del();
        return mappedRows;
    }
}
