import * as Knex from "knex";
import * as types from "../../types";
import { mapDataSource } from "../../MappedDataSource";
import { GraphQLID, GraphQLString, GraphQLInt } from "graphql";
import { times } from "lodash";
import { mapFields } from "../..";

export const setupUserSchema = async (knex: Knex) => {
    await knex.schema.createTable("users", t => {
        t.increments("id");
        t.string("name");
        t.integer("age");
        t.jsonb("metadata");
    });
};

export const insertFewUsers = async (knex: Knex) => {
    await knex("users").insert([
        {
            id: 1,
            name: "Lorefnon",
            age: 50,
            metadata: JSON.stringify({
                positionsHeld: [
                    {
                        title: "Software Architect",
                        organization: "Foo Bar Inc",
                        duration: 5,
                    },
                    {
                        title: "Software Developer",
                        organization: "Lorem Ipsum Gmbh",
                        duration: 10,
                    },
                ],
                awards: [
                    {
                        title: "Top Achiever",
                        compensation: 1000,
                    },
                ],
            }),
        },
        { id: 2, name: "Gandalf", age: 1000 },
    ]);
};

export const insertManyUsers = async (knex: Knex) => {
    let users = [];
    for (const id of times(500)) {
        users.push({
            id,
            name: `User ${id}`,
            age: 50,
            metadata: JSON.stringify({
                positionsHeld: times(5).map(idx => ({
                    title: `Pos ${id}:${idx}`,
                    organization: `Org ${id}:${idx}`,
                    duration: 3,
                })),
                awards:
                    id > 100
                        ? []
                        : times(3).map(idx => ({
                              title: `Award: ${idx}`,
                              compensation: 100,
                          })),
            }),
        });
        if (users.length >= 20) {
            await knex("users").insert(users);
            users = [];
        }
    }
};

export const mapUsersDataSource = () => {
    // @snippet:start mapDataSource_user_simple
    /// import {mapDataSource, mapFields, types} from "greldal";

    const users = mapDataSource({
        name: "User",
        fields: mapFields({
            id: {
                type: types.number,
                to: GraphQLID,
                isPrimary: true,
            },
            name: {
                type: types.string,
            },
            age: {
                type: types.integer,
            },
        }),
    });
    // @snippet:end
    return users;
};

export const mapUsersDataSourceExplicitly = () => {
    // @snippet:start mapDataSource_user_simple_explicit
    /// import {mapDataSource, mapFields, types} from "greldal";

    const users = mapDataSource({
        name: {
            mapped: "User",
            stored: "users",
        },
        fields: mapFields({
            id: {
                sourceColumn: "id",
                type: types.string,
                to: {
                    input: GraphQLID,
                    output: GraphQLID,
                },
            },
            name: {
                sourceColumn: "name",
                type: types.string,
                to: {
                    input: GraphQLString,
                    output: GraphQLString,
                },
            },
            age: {
                sourceColumn: "age",
                type: types.integer,
                to: {
                    input: GraphQLInt,
                    output: GraphQLInt
                }
            }
        }),
    });
    // @snippet:end
    return users;
};

export const mapUsersDataSourceWithJSONFields = () =>
    mapDataSource({
        name: "User",
        fields: mapFields({
            id: {
                type: types.number,
                to: GraphQLID,
                isPrimary: true,
            },
            name: {
                type: types.string,
            },
            age: {
                type: types.integer,
            },
            metadata: {
                type: types.maybe(
                    types.json(
                        types.partial({
                            positionsHeld: types.array(
                                types.interface({
                                    title: types.string,
                                    organization: types.string,
                                    duration: types.integer,
                                }),
                            ),
                            awards: types.array(
                                types.interface({
                                    compensation: types.number,
                                    title: types.string,
                                }),
                            ),
                        }),
                    ),
                ),
            },
        }),
    });

export const teardownUserSchema = async (knex: Knex) => {
    await knex.schema.dropTable("users");
};
