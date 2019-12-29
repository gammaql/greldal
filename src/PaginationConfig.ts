import * as t from "io-ts";
import * as Knex from "knex";
import { Dict, Maybe } from "./utils/util-types";
import { has } from "lodash";
import { ColumnSelection } from "./SingleSourceQueryOperationResolver";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";

export const BasePaginationConfigRT = t.partial({
    pageSize: t.union([
        t.number,
        t.partial({
            max: t.number,
            default: t.number,
        }),
    ]),
}, "BasePaginationConfig");

export const AutoPaginationConfigRT = t.intersection([
    t.interface({
        cursorColumn: t.string,
    }),
    BasePaginationConfigRT,
], "AutoPaginationConfig");

export const ControlledPaginationConfigRT = t.intersection([
    BasePaginationConfigRT,
    t.interface({
        interceptQuery: t.Function,
        getNextCursor: t.Function,
        getPrevCursor: t.Function,
        getTotalCount: t.Function,
    }),
], "ControlledPaginationConfig");

export const PaginationConfigRT = t.union([AutoPaginationConfigRT, ControlledPaginationConfigRT], "PaginationConfig");

export interface AutoPaginationConfig extends t.TypeOf<typeof AutoPaginationConfigRT> {}

export interface ControlledPaginationConfig extends t.TypeOf<typeof ControlledPaginationConfigRT> {
    interceptQuery(
        qb: Knex.QueryBuilder,
        cursor: Maybe<string>,
        pageSize: number,
        selectedColumns: ColumnSelection,
        ahv: AliasHierarchyVisitor,
    ): Knex.QueryBuilder;
    getNextCursor(results: Dict[], ahv: AliasHierarchyVisitor): string;
    getPrevCursor(results: Dict[], ahv: AliasHierarchyVisitor): string;
    getTotalCount(qb: Knex.QueryBuilder, ahv: AliasHierarchyVisitor): Promise<number>;
}

export type PaginationConfig = AutoPaginationConfig | ControlledPaginationConfig;

export const isAutoPaginationConfig = (config: PaginationConfig): config is AutoPaginationConfig =>
    has(config, "cursorColumn");
