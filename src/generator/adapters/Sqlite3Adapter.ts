import { Adapter, ForeignKeyInfo, TableLike, TableSchema } from "./Adapter";
import { BaseAdapter } from "./BaseAdapter";
import { TYPES_MAPPING } from "./types-mapping";

export class Sqlite3Adapter extends BaseAdapter implements Adapter {
    async getTables(): Promise<TableLike[]> {
        const tables = await this.connector("sqlite_master")
            .where({ type: "table" })
            .orWhere({ type: "view" });
        return tables.map(({ name, type }: any) => ({ name, type }));
    }
    async getSchemaForTable(table: TableLike): Promise<TableSchema> {
        const schemaInfo = await this.connector.raw(`PRAGMA table_info("${table.name}");`);
        const columns = schemaInfo.map((c: any) => {
            const typeMapping = c.type && TYPES_MAPPING.find(t => c.type.match(t.regexp));
            return {
                name: c.name,
                isPrimary: c.pk === 1,
                type: typeMapping && typeMapping.type,
            };
        });
        const fkInfo: any[] = await this.connector.raw(`PRAGMA foreign_key_list("${table.name}");`);
        const foreignKeys: ForeignKeyInfo[] = fkInfo.map((f: any) => {
            return {
                associatedTable: {
                    name: f.table,
                    type: "table",
                },
                associatorColumns: {
                    inSource: f.from,
                    inRelated: f.to,
                },
            };
        });
        return {
            columns,
            foreignKeys,
        };
    }
}
