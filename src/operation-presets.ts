import { MappedDataSource } from "./MappedDataSource";
import { MappedSingleSourceQueryOperation } from "./MappedSingleSourceQueryOperation";
import { MappedSingleSourceInsertionOperation } from "./MappedSingleSourceInsertionOperation";
import { MappedSingleSourceUpdateOperation } from "./MappedSingleSourceUpdateOperation";
import { MappedSingleSourceDeletionOperation } from "./MappedSingleSourceDeletionOperation";
import { pluralize, singularize } from "inflection";
import { has, isPlainObject, identity } from "lodash";
import { isArray } from "util";
import * as t from "io-ts";
import { isOrRefinedFrom } from "./graphql-type-mapper";
import { Interceptor } from "./utils/util-types";

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

export function isPresetSingleInsertionParams(params: any): params is PresetSingleInsertionParams<any> {
    return isPlainObject(params.entity);
}

export function isPresetMultiInsertionParams(params: any): params is PresetMultiInsertionParams<any> {
    return isArray(params.entities);
}

/**
 * Default type of arguments expected by insertion preset
 * @api-category ConfigType
 */
export type PresetInsertionParams<TSrc extends MappedDataSource> =
    | PresetSingleInsertionParams<TSrc>
    | PresetMultiInsertionParams<TSrc>;

export function isPresentInsertionParams(params: any): params is PresetInsertionParams<any> {
    return isPresetSingleInsertionParams(params) || isPresetMultiInsertionParams(params);
}

export function isPresetQueryParams<TSrc extends MappedDataSource>(t: any): t is PresetQueryParams<TSrc> {
    return has(t, "where") && isPlainObject(t.where);
}

export function isPresetUpdateParams<TSrc extends MappedDataSource>(t: any): t is PresetUpdateParams<TSrc> {
    return isPresetQueryParams(t) && has(t, "update") && isPlainObject((t as any).update);
}

