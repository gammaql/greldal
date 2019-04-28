import { Adapter, TableLike, TableSchema } from "./Adapter";
import { BaseAdapter } from "./BaseAdapter";
import { retrieveTables, getSchemaForTable } from "./information-schema-support";
import { get } from "lodash";
import assert from "assert";

export class MySQLAdapter extends BaseAdapter implements Adapter {
    async getTables(): Promise<TableLike[]> {
        const dbname = get(this.connector, "client.config.connection.database");
        assert(dbname, "database name could not be retrieved from connection configuration");
        return retrieveTables(this.connector, table =>
            table.where(function() {
                this.where("schema", dbname);
            }),
        );
    }
    async getSchemaForTable(table: TableLike): Promise<TableSchema> {
        return getSchemaForTable(this.connector, table);
    }
}
