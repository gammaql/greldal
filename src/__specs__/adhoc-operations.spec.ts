import { mapSchema } from "../MappedSchema";
import { graphql, GraphQLString } from "graphql";
import { OperationType } from "../operation-types";

describe("Adhoc operations", () => {
    test("custom operation without args", async () => {
        // @snippet:start AdhocOperation_withoutArgs
        const customOperation = {
            operationType: OperationType.Query,
            name: "printHello",
            fieldConfig: {
                type: GraphQLString,
                description: "Prints hello",
                resolve: () => {
                    return "hello";
                },
            },
        };
        const schema = mapSchema([customOperation]);
        // @snippet:end
        const result = await graphql(
            schema,
            `
                query {
                    printHello
                }
            `,
        );
        expect(result).toMatchInlineSnapshot(`
            Object {
              "data": Object {
                "printHello": "hello",
              },
            }
        `);
    });
    test("custom operations with args", async () => {
        // @snippet:start AdhocOperation_withArgs
        const customOperation = {
            operationType: OperationType.Query,
            name: "printGreeting",
            fieldConfig: {
                type: GraphQLString,
                args: {
                    name: {
                        type: GraphQLString,
                    },
                },
                description: "Prints hello",
                resolve: (_obj: any, args: { name: string }) => {
                    return `hello ${args.name}`;
                },
            },
        };
        const schema = mapSchema([customOperation]);
        // @snippet:end
        const result = await graphql(
            schema,
            `
                query {
                    printGreeting(name: "Lorefnon")
                }
            `,
        );
        expect(result).toMatchInlineSnapshot(`
            Object {
              "data": Object {
                "printGreeting": "hello Lorefnon",
              },
            }
        `);
    });
    test("custom operations with args and default values", async () => {
        // @snippet:start AdhocOperation_withDefaultArgs
        const customOperation = {
            operationType: OperationType.Query,
            name: "printGreeting",
            fieldConfig: {
                type: GraphQLString,
                args: {
                    name: {
                        type: GraphQLString,
                        defaultValue: "Lorefnon",
                    },
                },
                description: "Prints hello",
                resolve: (_obj: any, args: { name: string }) => {
                    return `hello ${args.name}`;
                },
            },
        };
        const schema = mapSchema([customOperation]);
        // @snippet:end
        const result = await graphql(
            schema,
            `
                query {
                    greetSpecific: printGreeting(name: "John")
                    greetDefault: printGreeting
                }
            `,
        );
        expect(result).toMatchInlineSnapshot(`
            Object {
              "data": Object {
                "greetDefault": "hello Lorefnon",
                "greetSpecific": "hello John",
              },
            }
        `);
    });
});
