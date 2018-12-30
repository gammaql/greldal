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
import { pluralize, singularize } from "inflection";
import { has, isPlainObject } from "lodash";

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

export type PresetQueryArgs<T extends MappedDataSource> = { where: Partial<T["ShallowRecordType"]> };

export function isPresetQueryArgs<T extends MappedDataSource>(t: any): t is PresetQueryArgs<T> {
    return has(t, "where") && isPlainObject(t.where);
}

/**
 * @name operationPresets.query.findOneOperation
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function findOneOperation<T extends MappedDataSource>(rootSource: T) {
    return new MappedQueryOperation<T, PresetQueryArgs<T>>({
        rootSource,
        name: `findOne${singularize(rootSource.mappedName)}`,
        description: undefined,
        returnType: undefined,
        args: undefined,
        singular: true,
        shallow: false,
    });
}

/**
 * @name operationPresets.query.findManyOperation
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function findManyOperation<T extends MappedDataSource>(rootSource: T) {
    return new MappedQueryOperation<T, PresetQueryArgs<T>>({
        rootSource,
        name: `findMany${pluralize(rootSource.mappedName)}`,
        returnType: undefined,
        description: undefined,
        args: undefined,
        singular: false,
        shallow: false,
    });
}

/**
 * @name operationPresets.mutation.insertOneOpeeration
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function insertOneOperation<T extends MappedDataSource>(rootSource: T) {
    return new MappedInsertionOperation<T, { entity: T["ShallowRecordType"] }>({
        rootSource,
        name: `insertOne${singularize(rootSource.mappedName)}`,
        description: undefined,
        returnType: undefined,
        args: undefined,
        singular: true,
        shallow: true,
    });
}

/**
 * @name operationPresets.mutation.insertManyOperation
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function insertManyOperation<T extends MappedDataSource>(rootSource: T) {
    return new MappedInsertionOperation<T, { entities: T["ShallowRecordType"][] }>({
        rootSource,
        name: `insertMany${pluralize(rootSource.mappedName)}`,
        description: undefined,
        returnType: undefined,
        args: undefined,
        singular: false,
        shallow: true,
    });
}

/**
 * @name operationPresets.mutations.updateManyOperation
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function updateOneOperation<T extends MappedDataSource>(rootSource: T) {
    return new MappedUpdateOperation<T, { where: T["ShallowRecordType"]; update: T["ShallowRecordType"] }>({
        rootSource,
        name: `updateOne${singularize(rootSource.mappedName)}`,
        description: undefined,
        returnType: undefined,
        args: undefined,
        singular: true,
        shallow: true,
    });
}

/**
 * @name operationPresets.mutations.updateManyOperation
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function updateManyOperation<T extends MappedDataSource>(rootSource: T) {
    return new MappedUpdateOperation<T, { where: T["ShallowRecordType"]; update: T["ShallowRecordType"] }>({
        rootSource,
        name: `updateMany${pluralize(rootSource.mappedName)}`,
        description: undefined,
        returnType: undefined,
        args: undefined,
        singular: false,
        shallow: true,
    });
}

/**
 * Operation preset to delete a single entity matching some query criteria
 *
 * @name operationPresets.mutations.deleteOneOperation
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function deleteOneOperation<TSrc extends MappedDataSource>(rootSource: TSrc) {
    return new MappedDeletionOperation<TSrc, { where: TSrc["ShallowRecordType"] }>({
        rootSource,
        name: `deleteOne${singularize(rootSource.mappedName)}`,
        singular: true,
        shallow: true,
    });
}

/**
 * @name operationPresets.mutations.deleteManyOperation
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function deleteManyOperation<T extends MappedDataSource>(rootSource: T) {
    return new MappedDeletionOperation<T, { where: T["ShallowRecordType"] }>({
        rootSource,
        name: `deleteMany${pluralize(rootSource.mappedName)}`,
        description: undefined,
        returnType: undefined,
        args: undefined,
        singular: false,
        shallow: true,
    });
}

/**
 * @name operationPresets.query.all
 * @api-category PriamryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
const allQueries = (rootSource: MappedDataSource) => [findOneOperation(rootSource), findManyOperation(rootSource)];

export const query = {
    findOneOperation,
    findManyOperation,
    all: allQueries,
};

/**
 * @name operationPresets.mutation.all
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
const allMutations = (rootSource: MappedDataSource) => [
    insertOneOperation(rootSource),
    insertManyOperation(rootSource),
    updateOneOperation(rootSource),
    updateManyOperation(rootSource),
    deleteOneOperation(rootSource),
    deleteManyOperation(rootSource),
];

export const mutation = {
    insertOneOperation,
    insertManyOperation,
    updateOneOperation,
    updateManyOperation,
    deleteOneOperation,
    deleteManyOperation,
    all: allMutations,
};

/**
 * @name operationPresets.all
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function all(rootSource: MappedDataSource) {
    return [...query.all(rootSource), ...mutation.all(rootSource)];
}
