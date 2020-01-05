import * as Knex from "knex";
import * as types from "../../utils/types";
import { mapDataSource } from "../../MappedDataSource";
import { GraphQLID, GraphQLString, GraphQLInt } from "graphql";
import { times, isString } from "lodash";
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
    for (const idx of times(500)) {
        const id = idx + 1;
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
                type: types.intId,
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

export const mapUsersDataSourceWithJSONFields = () =>
    mapDataSource({
        name: "User",
        fields: mapFields({
            id: {
                type: types.intId,
                isPrimary: true,
            },
            name: {
                type: types.string,
            },
            age: {
                type: types.integer,
            },
            metadata: {
                type: types.object("Metadata", {
                    positionsHeld: types.array(
                        types.object("Position", {
                            title: types.string,
                            organization: types.string,
                            duration: types.integer,
                        }),
                    ),
                    awards: types.array(
                        types.object("Award", {
                            compensation: types.number,
                            title: types.string,
                        }),
                    ),
                }),
                fromSource: (i: any) => {
                    if (isString(i)) return JSON.parse(i);
                    return i;
                },
                toSource: (i: any) => JSON.stringify(i)
            },
        }),
    });

export const teardownUserSchema = async (knex: Knex) => {
    await knex.schema.dropTable("users");
};
