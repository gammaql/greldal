import * as Knex from "knex";
import { GraphQLSchema, printSchema, graphql } from "graphql";
import {
    setupUserSchema,
    teardownUserSchema,
    insertManyUsers,
    mapUsersDataSourceWithJSONFields,
} from "../helpers/setup-user-schema";

import { MappedDataSource } from "../../MappedDataSource";
import { mapSchema, operationPresets, useDatabaseConnector } from "../..";
import { setupKnex } from "../helpers/setup-knex";
import { last, first } from "lodash";

let users: MappedDataSource, schema: GraphQLSchema, knex: Knex;

describe("find operation presets", () => {
    beforeAll(async () => {
        knex = useDatabaseConnector(setupKnex());
        await setupUserSchema(knex);
        await insertManyUsers(knex);
        users = mapUsersDataSourceWithJSONFields();
        schema = mapSchema([operationPresets.paginatedFindManyOperation(users)]);
    }, 60000);

    afterAll(async () => {
        await teardownUserSchema(knex);
        await knex.destroy();
    });

    test("generated schema", () => {
        expect(printSchema(schema)).toMatchSnapshot();
    });

    test("paginated response with default page size", async () => {
        const r1 = await graphql(
            schema,
            `
                query {
                    findManyUsers(where: {}) {
                        page {
                            entities {
                                id
                                name
                                metadata {
                                    positionsHeld {
                                        title
                                        organization
                                        duration
                                    }
                                    awards {
                                        title
                                        compensation
                                    }
                                }
                            }
                        }
                    }
                }
            `,
        );
        expect(r1.errors).not.toBeDefined();
        const entities = r1.data!.findManyUsers.page.entities;
        expect(entities.length).toBe(10);
        expect(first<any>(entities)!.id).toEqual("1");
        expect(last<any>(entities)!.id).toEqual("10");
        expect(r1.data).toMatchSnapshot();
    });

    test("paginated response with specified page size", async () => {
        const r1 = await graphql(
            schema,
            `
                query {
                    findManyUsers(where: {}) {
                        page(pageSize: 100) {
                            pageInfo {
                                prevCursor
                                nextCursor
                                totalCount
                            }
                            entities {
                                id
                                name
                                metadata {
                                    positionsHeld {
                                        title
                                        organization
                                        duration
                                    }
                                    awards {
                                        title
                                        compensation
                                    }
                                }
                            }
                        }
                    }
                }
            `,
        );
        expect(r1.errors).not.toBeDefined();
        const entities = r1.data!.findManyUsers.page.entities;
        expect(entities.length).toBe(100);
        expect(first<any>(entities)!.id).toEqual("1");
        expect(last<any>(entities)!.id).toEqual("100");
        expect(r1.data).toMatchSnapshot();
        const r2 = await graphql(
            schema,
            `
                query {
                    findManyUsers(where: {}) {
                        page(pageSize: 100, cursor: "101") {
                            pageInfo {
                                prevCursor
                                nextCursor
                                totalCount
                            }
                            entities {
                                id
                                name
                                metadata {
                                    positionsHeld {
                                        title
                                        organization
                                        duration
                                    }
                                    awards {
                                        title
                                        compensation
                                    }
                                }
                            }
                        }
                    }
                }
            `,
        );
        expect(r2.errors).not.toBeDefined();
        const nextEntities = r2.data!.findManyUsers.page.entities;
        expect(nextEntities.length).toBe(100);
        expect(first<any>(nextEntities)!.id).toEqual("101");
        expect(last<any>(nextEntities)!.id).toEqual("200");
        expect(r2.data).toMatchSnapshot();
    });
});
