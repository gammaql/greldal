"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const lodash_1 = require("lodash");
function mapSchema(operations) {
    return new graphql_1.GraphQLSchema({
        query: deriveGraphQLObjectType("query", operations.filter(op => op.opType === "query")),
        mutation: deriveGraphQLObjectType("mutation", operations.filter(op => op.opType === "mutation")),
    });
}
exports.mapSchema = mapSchema;
function deriveGraphQLObjectType(name, operations) {
    return lodash_1.isEmpty(operations)
        ? undefined
        : new graphql_1.GraphQLObjectType({
            name,
            fields: lodash_1.transform(operations, (result, operation) => {
                result[operation.name] = operation.graphQLOperation;
            }, {}),
        });
}
//# sourceMappingURL=MappedSchema.js.map