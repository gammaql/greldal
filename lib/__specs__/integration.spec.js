"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const setup_knex_1 = require("./helpers/setup-knex");
const graphql_1 = require("graphql");
const setup_department_schema_1 = require("./helpers/setup-department-schema");
const lodash_1 = require("lodash");
const MappedQueryOperation_1 = require("../MappedQueryOperation");
const QueryOperationResolver_1 = require("../QueryOperationResolver");
let knex;
beforeAll(() => {
    knex = setup_knex_1.setupKnex();
    __1.useDatabaseConnector(knex);
});
describe("Conventionally mapped data source", () => {
    let mappedDataSource, generatedSchema;
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        yield knex.schema.createTable("users", t => {
            t.increments("id");
            t.string("name");
        });
        mappedDataSource = __1.mapDataSource({
            name: "User",
            fields: {
                id: {
                    type: __1.types.number,
                    to: graphql_1.GraphQLID,
                },
                name: {
                    type: __1.types.string,
                },
            },
        });
        generatedSchema = __1.mapSchema(__1.operationPresets.all(mappedDataSource));
        yield knex("users").insert([{ id: 1, name: "Lorefnon" }, { id: 2, name: "Gandalf" }]);
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield knex.schema.dropTable("users");
    }));
    test("generated schema", () => {
        expect(graphql_1.printSchema(generatedSchema)).toMatchSnapshot();
    });
    test("singular query operation without params", () => __awaiter(this, void 0, void 0, function* () {
        const r1 = yield graphql_1.graphql(generatedSchema, `
                query {
                    findOneUser(where: {}) {
                        id
                        name
                    }
                }
            `);
        expect(r1.errors).not.toBeDefined();
        expect(r1).toMatchSnapshot();
    }));
    test("singular query operation with params", () => __awaiter(this, void 0, void 0, function* () {
        const r2 = yield graphql_1.graphql(generatedSchema, `
                query {
                    findOneUser(where: { id: 2 }) {
                        id
                        name
                    }
                }
            `);
        expect(r2.errors).not.toBeDefined();
        expect(r2).toMatchSnapshot();
    }));
    test("singular query operation for non-existent row", () => __awaiter(this, void 0, void 0, function* () {
        const r3 = yield graphql_1.graphql(generatedSchema, `
                query {
                    findOneUser(where: { id: 10 }) {
                        id
                        name
                    }
                }
            `);
        expect(r3.errors).not.toBeDefined();
        expect(r3.data.findOneUser).toBeNull();
    }));
    test("batch query operation without args", () => __awaiter(this, void 0, void 0, function* () {
        const r4 = yield graphql_1.graphql(generatedSchema, `
                query {
                    findManyUsers(where: {}) {
                        id
                        name
                    }
                }
            `);
        expect(r4.errors).not.toBeDefined();
        expect(r4).toMatchSnapshot();
    }));
    test("batch query operations with arguments", () => __awaiter(this, void 0, void 0, function* () {
        const r5 = yield graphql_1.graphql(generatedSchema, `
                query {
                    findManyUsers(where: { id: 1 }) {
                        id
                        name
                    }
                }
            `);
        expect(r5.errors).not.toBeDefined();
        expect(r5).toMatchSnapshot();
    }));
});
describe("Data source mapped as per custom configuration", () => {
    let mappedDataSource, generatedSchema;
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        yield knex.schema.createTable("customers", t => {
            t.increments("pk");
            t.string("first_name");
            t.string("last_name");
        });
        mappedDataSource = __1.mapDataSource({
            name: {
                mapped: "User",
                stored: "customers",
            },
            fields: {
                id: {
                    sourceColumn: "pk",
                    type: __1.types.string,
                    to: {
                        input: graphql_1.GraphQLID,
                        output: graphql_1.GraphQLID,
                    },
                },
                firstName: {
                    sourceColumn: "first_name",
                    type: __1.types.string,
                },
                lastName: {
                    sourceColumn: "last_name",
                    type: __1.types.string,
                },
            },
        });
        generatedSchema = __1.mapSchema(__1.operationPresets.all(mappedDataSource));
        yield knex("customers").insert([
            { pk: 1, first_name: "John", last_name: "Doe" },
            { pk: 2, first_name: "Jane", last_name: "Doe" },
        ]);
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield knex.schema.dropTable("customers");
    }));
    test("generated schema", () => {
        expect(graphql_1.printSchema(generatedSchema)).toMatchSnapshot();
    });
    test("singular query operation", () => __awaiter(this, void 0, void 0, function* () {
        const r1 = yield graphql_1.graphql(generatedSchema, "query { findOneUser(where: {}) { id, firstName, lastName }}");
        expect(r1.errors).not.toBeDefined();
        expect(r1).toMatchSnapshot();
        const r2 = yield graphql_1.graphql(generatedSchema, "query { findOneUser(where: {id: 2}) { id, firstName, lastName }}");
        expect(r2.errors).not.toBeDefined();
        expect(r2).toMatchSnapshot();
    }));
    test("batch query operation", () => __awaiter(this, void 0, void 0, function* () {
        const r3 = yield graphql_1.graphql(generatedSchema, "query { findManyUsers(where: {}) { id, firstName, lastName }}");
        expect(r3.errors).not.toBeDefined();
        expect(r3).toMatchSnapshot();
    }));
});
describe("Data sources associated by joins", () => {
    let tags, products, departments;
    let generatedSchema;
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        yield setup_department_schema_1.setupDepartmentSchema(knex);
        yield knex("tags").insert([{ name: "imported" }, { name: "third-party" }]);
        yield knex("departments").insert([{ name: "textile" }, { name: "heavy goods" }]);
        yield knex("products").insert([
            { name: "silk gown", department_id: 1 },
            { name: "steel welding machine", department_id: 2 },
        ]);
        yield knex("product_tag_associators").insert([
            { product_id: 1, tag_id: 1 },
            { product_id: 2, tag_id: 2 },
            { product_id: 2, tag_id: 1 },
        ]);
        const fields = {
            id: {
                type: __1.types.number,
                to: graphql_1.GraphQLID,
            },
            name: {
                type: __1.types.string,
            },
        };
        tags = __1.mapDataSource({
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
                                    .leftOuterJoin(`product_tag_associators as ${ptaVisitor.alias}`, `${ptaVisitor.alias}.tag_id`, `${ahv.alias}.id`)
                                    .leftOuterJoin(`products as ${productsVisitor.alias}`, `${productsVisitor.alias}.id`, `${ptaVisitor.alias}.product_id`);
                                return productsVisitor;
                            },
                        },
                    ],
                },
            },
        });
        products = __1.mapDataSource({
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
        departments = __1.mapDataSource({
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
        generatedSchema = __1.mapSchema([
            ...__1.operationPresets.all(tags),
            ...__1.operationPresets.all(departments),
            ...__1.operationPresets.all(products),
        ]);
    }));
    test("generated schema", () => {
        expect(graphql_1.printSchema(generatedSchema)).toMatchSnapshot();
    });
    test("query operations involving auto-inferred binary joins", () => __awaiter(this, void 0, void 0, function* () {
        const r1 = yield graphql_1.graphql(generatedSchema, `
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
            `);
        expect(r1).toMatchSnapshot();
        const r2 = yield graphql_1.graphql(generatedSchema, `
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
            `);
        expect(r2).toMatchSnapshot();
    }));
    test("query operations involving user specified complex joins", () => __awaiter(this, void 0, void 0, function* () {
        const r1 = yield graphql_1.graphql(generatedSchema, `
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
            `);
        expect(r1).toMatchSnapshot();
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield setup_department_schema_1.teardownDepartmentSchema(knex);
    }));
});
describe.only("Data sources linked by side-loadable associations", () => __awaiter(this, void 0, void 0, function* () {
    let generatedSchema;
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        yield setup_department_schema_1.setupDepartmentSchema(knex);
        yield knex("tags").insert([{ name: "imported" }, { name: "third-party" }]);
        yield knex("departments").insert([{ name: "textile" }, { name: "heavy goods" }]);
        yield knex("products").insert([
            { name: "silk gown", department_id: 1 },
            { name: "steel welding machine", department_id: 2 },
        ]);
        yield knex("product_tag_associators").insert([
            { product_id: 1, tag_id: 1 },
            { product_id: 2, tag_id: 2 },
            { product_id: 2, tag_id: 1 },
        ]);
        const fields = {
            id: {
                type: __1.types.number,
                to: graphql_1.GraphQLID,
            },
            name: {
                type: __1.types.string,
            },
        };
        const departments = __1.mapDataSource({
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
                                return lodash_1.has(operation.args, ["where", "id"]);
                            },
                            preFetch(operation) {
                                const department_id = operation.args.where.id;
                                return {
                                    query: findManyProducts,
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
                                console.log("parents =>", parents);
                                return {
                                    query: findManyProductsByDepartmentIdList,
                                    args: {
                                        department_ids: lodash_1.map(parents, "id"),
                                    },
                                };
                            },
                        },
                    ],
                },
            },
        });
        const products = __1.mapDataSource({
            name: "Product",
            fields: Object.assign({}, fields, { department_id: {
                    type: __1.types.number,
                } }),
        });
        const findOneProduct = __1.operationPresets.query.findOneOperation(products);
        const findManyProducts = __1.operationPresets.query.findManyOperation(products);
        const findManyProductsByDepartmentIdList = new MappedQueryOperation_1.MappedQueryOperation({
            rootSource: products,
            name: `findManyProductsByDepartmentIdList`,
            args: {
                department_ids: {
                    type: graphql_1.GraphQLList(graphql_1.GraphQLInt),
                },
            },
            resolver: QueryOperationResolver_1.QueryOperationResolver,
            rootQuery(args, ahv) {
                return products.rootQuery(ahv).whereIn("department_id", args.department_ids);
            },
            singular: false,
            shallow: false,
            description: undefined,
        });
        generatedSchema = __1.mapSchema([...__1.operationPresets.all(departments), findOneProduct, findManyProducts]);
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield setup_department_schema_1.teardownDepartmentSchema(knex);
    }));
    test("pre-fetch queries", () => __awaiter(this, void 0, void 0, function* () {
        const r1 = yield graphql_1.graphql(generatedSchema, `
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
            `);
        expect(r1).toMatchSnapshot();
    }));
    test("post-fetch queries", () => __awaiter(this, void 0, void 0, function* () {
        const r1 = yield graphql_1.graphql(generatedSchema, `
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
            `);
        expect(r1).toMatchSnapshot();
    }));
}));
//# sourceMappingURL=integration.spec.js.map