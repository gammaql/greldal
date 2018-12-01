import { MappedDataSource } from "./MappedDataSource";
import { MappedQueryOperation } from "./MappedQueryOperation";
import { MappedInsertionOperation } from "./MappedInsertionOperation";
import { MappedUpdateOperation } from "./MappedUpdateOperation";
import { MappedDeletionOperation } from "./MappedDeletionOperation";
export interface PresetQueryParams<T extends MappedDataSource> {
    where: Partial<T["ShallowRecordType"]>;
}
export interface PresetUpdateParams<T extends MappedDataSource> extends PresetQueryParams<T> {
    update: Partial<T["ShallowRecordType"]>;
}
export interface PresetDeletionParams<T extends MappedDataSource> extends PresetQueryParams<T> {
}
export interface PresetSingleInsertionParams<T extends MappedDataSource> {
    entity: T["ShallowRecordType"];
}
export interface PresetMultiInsertionParams<T extends MappedDataSource> {
    entities: T["ShallowRecordType"][];
}
export declare type PresetInsertionParams<T extends MappedDataSource> = PresetSingleInsertionParams<T> | PresetMultiInsertionParams<T>;
export declare function findOneOperation(rootSource: MappedDataSource): MappedQueryOperation<any>;
export declare function findManyOperation(rootSource: MappedDataSource): MappedQueryOperation<any>;
export declare function insertOneOperation(rootSource: MappedDataSource): MappedInsertionOperation<any>;
export declare function insertManyOperation(rootSource: MappedDataSource): MappedInsertionOperation<any>;
export declare function updateOneOperation(rootSource: MappedDataSource): MappedUpdateOperation<any>;
export declare function updateManyOperation(rootSource: MappedDataSource): MappedUpdateOperation<any>;
export declare function deleteOneOperation(rootSource: MappedDataSource): MappedDeletionOperation<any>;
export declare function deleteManyOperation(rootSource: MappedDataSource): MappedDeletionOperation<any>;
export declare const query: {
    findOneOperation: typeof findOneOperation;
    findManyOperation: typeof findManyOperation;
    all: (rootSource: MappedDataSource<any>) => MappedQueryOperation<any>[];
};
export declare const mutation: {
    insertOneOperation: typeof insertOneOperation;
    insertManyOperation: typeof insertManyOperation;
    updateOneOperation: typeof updateOneOperation;
    updateManyOperation: typeof updateManyOperation;
    deleteOneOperation: typeof deleteOneOperation;
    deleteManyOperation: typeof deleteManyOperation;
    all: (rootSource: MappedDataSource<any>) => (MappedInsertionOperation<any> | MappedUpdateOperation<any> | MappedDeletionOperation<any>)[];
};
export declare const all: (rootSource: MappedDataSource<any>) => (MappedQueryOperation<any> | MappedInsertionOperation<any> | MappedUpdateOperation<any> | MappedDeletionOperation<any>)[];
