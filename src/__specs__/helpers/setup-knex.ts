import Knex from "knex";
import path from "path";
import tmp from "tmp";
import assert from "assert";
import _debug from "debug";

import { Maybe } from "../../util-types";

const debug = _debug("greldal:setup-knex");

export const getConnectionString = () => {
    const connectionString = process.env.DB_CONNECTION_STRING;
    assert(connectionString, "Expected DB_CONNECTION_STRING environment variable to be defined");
    return connectionString;
};

export const setupKnex = () => {
    const isCI = !!process.env.CI;
    let config: Maybe<Knex.Config>;
    switch (process.env.DB) {
        case "mysql":
            if (isCI) {
                config = {
                    client: "mysql",
                    connection: {
                        socketPath: path.join(process.env.HOME!, ".my.cnf"),
                        user: "travis",
                        database: "greldal_test",
                    },
                };
            } else {
                config = {
                    client: "mysql",
                    connection: getConnectionString(),
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
            } else {
                config = {
                    client: "pg",
                    connection: getConnectionString(),
                };
            }
        case "sqlite3":
        default:
            const sqliteFile = tmp.fileSync();
            config = {
                client: "sqlite3",
                connection: {
                    filename: sqliteFile.name,
                },
                useNullAsDefault: true,
            };
    }
    debug("Connecting to knex using configuration: %O", config);
    assert(config, "Failed to configure database for the test suite. You may need to update above configuration");
    return Knex({
        ...config,
        debug: !!process.env.DEBUG,
        pool: {
            min: 0
        }
    });

};
