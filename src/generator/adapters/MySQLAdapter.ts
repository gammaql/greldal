import { Adapter, TableLike, TableSchema, ForeignKeyInfo } from "./Adapter";
import { BaseAdapter } from "./BaseAdapter";
import { retrieveTables, getSchemaForTable } from "./information-schema-support";
import { get, isEmpty } from "lodash";
import assert from "assert";
import { TYPES_MAPPING } from "./types-mapping";

export class MySQLAdapter extends BaseAdapter implements Adapter {
    async getTables(): Promise<TableLike[]> {
        const dbname = get(this.connector, "client.config.connection.database");
        assert(dbname, "database name could not be retrieved from connection configuration");
        return retrieveTables(this.connector, table =>
            table.where(function () {
                this.where("table_schema", dbname);
            }),
        );
    }
    async getSchemaForTable(table: TableLike): Promise<TableSchema> {
        const knex = this.connector;
        const colInfo = await knex("information_schema.columns").where({
            table_schema: table.schema,
            table_name: table.name,
        });
        const columns = colInfo.map((c: any) => {
            const typeMapping = c.DATA_TYPE && TYPES_MAPPING.find(t => c.DATA_TYPE.match(t.regexp));
            return {
                name: c.COLUMN_NAME,
                isPrimary: false,
                type: typeMapping && typeMapping.type,
            };
        });
        const primaryKeyCols = await knex("information_schema.key_column_usage as kcu")
            .leftJoin(
                "information_schema.table_constraints as tc",
                function() {
                    this
                        .on("kcu.constraint_name", "=", "tc.constraint_name")
                        .andOn("kcu.table_schema", "=", "tc.constraint_schema")
                        .andOn("kcu.table_name", "=", "tc.table_name")
                }
            )
            .where("tc.table_name", table.name)
            .where("tc.constraint_type", "PRIMARY KEY");

        if (!isEmpty(primaryKeyCols)) {
            for (const pkCol of primaryKeyCols) {
                for (const col of columns) {
                    if (col.name === pkCol.COLUMN_NAME) col.isPrimary = true;
                }
            }
        }

        const fkInfo: any[] = await knex("information_schema.table_constraints as tc")
            .innerJoin("information_schema.key_column_usage AS kcu", function () {
                this.on("tc.constraint_name", "=", "kcu.constraint_name").andOn("tc.table_schema", "=", "kcu.table_schema");
            })
            .where("tc.constraint_type", "FOREIGN KEY")
            .where("tc.table_name", table.name)
            .select(
                "tc.table_schema",
                "tc.constraint_name",
                "tc.table_name",
                "kcu.column_name",
                "kcu.referenced_table_schema AS foreign_table_schema",
                "kcu.referenced_table_name AS foreign_table_name",
                "kcu.referenced_column_name AS foreign_column_name",
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
    }
}
