import * as Knex from "knex";
import { Maybe } from "./util-types";
export declare const KNEX_SUPPORTED_DBS: string[];
export declare const OFFICIALLY_SUPPORTED_DBS: string[];
/**
 * Singleton database connector used by default if a local database connector is not specified at data source level
 */
export declare let globalConnector: Maybe<Knex>;
export declare const assertSupportedConnector: (connector: Knex) => Knex;
export declare const assertConnectorConfigured: (connector?: Maybe<Knex>) => Knex;
/**
 * Register a database connector as the global default for the library.
 *
 * Connector options can be found in [knex documentation](https://knexjs.org/#Installation-client).
 */
export declare const useDatabaseConnector: (connector: Knex) => void;
/** Specify whether the database supports returning clause */
export declare const supportsReturning: (connector: Knex) => boolean;
