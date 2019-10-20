import { Adapter, TableLike, TableSchema } from "./Adapter";
import { BaseAdapter } from "./BaseAdapter";
import { retrieveTables, getSchemaForTable } from "./information-schema-support";

export class PGAdapter extends BaseAdapter implements Adapter {
    async getTables(): Promise<TableLike[]> {
        return retrieveTables(this.connector, table =>
            table
                .where(function() {
                    this.where("table_type", "BASE TABLE").orWhere("table_type", "VIEW");
                })
                .where(function() {
                    this.whereNot("table_schema", "pg_catalog").andWhereNot("table_schema", "information_schema");
                }),
        );
    }
    async getSchemaForTable(table: TableLike): Promise<TableSchema> {
        return getSchemaForTable(this.connector, table);
    }
}
