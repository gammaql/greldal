import * as Knex from "knex";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { JoinTypeId } from "./AssociationMapping";

type JoinFn = (tableName: string, column1: string, operator: string, column2: string) => JoinBuilder;

export type JoinBuilder = { [J in JoinTypeId]: JoinFn } & {
    aliasHierarchyVisitor: AliasHierarchyVisitor;
};

const joinTypes: JoinTypeId[] = [
    "innerJoin",
    "leftJoin",
    "leftOuterJoin",
    "rightJoin",
    "rightOuterJoin",
    "outerJoin",
    "fullOuterJoin",
    "crossJoin",
];

export const createJoinBuilder = (queryBuilder: Knex.QueryBuilder, ahv: AliasHierarchyVisitor): JoinBuilder => {
    let result: any = {
        queryBuilder,
        aliasHierarchyVisitor: ahv,
    };
    joinTypes.forEach((joinType: JoinTypeId) => {
        const joinFn: JoinFn = (joinTableName, joinedTableColName, joinOperator, parentTableColName) => {
            const tableVisitor = ahv.visit(joinTableName);
            queryBuilder[joinType](
                `${joinTableName} as ${tableVisitor.alias}`,
                `${tableVisitor.alias}.${joinedTableColName}`,
                joinOperator,
                `${ahv.alias}.${parentTableColName}`,
            );
            return createJoinBuilder(queryBuilder, tableVisitor);
        };
        result[joinType] = joinFn;
    });
    return result;
};
