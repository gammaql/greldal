import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLFieldConfigMap,
    GraphQLFieldConfig,
    GraphQLSchemaConfig,
} from "graphql";
import { isEmpty, transform, identity, filter } from "lodash";
import { Maybe, Interceptor } from "./util-types";
import { Operation } from "./Operation";
import { OperationType } from "./operation-types";

/**
 * @api-category PrimaryAPI
 */
export function mapSchema(operations: Operation[], interceptFields: Interceptor<GraphQLSchemaConfig> = identity) {
    return new GraphQLSchema(
        interceptFields({
            query: deriveGraphQLObjectType("query", operations.filter(op => op.operationType === OperationType.Query)),
            mutation: deriveGraphQLObjectType("mutation", operations.filter(op => op.operationType === OperationType.Mutation)),
            subscription: deriveGraphQLObjectType(
                "subscription",
                filter(operations, { operationType: OperationType.Subscription }),
            ),
        }),
    );
}

function deriveGraphQLObjectType(name: string, operations: Operation[]): Maybe<GraphQLObjectType> {
    return isEmpty(operations)
        ? undefined
        : new GraphQLObjectType({
              name,
              fields: transform(
                  operations,
                  (result: GraphQLFieldConfigMap<any, any>, operation: Operation) => {
                      result[operation.name] = operation.fieldConfig;
                  },
                  {},
              ),
          });
}
