import Knex from "knex";
import { uniqueId } from "lodash";
import { ReturnType } from "../../../util-types";

const prefixTableNames = (prefix: string) => {
    const prefixedName = (n: string) => `${prefix}_${n}`;
    return {
        employees: prefixedName("employees"),
        categories: prefixedName("categories"),
        customers: prefixedName("customers"),
        shippers: prefixedName("shippers"),
        suppliers: prefixedName("suppliers"),
        orders: prefixedName("orders"),
        products: prefixedName("products"),
        order_details: prefixedName("order_details"),
        customer_customer_demos: prefixedName("customer_customer_demos"),
        customer_demographics: prefixedName("customer_demographics"),
        regions: prefixedName("regions"),
        territories: prefixedName("territories"),
        employees_territories: prefixedName("employees_territories"),
    };
};

interface SetupOptions {
    shouldSetup?: (name: TableKeys) => boolean;
}

export type TableKeys = keyof ReturnType<typeof prefixTableNames>;

export const northwindFixture = (knex: Knex, prefix = uniqueId("tscope_")) => {
    const tables = prefixTableNames(prefix);

    const setup = async (setupOptions?: SetupOptions) => {
        const addressFields = (t: Knex.CreateTableBuilder) => {
            t.string("address");
            t.string("city");
            t.string("region");
            t.string("postal_code");
            t.string("country");
            t.string("phone");
        };

        const orgAddressFields = (t: Knex.CreateTableBuilder) => {
            addressFields(t);
            t.string("fax");
        };

        const createdTables: string[] = [];

        const createTable = async (name: keyof typeof tables, callback: (t: Knex.CreateTableBuilder) => void) => {
            if (setupOptions && setupOptions.shouldSetup && setupOptions.shouldSetup(name) === false) return;
            const tableName = tables[name];
            await knex.schema.dropTableIfExists(tableName);
            await knex.schema.createTable(tableName, callback);
            createdTables.push(tableName);
        };

        await createTable("employees", t => {
            t.integer("id").primary();
            t.string("first_name");
            t.string("last_name");
            t.string("title");
            t.date("birth_date");
            t.date("hire_date");
            t.string("address");
            t.string("city");
            t.string("region");
            t.string("postal_code");
            t.string("country");
            t.string("home_home");
            t.string("extension");
            t.binary("photo");
            t.string("notes");
            t.integer("reports_to")
                .references("id")
                .inTable(tables.employees);
            t.string("photo_path");
        });

        await createTable("categories", t => {
            t.integer("id").primary();
            t.string("category_name");
            t.string("description");
        });

        await createTable("customers", t => {
            t.string("id").primary();
            t.string("company_name");
            t.string("contact_name");
            t.string("contact_title");
            orgAddressFields(t);
        });

        await createTable("shippers", t => {
            t.string("id").primary();
            t.string("company_name");
            t.string("phone");
        });

        await createTable("suppliers", t => {
            t.integer("id").primary();
            t.string("company_name");
            t.string("contact_name");
            t.string("contact_title");
            orgAddressFields(t);
            t.string("home_page");
        });

        await createTable("orders", t => {
            t.integer("id").primary();
            t.string("customer_id")
                .references("id")
                .inTable(tables.customers);
            t.integer("employee_id")
                .references("id")
                .inTable(tables.employees);
            t.date("order_date");
            t.date("required_date");
            t.date("shipped_date");
            t.integer("ship_via");
            t.decimal("freight");
            t.string("ship_name");
            t.string("ship_address");
            t.string("ship_city");
            t.string("ship_region");
            t.string("ship_postal_code");
            t.string("ship_country");
        });

        await createTable("products", t => {
            t.integer("id").primary();
            t.string("product_name");
            t.integer("supplier_id").notNullable();
            t.integer("category_id").notNullable();
            t.string("quantity_per_unit");
            t.decimal("unit_price");
            t.integer("units_in_stock");
            t.integer("units_on_order");
            t.integer("reorder_level");
            t.integer("discontinued");
        });

        await createTable("order_details", t => {
            t.string("id").primary();
            t.integer("order_id");
            t.integer("product_id");
            t.decimal("unit_price");
            t.integer("quantity");
            t.decimal("discount");
        });

        await createTable("customer_customer_demos", t => {
            t.string("id").primary();
            t.string("customer_type_id");
        });

        await createTable("customer_demographics", t => {
            t.string("id").primary();
            t.string("customer_desc");
        });

        await createTable("regions", t => {
            t.integer("id").primary();
            t.string("region_description");
        });

        await createTable("territories", t => {
            t.string("id").primary();
            t.string("territory_description");
            t.integer("region_id")
                .notNullable()
                .references("id")
                .inTable(tables.regions);
        });

        await createTable("employees_territories", t => {
            t.string("id").primary();
            t.integer("employee_id")
                .notNullable()
                .references("id")
                .inTable(tables.employees);
            t.string("territory_id")
                .notNullable()
                .references("id")
                .inTable(tables.territories);
        });

        const teardown = async () => {
            for (let i = createdTables.length - 1; i >= 0; i--) {
                console.log("Dropping Table:", createdTables[i]);
                await knex.schema.dropTable(createdTables[i]);
            }
        };

        return { teardown };
    };
    return {
        tables,
        setup,
    };
};
