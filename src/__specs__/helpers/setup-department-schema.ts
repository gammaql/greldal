import * as Knex from "knex";

export const setupDepartmentSchema = async (knex: Knex) => {
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
            .references("id")
            .inTable("departments")
            .notNullable();
        t.string("name");
    });
    await knex.schema.createTable("product_tag_associators", t => {
        t.increments("id");
        t.integer("product_id")
            .references("id")
            .inTable("products")
            .notNullable();
        t.integer("tag_id")
            .references("id")
            .inTable("tags")
            .notNullable();
    });
};

export const teardownDepartmentSchema = async (knex: Knex) => {
    await knex.schema.dropTable("departments");
    await knex.schema.dropTable("products");
    await knex.schema.dropTable("tags");
    await knex.schema.dropTable("product_tag_associators");
};