/**
 * @name operationPresets.query.findOneOperation
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function findOneOperation<TSrc extends MappedDataSource>(
    rootSource: TSrc,
    interceptMapping: Interceptor<
        MappedSingleSourceQueryOperation<TSrc, PresetQueryParams<TSrc>>["mapping"]
    > = identity,
) {
    return new MappedSingleSourceQueryOperation<TSrc, PresetQueryParams<TSrc>>(
        interceptMapping({
            rootSource,
            name: `findOne${singularize(rootSource.mappedName)}`,
            description: undefined,
            returnType: undefined,
            args: undefined,
            singular: true,
            shallow: false,
        }),
    );
}

const getPresetPaginationConfig = (rootSource: MappedDataSource) => {
    const { primaryFields } = rootSource;
    if (primaryFields.length !== 1) throw new Error("Preset expects a single primary field");
    const [primaryField] = primaryFields;
    if (!isOrRefinedFrom(t.number)(primaryField.type)) {
        console.warn(
            `pagination presets expect the primary field to be sequentially incrementing which doesn't seem to be the case. ` +
                `You may need to configure pagination parameters`,
        );
    }
    return {
        cursorColumn: primaryField.sourceColumn!,
    };
};

/**
 * @name operationPresets.query.findManyOperation
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function findManyOperation<TSrc extends MappedDataSource>(
    rootSource: TSrc,
    interceptMapping: Interceptor<
        MappedSingleSourceQueryOperation<TSrc, PresetQueryParams<TSrc>>["mapping"]
    > = identity,
) {
    return new MappedSingleSourceQueryOperation<TSrc, PresetQueryParams<TSrc>>(
        interceptMapping({
            rootSource,
            name: `findMany${pluralize(rootSource.mappedName)}`,
            returnType: undefined,
            description: undefined,
            args: undefined,
            singular: false,
            shallow: false,
        }),
    );
}
/**
 * @name operationPresets.query.findManyOperation
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function paginatedFindManyOperation<TSrc extends MappedDataSource>(
    rootSource: TSrc,
    interceptMapping: Interceptor<
        MappedSingleSourceQueryOperation<TSrc, PresetQueryParams<TSrc>>["mapping"]
    > = identity,
) {
    const mapping = interceptMapping({
        rootSource,
        name: `findMany${pluralize(rootSource.mappedName)}`,
        returnType: undefined,
        description: undefined,
        args: undefined,
        singular: false,
        shallow: false,
    });
    mapping.paginate = mapping.paginate || getPresetPaginationConfig(rootSource);
    return new MappedSingleSourceQueryOperation<TSrc, PresetQueryParams<TSrc>>(interceptMapping(mapping));
}

/**
 * @name operationPresets.mutation.insertOneOpeeration
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function insertOneOperation<TSrc extends MappedDataSource>(
    rootSource: TSrc,
    interceptMapping: Interceptor<
        MappedSingleSourceInsertionOperation<TSrc, PresetSingleInsertionParams<TSrc>>["mapping"]
    > = identity,
) {
    return new MappedSingleSourceInsertionOperation<TSrc, PresetSingleInsertionParams<TSrc>>(
        interceptMapping({
            rootSource,
            name: `insertOne${singularize(rootSource.mappedName)}`,
            description: undefined,
            returnType: undefined,
            args: undefined,
            singular: true,
            shallow: true,
        }),
    );
}

/**
 * @name operationPresets.mutation.insertManyOperation
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function insertManyOperation<TSrc extends MappedDataSource>(
    rootSource: TSrc,
    interceptMapping: Interceptor<
        MappedSingleSourceInsertionOperation<TSrc, PresetMultiInsertionParams<TSrc>>["mapping"]
    > = identity,
) {
    return new MappedSingleSourceInsertionOperation<TSrc, PresetMultiInsertionParams<TSrc>>(
        interceptMapping({
            rootSource,
            name: `insertMany${pluralize(rootSource.mappedName)}`,
            description: undefined,
            returnType: undefined,
            args: undefined,
            singular: false,
            shallow: true,
        }),
    );
}

/**
 * @name operationPresets.mutations.updateManyOperation
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function updateOneOperation<TSrc extends MappedDataSource>(
    rootSource: TSrc,
    interceptMapping: Interceptor<
        MappedSingleSourceUpdateOperation<TSrc, PresetUpdateParams<TSrc>>["mapping"]
    > = identity,
) {
    return new MappedSingleSourceUpdateOperation<TSrc, PresetUpdateParams<TSrc>>(
        interceptMapping({
            rootSource,
            name: `updateOne${singularize(rootSource.mappedName)}`,
            description: undefined,
            returnType: undefined,
            args: undefined,
            singular: true,
            shallow: true,
        }),
    );
}

/**
 * @name operationPresets.mutations.updateManyOperation
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function updateManyOperation<TSrc extends MappedDataSource>(
    rootSource: TSrc,
    interceptMapping: Interceptor<
        MappedSingleSourceUpdateOperation<TSrc, PresetUpdateParams<TSrc>>["mapping"]
    > = identity,
) {
    return new MappedSingleSourceUpdateOperation<TSrc, PresetUpdateParams<TSrc>>(
        interceptMapping({
            rootSource,
            name: `updateMany${pluralize(rootSource.mappedName)}`,
            description: undefined,
            returnType: undefined,
            args: undefined,
            singular: false,
            shallow: true,
        }),
    );
}

/**
 * Operation preset to delete a single entity matching some query criteria
 *
 * @name operationPresets.mutations.deleteOneOperation
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function deleteOneOperation<TSrc extends MappedDataSource>(
    rootSource: TSrc,
    interceptMapping: Interceptor<
        MappedSingleSourceDeletionOperation<TSrc, PresetDeletionParams<TSrc>>["mapping"]
    > = identity,
) {
    return new MappedSingleSourceDeletionOperation<TSrc, PresetDeletionParams<TSrc>>(
        interceptMapping({
            rootSource,
            name: `deleteOne${singularize(rootSource.mappedName)}`,
            singular: true,
            shallow: true,
        }),
    );
}

/**
 * Operation preset to delete multiple entities matching specified query criteria
 *
 * @name operationPresets.mutations.deleteManyOperation
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function deleteManyOperation<TSrc extends MappedDataSource>(
    rootSource: TSrc,
    interceptMapping: Interceptor<
        MappedSingleSourceDeletionOperation<TSrc, PresetDeletionParams<TSrc>>["mapping"]
    > = identity,
) {
    return new MappedSingleSourceDeletionOperation<TSrc, PresetDeletionParams<TSrc>>(
        interceptMapping({
            rootSource,
            name: `deleteMany${pluralize(rootSource.mappedName)}`,
            description: undefined,
            returnType: undefined,
            args: undefined,
            singular: false,
            shallow: true,
        }),
    );
}

/**
 * Get list of all available query presets applied to specified data source
 *
 * @name operationPresets.query.all
 * @api-category PriamryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
const defaultQueries = (rootSource: MappedDataSource) => [findOneOperation(rootSource), findManyOperation(rootSource)];

export const query = {
    findOneOperation,
    findManyOperation,
    defaults: defaultQueries,
};

/**
 * Get list of all available mutation presets applied to specified data source
 *
 * @name operationPresets.mutation.all
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
const defaultMutations = (rootSource: MappedDataSource) => [
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
    defaults: defaultMutations,
};

/**
 * Get list of all available presets applied to specified data source
 *
 * @name operationPresets.all
 * @api-category PrimaryAPI
 * @param rootSource The data source on which the operation is to be performed
 */
export function defaults(rootSource: MappedDataSource) {
    return [...query.defaults(rootSource), ...mutation.defaults(rootSource)];
}
