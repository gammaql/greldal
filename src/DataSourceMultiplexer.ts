import { MappedDataSource } from "./MappedDataSource";
import { MappedOperation } from "./MappedOperation";

export type MultiplexedSources = Array<{
    source: MappedDataSource;
    canUse?: <TOp extends MappedOperation<any, any, any>>(operation: TOp) => boolean;
}>;

export interface SingleTargetDelegationStrategy {
    tag: "SingleTargetDelegation";
    sources: MultiplexedSources;
}

export interface MultiTargetDelegationStrategy {
    tag: "MultiTargetDelegation";
    sources: MultiplexedSources;
}

export interface MultiTargetCompositionStrategy<T> {
    tag: "MultiTargetComposition";
    compositionOperator: T;
    sources: MultiplexedSources;
}

export type QueryMultiplexingStrategy =
    | SingleTargetDelegationStrategy
    | MultiTargetDelegationStrategy
    | MultiTargetCompositionStrategy<"Union">
    | MultiTargetCompositionStrategy<"UnionAll">;

export type MutationMultiplexingStrategy = SingleTargetDelegationStrategy | MultiTargetDelegationStrategy;
