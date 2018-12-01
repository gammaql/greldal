"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
exports.KNEX_SUPPORTED_DBS = ["mysql", "mysql2", "oracledb", "pg", "redshift", "sqlite3", "mssql"];
exports.OFFICIALLY_SUPPORTED_DBS = ["mysql2", "pg", "sqlite3"];
exports.assertSupportedConnector = (connector) => {
    const { client } = connector.client.config;
    if (exports.KNEX_SUPPORTED_DBS.indexOf(client) < 0) {
        throw new Error(`Unsupported client: "${client}". ` +
            `Check Knex documentation to ensure Knex connector is properly configured`);
    }
    if (exports.OFFICIALLY_SUPPORTED_DBS.indexOf(client) < 0) {
        console.warn(`${client} is currently not officially supported.` +
            `The contributors may not be able to prioritize ${client} specific issues.`);
    }
    return connector;
};
exports.assertConnectorConfigured = (connector) => {
    if (lodash_1.isNil(connector)) {
        throw new Error(`You need to configure a database connector either at data source level or global level`);
    }
    return connector;
};
/**
 * Register a database connector as the global default for the library.
 *
 * Connector options can be found in [knex documentation](https://knexjs.org/#Installation-client).
 */
exports.useDatabaseConnector = (connector) => {
    exports.globalConnector = exports.assertSupportedConnector(connector);
};
/** Specify whether the database supports returning clause */
exports.supportsReturning = (connector) => {
    const { client } = connector.client.config;
    return ["mssql", "oracledb", "pg"].indexOf(client) >= 0;
};
//# sourceMappingURL=connector.js.map