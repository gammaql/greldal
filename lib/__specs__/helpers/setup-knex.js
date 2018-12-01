"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const path_1 = __importDefault(require("path"));
const tmp_1 = __importDefault(require("tmp"));
const assert_1 = __importDefault(require("assert"));
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default("greldal:setup-knex");
exports.getConnectionString = () => {
    const connectionString = process.env.DB_CONNECTION_STRING;
    assert_1.default(connectionString, "Expected DB_CONNECTION_STRING environment variable to be defined");
    return connectionString;
};
exports.setupKnex = () => {
    const isCI = !!process.env.CI;
    let config;
    switch (process.env.DB) {
        case "mysql":
            if (isCI) {
                config = {
                    client: "mysql",
                    connection: {
                        socketPath: path_1.default.join(process.env.HOME, ".my.cnf"),
                        user: "travis",
                        database: "greldal_test",
                    },
                };
            }
            else {
                config = {
                    client: "mysql",
                    connection: exports.getConnectionString(),
                };
            }
        case "pg":
            if (isCI) {
                config = {
                    client: "pg",
                    connection: {
                        user: "postgres",
                        database: "greldal_test",
                    },
                };
            }
            else {
                config = {
                    client: "pg",
                    connection: exports.getConnectionString(),
                };
            }
        case "sqlite3":
        default:
            const sqliteFile = tmp_1.default.fileSync();
            config = {
                client: "sqlite3",
                connection: {
                    filename: sqliteFile.name,
                },
                useNullAsDefault: true,
            };
    }
    debug("Connecting to knex using configuration: %O", config);
    assert_1.default(config, "Failed to configure database for the test suite. You may need to update above configuration");
    return knex_1.default(config);
};
//# sourceMappingURL=setup-knex.js.map