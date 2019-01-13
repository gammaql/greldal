import { GraphQLFieldConfigArgumentMap, GraphQLArgumentConfig } from "graphql";
import * as t from "io-ts";
import * as Knex from "knex";
import { forEach, transform, reduce } from "lodash";

import { getTypeAccessorError } from "./errors";
import { ioToGraphQLInputType } from "./graphql-type-mapper";
import { Dict } from "./util-types";
import { ArgMapping, ArgMappingDictRT } from "./ArgMapping";
import { assertType } from "./assertions";

/**
 * Dictionary of [ArgMapping](api:ConfigType:ArgMapping)
 *
 * @api-category ConfigType
 */
export type ArgMappingDict<TArgs extends {} = Dict> = { [K in keyof TArgs]: ArgMapping<t.Type<TArgs[K]>> };

/**
 * Derive the type of arguments object (args) that the resolver receives from the ArgMapping specification.
 */
export type ArgsType<T extends ArgMappingDict> = { [K in keyof T]: T[K]["type"] };

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
     *         to: GraphQLList(GraphQLInt)
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
    get mappedArgs(): GraphQLFieldConfigArgumentMap {
        return transform<ArgMapping<t.Type<any>>, GraphQLArgumentConfig>(
            this.mapping,
            (result, arg, name) => {
                result[name] = {
                    type: ioToGraphQLInputType(arg.type, `args[${name}]`),
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
 *         to: GraphQLList(GraphQLInt)
 *     }
 * })
 * ```
 *
 * @api-category PrimaryAPI
 */
export function mapArgs<TArgs extends object>(mapping: ArgMappingDict<TArgs>) {
    return new MappedArgs<TArgs>(mapping);
}
