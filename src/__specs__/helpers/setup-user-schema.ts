import * as Knex from "knex";
import * as types from "../../types";
import { mapDataSource } from "../../MappedDataSource";
import { GraphQLID } from "graphql";

export const setupUserSchema = async (knex: Knex) => {
    await knex.schema.createTable("users", t => {
        t.increments("id");
        t.string("name");
        t.jsonb("metadata");
    });
    await knex("users").insert([
        {
            id: 1,
            name: "Lorefnon",
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
        { id: 2, name: "Gandalf" },
    ]);
};

export const mapUsersDataSource = () =>
    mapDataSource({
        name: "User",
        fields: {
            id: {
                type: types.number,
                to: GraphQLID,
                isPrimary: true
            },
            name: {
                type: types.string,
            },
            metadata: {
                type: types.json(
                    types.interface({
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
            },
        },
    });

export const teardownUserSchema = async (knex: Knex) => {
    await knex.schema.dropTable("users");
}