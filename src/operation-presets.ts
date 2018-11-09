import * as t from "io-ts";
import * as Knex from "knex";
import { MappedDataSource } from "./MappedDataSource";
import { mapQuery } from "./MappedOperation";
import { Dict } from "./util-types";
import { QueryOperationResolver } from "./QueryOperationResolver";

export interface PresetQueryParams<T extends MappedDataSource> {
    where: Partial<T["ShallowRecordType"]>;
}

export interface PresetUpdateParams<T extends MappedDataSource> extends PresetQueryParams<T> {
    update: Partial<T["ShallowRecordType"]>;
}

export interface PresetDeletionParams<T extends MappedDataSource> extends PresetQueryParams<T> { }

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
        returnType: () => rootSource.recordType,
        args: rootSource.fields,
        singular: true,
        shallow: false,
        resolver: QueryOperationResolver
    });
}
