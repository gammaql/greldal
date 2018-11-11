import * as t from "io-ts";
import * as Knex from "knex";
import { MappedDataSource } from "./MappedDataSource";
import { Dict } from "./util-types";
import { QueryOperationResolver } from "./QueryOperationResolver";
import { InsertionOperationResolver } from "./InsertionOperationResolver";
import { MappedQueryOperation } from "./MappedQueryOperation";
import { UpdateOperationResolver } from "./UpdateOperationResolver";
import { MappedInsertionOperation } from "./MappedInsertionOperation";
import { MappedUpdateOperation } from "./MappedUpdateOperation";
import { MappedDeletionOperation } from "./MappedDeletionOperation";
import { DeletionOperationResolver } from "./DeletionOperationResolver";

export interface PresetQueryParams<T extends MappedDataSource> {
    where: Partial<T["ShallowRecordType"]>;
}

export interface PresetUpdateParams<T extends MappedDataSource> extends PresetQueryParams<T> {
    update: Partial<T["ShallowRecordType"]>;
}

export interface PresetDeletionParams<T extends MappedDataSource> extends PresetQueryParams<T> {}

export interface PresetSingleInsertionParams<T extends MappedDataSource> {
    entity: T["ShallowRecordType"];
}

export interface PresetMultiInsertionParams<T extends MappedDataSource> {
    entities: T["ShallowRecordType"][];
}

export type PresetInsertionParams<T extends MappedDataSource> =
    | PresetSingleInsertionParams<T>
    | PresetMultiInsertionParams<T>;

export function findOneOperation(rootSource: MappedDataSource) {
    return new MappedQueryOperation({
        rootSource,
        name: `findOne${rootSource.mappedName}`,
        description: undefined,
        returnType: undefined,
        args: undefined,
        singular: true,
        shallow: false,
        resolver: QueryOperationResolver,
    });
}

export function findManyOperation(rootSource: MappedDataSource) {
    return new MappedQueryOperation({
        rootSource,
        name: `findMany${rootSource.mappedName}`,
        returnType: undefined,
        description: undefined,
        args: undefined,
        singular: false,
        shallow: false,
        resolver: QueryOperationResolver,
    });
}

export function insertOneOperation(rootSource: MappedDataSource) {
    return new MappedInsertionOperation({
        rootSource,
        name: `insertOne${rootSource.mappedName}`,
        description: undefined,
        returnType: undefined,
        args: undefined,
        singular: true,
        shallow: true,
        resolver: InsertionOperationResolver,
    });
}

export function insertManyOperation(rootSource: MappedDataSource) {
    return new MappedInsertionOperation({
        rootSource,
        name: `insertMany${rootSource.mappedName}`,
        description: undefined,
        returnType: undefined,
        args: undefined,
        singular: false,
        shallow: true,
        resolver: InsertionOperationResolver,
    });
}

export function updateOneOperation(rootSource: MappedDataSource) {
    return new MappedUpdateOperation({
        rootSource,
        name: `updateOne${rootSource.mappedName}`,
        description: undefined,
        returnType: undefined,
        args: undefined,
        singular: true,
        shallow: true,
        resolver: UpdateOperationResolver,
    });
}

export function updateManyOperation(rootSource: MappedDataSource) {
    return new MappedUpdateOperation({
        rootSource,
        name: `updateMany${rootSource.mappedName}`,
        description: undefined,
        returnType: undefined,
        args: undefined,
        singular: false,
        shallow: true,
        resolver: UpdateOperationResolver,
    });
}

export function deleteOneOperation(rootSource: MappedDataSource) {
    return new MappedDeletionOperation({
        rootSource,
        name: `deleteOne${rootSource.mappedName}`,
        description: undefined,
        returnType: undefined,
        args: undefined,
        singular: true,
        shallow: true,
        resolver: DeletionOperationResolver,
    });
}

export function deleteManyOperation(rootSource: MappedDataSource) {
    return new MappedDeletionOperation({
        rootSource,
        name: `deleteMany${rootSource.mappedName}`,
        description: undefined,
        returnType: undefined,
        args: undefined,
        singular: false,
        shallow: true,
        resolver: DeletionOperationResolver,
    });
}

export const query = {
    findOneOperation,
    findManyOperation,
    all: (rootSource: MappedDataSource) => [
        findOneOperation(rootSource),
        findManyOperation(rootSource)
    ],
};

export const mutation = {
    insertOneOperation,
    insertManyOperation,
    updateOneOperation,
    updateManyOperation,
    deleteOneOperation,
    deleteManyOperation,
    all: (rootSource: MappedDataSource) => [
        insertOneOperation(rootSource),
        insertManyOperation(rootSource),
        updateOneOperation(rootSource),
        updateManyOperation(rootSource),
        deleteOneOperation(rootSource),
        deleteManyOperation(rootSource),
    ],
};

export const all = (rootSource: MappedDataSource) => [
    ...query.all(rootSource),
    ...mutation.all(rootSource)
];
