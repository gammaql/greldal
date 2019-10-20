import { Sqlite3Adapter } from "./Sqlite3Adapter";
import { PGAdapter } from "./PGAdapter";
import { MySQLAdapter } from "./MySQLAdapter";

export const adapters = {
    sqlite3: Sqlite3Adapter,
    pg: PGAdapter,
    mysql: MySQLAdapter,
    mysql2: MySQLAdapter,
};
