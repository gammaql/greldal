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
exports.setupDepartmentSchema = (knex) => __awaiter(this, void 0, void 0, function* () {
    yield knex.schema.createTable("tags", t => {
        t.increments("id");
        t.string("name");
    });
    yield knex.schema.createTable("departments", t => {
        t.increments("id");
        t.string("name");
    });
    yield knex.schema.createTable("products", t => {
        t.increments("id");
        t.integer("department_id")
            .references("id")
            .inTable("departments")
            .notNullable();
        t.string("name");
    });
    yield knex.schema.createTable("product_tag_associators", t => {
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
});
exports.teardownDepartmentSchema = (knex) => __awaiter(this, void 0, void 0, function* () {
    yield knex.schema.dropTable("departments");
    yield knex.schema.dropTable("products");
    yield knex.schema.dropTable("tags");
    yield knex.schema.dropTable("product_tag_associators");
});
//# sourceMappingURL=setup-department-schema.js.map