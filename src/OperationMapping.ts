import * as t from "io-ts";
import _debug from "debug";
import { GraphQLOutputType } from "graphql";
import { MappedArgs } from "./MappedArgs";
import { MaybeMappedRT } from "./utils/util-types";

export const OperationMappingRT = t.intersection([
    t.type({
        /**
         * Name of operation
         * (surfaced as-is to GraphQL)
         * (not used internally by GRelDAL)
         *
         * @memberof OperationMapping
         */
        name: MaybeMappedRT(t.string, t.string),
    }),
    t.partial({
        /**
         * A human readable description of what this operation does
         * (surfaced as-is to GraphQL)
         * (not used internally by GRelDAL)
         *
         * @memberof OperationMapping
         */
        description: t.string,

        /**
         * Whether the operation operates on a single entity (true) or a collection of entities (false)
         *
         * @memberof OperationMapping
         */
        singular: t.boolean,

        /**
         * Whether the operation can operate on the concerned entity (or entities) as well as other associated entities (false)
         * or just the top level entity (or entities)
         *
         * @memberof OperationMapping
         */
        shallow: t.boolean,
    }),
]);

/**
 * @api-category ConfigType
 */
export interface OperationMapping<TArgs extends {}> extends t.TypeOf<typeof OperationMappingRT> {
    /**
     * GraphQL return type (or output type) of this operation
     *
     * (Surfaced as-is to GraphQL)
     * (Not used internally by GRelDAL)
     */
    returnType?: GraphQLOutputType;

    /**
     * Mapped operation arguments. This would be obtained by invoking the mapArgs function
     */
    args?: MappedArgs<TArgs>;

    resolver?: Function;
}
