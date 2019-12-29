import * as Knex from "knex";
import { AliasHierarchyVisitor } from "../AliasHierarchyVisitor";
import { JoinTypeId } from "../AssociationMapping";

/**
 * Type of a join builder function
 *
 * The API exposed by this function is currently much less polymorphic compared to Knex join composition
 * functions. All parameters are mandatory.
 *
 * @param tableName (Unaliased) name of table being joined (referred to as target table)
 * @param column1 (Unaliased) name of column in source table
 * @param operator Join operator (eg. =, <)
 * @param column2 (Unaliased) name of column in target table
 */
type BuildJoin = (tableName: string, column1: string, operator: string, column2: string) => JoinBuilder;

/**
 * A mediator to allow  users to compose joins across data sources without having to deal with
 * aliasing.
 *
 * Exposes a function for every join type supported by knex. For the signature of the function refer
 * BuildJoin type.
 *
 * For example:
 *
 * Given a joinBuilder constructed in the context of users table, when used as below:
 *
 * ```
 * joinBuilder
 *     .leftJoin('departments', 'department_id', '=', 'id')
 *     .leftJoin('purchases', 'id', '=', 'department_id')
 * ```
 *
 * Will construct a join like:
 *
 * ```
 * `users` AS `GQL_DAL_users_1`
 *     LEFT JOIN `departments` as `GQL_DAL_departments_2`
 *     LEFT JOIN `purchases` as `GQL_DAL_purchases_3`
 * ```
 *
 * Note that the aliasing of tables is completely abstracted out from the consumer of join builder
 */
export type JoinBuilder = { [J in JoinTypeId]: BuildJoin } & {
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

/**
 * Convenience utility to construct a JoinBuilder instance
 *
 * @param queryBuilder Knex query builder
 * @param aliasHierarchyVisitor
 */
export const createJoinBuilder = (
    queryBuilder: Knex.QueryBuilder,
    aliasHierarchyVisitor: AliasHierarchyVisitor,
): JoinBuilder => {
    let result: any = {
        queryBuilder,
        aliasHierarchyVisitor: aliasHierarchyVisitor,
    };
    joinTypes.forEach((joinType: JoinTypeId) => {
        const joinFn: BuildJoin = (joinTableName, joinedTableColName, joinOperator, parentTableColName) => {
            const tableVisitor = aliasHierarchyVisitor.visit(joinTableName);
            queryBuilder[joinType](
                `${joinTableName} as ${tableVisitor.alias}`,
                `${tableVisitor.alias}.${joinedTableColName}`,
                joinOperator,
                `${aliasHierarchyVisitor.alias}.${parentTableColName}`,
            );
            return createJoinBuilder(queryBuilder, tableVisitor);
        };
        result[joinType] = joinFn;
    });
    return result;
};
