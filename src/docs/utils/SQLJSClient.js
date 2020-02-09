import SQLiteClient from "knex/lib/dialects/sqlite3";
import initSqlJs from "sql.js";
import { once, first } from "lodash";

const initSqlJSOnce = once(initSqlJs);

export default class SQLJSClient extends SQLiteClient {
    dialect = "sqljs";
    driverName = "sqljs";

    _driver() {
        throw new Error("ExpectedToNotBeReachable");
    }

    // Get a raw connection from the database, returning a promise with the connection object.
    async acquireRawConnection() {
        const SQL = await initSqlJSOnce({
            locateFile: pathname => {
                if (pathname === "sql-wasm.wasm") {
                    return require("sql.js/dist/sql-wasm.wasm").default;
                }
                throw new Error("Unhandled locate path:", pathname);
            },
        });
        return new SQL.Database();
    }

    // Runs the query on the specified connection, providing the bindings and any
    // other necessary prep work.
    async _query(connection, obj) {
        const stmt = connection.prepare(obj.sql)
        stmt.bind(obj.bindings);
        obj.response = [];
        while (stmt.step()) {
            obj.response.push(stmt.getAsObject());
        }
        obj.context = this;
        return obj;
    }

    _stream(connection, sql, stream) {
        throw new Error("Unsupported");
    }

    // Ensures the response is returned in the same format as other clients.
    processResponse(obj, runner) {
        const ctx = obj.context;
        let { response } = obj;
        switch (obj.method) {
            case "pluck":
                throw new Error("Unsupported");
            case "select":
            case "first":
                // const selectResult = map(get(response, [0, 'values']), (row) => zipObject(get(response, [0, 'columns']), row));
                return obj.method === "first" ? first(response) : response;
            case "insert":
            case "del":
            case "update":
            case "counter":
                return [];
            default:
                return response;
        }
    }
}
