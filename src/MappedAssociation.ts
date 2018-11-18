import { MappedDataSource } from "./MappedDataSource";
import { singularize } from "inflection";
import { QueryOperationResolver } from "./QueryOperationResolver";
import { getTypeAccessorError } from "./errors";
import { MappedOperation } from "./MappedOperation";
import { PartialDeep, isBoolean, isPlainObject, has } from "lodash";
import _debug from "debug";
import * as Knex from "knex";
import { indexBy, MemoizeGetter } from "./utils";
import { isString, isFunction } from "util";
import { TypeGuard } from "./util-types";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";

const debug = _debug("greldal:MappedAssociation");

export interface MappedForeignQuery<M extends MappedOperation = MappedOperation> {
    query: M;
    args: M["ArgsType"];
}

export type JoinTypeId =
    | "innerJoin"
    | "leftJoin"
    | "leftOuterJoin"
    | "rightJoin"
    | "rightOuterJoin"
    | "outerJoin"
    | "fullOuterJoin"
    | "crossJoin";

export interface AssociationJoinConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource> {
    join:
        | JoinTypeId
        | ((queryBuilder: Knex.QueryBuilder, aliasHierarchyVisitor: AliasHierarchyVisitor) => AliasHierarchyVisitor);
}

export interface AssociationPreFetchConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource> {
    preFetch: (this: MappedAssociation<TSrc, TTgt>, operation: QueryOperationResolver) => MappedForeignQuery;
    associateResultsWithParents?: (
        this: MappedAssociation<TSrc, TTgt>,
        parents: PartialDeep<TSrc["RecordType"]>[],
        results: PartialDeep<TTgt["RecordType"]>[],
    ) => void;
}

export interface AssociationPostFetchConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource> {
    postFetch: (
        this: MappedAssociation<TSrc, TTgt>,
        operation: QueryOperationResolver,
        parents: PartialDeep<TSrc["RecordType"]>[],
    ) => MappedForeignQuery;
    associateResultsWithParents?: (
        this: MappedAssociation<TSrc, TTgt>,
        parents: PartialDeep<TSrc["RecordType"]>[],
        results: PartialDeep<TTgt["RecordType"]>[],
    ) => void;
}

export type AssociationFetchConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource> = (
    | AssociationJoinConfig<TSrc, TTgt>
    | AssociationPreFetchConfig<TSrc, TTgt>
    | AssociationPostFetchConfig<TSrc, TTgt>) & {
    useIf?: (this: MappedAssociation<TSrc, TTgt>, operation: QueryOperationResolver<any>) => boolean;
};

export function isPreFetchConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource>(
    config: any,
): config is AssociationPreFetchConfig<TSrc, TTgt> {
    return isFunction(config.preFetch);
}

export function isPostFetchConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource>(
    config: any,
): config is AssociationPostFetchConfig<TSrc, TTgt> {
    return isFunction(config.postFetch);
}

export function isJoinConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource>(
    config: any,
): config is AssociationJoinConfig<TSrc, TTgt> {
    return has(config, "join");
}

export interface AssociationMapping<TSrc extends MappedDataSource = any, TTgt extends MappedDataSource = any> {
    target: (this: MappedAssociation<TSrc, TTgt>) => TTgt;
    description?: string;
    singular?: boolean;
    associatorColumns?: {
        inSource: string;
        inRelated: string;
    };
    fetchThrough: AssociationFetchConfig<TSrc, TTgt>[];
}

export class MappedAssociation<TSrc extends MappedDataSource = any, TTgt extends MappedDataSource = any> {
    constructor(public dataSource: TSrc, public mappedName: string, private mapping: AssociationMapping<TSrc, TTgt>) {}

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

    getFetchConfig(operation: QueryOperationResolver<any>) {
        for (const config of this.mapping.fetchThrough) {
            if (!config.useIf || config.useIf.call(this, operation)) {
                return config;
            }
        }
        return null;
    }

    preFetch(preFetchConfig: AssociationPreFetchConfig<TSrc, TTgt>, operation: QueryOperationResolver<any>) {
        return preFetchConfig.preFetch.call(this, operation);
    }

    postFetch(
        postFetchConfig: AssociationPostFetchConfig<TSrc, TTgt>,
        operation: QueryOperationResolver,
        parents: PartialDeep<TSrc["RecordType"]>[],
    ) {
        return postFetchConfig.postFetch.call(this, operation, parents);
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
            const nextAliasHierarchyVisitor = aliasHierarchyVisitor.visit(storedName)!;
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
        return (parents: PartialDeep<TSrc["RecordType"]>[], results: PartialDeep<TTgt["RecordType"]>[]) => {
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

    get SourceRecordType(): TSrc["RecordType"] {
        throw getTypeAccessorError("SourceRecordType", "MappedAssociation");
    }

    get AssociatedRecordType(): TTgt["RecordType"] {
        throw getTypeAccessorError("AssociatedRecordType", "MappedAssociation");
    }
}
