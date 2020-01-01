import * as Knex from "knex";
import { setupKnex } from "./helpers/setup-knex";
import { useDatabaseConnector, types, operationPresets } from "..";
import { setupUserSchema, insertFewUsers, mapUsersDataSource, teardownUserSchema } from "./helpers/setup-user-schema";
import { GraphQLSchema, GraphQLFloat, graphql } from "graphql";
import { mapSchema } from "../MappedSchema";
import { mapArgs } from "../MappedArgs";
import { MappedDataSource } from "../MappedDataSource";
import { mapUserDefinedFunction } from "../universal";

let knex: Knex;
describe("UDF Invocation mapping", () => {
    let schema: GraphQLSchema;
    let users: MappedDataSource;
    const db = process.env.DB;
    if (db === "pg") {
        beforeAll(async () => {
            knex = setupKnex();
            useDatabaseConnector(knex);
            await setupUserSchema(knex);
            await insertFewUsers(knex);
            users = mapUsersDataSource();
            // @snippet:start udf_example
            await knex.raw(`
                CREATE OR REPLACE FUNCTION get_sum(a numeric, b numeric)
                RETURNS NUMERIC AS $$
                BEGIN
                    RETURN a + b;
                END; $$ language plpgsql;
            `);
            // @snippet:end
            schema = mapSchema([
                operationPresets.findOneOperation(users),
                // @snippet:start udf_mapping
                mapUserDefinedFunction({
                    name: {
                        stored: "get_sum",
                        mapped: "getSum",
                    },
                    args: mapArgs({
                        a: { type: types.number },
                        b: { type: types.number },
                    }),
                    returnType: GraphQLFloat,
                    deriveParams: ({ a, b }) => [
                        {
                            name: "a",
                            value: a,
                            argMode: "IN",
                        },
                        {
                            name: "b",
                            value: b,
                            argMode: "IN",
                        },
                    ],
                })
                // @snippet:end
            ]);
        });
        it("returns result of invocation of stored procedure", async () => {
            // @snippet:start udf_mapping_usage
            const graphQLResult = await graphql(
                schema,
                `
                    mutation {
                        getSum(a: 1, b: 2)
                    }
                `,
            );
            // @snippet:end
            expect(graphQLResult.data!.getSum).toEqual(3);
        });
        afterAll(async () => {
            await teardownUserSchema(knex);
            await knex.raw("drop function get_sum(numeric, numeric)");
        });
    } else {
        test.todo("Stored procedures not yet supported for this database");
    }
});
