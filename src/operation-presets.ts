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

/**
 * Default type of arguments expected by query operation preset
 * @api-category ConfigType
 */
export interface PresetQueryParams<TSrc extends MappedDataSource> {
    where: Partial<TSrc["ShallowEntityType"]>;
}

/**
 * Default type of arguments expected by update operation preset
 * @api-category ConfigType
 */
export interface PresetUpdateParams<TSrc extends MappedDataSource> extends PresetQueryParams<TSrc> {
    update: Partial<TSrc["ShallowEntityType"]>;
}

/**
 * Default type of arguments expected by deletion operation preset
 * @api-category ConfigType
 */
export interface PresetDeletionParams<TSrc extends MappedDataSource> extends PresetQueryParams<TSrc> {}

/**
 * Default type of arguments expected by singular insertion preset
 * @api-category ConfigType
 */
export interface PresetSingleInsertionParams<TSrc extends MappedDataSource> {
    entity: TSrc["ShallowEntityType"];
}

/**
 * Default type of arguments expected by multi-insertion preset
 * @api-category ConfigType
 */
export interface PresetMultiInsertionParams<TSrc extends MappedDataSource> {
    entities: TSrc["ShallowEntityType"][];
}

/**
 * Default type of arguments expected by insertion preset
 * @api-category ConfigType
 */
export type PresetInsertionParams<TSrc extends MappedDataSource> =
    | PresetSingleInsertionParams<TSrc>
    | PresetMultiInsertionParams<TSrc>;

export function isPresetQueryParams<TSrc extends MappedDataSource>(t: any): t is PresetQueryParams<TSrc> {
    return has(t, "where") && isPlainObject(t.where);
}

/**
 * @name operationPresets.query.findOneOperation
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function findOneOperation<TSrc extends MappedDataSource>(rootSource: TSrc) {
    return new MappedQueryOperation<TSrc, PresetQueryParams<TSrc>>({
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
export function findManyOperation<TSrc extends MappedDataSource>(rootSource: TSrc) {
    return new MappedQueryOperation<TSrc, PresetQueryParams<TSrc>>({
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
export function insertOneOperation<TSrc extends MappedDataSource>(rootSource: TSrc) {
    return new MappedInsertionOperation<TSrc, PresetSingleInsertionParams<TSrc>>({
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
export function insertManyOperation<TSrc extends MappedDataSource>(rootSource: TSrc) {
    return new MappedInsertionOperation<TSrc, PresetMultiInsertionParams<TSrc>>({
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
export function updateOneOperation<TSrc extends MappedDataSource>(rootSource: TSrc) {
    return new MappedUpdateOperation<TSrc, PresetUpdateParams<TSrc>>({
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
export function updateManyOperation<TSrc extends MappedDataSource>(rootSource: TSrc) {
    return new MappedUpdateOperation<TSrc, PresetUpdateParams<TSrc>>({
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
    return new MappedDeletionOperation<TSrc, PresetDeletionParams<TSrc>>({
        rootSource,
        name: `deleteOne${singularize(rootSource.mappedName)}`,
        singular: true,
        shallow: true,
    });
}

/**
 * Operation preset to delete multiple entities matching specified query criteria
 *
 * @name operationPresets.mutations.deleteManyOperation
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function deleteManyOperation<TSrc extends MappedDataSource>(rootSource: TSrc) {
    return new MappedDeletionOperation<TSrc, PresetDeletionParams<TSrc>>({
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
 * Get list of all available query presets applied to specified data source
 *
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
 * Get list of all available mutation presets applied to specified data source
 *
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
 * Get list of all available presets applied to specified data source
 *
 * @name operationPresets.all
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function all(rootSource: MappedDataSource) {
    return [...query.all(rootSource), ...mutation.all(rootSource)];
}
