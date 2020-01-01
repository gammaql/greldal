import * as t from "io-ts";
import { has } from "lodash";
import { isFunction } from "util";

import { MappedAssociation } from "./MappedAssociation";
import { MappedDataSource } from "./MappedDataSource";
import { MappedSingleSourceOperation } from "./MappedSingleSourceOperation";
import { MappedSingleSourceQueryOperation } from "./MappedSingleSourceQueryOperation";
import { SingleSourceQueryOperationResolver } from "./SingleSourceQueryOperationResolver";
import { PaginationConfigRT, PaginationConfig } from "./PaginationConfig";
import { JoinBuilder } from "./utils/JoinBuilder";
import { PartialDeep } from "./utils/util-types";
import { SourceAwareResolverContext } from "./SourceAwareResolverContext";

/**
 * In a composite multi-step operations, we can resolve operations over associations as mapped foreign operation in another data source
 *
 * Internally there is not much difference between a directly exposed data source and an operation which happens as a part of another multi-step composite operation
 *
 * MappedForeignOperation couples an operation as well as the arguments needed to invoke that operation.
 *
 * @api-category ConfigType
 */
export interface MappedForeignOperation<M extends MappedSingleSourceOperation<any, any>> {
    operation: M;
    args: M["ArgsType"];
}

/**
 * Runtime type representing union of constants representing different join types
 *
 * @api-category ConfigType
 */
export const JoinRT = t.union(
    [
        t.literal("innerJoin"),
        t.literal("leftJoin"),
        t.literal("leftOuterJoin"),
        t.literal("rightOuterJoin"),
        t.literal("rightJoin"),
        t.literal("outerJoin"),
        t.literal("fullOuterJoin"),
        t.literal("crossJoin"),
    ],
    "Join",
);

/**
 * @api-category ConfigType
 */
export type JoinTypeId = t.TypeOf<typeof JoinRT>;

/**
 * @api-category ConfigType
 */
export const AssociationJoinConfigRT = t.type(
    {
        join: t.union([JoinRT, t.Function]),
    },
    "AssociationJoinConfig",
);

/**
 * @api-category ConfigType
 */
export interface AssociationJoinConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource>
    extends t.TypeOf<typeof AssociationJoinConfigRT> {
    join: JoinTypeId | ((joinBuilder: JoinBuilder) => JoinBuilder);
}

/**
 * @api-category ConfigType
 */
export const AssociationPreFetchConfigRT = t.intersection(
    [
        t.type({
            preFetch: t.Function,
        }),
        t.partial({
            associateResultsWithParents: t.Function,
        }),
    ],
    "AssociationPreFetchConfig",
);

/**
 * @api-category ConfigType
 */
export interface AssociationPreFetchConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource>
    extends t.TypeOf<typeof AssociationPreFetchConfigRT> {
    preFetch: <
        TCtx extends SourceAwareResolverContext<TMappedOperation, TRootSrc, TGQLArgs, TGQLSource, TGQLContext>,
        TRootSrc extends MappedDataSource<any>,
        TMappedOperation extends MappedSingleSourceQueryOperation<TRootSrc, TGQLArgs>,
        TGQLArgs extends {},
        TGQLSource = any,
        TGQLContext = any,
        TResolved = any
    >(
        this: MappedAssociation<TSrc, TTgt>,
        operation: SingleSourceQueryOperationResolver<TCtx, TRootSrc, TMappedOperation, TGQLArgs, TResolved>,
    ) => MappedForeignOperation<MappedSingleSourceOperation<TTgt, any>>;
    associateResultsWithParents?: (
        this: MappedAssociation<TSrc, TTgt>,
        parents: PartialDeep<TSrc["EntityType"]>[],
        results: PartialDeep<TTgt["EntityType"]>[],
    ) => void;
}

/**
 * @api-category ConfigType
 */
export const AssociationPostFetchConfigRT = t.intersection(
    [
        t.type({
            postFetch: t.Function,
        }),
        t.partial({
            associateResultsWithParents: t.Function,
        }),
    ],
    "AssociationPostFetchConfig",
);

/**
 * @api-category ConfigType
 */
export interface AssociationPostFetchConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource>
    extends t.TypeOf<typeof AssociationPostFetchConfigRT> {
    postFetch: <
        TCtx extends SourceAwareResolverContext<TMappedOperation, TRootSrc, TGQLArgs, TGQLSource, TGQLContext>,
        TRootSrc extends MappedDataSource<any>,
        TMappedOperation extends MappedSingleSourceQueryOperation<TRootSrc, TGQLArgs>,
        TGQLArgs extends {},
        TGQLSource = any,
        TGQLContext = any,
        TResolved = any
    >(
        this: MappedAssociation<TSrc, TTgt>,
        operation: SingleSourceQueryOperationResolver<TCtx, TRootSrc, TMappedOperation, TGQLArgs, TResolved>,
        parents: PartialDeep<TSrc["EntityType"]>[],
    ) => MappedForeignOperation<MappedSingleSourceOperation<TTgt, any>>;
    associateResultsWithParents?: (
        this: MappedAssociation<TSrc, TTgt>,
        parents: PartialDeep<TSrc["EntityType"]>[],
        results: PartialDeep<TTgt["EntityType"]>[],
    ) => void;
}

/**
 * @api-category ConfigType
 */
export const AssociationFetchConfigRT = t.intersection(
    [
        t.union([AssociationPreFetchConfigRT, AssociationPostFetchConfigRT, AssociationJoinConfigRT]),
        t.partial({
            useIf: t.Function,
        }),
    ],
    "AssociationFetchConfig",
);

/**
 * @api-category ConfigType
 */
export type AssociationFetchConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource> = (
    | AssociationJoinConfig<TSrc, TTgt>
    | AssociationPreFetchConfig<TSrc, TTgt>
    | AssociationPostFetchConfig<TSrc, TTgt>
) & {
    useIf?: <
        TCtx extends SourceAwareResolverContext<TMappedOperation, TRootSrc, TGQLArgs, TGQLSource, TGQLContext>,
        TRootSrc extends MappedDataSource<any>,
        TMappedOperation extends MappedSingleSourceQueryOperation<TRootSrc, TGQLArgs>,
        TGQLArgs extends {},
        TGQLSource = any,
        TGQLContext = any,
        TResolved = any
    >(
        this: MappedAssociation<TSrc, TTgt>,
        operation: SingleSourceQueryOperationResolver<TCtx, TRootSrc, TMappedOperation, TGQLArgs, TResolved>,
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
export const AssociationMappingRT = t.intersection(
    [
        t.type({
            target: t.Function,
            fetchThrough: t.array(AssociationFetchConfigRT),
        }),
        t.partial({
            description: t.string,
            singular: t.boolean,
            exposed: t.boolean,
            associatorColumns: t.type({
                inSource: t.string,
                inRelated: t.string,
            }),
            paginate: PaginationConfigRT,
        }),
    ],
    "AssociationMapping",
);

/**
 * Configuration used to map an association.
 *
 * Association mapping determines how two data sources can be linked (through joins, or auxiliary queries) so
 * that operations can be performed over multiple data sources.
 *
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
    paginate?: PaginationConfig;
}
