import { GraphQLSchema, GraphQLObjectType, GraphQLFieldConfigMap, GraphQLFieldConfig } from "graphql";
import { isEmpty, transform } from "lodash";
import { Maybe } from "./util-types";
import { MappedOperation } from "./MappedOperation";

/**
 * @api-category PrimaryAPI
 */
export function mapSchema(operations: MappedOperation<any>[]) {
    return new GraphQLSchema({
        query: deriveGraphQLObjectType("query", operations.filter(op => op.opType === "query")),
        mutation: deriveGraphQLObjectType("mutation", operations.filter(op => op.opType === "mutation")),
    });
}

function deriveGraphQLObjectType(name: string, operations: MappedOperation<any>[]): Maybe<GraphQLObjectType> {
    return isEmpty(operations)
        ? undefined
        : new GraphQLObjectType({
              name,
              fields: transform<MappedOperation<any>, GraphQLFieldConfig<any, any>>(
                  operations,
                  (result: GraphQLFieldConfigMap<any, any>, operation: MappedOperation<any>) => {
                      result[operation.name] = operation.graphQLOperation;
                  },
                  {},
              ),
          });
}
