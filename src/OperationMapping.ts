import * as t from "io-ts";
import _debug from "debug";

export const OperationMappingRT = t.intersection([
    t.type({
        /**
         * Name of operation
         * (surfaced as-is to GraphQL)
         * (not used internally by GRelDAL)
         *
         * @memberof OperationMapping
         */
        name: t.string,
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

        paginate: t.union([
            t.interface({
                cursorColumn: t.string,
            }),
            t.interface({
                interceptQuery: t.Function,
                getNextCursor: t.Function,
                getPrevCursor: t.Function,
                getTotalCount: t.Function,
            }),
        ])
    }),
]);

/**
 * @api-category ConfigType
 */
export type OperationMapping = t.TypeOf<typeof OperationMappingRT>;