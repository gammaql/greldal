import Knex from "knex";
import { useDatabaseConnector, mapDataSource, mapSchema, types, operationPresets } from "..";
import { setupKnex } from "./helpers/setup-knex";
import { GraphQLID, printSchema, graphql, GraphQLSchema } from "graphql";
import { MappedDataSource } from "../MappedDataSource";

let knex: Knex;

beforeAll(() => {
    knex = setupKnex();
    useDatabaseConnector(knex);
});

describe("Conventionally mapped data source", () => {
    let mappedDataSource: MappedDataSource, generatedSchema: GraphQLSchema;
    beforeAll(async () => {
        await knex.schema.createTable("users", t => {
            t.increments("id");
            t.string("name");
        });
        mappedDataSource = mapDataSource({
            name: "User",
            fields: {
                id: {
                    type: types.number,
                    to: GraphQLID,
                },
                name: {
                    type: types.string,
                },
            },
        });
        generatedSchema = mapSchema(operationPresets.all(mappedDataSource));
        await knex("users").insert([{ id: 1, name: "Lorefnon" }, { id: 2, name: "Gandalf" }]);
    });
    afterAll(async () => {
        await knex.schema.dropTable("users");
    });
    test("generated schema", () => {
        expect(printSchema(generatedSchema)).toMatchSnapshot();
    });
    test("singular query operation without params", async () => {
        const r1 = await graphql(
            generatedSchema,
            `
                query {
                    findOneUser(where: {}) {
                        id
                        name
                    }
                }
            `,
        );
        expect(r1.errors).not.toBeDefined();
        expect(r1).toMatchSnapshot();
    });
    test("singular query operation with params", async () => {
        const r2 = await graphql(
            generatedSchema,
            `
                query {
                    findOneUser(where: { id: 2 }) {
                        id
                        name
                    }
                }
            `,
        );
        expect(r2.errors).not.toBeDefined();
        expect(r2).toMatchSnapshot();
    });
    test("singular query operation for non-existent row", async () => {
        const r3 = await graphql(
            generatedSchema,
            `
                query {
                    findOneUser(where: { id: 10 }) {
                        id
                        name
                    }
                }
            `,
        );
        expect(r3.errors).not.toBeDefined();
        expect(r3.data!.findOneUser).toBeNull();
    });
    test("batch query operation without args", async () => {
        const r4 = await graphql(
            generatedSchema,
            `
                query {
                    findManyUsers(where: {}) {
                        id
                        name
                    }
                }
            `,
        );
        expect(r4.errors).not.toBeDefined();
        expect(r4).toMatchSnapshot();
    });
    test("batch query operations with arguments", async () => {
        const r5 = await graphql(
            generatedSchema,
            `
                query {
                    findManyUsers(where: { id: 1 }) {
                        id
                        name
                    }
                }
            `,
        );
        expect(r5.errors).not.toBeDefined();
        expect(r5).toMatchSnapshot();
    });
});

describe("Data source mapped as per custom configuration", () => {
    let mappedDataSource: MappedDataSource, generatedSchema: GraphQLSchema;
    beforeAll(async () => {
        await knex.schema.createTable("customers", t => {
            t.increments("pk");
            t.string("first_name");
            t.string("last_name");
        });
        mappedDataSource = mapDataSource({
            name: {
                mapped: "User",
                stored: "customers",
            },
            fields: {
                id: {
                    sourceColumn: "pk",
                    type: types.string,
                    to: {
                        input: GraphQLID,
                        output: GraphQLID,
                    },
                },
                firstName: {
                    sourceColumn: "first_name",
                    type: types.string,
                },
                lastName: {
                    sourceColumn: "last_name",
                    type: types.string,
                },
            },
        });
        generatedSchema = mapSchema(operationPresets.all(mappedDataSource));
        await knex("customers").insert([
            { pk: 1, first_name: "John", last_name: "Doe" },
            { pk: 2, first_name: "Jane", last_name: "Doe" },
        ]);
    });
    afterAll(async () => {
        await knex.schema.dropTable("customers");
    });
    test("generated schema", () => {
        expect(printSchema(generatedSchema)).toMatchSnapshot();
    });
    test("singular query operation", async () => {
        const r1 = await graphql(generatedSchema, "query { findOneUser(where: {}) { id, firstName, lastName }}");
        expect(r1.errors).not.toBeDefined();
        expect(r1).toMatchSnapshot();
        const r2 = await graphql(generatedSchema, "query { findOneUser(where: {id: 2}) { id, firstName, lastName }}");
        expect(r2.errors).not.toBeDefined();
        expect(r2).toMatchSnapshot();
    });
    test("batch query operation", async () => {
        const r3 = await graphql(generatedSchema, "query { findManyUsers(where: {}) { id, firstName, lastName }}");
        expect(r3.errors).not.toBeDefined();
        expect(r3).toMatchSnapshot();
    });
});

