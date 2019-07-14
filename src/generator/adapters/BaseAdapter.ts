import { Adapter, TableLike, TableSchema } from "./Adapter";
import { GenConfig } from "../GenConfig";
import { globalConnector, assertConnectorConfigured } from "../../connector";
import * as Knex from "knex";

export abstract class BaseAdapter implements Adapter {
    constructor(private config: GenConfig) {}
    get connector() {
        const knex: Knex = this.config.knex || globalConnector;
        assertConnectorConfigured(knex);
        return knex;
    }
    abstract getTables(): Promise<TableLike[]>;
    abstract getSchemaForTable(table: TableLike): Promise<TableSchema>;
}
