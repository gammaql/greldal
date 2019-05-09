import { GraphQLSchema, GraphQLString, GraphQLList, subscribe, parse, graphql, GraphQLObjectType, GraphQLInt, GraphQLID } from "graphql";
import Knex from "knex";

// @snippet:start mapSchema_insert_subscription:0
import { PubSub } from 'graphql-subscriptions'
// @snippet:end

import { MappedDataSource } from "../MappedDataSource";
import { setupUserSchema, insertFewUsers, mapUsersDataSource, teardownUserSchema } from "./helpers/setup-user-schema";
import { mapSchema, operationPresets, useDatabaseConnector } from "..";
import { setupKnex } from "./helpers/setup-knex";
import { getSubscriptionResults } from './helpers/subscriptions';
import { MutationPublishPayload } from '../MappedSingleSourceMutationOperation';

let knex: Knex;

jest.setTimeout(30000);

describe("Insert operation", () => {
    let users: MappedDataSource, schema: GraphQLSchema;
    // @snippet:start mapSchema_insert_subscription:1
    const pubsub = new PubSub()
    // @snippet:end

    beforeAll(() => {
        knex = setupKnex();
        useDatabaseConnector(knex);
    });

    describe("Subscriptions", () => {
        beforeAll(async () => {
            await setupUserSchema(knex);
            await insertFewUsers(knex);
            users = mapUsersDataSource();
            // @snippet:start mapSchema_insert_subscription:2
            /// let
            schema = mapSchema([
                operationPresets.findOneOperation(users),

                // When mapping an operation we can specify a publish function
                // which will publish insertion to a specified channel
                operationPresets.insertOneOperation(users, (mapping) => ({
                    ...mapping,
                    publish: (payload: MutationPublishPayload) => pubsub.publish("MUTATIONS", payload)
                })),

                // We define a subscription operation
                // which can listen to this channel
                {
                    operationType: "subscription" as const,
                    name: "userInserted",
                    fieldConfig: {
                        type: GraphQLList(new GraphQLObjectType({
                            name: "UserInsertionNotification",
                            fields: {
                                id: {
                                    type: GraphQLID
                                }
                            }
                        })),
                        resolve: (payload) => {
                            return payload.primary;
                        },
                        subscribe: () => pubsub.asyncIterator("MUTATIONS")
                    }
                }
            ]);
            // @snippet:end
        });
        afterAll(async () => {
            await teardownUserSchema(knex);
        });
        test("Insertions are published as a mutation via configured publisher", async () => {
            const subscriptionQuery = `
                subscription {
                    userInserted {
                        id
                    }
                }
            `;
            const subP = subscribe(schema, parse(subscriptionQuery)).then(getSubscriptionResults());
            const graphQLResult = await graphql(schema, `
                mutation {
                    insertOneUser(entity: {
                        id: 999,
                        name: "Sherlock Holmes"
                    }) {
                        id,
                        name
                    }
                }
            `);
            const subscriptionResult = await subP;
            expect(graphQLResult.data!.insertOneUser.id).toEqual(subscriptionResult[0].data!.userInserted[0].id);
            expect(graphQLResult).toMatchSnapshot();
            expect(subscriptionResult).toMatchSnapshot();
        });
    });
});
