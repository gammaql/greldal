import { MappedQuery } from "./MappedQuery";
import { MappedMutation } from "./MappedMutation";
import { GraphQLSchema, GraphQLObjectType, GraphQLFieldConfigMap, GraphQLFieldConfig } from "graphql";
import { isEmpty, transform } from "lodash";
import { MappedOperation } from "./MappedOperation";
import { Maybe } from "./util-types";

export function mapSchema(queries: MappedQuery[] = [], mutations: MappedMutation[] = []) {
    return new GraphQLSchema({
        query: deriveGraphQLObjectType("query", queries),
        mutation: deriveGraphQLObjectType("mutation", mutations),
    });
}

function deriveGraphQLObjectType(name: string, operations: MappedOperation[]): Maybe<GraphQLObjectType> {
    return isEmpty(operations)
        ? undefined
        : new GraphQLObjectType({
              name,
              fields: transform<MappedOperation, GraphQLFieldConfig<any, any>>(
                  operations,
                  (result: GraphQLFieldConfigMap<any, any>, operation: MappedQuery) => {
                      result[operation.name] = operation.graphQLOperation;
                  },
                  {},
              ),
          });
}
