import Knex from "knex";
import _debug from "debug";
import * as t from "io-ts";
import {
    mapArgs,
    useDatabaseConnector,
    mapDataSource,
    mapSchema,
    types,
    operationPresets,
    SingleSourceQueryOperationResolver,
    MappedSingleSourceQueryOperation,
} from "..";
import { setupKnex } from "./helpers/setup-knex";
import { GraphQLID, printSchema, graphql, GraphQLSchema, GraphQLInt, GraphQLList } from "graphql";
import { MappedDataSource } from "../MappedDataSource";
import { setupDepartmentSchema, teardownDepartmentSchema } from "./helpers/setup-department-schema";
import { has, map, values, first } from "lodash";
import { MappedMultiSourceUnionQueryOperation } from "../MappedMultiSourceUnionQueryOperation";

let knex: Knex;

const getCount = async (qb: Knex.QueryBuilder) => first(values(first(await qb.count()))) as number;

beforeAll(() => {
    knex = setupKnex();
    useDatabaseConnector(knex);
});

afterAll(async () => {
    await knex.destroy();
});

describe("Conventionally mapped data source", () => {
    let users: MappedDataSource, schema: GraphQLSchema;
    beforeAll(async () => {
        await knex.schema.createTable("users", t => {
            t.increments("id");
            t.string("name");
        });
        users = mapDataSource({
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
        schema = mapSchema(operationPresets.all(users));
        await knex("users").insert([{ id: 1, name: "Lorefnon" }, { id: 2, name: "Gandalf" }]);
    });
    afterAll(async () => {
        await knex.schema.dropTable("users");
    });
    test("generated schema", () => {
        expect(printSchema(schema)).toMatchSnapshot();
    });
    test("singular query operation without params", async () => {
        const r1 = await graphql(
            schema,
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
            schema,
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
            schema,
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
            schema,
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
            schema,
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
    let users: MappedDataSource, schema: GraphQLSchema;
    beforeAll(async () => {
        await knex.schema.createTable("customers", t => {
            t.increments("pk");
            t.string("first_name");
            t.string("last_name");
        });
        users = mapDataSource({
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
        schema = mapSchema(operationPresets.all(users));
        await knex("customers").insert([
            { pk: 1, first_name: "John", last_name: "Doe" },
            { pk: 2, first_name: "Jane", last_name: "Doe" },
        ]);
    });
    afterAll(async () => {
        await knex.schema.dropTable("customers");
    });
    test("generated schema", () => {
        expect(printSchema(schema)).toMatchSnapshot();
    });
    test("singular query operation", async () => {
        const r1 = await graphql(schema, "query { findOneUser(where: {}) { id, firstName, lastName }}");
        expect(r1.errors).not.toBeDefined();
        expect(r1).toMatchSnapshot();
        const r2 = await graphql(schema, "query { findOneUser(where: {id: 2}) { id, firstName, lastName }}");
        expect(r2.errors).not.toBeDefined();
        expect(r2).toMatchSnapshot();
    });
    test("batch query operation", async () => {
        const r3 = await graphql(schema, "query { findManyUsers(where: {}) { id, firstName, lastName }}");
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
            new MappedSingleSourceQueryOperation({
                name: "findUsersByFullName",
                rootSource: users,
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
            t.integer("parent_id")
                .references("id")
                .inTable("users");
        });
        const users: any = mapDataSource({
            name: "User",
            fields: {
                id: { type: types.string, to: GraphQLID },
                first_name: { type: types.string },
                last_name: { type: types.string },
                full_name: {
                    type: types.string,
                    dependencies: ["first_name", "last_name"],
                    derive: ({ first_name, last_name }: any) => {
                        return `${first_name} ${last_name}`;
                    },
                },
            },
            associations: {
                parent: {
                    target: () => users,
                    singular: true,
                    fetchThrough: [
                        {
                            join: "leftOuterJoin",
                        },
                    ],
                    associatorColumns: {
                        inSource: "parent_id",
                        inRelated: "id",
                    },
                },
                children: {
                    target: () => users,
                    singular: false,
                    fetchThrough: [
                        {
                            join: "leftOuterJoin",
                        },
                    ],
                    associatorColumns: {
                        inSource: "id",
                        inRelated: "parent_id",
                    },
                },
            },
        });
        schema = mapSchema(operationPresets.query.all(users));
        await knex("users").insert([
            {
                id: 1,
                first_name: "John",
                last_name: "Doe",
            },
            {
                id: 2,
                parent_id: 1,
                first_name: "Jane",
                last_name: "Doe",
            },
            {
                id: 3,
                parent_id: 2,
                first_name: "John",
                last_name: "Delta",
            },
        ]);
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
    test("nested singular query operation", async () => {
        const r1 = await graphql(
            schema,
            `
                query {
                    findOneUser(where: { id: 2 }) {
                        id
                        first_name
                        full_name
                        parent {
                            id
                            first_name
                            last_name
                        }
                    }
                }
            `,
        );
        expect(r1.errors).not.toBeDefined();
        expect(r1).toMatchSnapshot();
        const r2 = await graphql(
            schema,
            `
                query {
                    findOneUser(where: { id: 2 }) {
                        id
                        first_name
                        full_name
                        parent(where: { id: 1 }) {
                            full_name
                            children {
                                id
                                full_name
                                children {
                                    id
                                    full_name
                                }
                            }
                        }
                    }
                }
            `,
        );
        expect(r2.errors).not.toBeDefined();
        expect(r2).toMatchSnapshot();
    });
    afterAll(async () => {
        await knex.schema.dropTable("users");
    });
    test("batch query operation", async () => {
        const r1 = await graphql(
            schema,
            `
                query {
                    findManyUsers(where: {}) {
                        id
                        first_name
                        full_name
                        parent {
                            id
                            first_name
                            last_name
                        }
                        children {
                            id
                            full_name
                        }
                    }
                }
            `,
        );
        expect(r1.errors).not.toBeDefined();
        expect(r1).toMatchSnapshot();
    });
});

describe("Multi-source operations", () => {
    describe("Union query", () => {
        let generatedSchema: GraphQLSchema;
        let students: MappedDataSource, staff: MappedDataSource;
        beforeAll(async () => {
            await knex.schema.createTable("students", t => {
                t.increments("id");
                t.string("name");
                t.integer("completion_year");
            });
            await knex.schema.createTable("staff", t => {
                t.increments("id");
                t.string("name");
                t.string("designation");
            });
            await knex("students").insert([
                {
                    name: "ram",
                    completion_year: 2009,
                },
                {
                    name: "abhi",
                    completion_year: 2010,
                },
            ]);
            await knex("staff").insert([
                {
                    name: "rahman",
                    designation: "Principal",
                },
                {
                    name: "akbar",
                    designation: "Teacher",
                },
            ]);
            students = mapDataSource({
                name: "Student",
                fields: {
                    id: {
                        type: types.number,
                        to: GraphQLID,
                    },
                    name: {
                        type: types.string,
                    },
                    completion_year: {
                        type: types.number,
                    },
                },
            });
            staff = mapDataSource({
                name: { stored: "staff", mapped: "Staff" },
                fields: {
                    id: {
                        type: types.number,
                        to: GraphQLID,
                    },
                    name: {
                        type: types.string,
                    },
                    designation: {
                        type: types.string,
                    },
                },
            });
            generatedSchema = mapSchema([
                new MappedMultiSourceUnionQueryOperation({
                    dataSources: () => ({
                        students: {
                            selection: () => students,
                        },
                        staff: {
                            selection: () => staff,
                        },
                    }),
                    unionMode: "union",
                    name: `findManyUsers`,
                    singular: false,
                    shallow: false,
                    description: undefined,
                }),
            ]);
        });

        afterAll(async () => {
            await knex.schema.dropTable("students");
            await knex.schema.dropTable("staff");
        });

        test("generated schema", () => {
            expect(printSchema(generatedSchema)).toMatchSnapshot();
        });

        test("batch query operation", async () => {
            const r1 = await graphql(
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
            expect(r1.errors).not.toBeDefined();
            expect(r1).toMatchSnapshot();
        });
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
                                const args: any = operation.args;
                                const department_id: string = args.where.id;
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
                            postFetch(_operation, parents) {
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
        const findManyProductsByDepartmentIdList = new MappedSingleSourceQueryOperation({
            rootSource: products,
            name: `findManyProductsByDepartmentIdList`,
            args,
            resolver(ctx) {
                return new SingleSourceQueryOperationResolver(ctx);
            },
            rootQuery(dataSource, args, ahv) {
                return products.rootQueryBuilder(ahv).whereIn("department_id", args.department_ids);
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

describe("Mutation Presets", () => {
    let users: MappedDataSource, schema: GraphQLSchema;
    beforeAll(async () => {
        await knex.schema.createTable("users", t => {
            t.increments("id");
            t.string("name");
            t.text("addr");
        });
        users = mapDataSource({
            name: "User",
            fields: {
                id: {
                    type: types.number,
                    to: GraphQLID,
                    isPrimary: true,
                },
                name: {
                    type: types.string,
                },
                address: {
                    type: types.string,
                    sourceColumn: "addr",
                },
            },
        });
        schema = mapSchema([...operationPresets.query.all(users), ...operationPresets.mutation.all(users)]);
    });
    afterAll(async () => {
        await knex.schema.dropTable("users");
    });
    describe("Insertion", () => {
        describe("Singular", () => {
            it("Inserts mapped entity", async () => {
                const r1 = await graphql(
                    schema,
                    `
                        mutation {
                            insertOneUser(entity: { id: 1, name: "Sherlock Holmes", address: "221 B Baker Street" }) {
                                id
                                name
                            }
                        }
                    `,
                );
                expect(r1.errors).not.toBeDefined();
                expect(r1).toMatchSnapshot();
                const numRows = await knex("users").count();
                expect(numRows).toMatchSnapshot();
            });
            it("surfaces database failues", async () => {
                const r1 = await graphql(
                    schema,
                    `
                        mutation {
                            insertOneUser(entity: { id: 1, name: "Sherlock Holmes", address: "221 B Baker Street" }) {
                                id
                                name
                            }
                        }
                    `,
                );
                expect(r1.errors).toBeDefined();
                expect(r1).toMatchSnapshot();
            });
        });
        describe("Batch", () => {
            it("Inserts mapped entities", async () => {
                const r1 = await graphql(
                    schema,
                    `
                        mutation {
                            insertManyUsers(
                                entities: [
                                    { id: 2, name: "John Doe", address: "A B C" }
                                    { id: 3, name: "Jane Doe", address: "A B C" }
                                ]
                            ) {
                                id
                                name
                            }
                        }
                    `,
                );
                expect(r1.errors).not.toBeDefined();
                expect(r1).toMatchSnapshot();
                const numRows = await knex("users")
                    .whereIn("id", [2, 3])
                    .count();
                expect(numRows).toMatchSnapshot();
            });
            it("surfaces database failues", async () => {
                const r1 = await graphql(
                    schema,
                    `
                        mutation {
                            insertManyUsers(
                                entities: [
                                    { id: 4, name: "John Doe", address: "A B C" }
                                    { id: 4, name: "Jane Doe", address: "A B C" }
                                ]
                            ) {
                                id
                                name
                            }
                        }
                    `,
                );
                expect(r1.errors).toBeDefined();
                expect(r1).toMatchSnapshot();
            });
        });
    });
    describe("Update", () => {
        beforeEach(async () => {
            await knex("users").insert([
                {
                    id: 5,
                    name: "Ali",
                    addr: "A B C",
                },
                {
                    id: 6,
                    name: "Ram",
                    addr: "A B C",
                },
            ]);
        });
        afterEach(async () => {
            await knex("users").del();
        });
        describe("Singular", () => {
            it("Updates mapped entity", async () => {
                const r1 = await graphql(
                    schema,
                    `
                        mutation {
                            updateOneUser(where: { id: 5 }, update: { name: "Rahman" }) {
                                id
                                name
                            }
                        }
                    `,
                );
                expect(r1.errors).not.toBeDefined();
                expect(r1).toMatchSnapshot();
                const row = await knex("users").where({ id: 5 });
                expect(row).toMatchSnapshot();
            });
            it("surfaces database failues", async () => {
                const r1 = await graphql(
                    schema,
                    `
                        mutation {
                            updateOneUser(where: { id: 5 }, update: { id: 6 }) {
                                id
                                name
                            }
                        }
                    `,
                );
                expect(r1.errors).toBeDefined();
                expect(r1).toMatchSnapshot();
            });
        });
        describe("Batch", () => {
            it("Updates mapped entities", async () => {
                const r1 = await graphql(
                    schema,
                    `
                        mutation {
                            updateManyUsers(where: { address: "A B C" }, update: { address: "D E F" }) {
                                id
                                name
                                address
                            }
                        }
                    `,
                );
                expect(r1.errors).not.toBeDefined();
                expect(r1).toMatchSnapshot();
                const n1 = await knex("users")
                    .where({ addr: "A B C" })
                    .count();
                expect(n1).toMatchSnapshot();
                const n2 = await knex("users")
                    .where({ addr: "D E F" })
                    .count();
                expect(n2).toMatchSnapshot();
            });
            it("surfaces database failues", async () => {
                const r1 = await graphql(
                    schema,
                    `
                        mutation {
                            updateManyUsers(where: { id: 5 }, update: { id: 6 }) {
                                id
                                name
                            }
                        }
                    `,
                );
                expect(r1.errors).toBeDefined();
                expect(r1).toMatchSnapshot();
            });
        });
    });
    describe("Deletion", () => {
        beforeEach(async () => {
            await knex("users").insert([
                {
                    name: "Ramesh",
                    addr: "H J K",
                },
                {
                    name: "Akbar",
                    addr: "H J K",
                },
                {
                    name: "Grisham",
                    addr: "P Q R",
                },
                {
                    name: "Gautam",
                    addr: "P Q R",
                },
            ]);
        });
        describe("Singular", () => {
            it("Deletes mapped entity", async () => {
                const prevCount = await getCount(knex("users"));
                const matchCount = await getCount(knex("users").where({ addr: "P Q R" }));
                expect(matchCount).toBeGreaterThan(0);
                const r1 = await graphql(
                    schema,
                    `
                        mutation {
                            deleteOneUser(where: { address: "P Q R" }) {
                                id
                                name
                                address
                            }
                        }
                    `,
                );
                expect(r1.errors).not.toBeDefined();
                expect(r1).toMatchSnapshot();
                const count = await getCount(knex("users"));
                expect(count).toBe(prevCount - 1);
            });
            it("surfaces database failues", async () => {
                // TODO
            });
        });
        describe("Batch", () => {
            it("Deletes mapped entities", async () => {
                const prevCount = await getCount(knex("users"));
                const matchCount = await getCount(
                    knex("users")
                        .where({ addr: "H J K" })
                        .count(),
                );
                const r1 = await graphql(
                    schema,
                    `
                        mutation {
                            deleteManyUsers(where: { address: "H J K" }) {
                                id
                                name
                                address
                            }
                        }
                    `,
                );
                expect(r1.errors).not.toBeDefined();
                expect(r1).toMatchSnapshot();
                const count = await getCount(knex("users"));
                expect(count).toBe(prevCount - matchCount);
            });
            it("surfaces database failues", async () => {
                // TODO
            });
        });
    });
});
