import {
    GraphQLSchema,
    GraphQLString,
    GraphQLList,
    subscribe,
    parse,
    graphql,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLID,
} from "graphql";
import Knex from "knex";
import { PubSub } from "graphql-subscriptions";

import { MappedDataSource } from "../MappedDataSource";
import { setupUserSchema, insertFewUsers, mapUsersDataSource, teardownUserSchema } from "./helpers/setup-user-schema";
import { mapSchema, operationPresets, useDatabaseConnector } from "..";
import { setupKnex } from "./helpers/setup-knex";
import { getSubscriptionResults } from "./helpers/subscriptions";
import { MutationPublishPayload } from "../MappedSingleSourceMutationOperation";

let knex: Knex;

jest.setTimeout(30000);

describe("Delete operation", () => {
    let users: MappedDataSource, schema: GraphQLSchema;
    const pubsub = new PubSub();

    beforeAll(() => {
        knex = setupKnex();
        useDatabaseConnector(knex);
    });

    describe("Subscriptions", () => {
        beforeAll(async () => {
            await setupUserSchema(knex);
            await insertFewUsers(knex);
            users = mapUsersDataSource();
            schema = mapSchema([
                operationPresets.findOneOperation(users),
                operationPresets.deleteOneOperation(users, mapping => ({
                    ...mapping,
                    publish: (payload: MutationPublishPayload) => {
                        pubsub.publish("MUTATIONS", payload);
                    },
                })),
                {
                    operationType: "subscription" as const,
                    name: "userDeleted",
                    fieldConfig: {
                        type: GraphQLList(
                            new GraphQLObjectType({
                                name: "UserDeletionNotification",
                                fields: {
                                    id: {
                                        type: GraphQLID,
                                    },
                                },
                            }),
                        ),
                        resolve: payload => {
                            return payload.primary;
                        },
                        subscribe: () => pubsub.asyncIterator("MUTATIONS"),
                    },
                },
            ]);
        });
        afterAll(async () => {
            await teardownUserSchema(knex);
        });
        test("Deletions are published as a mutation via configured publisher", async () => {
            const subscriptionQuery = `
                subscription {
                    userDeleted {
                        id
                    }
                }
            `;
            const subP = subscribe(schema, parse(subscriptionQuery)).then(getSubscriptionResults());
            const graphQLResult = await graphql(
                schema,
                `
                    mutation {
                        deleteOneUser(where: { id: 1 }) {
                            id
                            name
                        }
                    }
                `,
            );
            const subscriptionResult = await subP;
            expect(graphQLResult.data!.deleteOneUser.id).toEqual(subscriptionResult[0].data!.userDeleted[0].id);
            expect(graphQLResult).toMatchSnapshot();
            expect(subscriptionResult).toMatchSnapshot();
        });
    });
});
