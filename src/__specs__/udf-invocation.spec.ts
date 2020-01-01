import * as Knex from "knex";
import { setupKnex } from "./helpers/setup-knex";
import { useDatabaseConnector, types, operationPresets } from "..";
import { setupUserSchema, insertFewUsers, mapUsersDataSource, teardownUserSchema } from "./helpers/setup-user-schema";
import { GraphQLSchema, GraphQLFloat, graphql } from "graphql";
import { mapSchema } from "../MappedSchema";
import { MappedUDFInvocationOperation } from "../MappedUDFInvocationOperation";
import { mapArgs } from "../MappedArgs";
import { MappedDataSource } from "../MappedDataSource";

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
            await knex.raw(`
                create or replace function get_sum(a numeric, b numeric)
                returns numeric as $$
                begin
                    return a + b;
                end; $$ language plpgsql;`);
            schema = mapSchema([
                operationPresets.findOneOperation(users),

                new MappedUDFInvocationOperation({
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
                }),
            ]);
        });
        it("returns result of invocation of stored procedure", async () => {
            const graphQLResult = await graphql(
                schema,
                `
                    mutation {
                        getSum(a: 1, b: 2)
                    }
                `,
            );
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