describe.only("Data sources associated by joins", () => {
    let tags: MappedDataSource, products: MappedDataSource, departments: MappedDataSource;
    let generatedSchema: GraphQLSchema;
    beforeAll(async () => {
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
        await knex("tags").insert([{ name: "imported" }, { name: "third-party" }]);
        await knex("departments").insert([{ name: "textile" }, { name: "heavy goods" }]);
        await knex("products").insert([
            { name: "silk gown", department_id: 1 },
            { name: "steel welding machine", department_id: 2 },
        ]);
        await knex("product_tag_associators").insert([
            { product_id: 1, tag_id: 1 },
            { product_id: 2, tag_id: 2 },
            { product_id: 2, tag_id: 1 },
        ]);
        const fields = {
            id: {
                type: types.number,
                to: GraphQLID,
            },
            name: {
                type: types.string,
            },
        };
        tags = mapDataSource({
            name: "Tag",
            fields,
            associations: {
                products: {
                    target: () => products,
                    join: (queryBuilder, ahv) => {
                        const ptaVisitor = ahv.visit('product_tag_associators');
                        const productsVisitor = ptaVisitor.visit('products');
                        queryBuilder
                            .leftOuterJoin(
                                `product_tag_associators as ${ptaVisitor.alias}`,
                                `${ptaVisitor.alias}.tag_id`,
                                `${ahv.alias}.id`,
                            )
                            .leftOuterJoin(
                                `products as ${productsVisitor.alias}`,
                                `${productsVisitor.alias}.id`,
                                `${ptaVisitor.alias}.product_id`,
                            );
                        return productsVisitor;
                    },
                    singular: false,
                },
            },
        });
        products = mapDataSource({
            name: "Product",
            fields,
            associations: {
                department: {
                    target: () => departments,
                    singular: true,
                    join: "leftOuterJoin",
                    associatorColumns: {
                        inSource: "department_id",
                        inRelated: "id",
                    },
                },
            },
        });
        departments = mapDataSource({
            name: "Department",
            fields,
            associations: {
                products: {
                    target: () => products,
                    singular: false,
                    join: "leftOuterJoin",
                    associatorColumns: {
                        inSource: "id",
                        inRelated: "department_id",
                    },
                },
            },
        });
        generatedSchema = mapSchema([
            ...operationPresets.all(tags),
            ...operationPresets.all(departments),
            ...operationPresets.all(products),
        ]);
    });
    test("generated schema", () => {
        expect(printSchema(generatedSchema)).toMatchSnapshot();
    });
    test("query operations involving auto-inferred binary joins", async () => {
        const r1 = await graphql(
            generatedSchema,
            `
                query {
                    findOneProduct(where: {}) {
                        id
                        name
                        department(where: {}) {
                            id
                            name
                        }
                    }
                }
            `,
        );
        expect(r1).toMatchSnapshot();
        const r2 = await graphql(
            generatedSchema,
            `
                query {
                    findOneDepartment(where: { id: 1 }) {
                        id
                        name
                        products(where: {}) {
                            id
                            name
                        }
                    }
                }
            `,
        );
        expect(r2).toMatchSnapshot();
    });
    test("query operations involving user specified complex joins", async () => {
        const r1 = await graphql(
            generatedSchema,
            `
                query {
                    findManyTags(where: {}) {
                        id
                        name
                        products(where: {}) {
                            id
                            name
                        }
                    }
                }
            `,
        );
        expect(r1).toMatchSnapshot();
    });
    afterAll(async () => {
        await knex.schema.dropTable("departments");
        await knex.schema.dropTable("products");
        await knex.schema.dropTable("tags");
    });
});

describe("Data sources linked by pre-fetchable associations", async () => {

});

describe("Data sources linked by post-fetchable associations", async () => {

});
