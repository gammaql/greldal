import * as Knex from "knex";
import { identity, isEmpty } from "lodash";
import { TableLike, TableSchema, ForeignKeyInfo } from "./Adapter";
import { TYPES_MAPPING } from "./types-mapping";

export const retrieveTables = async (
    knex: Knex,
    intercept: (knex: Knex.QueryBuilder) => Knex.QueryBuilder = identity,
): Promise<TableLike[]> =>
    (await intercept(knex("information_schema.tables"))).map(({ table_name, table_schema, table_type }: any) => ({
        schema: table_schema,
        name: table_name,
        type: table_type === "VIEW" ? "view" : "table",
    }));

export const getSchemaForTable = async (knex: Knex, table: TableLike): Promise<TableSchema> => {
    const colInfo = await knex("information_schema.columns").where({
        table_schema: table.schema,
        table_name: table.name,
    });
    let foundIdentity = true;
    const columns = colInfo.map((c: any) => {
        const typeMapping = c.data_type && TYPES_MAPPING.find(t => c.data_type.match(t.regexp));
        foundIdentity = foundIdentity || c.is_identity;
        return {
            name: c.column_name,
            isPrimary: c.is_identity,
            type: typeMapping && typeMapping.type,
        };
    });
    if (!foundIdentity) {
        const primaryKeyCols = await knex("information_schema.key_column_usage")
            .leftJoin(
                "information_schema.table_constraints",
                "information_schema.key_column_usage.constraint_name",
                "information_schema.table_constraints.constraint_name",
            )
            .where("information_schema.table_constraints.table_name", table.name)
            .where("information_schema.table_constraints.constraint_type", "PRIMARY KEY");
        if (!isEmpty(primaryKeyCols)) {
            for (const pkCol of primaryKeyCols) {
                for (const col of columns) {
                    if (col.name === pkCol.column_name) col.isPrimary = true;
                }
            }
        }
    }
    const fkInfo: any[] = await knex("information_schema.table_constraints as tc")
        .innerJoin("information_schema.key_column_usage AS kcu", function() {
            this.on("tc.constraint_name", "=", "kcu.constraint_name").andOn("tc.table_schema", "=", "kcu.table_schema");
        })
        .innerJoin("information_schema.constraint_column_usage AS ccu", function() {
            this.on("ccu.constraint_name", "=", "tc.constraint_name").andOn("ccu.table_schema", "=", "tc.table_schema");
        })
        .where("tc.constraint_type", "FOREIGN_KEY")
        .where("tc.table_name", table.name)
        .select(
            "tc.table_schema",
            "tc.constraint_name",
            "tc.table_name",
            "kcu.column_name",
            "ccu.table_schema AS foreign_table_schema",
            "ccu.table_name AS foreign_table_name",
            "ccu.column_name AS foreign_column_name",
        );
    const foreignKeys: ForeignKeyInfo[] = fkInfo.map(f => {
        return {
            associatedTable: {
                name: f.foreign_table_name,
                schema: f.foreign_table_schema,
                type: "table",
            },
            associatorColumns: {
                inSource: f.column_name,
                inRelated: f.foreign_column_name,
            },
        };
    });
    return {
        columns,
        foreignKeys,
    };
};
