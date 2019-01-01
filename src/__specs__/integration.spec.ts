import Knex from "knex";
import _debug from "debug";
import * as t from "io-ts";
import { mapArgs, useDatabaseConnector, mapDataSource, mapSchema, types, operationPresets } from "..";
import { setupKnex } from "./helpers/setup-knex";
import { GraphQLID, printSchema, graphql, GraphQLSchema, GraphQLInt, GraphQLList } from "graphql";
import { MappedDataSource } from "../MappedDataSource";
import { setupDepartmentSchema, teardownDepartmentSchema } from "./helpers/setup-department-schema";
import { has, map } from "lodash";
import { MappedQueryOperation } from "../MappedQueryOperation";
import { QueryOperationResolver } from "../QueryOperationResolver";
import { OperationMapping, MappedOperation } from "../MappedOperation";

const debug = _debug("greldal.spec");

let knex: Knex;

beforeAll(() => {
    knex = setupKnex();
    useDatabaseConnector(knex);
});

afterAll(async () => {
    await knex.destroy();
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

describe("Custom column field mapping", () => {
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
    test("custom mapping of arguments", async () => {
        const argMapping = mapArgs({
            fullName: {
                description: "Full name of user",
                type: t.string,
                interceptQuery: (qb: Knex.QueryBuilder, value: string) => {
                    const names = value.split(" ");
                    return qb.where({
                        first_name: names[0],
                        last_name: names[1],
                    });
                },
            },
        });
        const schema = mapSchema([
            new MappedQueryOperation({
                name: "findUsersByFullName",
                rootSource: mappedDataSource,
                singular: true,
                args: argMapping,
            }),
        ]);
        const r3 = await graphql(
            schema,
            `
                query {
                    findUsersByFullName(fullName: "John Doe") {
                        id
                        firstName
                        lastName
                    }
                }
            `,
        );
        expect(r3.errors).not.toBeDefined();
        expect(r3).toMatchSnapshot();
    });
});

describe("Computed fields mapping", () => {
    let schema: GraphQLSchema;
    beforeAll(async () => {
        await knex.schema.createTable("users", t => {
            t.increments("id");
            t.string("first_name");
            t.string("last_name");
        });
        const users = mapDataSource({
            name: "User",
            fields: {
                id: { type: types.string, to: GraphQLID },
                first_name: { type: types.string },
                last_name: { type: types.string },
                full_name: {
                    type: types.string,
                    dependencies: ["first_name", "last_name"],
                    derive: ({first_name, last_name}: any) => {
                        console.log("[1]:", first_name, last_name);
                        return `${first_name} ${last_name}`;
                    },
                },
            },
        });
        schema = mapSchema(operationPresets.query.all(users));
        await knex("users").insert({
            id: 1,
            first_name: "John",
            last_name: "Doe",
        });
    });
    test("singular query operation", async () => {
        const r1 = await graphql(
            schema,
            `
                query {
                    findOneUser(where: {}) {
                        id
                        full_name
                    }
                }
            `,
        );
        expect(r1.errors).not.toBeDefined();
        expect(r1).toMatchSnapshot();
    });
});

describe("Data sources associated by joins", () => {
    let tags: MappedDataSource, products: MappedDataSource, departments: MappedDataSource;
    let generatedSchema: GraphQLSchema;
    beforeAll(async () => {
        await setupDepartmentSchema(knex);
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
                    singular: false,
                    fetchThrough: [
                        {
                            join: (queryBuilder, ahv) => {
                                const ptaVisitor = ahv.visit("product_tag_associators");
                                const productsVisitor = ptaVisitor.visit("products");
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
                        },
                    ],
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
                    fetchThrough: [
                        {
                            join: "leftOuterJoin",
                        },
                    ],
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
                    fetchThrough: [
                        {
                            join: "leftOuterJoin",
                        },
                    ],
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
        await teardownDepartmentSchema(knex);
    });
});

describe("Data sources linked by side-loadable associations", async () => {
    let generatedSchema: GraphQLSchema;

    beforeAll(async () => {
        await setupDepartmentSchema(knex);
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
        const departments = mapDataSource({
            name: "Department",
            fields,
            associations: {
                products: {
                    target: () => products,
                    singular: false,
                    associatorColumns: {
                        inSource: "id",
                        inRelated: "department_id",
                    },
                    fetchThrough: [
                        {
                            useIf(operation) {
                                return has(operation.args, ["where", "id"]);
                            },
                            preFetch(operation) {
                                const department_id: string = operation.args.where.id;
                                return {
                                    operation: findManyProducts,
                                    args: {
                                        where: {
                                            department_id,
                                        },
                                    },
                                };
                            },
                        },
                        {
                            postFetch(operation, parents) {
                                return {
                                    operation: findManyProductsByDepartmentIdList,
                                    args: {
                                        department_ids: map(parents, "id"),
                                    },
                                };
                            },
                        },
                    ],
                },
            },
        });
        const products = mapDataSource({
            name: "Product",
            fields: {
                ...fields,
                department_id: {
                    type: types.number,
                },
            },
        });
        const findOneProduct = operationPresets.query.findOneOperation(products);
        const findManyProducts = operationPresets.query.findManyOperation(products);
        const args = mapArgs({
            department_ids: {
                type: t.array(t.number),
                to: GraphQLList(GraphQLInt),
            },
        });
        const findManyProductsByDepartmentIdList = new MappedQueryOperation<typeof products, typeof args.ArgsType>({
            rootSource: products,
            name: `findManyProductsByDepartmentIdList`,
            args,
            resolver(operation, source, context, args, resolveInfoRoot, resolveInfoVisitor) {
                return new QueryOperationResolver(
                    operation,
                    source,
                    context,
                    args,
                    resolveInfoRoot,
                    resolveInfoVisitor,
                );
            },
            rootQuery(args, ahv) {
                return products.rootQuery(ahv).whereIn("department_id", args.department_ids);
            },
            singular: false,
            shallow: false,
            description: undefined,
        });
        generatedSchema = mapSchema([...operationPresets.all(departments), findOneProduct, findManyProducts]);
    });

    afterAll(async () => {
        await teardownDepartmentSchema(knex);
    });

    test("pre-fetch queries", async () => {
        const r1 = await graphql(
            generatedSchema,
            `
                query {
                    findOneDepartment(where: { id: 1 }) {
                        id
                        name
                        products(where: {}) {
                            id
                            name
                            department_id
                        }
                    }
                }
            `,
        );
        expect(r1).toMatchSnapshot();
    });

    test("post-fetch queries", async () => {
        const r1 = await graphql(
            generatedSchema,
            `
                query {
                    findOneDepartment(where: { name: "textile" }) {
                        id
                        name
                        products(where: {}) {
                            id
                            name
                            department_id
                        }
                    }
                }
            `,
        );
        expect(r1).toMatchSnapshot();
    });
});
