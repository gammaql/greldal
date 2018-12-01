import { MappedDataSource } from "./MappedDataSource";
import { OperationResolver } from "./OperationResolver";
import { Dict } from "./util-types";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
export declare class InsertionOperationResolver<T extends MappedDataSource = any> extends OperationResolver<T> {
    readonly entities: Dict[];
    readonly aliasHierarchyVisitor: AliasHierarchyVisitor;
    resolve(): Promise<any>;
}
