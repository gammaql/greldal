import fs from "fs-extra";
import Knex from "knex";
import path from "path";
import { setupKnex } from "../../__specs__/helpers/setup-knex";
import { useDatabaseConnector } from "../..";
import { generate } from "../index";
import { isEmpty, trim } from "lodash";
import { reportErrors } from "../../__specs__/test-helpers";

jest.setTimeout(60000);

xdescribe("Generator integration", () => {
    let knex: Knex;

    beforeAll(async () => {
        knex = setupKnex();
        useDatabaseConnector(knex);
        const db = process.env.DB || "sqlite3";
        const fixture = await fs.readFile(path.join(__dirname, "__fixtures__", `northwind.${db}.create.sql`));
        for (let stmt of fixture.toString().split(";")) {
            stmt = trim(stmt);
            if (isEmpty(stmt)) continue;
            await knex.schema.raw(stmt);
        }
    });

    afterAll(async () => {
        await reportErrors(async () => {
            for (const tbl of [
                "EmployeeTerritory",
                "CustomerDemographic",
                "CustomerCustomerDemo",
                "OrderDetail",
                "Territory",
                "Region",
                "Product",
                "Order",
                "Supplier",
                "Shipper",
                "Customer",
                "Category",
                "Employee",
            ]) {
                await knex.schema.dropTable(tbl);
            }
            await knex.destroy();
        });
    });

    it("identifies fields and associations", async () => {
        const generated = await generate({ knex });
        expect(generated).toMatchSnapshot();
    });
});
