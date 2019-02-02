import { GraphQLSchema, GraphQLObjectType, GraphQLFieldConfigMap, GraphQLFieldConfig } from "graphql";
import { isEmpty, transform } from "lodash";
import { Maybe } from "./util-types";
import { MappedExternalOperation } from "./MappedExternalOperation";

/**
 * @api-category PrimaryAPI
 */
export function mapSchema(operations: MappedExternalOperation[]) {
    return new GraphQLSchema({
        query: deriveGraphQLObjectType("query", operations.filter(op => op.operationType === "query")),
        mutation: deriveGraphQLObjectType("mutation", operations.filter(op => op.operationType === "mutation")),
    });
}

function deriveGraphQLObjectType(name: string, operations: MappedExternalOperation[]): Maybe<GraphQLObjectType> {
    return isEmpty(operations)
        ? undefined
        : new GraphQLObjectType({
              name,
              fields: transform<MappedExternalOperation, GraphQLFieldConfig<any, any>>(
                  operations,
                  (result: GraphQLFieldConfigMap<any, any>, operation: MappedExternalOperation) => {
                      result[operation.name] = operation.fieldConfig;
                  },
                  {},
              ),
          });
}
