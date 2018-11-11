import * as t from "io-ts";
import * as Knex from "knex";
import { MappedDataSource } from "./MappedDataSource";
import { mapQuery, mapMutation } from "./MappedOperation";
import { Dict } from "./util-types";
import { QueryOperationResolver } from "./QueryOperationResolver";
import { InsertOperationResolver } from "./InsertOperationResolver";

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
    return mapQuery({
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
    return mapQuery({
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
    return mapMutation({
        rootSource,
        name: `insertOne${rootSource.mappedName}`,
        description: undefined,
        returnType: undefined,
        args: undefined,
        singular: true,
        shallow: true,
        resolver: InsertOperationResolver,
    });
}

export const query = {
    findOneOperation,
    findManyOperation,
    all: (rootSource: MappedDataSource) => [findOneOperation(rootSource), findManyOperation(rootSource)],
};
