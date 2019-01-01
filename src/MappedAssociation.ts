import { MappedDataSource } from "./MappedDataSource";
import { singularize } from "inflection";
import { QueryOperationResolver } from "./QueryOperationResolver";
import { getTypeAccessorError } from "./errors";
import { MappedOperation, OperationMapping } from "./MappedOperation";
import { PartialDeep, isBoolean, isPlainObject, has } from "lodash";
import _debug from "debug";
import * as Knex from "knex";
import * as t from "io-ts";
import { indexBy, MemoizeGetter } from "./utils";
import { isString, isFunction } from "util";
import { TypeGuard } from "./util-types";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { assertType } from "./assertions";

const debug = _debug("greldal:MappedAssociation");

/**
 * In a composite multi-step operations, we can resolve operations over associations as mapped foreign operation in another data source
 *
 * Internally there is not much difference between a directly exposed data source and an operation which happens as a part of another multi-step composite operation
 *
 * MappedForeignOperation couples an operation as well as the arguments needed to invoke that operation.
 *
 * @api-category ConfigType
 */
export interface MappedForeignOperation<M extends MappedOperation<any, any, any>> {
    operation: M;
    args: M["ArgsType"];
}

/**
 * Runtime type representing union of constants representing different join types
 *
 * @api-category ConfigType
 */
export const JoinTypeRT = t.union([
    t.literal("innerJoin"),
    t.literal("leftJoin"),
    t.literal("leftOuterJoin"),
    t.literal("rightOuterJoin"),
    t.literal("rightJoin"),
    t.literal("outerJoin"),
    t.literal("fullOuterJoin"),
    t.literal("crossJoin"),
]);

/**
 * @api-category ConfigType
 */
export type JoinTypeId = t.TypeOf<typeof JoinTypeRT>;

/**
 * @api-category ConfigType
 */
export const AssociationJoinConfigRT = t.type({
    join: t.union([JoinTypeRT, t.Function]),
});

/**
 * @api-category ConfigType
 */
export interface AssociationJoinConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource>
    extends t.TypeOf<typeof AssociationJoinConfigRT> {
    join:
        | JoinTypeId
        | ((queryBuilder: Knex.QueryBuilder, aliasHierarchyVisitor: AliasHierarchyVisitor) => AliasHierarchyVisitor);
}

/**
 * @api-category ConfigType
 */
export const AssociationPreFetchConfigRT = t.intersection([
    t.type({
        preFetch: t.Function,
    }),
    t.partial({
        associateResultsWithParents: t.Function,
    }),
]);

/**
 * @api-category ConfigType
 */
export interface AssociationPreFetchConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource>
    extends t.TypeOf<typeof AssociationPreFetchConfigRT> {
    preFetch: <TRootSrc extends MappedDataSource, TArgs extends {}, TMapping extends OperationMapping<TRootSrc, TArgs>>(
        this: MappedAssociation<TSrc, TTgt>,
        operation: QueryOperationResolver<TRootSrc, TArgs, TMapping>,
    ) => MappedForeignOperation<MappedOperation<TTgt, any>>;
    associateResultsWithParents?: (
        this: MappedAssociation<TSrc, TTgt>,
        parents: PartialDeep<TSrc["EntityType"]>[],
        results: PartialDeep<TTgt["EntityType"]>[],
    ) => void;
}

/**
 * @api-category ConfigType
 */
export const AssociationPostFetchConfigRT = t.intersection([
    t.type({
        postFetch: t.Function,
    }),
    t.partial({
        associateResultsWithParents: t.Function,
    }),
]);

/**
 * @api-category ConfigType
 */
