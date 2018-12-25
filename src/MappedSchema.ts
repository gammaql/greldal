import { GraphQLSchema, GraphQLObjectType, GraphQLFieldConfigMap, GraphQLFieldConfig } from "graphql";
import { isEmpty, transform } from "lodash";
import { MappedOperation } from "./MappedOperation";
import { Maybe } from "./util-types";

export function mapSchema(operations: MappedOperation[]) {
    return new GraphQLSchema({
        query: deriveGraphQLObjectType("query", operations.filter(op => op.opType === "query")),
        mutation: deriveGraphQLObjectType("mutation", operations.filter(op => op.opType === "mutation")),
    });
}

function deriveGraphQLObjectType(name: string, operations: MappedOperation[]): Maybe<GraphQLObjectType> {
    return isEmpty(operations)
        ? undefined
        : new GraphQLObjectType({
              name,
              fields: transform<MappedOperation, GraphQLFieldConfig<any, any>>(
                  operations,
                  (result: GraphQLFieldConfigMap<any, any>, operation: MappedOperation) => {
                      result[operation.name] = operation.graphQLOperation;
                  },
                  {},
              ),
          });
}
