"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const t = __importStar(require("io-ts"));
const graphql_1 = require("graphql");
const lodash_1 = require("lodash");
const debug = debug_1.default("greldal:graphql-type-mapper");
exports.deriveDefaultOutputType = (mappedDataSource) => new graphql_1.GraphQLObjectType({
    name: mappedDataSource.mappedName,
    fields: () => exports.mapOutputAssociationFields(mappedDataSource, exports.mapOutputFields(mappedDataSource)),
});
exports.deriveDefaultShallowInputType = (mappedDataSource) => new graphql_1.GraphQLInputObjectType({
    name: `${mappedDataSource.mappedName}Input`,
    fields: () => exports.mapInputFields(mappedDataSource),
});
exports.deriveDefaultShallowOutputType = (mappedDataSource) => new graphql_1.GraphQLObjectType({
    name: `Shallow${mappedDataSource.mappedName}`,
    fields: () => exports.mapOutputFields(mappedDataSource),
});
exports.mapInputFields = (ds, result = {}) => lodash_1.transform(ds.fields, (fields, field, name) => {
    fields[name] = {
        type: field.inputType,
        description: field.description,
    };
}, result);
exports.mapOutputFields = (ds, result = {}) => lodash_1.transform(ds.fields, (fields, field, name) => {
    debug("mapping output field from data source field: ", name, field);
    fields[name] = {
        type: field.outputType,
        description: field.description,
    };
}, result);
exports.mapOutputAssociationFields = (ds, result = {}) => lodash_1.transform(ds.associations, (fields, association, name) => {
    debug("mapping output field from association: ", name, association);
    const outputType = association.target.defaultOutputType;
    fields[name] = {
        type: association.singular ? outputType : graphql_1.GraphQLList(outputType),
        args: {
            where: {
                type: association.target.defaultShallowInputType,
            },
        },
        description: association.description,
        resolve: (source, args, context, info) => normalizeResultsForSingularity(source[name], association.singular),
    };
}, result);
function ioToGraphQLOutputType(type, id) {
    const scalar = ioToGraphQLScalarType(type);
    if (scalar)
        return scalar;
    if (type instanceof t.ArrayType)
        return graphql_1.GraphQLList(ioToGraphQLOutputType(type.type, `id[]`));
    if (type instanceof t.InterfaceType)
        return new graphql_1.GraphQLObjectType({
            name: lodash_1.uniqueId("GrelDALAutoDerivedOutputType"),
            fields: lodash_1.transform(type.props, (result, val, key) => {
                result[key] = {
                    type: ioToGraphQLOutputType(val, `id[${key}]`),
                };
            }, {}),
        });
    throw new Error(`GraphQL type for ${id} could not be auto-derived. You will need to specify the mapped types yourself.`);
}
exports.ioToGraphQLOutputType = ioToGraphQLOutputType;
function ioToGraphQLScalarType(type) {
    if (type instanceof t.StringType)
        return graphql_1.GraphQLString;
    if (type instanceof t.NumberType)
        return graphql_1.GraphQLFloat;
    if (type instanceof t.BooleanType)
        return graphql_1.GraphQLBoolean;
    return null;
}
exports.ioToGraphQLScalarType = ioToGraphQLScalarType;
function ioToGraphQLInputType(type, id) {
    const scalar = ioToGraphQLScalarType(type);
    if (scalar)
        return scalar;
    if (type instanceof t.ArrayType)
        return graphql_1.GraphQLList(ioToGraphQLInputType(type.type, `id[]`));
    if (type instanceof t.InterfaceType)
        return new graphql_1.GraphQLInputObjectType({
            name: lodash_1.uniqueId("GrelDALAutoDerivedInputType"),
            fields: lodash_1.transform(type.props, (result, val, key) => {
                result[key] = {
                    type: ioToGraphQLInputType(val, `id[${key}]`),
                };
            }, {}),
        });
    throw new Error(`GraphQL type for ${id} could not be auto-derived. You will need to specify the mapped types yourself.`);
}
exports.ioToGraphQLInputType = ioToGraphQLInputType;
exports.deriveFieldOutputType = (field) => ioToGraphQLOutputType(field.type, field.keyPath);
exports.deriveFieldInputType = (field) => ioToGraphQLInputType(field.type, field.keyPath);
function normalizeResultsForSingularity(result, singular) {
    if (singular) {
        if (lodash_1.isArray(result))
            return lodash_1.first(result);
    }
    else {
        if (!lodash_1.isArray(result))
            return [result];
        if (lodash_1.isNil(result))
            return [];
    }
    return result;
}
exports.normalizeResultsForSingularity = normalizeResultsForSingularity;
//# sourceMappingURL=graphql-type-mapper.js.map