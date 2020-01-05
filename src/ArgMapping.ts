import * as t from "io-ts";
import * as Knex from "knex";

import { Dict, InstanceOf } from "./utils/util-types";
import { TypeSpec } from "./utils/types";

export const ArgMappingRT = t.intersection(
    [
        t.partial({
            /**
             * Description exposed to clients through mapped GraphQL API
             *
             * @memberof ArgMapping
             */
            description: t.string,
            interceptQuery: t.Function,
            interceptEntity: t.Function,
            defaultValue: t.any,
        }),
        t.type({
            type: InstanceOf(TypeSpec),
        }),
    ],
    "ArgMapping",
);

export const ArgMappingDictRT = t.record(t.string, ArgMappingRT, "ArgMappingDict");

/**
 * Configuration for mapping of an input argument
 *
 * @api-category ConfigType
 */
export interface ArgMapping<TMapped> extends t.TypeOf<typeof ArgMappingRT> {
    /**
     * Type specification for this argument
     *
     * Normally this would be a composition of one of the runtime types exposed through types library.
     * These types are simply re-exported from [io-ts](https://github.com/gcanti/io-ts) and detailed documentation can be found there.
     *
     * Example:
     *
     * ```
     * // Primitives
     * t.string
     * t.number
     *
     * // Composite types
     * t.type({
     *     x: t.number,
     *     y: t.number
     * })
     *
     * t.array(t.string)
     * ```
     */
    type: TypeSpec<TMapped>;
    /**
     * Default value of this argument.
     *
     * Exposed to clients through mapped GraphQL API
     */
    defaultValue?: TMapped;
    /**
     * Can be used to intercept the database query being constructed during query
     *
     * This opens up the ability to map an argument value to an arbitrary database query operation.
     */
    interceptQuery?: (queryBuilder: Knex.QueryBuilder, value: TMapped, args: Dict) => Knex.QueryBuilder;
    /**
     * Can be used to intercept the derived entity to be used for the operation this argument is part of.
     *
     * Typically useful for insert, update operations.
     */
    interceptEntity?: <TEntity>(entity: Partial<TEntity>) => Partial<TEntity>;
}
