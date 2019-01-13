import { MappedDataSource } from "./MappedDataSource";
import { singularize } from "inflection";
import { QueryOperationResolver } from "./QueryOperationResolver";
import { getTypeAccessorError } from "./errors";
import { MappedOperation } from "./MappedOperation";
import { OperationMapping } from "./OperationMapping";
import { PartialDeep, isBoolean, isPlainObject } from "lodash";
import _debug from "debug";
import * as Knex from "knex";
import { indexBy, MemoizeGetter } from "./utils";
import { isString, isFunction } from "util";
import { TypeGuard, Dict } from "./util-types";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { assertType } from "./assertions";
import {
    AssociationMappingRT,
    AssociationMapping,
    AssociationPreFetchConfig,
    MappedForeignOperation,
    AssociationPostFetchConfig,
    AssociationJoinConfig,
    JoinTypeId,
} from "./AssociationMapping";
import { ResolverContext } from "./ResolverContext";
import { MappedQueryOperation, QueryOperationMapping } from "./MappedQueryOperation";

const debug = _debug("greldal:MappedAssociation");

/**
 * A mapped association represents an association among multiple data sources and encapsulates the knowledge of how to fetch a connected
 * data source while resolving an operation in another data source.
 *
 * @api-category MapperClass
 */
export class MappedAssociation<TSrc extends MappedDataSource = any, TTgt extends MappedDataSource = any> {
    constructor(public dataSource: TSrc, public mappedName: string, private mapping: AssociationMapping<TSrc, TTgt>) {
        assertType(
            AssociationMappingRT,
            mapping,
            `Association mapping configuration:\nDataSource<${dataSource}>[associations][${mappedName}]`,
        );
    }

    @MemoizeGetter
    get singular() {
        if (isBoolean(this.mapping.singular)) {
            return this.mapping.singular;
        }
        return singularize(this.mappedName) === this.mappedName;
    }

    get target(): TTgt {
        return this.mapping.target.apply(this);
    }

    get description() {
        return this.mapping.description;
    }

    getFetchConfig<
        TCtx extends ResolverContext<
            MappedQueryOperation<any, any, QueryOperationMapping<any, any>>,
            MappedDataSource<any>,
            Dict<any>,
            any,
            any
        >
    >(operation: QueryOperationResolver<TCtx>) {
        for (const config of this.mapping.fetchThrough) {
            if (
                !config.useIf ||
                config.useIf.call<MappedAssociation<TSrc, TTgt>, [QueryOperationResolver<TCtx>], boolean>(
                    this,
                    operation,
                )
            ) {
                return config;
            }
        }
        return null;
    }

    preFetch<
        TCtx extends ResolverContext<
            MappedQueryOperation<any, any, QueryOperationMapping<any, any>>,
            MappedDataSource<any>,
            Dict<any>,
            any,
            any
        >
    >(preFetchConfig: AssociationPreFetchConfig<TSrc, TTgt>, operation: QueryOperationResolver<TCtx>) {
        return preFetchConfig.preFetch.call<
            MappedAssociation<TSrc, TTgt>,
            [QueryOperationResolver<TCtx>],
            MappedForeignOperation<MappedOperation<TTgt, any>>
        >(this, operation);
    }

    postFetch<TRootSrc extends MappedDataSource, TArgs extends {}, TMapping extends OperationMapping<TRootSrc, TArgs>>(
        postFetchConfig: AssociationPostFetchConfig<TSrc, TTgt>,
        operation: QueryOperationResolver<
            ResolverContext<MappedQueryOperation<TRootSrc, TArgs, TMapping>, TRootSrc, TArgs>
        >,
        parents: PartialDeep<TSrc["EntityType"]>[],
    ) {
        return postFetchConfig.postFetch.call<
            MappedAssociation<TSrc, TTgt>,
            [
                QueryOperationResolver<
                    ResolverContext<MappedQueryOperation<TRootSrc, TArgs, TMapping>, TRootSrc, TArgs>
                >,
                PartialDeep<TSrc["EntityType"]>[]
            ],
            MappedForeignOperation<MappedOperation<TTgt, any>>
        >(this, operation, parents);
    }

    join(
        joinConfig: AssociationJoinConfig<TSrc, TTgt>,
        queryBuilder: Knex.QueryBuilder,
        aliasHierarchyVisitor: AliasHierarchyVisitor,
    ): AliasHierarchyVisitor {
        if ((isFunction as TypeGuard<Function>)(joinConfig.join)) {
            return joinConfig.join(queryBuilder, aliasHierarchyVisitor);
        }
        if ((isString as TypeGuard<JoinTypeId>)(joinConfig.join) && isPlainObject(this.associatorColumns)) {
            const { storedName } = this.target;
            const sourceAlias = aliasHierarchyVisitor.alias;
            const nextAliasHierarchyVisitor = aliasHierarchyVisitor.visit(this.mappedName)!;
            const { alias } = nextAliasHierarchyVisitor;
            queryBuilder[joinConfig.join](
                `${storedName} as ${alias}`,
                `${sourceAlias}.${this.associatorColumns!.inSource}`,
                `${alias}.${this.associatorColumns!.inRelated}`,
            );
            return nextAliasHierarchyVisitor;
        }
        throw new Error(`Not enough information to autoJoin association. Specify a join function`);
    }

    isAutoJoinable(joinConfig: AssociationJoinConfig<TSrc, TTgt>) {
        return isString(joinConfig.join) && isPlainObject(this.associatorColumns);
    }

    associateResultsWithParents(
        fetchConfig: AssociationPreFetchConfig<TSrc, TTgt> | AssociationPostFetchConfig<TSrc, TTgt>,
    ) {
        return (parents: PartialDeep<TSrc["EntityType"]>[], results: PartialDeep<TTgt["EntityType"]>[]) => {
            if (fetchConfig.associateResultsWithParents) {
                return fetchConfig.associateResultsWithParents.call(this, parents, results);
            }
            debug("associating results with parents -- parents: %O, results: %O", parents, results);
            if (!this.mapping.associatorColumns) {
                throw new Error("Either associatorColumns or associateResultsWithParents must be specified");
            }
            const { inRelated, inSource } = this.mapping.associatorColumns!;
            const parentsIndex = indexBy(parents, inSource);
            results.forEach(result => {
                const pkey = result[inRelated] as any;
                if (!pkey) return;
                const parent = parentsIndex[pkey] as any;
                if (!parent) return;
                if (this.mapping.singular) {
                    parent[this.mappedName] = result;
                } else {
                    parent[this.mappedName] = parent[this.mappedName] || [];
                    parent[this.mappedName].push(result);
                }
            });
        };
    }

    get associatorColumns() {
        return this.mapping.associatorColumns;
    }

    get DataSourceType(): TSrc {
        throw getTypeAccessorError("DataSourceType", "MappedAssociation");
    }

    get AssociatedDataSourceType(): TTgt {
        throw getTypeAccessorError("AssociatedDataSourceType", "MappedAssociation");
    }

    get SourceEntityType(): TSrc["EntityType"] {
        throw getTypeAccessorError("SourceEntityType", "MappedAssociation");
    }

    get AssociatedEntityType(): TTgt["EntityType"] {
        throw getTypeAccessorError("AssociatedEntityType", "MappedAssociation");
    }
}
