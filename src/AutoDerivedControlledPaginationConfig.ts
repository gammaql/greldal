import { ControlledPaginationConfig, AutoPaginationConfig } from "./PaginationConfig";
import * as Knex from "knex";
import Maybe from "graphql/tsutils/Maybe";
import { ColumnSelection } from "./SingleSourceQueryOperationResolver";
import { Dict } from "./util-types";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { last, get, first } from "lodash";
import { getCount } from "./__specs__/knex-helpers";

export class AutoDerivedControlledPaginationConfig implements ControlledPaginationConfig {
    constructor(private config: AutoPaginationConfig) {}

    interceptQuery(
        qb: Knex.QueryBuilder,
        cursor: Maybe<string>,
        pageSize: number,
        selectedColumns: ColumnSelection,
        ahv: AliasHierarchyVisitor,
    ): Knex.QueryBuilder {
        const alias = this.getAlias(ahv);
        const isAlreadySelected = !!selectedColumns.find(col => !!col[alias]);
        if (cursor) qb.whereRaw(`??.?? >= ?`, [ahv.alias, this.config.cursorColumn, cursor]);
        if (!isAlreadySelected) qb.column([{ [alias]: this.config.cursorColumn }]);
        return qb.orderBy(alias).limit(pageSize + 1);
    }

    getAlias(ahv: AliasHierarchyVisitor) {
        return ahv.getMemberColumnAlias(this.config.cursorColumn);
    }

    getNextCursor(results: Dict[], ahv: AliasHierarchyVisitor): string {
        return get(last(results), ahv.getMemberColumnAlias(this.config.cursorColumn));
    }

    getPrevCursor(results: Dict[], ahv: AliasHierarchyVisitor): string {
        return get(first(results), ahv.getMemberColumnAlias(this.config.cursorColumn));
    }

    getTotalCount(qb: Knex.QueryBuilder, ahv: AliasHierarchyVisitor): Promise<number> {
        return getCount(qb);
    }
}
