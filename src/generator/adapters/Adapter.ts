import { Mapped } from "../../util-types";
import { Interceptable } from "../GenConfig";

export interface TableLike {
    name: string;
    type: "table" | "view";
    schema?: string;
}

export interface ColumnInfo {
    name: string;
    isPrimary: boolean;
    type?: string;
}

export interface ForeignKeyInfo {
    associatedTable: TableLike;
    associatorColumns: {
        inSource: string;
        inRelated: string;
    };
}

export interface TableSchema {
    columns: ColumnInfo[];
    foreignKeys: ForeignKeyInfo[];
}

export type DataSourceInfo = Interceptable & {
    name: Mapped<string>;
    table: TableLike;
    fields: {
        [mappedName: string]: Interceptable & {
            column: ColumnInfo;
        };
    };
    associations: {
        [mappedName: string]: Interceptable & {
            foreignKey: ForeignKeyInfo;
            targetDataSourceName?: string;
            singular?: boolean;
        };
    };
};

export interface Adapter {
    getTables(): Promise<TableLike[]>;
    getSchemaForTable(table: TableLike): Promise<TableSchema>;
}
