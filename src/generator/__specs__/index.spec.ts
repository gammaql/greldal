import fs from "fs-extra";
import Knex from "knex";
import path from "path";
import { setupKnex } from "../../__specs__/helpers/setup-knex";
import { useDatabaseConnector } from "../..";
import { generate } from '../index';
import { isEmpty, trim } from 'lodash';

jest.setTimeout(60000);

describe("Generator integration", () => {
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
        await knex.destroy();
    });

    it("identifies fields and associations", async () => {
        const generated = await generate({knex})
        expect(generated).toMatchSnapshot();
    })
})
