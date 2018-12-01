import { MappedDataSource } from "./MappedDataSource";
import { QueryOperationResolver } from "./QueryOperationResolver";
import { MappedOperation } from "./MappedOperation";
import { PartialDeep } from "lodash";
import * as Knex from "knex";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
export interface MappedForeignQuery<M extends MappedOperation = MappedOperation> {
    query: M;
    args: M["ArgsType"];
}
export declare type JoinTypeId = "innerJoin" | "leftJoin" | "leftOuterJoin" | "rightJoin" | "rightOuterJoin" | "outerJoin" | "fullOuterJoin" | "crossJoin";
export interface AssociationJoinConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource> {
    join: JoinTypeId | ((queryBuilder: Knex.QueryBuilder, aliasHierarchyVisitor: AliasHierarchyVisitor) => AliasHierarchyVisitor);
}
export interface AssociationPreFetchConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource> {
    preFetch: (this: MappedAssociation<TSrc, TTgt>, operation: QueryOperationResolver) => MappedForeignQuery;
    associateResultsWithParents?: (this: MappedAssociation<TSrc, TTgt>, parents: PartialDeep<TSrc["RecordType"]>[], results: PartialDeep<TTgt["RecordType"]>[]) => void;
}
export interface AssociationPostFetchConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource> {
    postFetch: (this: MappedAssociation<TSrc, TTgt>, operation: QueryOperationResolver, parents: PartialDeep<TSrc["RecordType"]>[]) => MappedForeignQuery;
    associateResultsWithParents?: (this: MappedAssociation<TSrc, TTgt>, parents: PartialDeep<TSrc["RecordType"]>[], results: PartialDeep<TTgt["RecordType"]>[]) => void;
}
export declare type AssociationFetchConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource> = (AssociationJoinConfig<TSrc, TTgt> | AssociationPreFetchConfig<TSrc, TTgt> | AssociationPostFetchConfig<TSrc, TTgt>) & {
    useIf?: (this: MappedAssociation<TSrc, TTgt>, operation: QueryOperationResolver<any>) => boolean;
};
export declare function isPreFetchConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource>(config: any): config is AssociationPreFetchConfig<TSrc, TTgt>;
export declare function isPostFetchConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource>(config: any): config is AssociationPostFetchConfig<TSrc, TTgt>;
export declare function isJoinConfig<TSrc extends MappedDataSource, TTgt extends MappedDataSource>(config: any): config is AssociationJoinConfig<TSrc, TTgt>;
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
export declare class MappedAssociation<TSrc extends MappedDataSource = any, TTgt extends MappedDataSource = any> {
    dataSource: TSrc;
    mappedName: string;
    private mapping;
    constructor(dataSource: TSrc, mappedName: string, mapping: AssociationMapping<TSrc, TTgt>);
    readonly singular: boolean;
    readonly target: TTgt;
    readonly description: string | undefined;
    getFetchConfig(operation: QueryOperationResolver<any>): (AssociationJoinConfig<TSrc, TTgt> & {
        useIf?: ((this: MappedAssociation<TSrc, TTgt>, operation: QueryOperationResolver<any>) => boolean) | undefined;
    }) | (AssociationPreFetchConfig<TSrc, TTgt> & {
        useIf?: ((this: MappedAssociation<TSrc, TTgt>, operation: QueryOperationResolver<any>) => boolean) | undefined;
    }) | (AssociationPostFetchConfig<TSrc, TTgt> & {
        useIf?: ((this: MappedAssociation<TSrc, TTgt>, operation: QueryOperationResolver<any>) => boolean) | undefined;
    }) | null;
    preFetch(preFetchConfig: AssociationPreFetchConfig<TSrc, TTgt>, operation: QueryOperationResolver<any>): MappedForeignQuery<MappedOperation<any>>;
    postFetch(postFetchConfig: AssociationPostFetchConfig<TSrc, TTgt>, operation: QueryOperationResolver, parents: PartialDeep<TSrc["RecordType"]>[]): MappedForeignQuery<MappedOperation<any>>;
    join(joinConfig: AssociationJoinConfig<TSrc, TTgt>, queryBuilder: Knex.QueryBuilder, aliasHierarchyVisitor: AliasHierarchyVisitor): AliasHierarchyVisitor;
    isAutoJoinable(joinConfig: AssociationJoinConfig<TSrc, TTgt>): boolean;
    associateResultsWithParents(fetchConfig: AssociationPreFetchConfig<TSrc, TTgt> | AssociationPostFetchConfig<TSrc, TTgt>): (parents: PartialDeep<TSrc["RecordType"]>[], results: PartialDeep<TTgt["RecordType"]>[]) => void;
    readonly associatorColumns: {
        inSource: string;
        inRelated: string;
    } | undefined;
    readonly DataSourceType: TSrc;
    readonly AssociatedDataSourceType: TTgt;
    readonly SourceRecordType: TSrc["RecordType"];
    readonly AssociatedRecordType: TTgt["RecordType"];
}
