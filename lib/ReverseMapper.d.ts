import { MappedDataSource } from "./MappedDataSource";
import { Maybe, Dict } from "./util-types";
import { StoreQueryParams } from "./QueryOperationResolver";
export interface ReverseMapperTree {
    readonly fields: Dict<Maybe<string>>;
    readonly relations: Dict<ReverseMapperTree>;
}
export declare class ReverseMapper<T extends MappedDataSource> {
    private rootSource;
    private storeParams;
    tree: ReverseMapperTree;
    constructor(rootSource: T, storeParams: StoreQueryParams<T>);
    reverseMap(rows: Dict[], shallow?: boolean): Promise<any[]>;
    private populateReverseTree;
    private getImmediateColKeys;
    private getAllDescendantColKeys;
    private reverseMapQueryResults;
    private extractEntitiesAtPath;
}
