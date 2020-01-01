import { GraphQLSchema, GraphQLList, subscribe, parse, graphql, GraphQLObjectType, GraphQLID } from "graphql";
import util from "util";
import Knex from "knex";
import { PubSub } from "graphql-subscriptions";

import { MappedDataSource } from "../../MappedDataSource";
import { setupUserSchema, insertFewUsers, mapUsersDataSource, teardownUserSchema } from "../helpers/setup-user-schema";
import { mapSchema, operationPresets, useDatabaseConnector, OperationTypes } from "../..";
import { setupKnex } from "../helpers/setup-knex";
import { getSubscriptionResults } from "../helpers/subscriptions";
import { MutationNotification } from "../../NotificationDispatcher";
import { NotificationDispatcher } from "../../universal";

let knex: Knex;

jest.setTimeout(30000);

describe("Update operation", () => {
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
            NotificationDispatcher.configure({
                publish: (payload: MutationNotification) => {
                    pubsub.publish("MUTATIONS", payload);
                },
            });
            schema = mapSchema([
                operationPresets.findOneOperation(users),
                operationPresets.updateOneOperation(users),
                {
                    operationType: OperationTypes.Subscription,
                    name: "userUpdated",
                    fieldConfig: {
                        type: GraphQLList(
                            new GraphQLObjectType({
                                name: "UserUpdateNotification",
                                fields: {
                                    id: {
                                        type: GraphQLID,
                                    },
                                },
                            }),
                        ),
                        resolve: payload => payload.entities.User,
                        subscribe: () => pubsub.asyncIterator("MUTATIONS"),
                    },
                },
            ]);
        });
        afterAll(async () => {
            await teardownUserSchema(knex);
            NotificationDispatcher.resetConfig();
        });
        test("Updates are published as a mutation via configured publisher", async () => {
            const subscriptionQuery = `
                subscription {
                    userUpdated {
                        id
                    }
                }
            `;
            const subP = subscribe(schema, parse(subscriptionQuery)).then(getSubscriptionResults());
            const graphQLResult = await graphql(
                schema,
                `
                    mutation {
                        updateOneUser(where: { id: 1 }, update: { name: "Sherlock Holmes" }) {
                            id
                            name
                        }
                    }
                `,
            );
            const subscriptionResult = await subP;
            expect(graphQLResult.data!.updateOneUser.id).toEqual(subscriptionResult[0].data!.userUpdated[0].id);
            expect(graphQLResult).toMatchSnapshot();
            expect(subscriptionResult).toMatchSnapshot();
        });
    });
});
