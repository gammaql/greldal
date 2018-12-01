"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const connector_1 = require("./connector");
exports.KNEX_SUPPORTED_DBS = connector_1.KNEX_SUPPORTED_DBS;
exports.OFFICIALLY_SUPPORTED_DBS = connector_1.OFFICIALLY_SUPPORTED_DBS;
exports.useDatabaseConnector = connector_1.useDatabaseConnector;
const InsertionOperationResolver_1 = require("./InsertionOperationResolver");
exports.InsertionOperationResolver = InsertionOperationResolver_1.InsertionOperationResolver;
const QueryOperationResolver_1 = require("./QueryOperationResolver");
exports.QueryOperationResolver = QueryOperationResolver_1.QueryOperationResolver;
const MappedSchema_1 = require("./MappedSchema");
exports.mapSchema = MappedSchema_1.mapSchema;
const MappedDataSource_1 = require("./MappedDataSource");
exports.mapDataSource = MappedDataSource_1.mapDataSource;
const types = __importStar(require("io-ts"));
exports.types = types;
const operationPresets = __importStar(require("./operation-presets"));
exports.operationPresets = operationPresets;
//# sourceMappingURL=index.js.map