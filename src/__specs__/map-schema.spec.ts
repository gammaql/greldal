import { mapSchema } from "..";
import { GraphQLString, graphql, GraphQLObjectType, printSchema } from "graphql";
import { OperationType } from "../operation-types";

test("External resolver mapping", async () => {
    const schema = mapSchema([
        {
            operationType: OperationType.Query,
            name: "hello",
            fieldConfig: {
                type: GraphQLString,
                resolve() {
                    return "world";
                },
            },
        },
    ]);
    const r1 = await graphql(
        schema,
        `
            query {
                hello
            }
        `,
    );
    expect(r1.errors).not.toBeDefined();
    expect(r1).toMatchSnapshot();
});

test("Schema interceptor", () => {
    const schema = mapSchema(
        [
            {
                operationType: OperationType.Query,
                name: "hello",
                fieldConfig: {
                    type: GraphQLString,
                    resolve() {
                        return "world";
                    },
                },
            },
        ],
        schemaConfig => {
            schemaConfig.subscription = new GraphQLObjectType({
                name: "Subscription",
                fields: {},
            });
            return schemaConfig;
        },
    );
    expect(printSchema(schema)).toMatchSnapshot();
});
