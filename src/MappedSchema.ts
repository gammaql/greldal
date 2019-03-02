import { GraphQLSchema, GraphQLObjectType, GraphQLFieldConfigMap, GraphQLFieldConfig } from "graphql";
import { isEmpty, transform } from "lodash";
import { Maybe } from "./util-types";
import { Operation } from "./Operation";

/**
 * @api-category PrimaryAPI
 */
export function mapSchema(operations: Operation[]) {
    return new GraphQLSchema({
        query: deriveGraphQLObjectType("query", operations.filter(op => op.operationType === "query")),
        mutation: deriveGraphQLObjectType("mutation", operations.filter(op => op.operationType === "mutation")),
    });
}

function deriveGraphQLObjectType(name: string, operations: Operation[]): Maybe<GraphQLObjectType> {
    return isEmpty(operations)
        ? undefined
        : new GraphQLObjectType({
              name,
              fields: transform<Operation, GraphQLFieldConfig<any, any>>(
                  operations,
                  (result: GraphQLFieldConfigMap<any, any>, operation: Operation) => {
                      result[operation.name] = operation.fieldConfig;
                  },
                  {},
              ),
          });
}
