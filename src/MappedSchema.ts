import { GraphQLSchema, GraphQLObjectType, GraphQLFieldConfigMap, GraphQLFieldConfig } from "graphql";
import { isEmpty, transform } from "lodash";
import { MappedSingleSourceOperation } from "./MappedSingleSourceOperation";
import { Maybe } from "./util-types";

/**
 * @api-category PrimaryAPI
 */
export function mapSchema(operations: MappedSingleSourceOperation<any, any, any>[]) {
    return new GraphQLSchema({
        query: deriveGraphQLObjectType("query", operations.filter(op => op.opType === "query")),
        mutation: deriveGraphQLObjectType("mutation", operations.filter(op => op.opType === "mutation")),
    });
}

function deriveGraphQLObjectType(name: string, operations: MappedSingleSourceOperation<any, any, any>[]): Maybe<GraphQLObjectType> {
    return isEmpty(operations)
        ? undefined
        : new GraphQLObjectType({
              name,
              fields: transform<MappedSingleSourceOperation<any, any, any>, GraphQLFieldConfig<any, any>>(
                  operations,
                  (result: GraphQLFieldConfigMap<any, any>, operation: MappedSingleSourceOperation<any, any>) => {
                      result[operation.name] = operation.graphQLOperation;
                  },
                  {},
              ),
          });
}
