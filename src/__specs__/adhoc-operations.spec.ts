import { mapSchema } from "../MappedSchema";
import { graphql, GraphQLString } from "graphql";
import { OperationType } from "../operation-types";
import { types } from "../universal";

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
    test("Custom query operation with types specified through io-ts", async () => {
        // @snippet:start AdhocQueryOperation_iots
        const OrderDetailTypeSpec = types.object("OrderDetail", {
            orderId: types.number,
            purchasedAt: types.isoDate,
            purchasedBy: types.array(
                types.object("OrderDetailPurchaser", {
                    customerId: types.number,
                    name: types.string,
                }),
            ),
        });
        type OrderDetail = typeof OrderDetailTypeSpec["Type"];
        const customOperation = {
            operationType: OperationType.Query,
            name: "orderDetails",
            fieldConfig: {
                type: OrderDetailTypeSpec.graphQLOutputType,
                args: {
                    orderId: {
                        type: types.number.graphQLInputType,
                    },
                },
                description: "Prints hello",
                resolve: (_parent: any, args: { orderId: number }): OrderDetail => ({
                    orderId: args.orderId,
                    purchasedAt: new Date("2020-01-01"),
                    purchasedBy: [
                        {
                            customerId: 1,
                            name: "John Doe",
                        },
                        {
                            customerId: 2,
                            name: "Jane Doe",
                        },
                    ],
                }),
            },
        };
        const schema = mapSchema([customOperation]);
        // @snippet:end
        // @snippet:start AdhocQueryOperation_iots_schema_introspection_query
        const introspectionResult = await graphql(
            schema,
            `
                query {
                    __schema {
                        types {
                            name
                            fields {
                                name
                                type {
                                    name
                                }
                            }
                        }
                    }
                }
            `,
        );
        // @snippet:end
        // @snippet:start AdhocQueryOperation_iots_schema_introspection_query_result
        expect(introspectionResult).toMatchInlineSnapshot(`
            Object {
              "data": Object {
                "__schema": Object {
                  "types": Array [
                    Object {
                      "fields": Array [
                        Object {
                          "name": "orderDetails",
                          "type": Object {
                            "name": "OrderDetail",
                          },
                        },
                      ],
                      "name": "query",
                    },
                    Object {
                      "fields": Array [
                        Object {
                          "name": "orderId",
                          "type": Object {
                            "name": "Float",
                          },
                        },
                        Object {
                          "name": "purchasedAt",
                          "type": Object {
                            "name": "Date",
                          },
                        },
                        Object {
                          "name": "purchasedBy",
                          "type": Object {
                            "name": null,
                          },
                        },
                      ],
                      "name": "OrderDetail",
                    },
                    Object {
                      "fields": null,
                      "name": "Float",
                    },
                    Object {
                      "fields": null,
                      "name": "Date",
                    },
                    Object {
                      "fields": Array [
                        Object {
                          "name": "customerId",
                          "type": Object {
                            "name": "Float",
                          },
                        },
                        Object {
                          "name": "name",
                          "type": Object {
                            "name": "String",
                          },
                        },
                      ],
                      "name": "OrderDetailPurchaser",
                    },
                    Object {
                      "fields": null,
                      "name": "String",
                    },
                    Object {
                      "fields": null,
                      "name": "Boolean",
                    },
                    Object {
                      "fields": Array [
                        Object {
                          "name": "description",
                          "type": Object {
                            "name": "String",
                          },
                        },
                        Object {
                          "name": "types",
                          "type": Object {
                            "name": null,
                          },
                        },
                        Object {
                          "name": "queryType",
                          "type": Object {
                            "name": null,
                          },
                        },
                        Object {
                          "name": "mutationType",
                          "type": Object {
                            "name": "__Type",
                          },
                        },
                        Object {
                          "name": "subscriptionType",
                          "type": Object {
                            "name": "__Type",
                          },
                        },
                        Object {
                          "name": "directives",
                          "type": Object {
                            "name": null,
                          },
                        },
                      ],
                      "name": "__Schema",
                    },
                    Object {
                      "fields": Array [
                        Object {
                          "name": "kind",
                          "type": Object {
                            "name": null,
                          },
                        },
                        Object {
                          "name": "name",
                          "type": Object {
                            "name": "String",
                          },
                        },
                        Object {
                          "name": "description",
                          "type": Object {
                            "name": "String",
                          },
                        },
                        Object {
                          "name": "fields",
                          "type": Object {
                            "name": null,
                          },
                        },
                        Object {
                          "name": "interfaces",
                          "type": Object {
                            "name": null,
                          },
                        },
                        Object {
                          "name": "possibleTypes",
                          "type": Object {
                            "name": null,
                          },
                        },
                        Object {
                          "name": "enumValues",
                          "type": Object {
                            "name": null,
                          },
                        },
                        Object {
                          "name": "inputFields",
                          "type": Object {
                            "name": null,
                          },
                        },
                        Object {
                          "name": "ofType",
                          "type": Object {
                            "name": "__Type",
                          },
                        },
                      ],
                      "name": "__Type",
                    },
                    Object {
                      "fields": null,
                      "name": "__TypeKind",
                    },
                    Object {
                      "fields": Array [
                        Object {
                          "name": "name",
                          "type": Object {
                            "name": null,
                          },
                        },
                        Object {
                          "name": "description",
                          "type": Object {
                            "name": "String",
                          },
                        },
                        Object {
                          "name": "args",
                          "type": Object {
                            "name": null,
                          },
                        },
                        Object {
                          "name": "type",
                          "type": Object {
                            "name": null,
                          },
                        },
                        Object {
                          "name": "isDeprecated",
                          "type": Object {
                            "name": null,
                          },
                        },
                        Object {
                          "name": "deprecationReason",
                          "type": Object {
                            "name": "String",
                          },
                        },
                      ],
                      "name": "__Field",
                    },
                    Object {
                      "fields": Array [
                        Object {
                          "name": "name",
                          "type": Object {
                            "name": null,
                          },
                        },
                        Object {
                          "name": "description",
                          "type": Object {
                            "name": "String",
                          },
                        },
                        Object {
                          "name": "type",
                          "type": Object {
                            "name": null,
                          },
                        },
                        Object {
                          "name": "defaultValue",
                          "type": Object {
                            "name": "String",
                          },
                        },
                      ],
                      "name": "__InputValue",
                    },
                    Object {
                      "fields": Array [
                        Object {
                          "name": "name",
                          "type": Object {
                            "name": null,
                          },
                        },
                        Object {
                          "name": "description",
                          "type": Object {
                            "name": "String",
                          },
                        },
                        Object {
                          "name": "isDeprecated",
                          "type": Object {
                            "name": null,
                          },
                        },
                        Object {
                          "name": "deprecationReason",
                          "type": Object {
                            "name": "String",
                          },
                        },
                      ],
                      "name": "__EnumValue",
                    },
                    Object {
                      "fields": Array [
                        Object {
                          "name": "name",
                          "type": Object {
                            "name": null,
                          },
                        },
                        Object {
                          "name": "description",
                          "type": Object {
                            "name": "String",
                          },
                        },
                        Object {
                          "name": "isRepeatable",
                          "type": Object {
                            "name": null,
                          },
                        },
                        Object {
                          "name": "locations",
                          "type": Object {
                            "name": null,
                          },
                        },
                        Object {
                          "name": "args",
                          "type": Object {
                            "name": null,
                          },
                        },
                      ],
                      "name": "__Directive",
                    },
                    Object {
                      "fields": null,
                      "name": "__DirectiveLocation",
                    },
                  ],
                },
              },
            }
        `);
        // @snippet:end
        const result = await graphql(
            schema,
            `
                query {
                    orderDetails(orderId: 1) {
                        orderId
                        purchasedAt
                        purchasedBy {
                            customerId
                            name
                        }
                    }
                }
            `,
        );
        expect(result).toMatchInlineSnapshot(`
            Object {
              "data": Object {
                "orderDetails": Object {
                  "orderId": 1,
                  "purchasedAt": "2020-01-01",
                  "purchasedBy": Array [
                    Object {
                      "customerId": 1,
                      "name": "John Doe",
                    },
                    Object {
                      "customerId": 2,
                      "name": "Jane Doe",
                    },
                  ],
                },
              },
            }
        `);
    });
});
