import { OperationResolver, BaseStoreParams } from "./OperationResolver";
import { MappedDataSource } from "./MappedDataSource";
import { Dict } from "./util-types";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { MappedAssociation } from "./MappedAssociation";
import { MappedQueryOperation } from "./MappedQueryOperation";
import { OperationMapping } from "./MappedOperation";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
export interface PrimaryRowMapper {
    readonly propertyPath: string[];
    readonly fetchedColName: string;
}
export interface PreFetchedRowMapper<TResult, TParent> {
    readonly propertyPath: string[];
    readonly result: Promise<TResult[]>;
    readonly reverseAssociate: (parents: TParent[], results: TResult[]) => void;
}
export interface PostFetchedRowMapper<TResult, TParent> {
    readonly propertyPath: string[];
    readonly run: (parents: TParent[]) => Promise<TResult[]>;
    readonly reverseAssociate: (parents: TParent[], results: TResult[]) => void;
}
export interface StoreQueryParams<T extends MappedDataSource> extends BaseStoreParams {
    readonly whereParams: Dict;
    readonly columns: {
        [k: string]: string;
    }[];
    readonly primaryMappers: PrimaryRowMapper[];
    readonly secondaryMappers: {
        readonly preFetched: PreFetchedRowMapper<any, Partial<T["ShallowRecordType"]>>[];
        readonly postFetched: PostFetchedRowMapper<any, Partial<T["ShallowRecordType"]>>[];
    };
}
export declare class QueryOperationResolver<TDataSource extends MappedDataSource = any> extends OperationResolver<TDataSource> {
    operation: MappedQueryOperation<OperationMapping<TDataSource>>;
    readonly aliasHierarchyVisitor: AliasHierarchyVisitor;
    readonly rootSource: TDataSource;
    readonly storeParams: StoreQueryParams<TDataSource>;
    resolve(): Promise<any[]>;
    runQuery(): Promise<any>;
    resolveFields<TCurSrc extends MappedDataSource>(tablePath: string[] | undefined, aliasHierarchyVisitor: AliasHierarchyVisitor, dataSource: TCurSrc, resolveInfoVisitor: ResolveInfoVisitor<TCurSrc>): void;
    private resolveFieldName;
    private resolveAssociation;
    private deriveJoinedQuery;
    private invokeSideLoader;
    associateResultsWithParents<TCurSrc extends MappedDataSource>(association: MappedAssociation<TCurSrc>): (parents: Dict<any>[], results: Dict<any>[]) => void;
    private deriveColumnsForField;
    protected mapWhereArgs(whereArgs: Dict, aliasHierarchyVisitor: AliasHierarchyVisitor): Dict<any>;
}
