import * as Knex from "knex";
import { reportErrors } from "../test-helpers";

export const setupDepartmentSchema = async (knex: Knex) => {
    console.log("Setting up department schema: start");
    try {
        await knex.schema.createTable("tags", t => {
            t.increments("id");
            t.string("name");
        });
        await knex.schema.createTable("departments", t => {
            t.increments("id");
            t.string("name");
        });
        await knex.schema.createTable("products", t => {
            t.increments("id");
            t.integer("department_id")
                .unsigned()
                .references("id")
                .inTable("departments")
                .notNullable();
            t.string("name");
        });
        await knex.schema.createTable("product_tag_associators", t => {
            t.increments("id");
            t.integer("product_id")
                .unsigned()
                .references("id")
                .inTable("products")
                .notNullable();
            t.integer("tag_id")
                .unsigned()
                .references("id")
                .inTable("tags")
                .notNullable();
        });
    } catch (e) {
        console.error("Error when setting up departments schema");
        console.error(e);
        throw e;
    }
    console.log("Setting up department schema: end");
};

export const teardownDepartmentSchema = async (knex: Knex) => {
    await reportErrors(async () => {
        await knex.schema.dropTable("product_tag_associators");
        await knex.schema.dropTable("products");
        await knex.schema.dropTable("departments");
        await knex.schema.dropTable("tags");
    });
};
