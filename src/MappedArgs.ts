import { GraphQLFieldConfigArgumentMap } from "graphql";
import * as t from "io-ts";
import * as Knex from "knex";
import { forEach, transform, reduce } from "lodash";

import { getTypeAccessorError } from "./utils/errors";
import { Dict } from "./utils/util-types";
import { ArgMapping, ArgMappingDictRT } from "./ArgMapping";
import { assertType } from "./utils/assertions";
import { MappedDataSource } from "./MappedDataSource";

/**
 * Dictionary of [ArgMapping](api:ConfigType:ArgMapping)
 *
 * @api-category ConfigType
 */
export type ArgMappingDict<TArgs extends {} = Dict> = { [K in keyof TArgs]: ArgMapping<TArgs[K]> };

/**
 * Derive the type of arguments object (args) that the resolver receives from the ArgMapping specification.
 */
export type ArgsType<T extends ArgMappingDict> = { [K in keyof T]: T[K]["type"]["Type"] };

/**
 * Input argument configuration mapper.
 *
 * There shouldn't be a need to extend or instantiate this class. Use the mapArgs function instead to map an argument
 * mapping configuration to a MappedArgs instance.
 *
 * @api-category MapperClass
 */
export class MappedArgs<TArgs extends object = Dict> {
    constructor(private mapping: ArgMappingDict<TArgs>) {
        assertType(ArgMappingDictRT, mapping, "ArgMapping");
    }

    /**
     * This Getter can be used to get the static type for the arguments object.
     *
     * Example:
     * ```
     * const productsArgs: ArgMapping = mapArgs({
     *     department_ids: {
     *         type: types.array(types.number),
     *     }
     * })
     *
     * type IProductArgs = typeof productArgs["ArgsType"];
     * // IProductArgs is
     * // {department_ids: number[]}
     * ```
     *
     * This getter should be used only for extracting type information.
     * Invoking the getter at runtime will cause an error to be thrown.
     */
    get ArgsType(): TArgs {
        throw getTypeAccessorError("ArgsType", "MappedArgs");
    }

    /**
     * Getter to access the ArgMappingDict specification type from which this instance was derived.
     *
     * This getter should be used only for extracting type information.
     * Invoking the getter at runtime will cause an error to be thrown.
     */
    get ArgsMappingType(): ArgMappingDict<TArgs> {
        throw getTypeAccessorError("ArgsMappingType", "MappedArgs");
    }

    /**
     * @returns The GraphQLFieldConfigArgumentMap (which is passed to graphql-js) derived from the specified argument mapping.
     */
    getMappedArgsFor(dataSource?: MappedDataSource): GraphQLFieldConfigArgumentMap {
        return transform(
            this.mapping,
            (result: GraphQLFieldConfigArgumentMap, arg: ArgMapping<any>, name: string) => {
                result[name] = {
                    type: arg.type.graphQLInputType,
                    defaultValue: arg.defaultValue,
                    description: arg.description,
                };
            },
            {},
        );
    }

    /**
     * Apply all argument level query interceptors on the database query being constructed
     * for this operation.
     */
    interceptQuery(qb: Knex.QueryBuilder, args: TArgs) {
        forEach(this.mapping, (arg, name) => {
            if (arg.interceptQuery) {
                qb = arg.interceptQuery(qb, args[name as keyof TArgs], args) || qb;
            }
        });
        return qb;
    }

    /**
     * Apply all argument level entity interceptors on an entity which is being used
     * for the operation.
     */
    interceptEntity<TEntity>(entity: Partial<TEntity>): Partial<TEntity> {
        return reduce<ArgMappingDict, Partial<TEntity>>(
            this.mapping,
            (result, arg) => {
                if (!arg.interceptEntity) return result;
                return arg.interceptEntity(result) || result;
            },
            entity,
        );
    }
}

/**
 * Map arguments for an operation.
 *
 * ```
 * const args: ArgMapping = mapArgs({
 *     department_ids: {
 *         type: types.array(types.number),
 *     }
 * })
 * ```
 *
 * @api-category PrimaryAPI
 */
export function mapArgs<TArgs extends {}>(mapping: ArgMappingDict<TArgs>) {
    return new MappedArgs<TArgs>(mapping);
}
