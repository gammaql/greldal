import * as Knex from "knex";
import { Maybe } from "./util-types";
import { isNil } from "lodash";

/**
 * String constants representing database clients supported by Knex.
 * This collection must be kept in sync with Knex.
 *
 * TODO: Expose this collection from knex itself.
 */
export const KNEX_SUPPORTED_DBS = ["mysql", "mysql2", "oracledb", "pg", "redshift", "sqlite3", "mssql"];

/**
 * Subset of KNEX_SUPPORTED_DBS which are officially supported by GRelDAL and which are covered by GRelDAL's test coverage
 */
export const OFFICIALLY_SUPPORTED_DBS = ["mysql2", "pg", "sqlite3"];

/**
 * Singleton database connector used by default if a local database connector is not specified at data source level
 */
export let globalConnector: Maybe<Knex>;

/**
 * Validate if the passed knex connector is configured to use a supported datbase.
 */
export const assertSupportedConnector = (connector: Knex) => {
    const { client } = connector.client.config;
    if (KNEX_SUPPORTED_DBS.indexOf(client) < 0) {
        throw new Error(
            `Unsupported client: "${client}". ` +
                `Check Knex documentation to ensure Knex connector is properly configured`,
        );
    }
    if (OFFICIALLY_SUPPORTED_DBS.indexOf(client) < 0) {
        console.warn(
            `${client} is currently not officially supported.` +
                `The contributors may not be able to prioritize ${client} specific issues.`,
        );
    }
    return connector;
};

export const assertConnectorConfigured = (connector?: Maybe<Knex>) => {
    if (isNil(connector)) {
        throw new Error(`You need to configure a database connector either at data source level or global level`);
    }
    return connector;
};

/**
 * Register a database connector as the global default for the library.
 *
 * Connector options can be found in [knex documentation](https://knexjs.org/#Installation-client).
 *
 * @api-category PrimaryAPI
 */
export const useDatabaseConnector = (connector: Knex) => {
    globalConnector = assertSupportedConnector(connector);
    return connector;
};

/** Specify whether the database supports returning clause */
export const supportsReturning = (connector: Knex) => {
    const { client } = connector.client.config;
    return ["mssql", "oracledb", "pg"].indexOf(client) >= 0;
};
