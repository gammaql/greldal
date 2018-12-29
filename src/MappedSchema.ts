import { GraphQLSchema, GraphQLObjectType, GraphQLFieldConfigMap, GraphQLFieldConfig } from "graphql";
import { isEmpty, transform } from "lodash";
import { MappedOperation } from "./MappedOperation";
import { Maybe } from "./util-types";

export function mapSchema(operations: MappedOperation<any, any, any>[]) {
    return new GraphQLSchema({
        query: deriveGraphQLObjectType("query", operations.filter(op => op.opType === "query")),
        mutation: deriveGraphQLObjectType("mutation", operations.filter(op => op.opType === "mutation")),
    });
}

function deriveGraphQLObjectType(name: string, operations: MappedOperation<any, any, any>[]): Maybe<GraphQLObjectType> {
    return isEmpty(operations)
        ? undefined
        : new GraphQLObjectType({
              name,
              fields: transform<MappedOperation<any, any, any>, GraphQLFieldConfig<any, any>>(
                  operations,
                  (result: GraphQLFieldConfigMap<any, any>, operation: MappedOperation<any, any>) => {
                      result[operation.name] = operation.graphQLOperation;
                  },
                  {},
              ),
          });
}
