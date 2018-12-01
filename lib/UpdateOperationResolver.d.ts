import { MappedDataSource } from "./MappedDataSource";
import { OperationResolver, BaseStoreParams } from "./OperationResolver";
import { Dict } from "./util-types";
import { QueryOperationResolver } from "./QueryOperationResolver";
export interface StoreUpdateParams extends BaseStoreParams {
    readonly whereParams: Dict;
}
export declare class UpdateOperationResolver<T extends MappedDataSource = any> extends OperationResolver<T> {
    readonly queryResolver: QueryOperationResolver<T>;
    readonly aliasHierarchyVisitor: import("./AliasHierarchyVisitor").AliasHierarchyVisitor;
    readonly storeParams: Pick<import("./QueryOperationResolver").StoreQueryParams<T>, "whereParams">;
    resolve(): Promise<any>;
}