export interface AssociationPostFetchConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource>
    extends t.TypeOf<typeof AssociationPostFetchConfigRT> {
    postFetch: <
        TRootSrc extends MappedDataSource,
        TArgs extends {},
        TMapping extends OperationMapping<TRootSrc, TArgs>
    >(
        this: MappedAssociation<TSrc, TTgt>,
        operation: QueryOperationResolver<TRootSrc, TArgs, TMapping>,
        parents: PartialDeep<TSrc["EntityType"]>[],
    ) => MappedForeignOperation<MappedOperation<TTgt, any>>;
    associateResultsWithParents?: (
        this: MappedAssociation<TSrc, TTgt>,
        parents: PartialDeep<TSrc["EntityType"]>[],
        results: PartialDeep<TTgt["EntityType"]>[],
    ) => void;
}

/**
 * @api-category ConfigType
 */
export const AssociationFetchConfigRT = t.intersection([
    t.union([AssociationPreFetchConfigRT, AssociationPostFetchConfigRT, AssociationJoinConfigRT]),
    t.partial({
        useIf: t.Function,
    }),
]);

/**
 * @api-category ConfigType
 */
export type AssociationFetchConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource> = (
    | AssociationJoinConfig<TSrc, TTgt>
    | AssociationPreFetchConfig<TSrc, TTgt>
    | AssociationPostFetchConfig<TSrc, TTgt>) & {
    useIf?: <TRootSrc extends MappedDataSource, TArgs extends {}, TMapping extends OperationMapping<TRootSrc, TArgs>>(
        this: MappedAssociation<TSrc, TTgt>,
        operation: QueryOperationResolver<TRootSrc, TArgs, TMapping>,
    ) => boolean;
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

/**
 * @api-category ConfigType
 */
export const AssociationMappingRT = t.intersection([
    t.type({
        target: t.Function,
        fetchThrough: t.array(AssociationFetchConfigRT),
    }),
    t.partial({
        description: t.string,
        singular: t.boolean,
        associatorColumns: t.type({
            inSource: t.string,
            inRelated: t.string,
        }),
    }),
]);

/**
 * @api-category ConfigType
 */
export interface AssociationMapping<TSrc extends MappedDataSource = any, TTgt extends MappedDataSource = any>
    extends t.TypeOf<typeof AssociationMappingRT> {
    target: (this: MappedAssociation<TSrc, TTgt>) => TTgt;
    description?: string;
    singular?: boolean;
    associatorColumns?: {
        inSource: string;
        inRelated: string;
    };
    fetchThrough: AssociationFetchConfig<TSrc, TTgt>[];
}

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
        TRootSrc extends MappedDataSource,
        TArgs extends {},
        TMapping extends OperationMapping<TRootSrc, TArgs>
    >(operation: QueryOperationResolver<TRootSrc, TArgs, TMapping>) {
        for (const config of this.mapping.fetchThrough) {
            if (
                !config.useIf ||
                config.useIf.call<
                    MappedAssociation<TSrc, TTgt>,
                    [QueryOperationResolver<TRootSrc, TArgs, TMapping>],
                    boolean
                >(this, operation)
            ) {
                return config;
            }
        }
        return null;
    }

    preFetch<TRootSrc extends MappedDataSource, TArgs extends {}, TMapping extends OperationMapping<TRootSrc, TArgs>>(
        preFetchConfig: AssociationPreFetchConfig<TSrc, TTgt>,
        operation: QueryOperationResolver<TRootSrc, TArgs, TMapping>,
    ) {
        return preFetchConfig.preFetch.call<
            MappedAssociation<TSrc, TTgt>,
            [QueryOperationResolver<TRootSrc, TArgs, TMapping>],
            MappedForeignOperation<MappedOperation<TTgt, any>>
        >(this, operation);
    }

    postFetch<TRootSrc extends MappedDataSource, TArgs extends {}, TMapping extends OperationMapping<TRootSrc, TArgs>>(
        postFetchConfig: AssociationPostFetchConfig<TSrc, TTgt>,
        operation: QueryOperationResolver<TRootSrc, TArgs, TMapping>,
        parents: PartialDeep<TSrc["EntityType"]>[],
    ) {
        return postFetchConfig.postFetch.call<
            MappedAssociation<TSrc, TTgt>,
            [QueryOperationResolver<TRootSrc, TArgs, TMapping>, PartialDeep<TSrc["EntityType"]>[]],
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
