import * as Knex from "knex";
import { setupKnex } from "./helpers/setup-knex";
import { useDatabaseConnector, operationPresets } from "..";
import { setupUserSchema, insertFewUsers, mapUsersDataSource, teardownUserSchema } from "./helpers/setup-user-schema";
import { GraphQLSchema, graphql, GraphQLInt } from "graphql";
import { mapSchema } from "../MappedSchema";
import { mapArgs } from "../MappedArgs";
import { MappedDataSource } from "../MappedDataSource";
import { MappedStoredProcInvocationOperation } from "../MappedStoredProcInvocationOperation";
import { inspect } from "util";
`_`
let knex: Knex;
describe("Stored Procedure mapping", () => {
    let schema: GraphQLSchema;
    let users: MappedDataSource;
    const db = process.env.DB;
    if (db === "mysql2" || db === "pg") {
        beforeAll(async () => {
            knex = setupKnex();
            useDatabaseConnector(knex);
            await setupUserSchema(knex);
            await insertFewUsers(knex);
            users = mapUsersDataSource();
            if (db === "pg") {
                await knex.raw(`
                    CREATE OR REPLACE PROCEDURE get_avg_user_age(
                        INOUT avg_age INT
                    )
                    LANGUAGE plpgsql
                    AS $$
                        BEGIN
                            SELECT AVG(age)
                            INTO avg_age
                            FROM users;
                        END;
                    $$
                `);
            } else {
                await knex.raw(`
                    CREATE PROCEDURE get_avg_user_age(
                        INOUT avg_age INT
                    )
                    BEGIN
                        SELECT AVG(age)
                        INTO @avg_age
                        FROM users;

                        SET avg_age = @avg_age;
                    END
                `);
            }
            schema = mapSchema([
                operationPresets.findOneOperation(users),
                new MappedStoredProcInvocationOperation({
                    type: "query",
                    name: {
                        stored: "get_avg_user_age",
                        mapped: "getAvgAge",
                    },
                    args: mapArgs({}),
                    returnType: GraphQLInt,
                    deriveParams: () => [{
                        name: 'avg_age',
                        argMode: 'INOUT' as const,
                        value: undefined
                    }],
                }),
            ]);
        });
        afterAll(async () => {
            await knex.raw('DROP PROCEDURE get_avg_user_age')
        })
        it("returns result of invocation of stored procedure", async () => {
            const users = await knex('users');
            const avgAge = users.reduce((sum, u) => sum + u.age, 0) / users.length;
            const graphQLResult = await graphql(
                schema, `
                    query {
                        getAvgAge
                    }
                `,
            );
            console.log("[2] Result =>", inspect(graphQLResult, {depth: 20}));
            expect(graphQLResult.data!.getAvgAge).toEqual(avgAge);
        });
        afterAll(async () => {
            await teardownUserSchema(knex);
            await knex.raw("drop function get_sum(numeric, numeric)");
        });
    } else {
        test.todo("Stored procedures not yet supported for this database");
    }
});
