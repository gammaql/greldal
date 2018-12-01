import { MappedDataSource } from "./MappedDataSource";
import { OperationResolver } from "./OperationResolver";
import { QueryOperationResolver } from ".";
export declare class DeletionOperationResolver<T extends MappedDataSource = any> extends OperationResolver<T> {
    readonly queryResolver: QueryOperationResolver<T>;
    readonly aliasHierarchyVisitor: import("./AliasHierarchyVisitor").AliasHierarchyVisitor;
    readonly storeParams: Pick<import("./QueryOperationResolver").StoreQueryParams<T>, "whereParams">;
    resolve(): Promise<any[]>;
}
