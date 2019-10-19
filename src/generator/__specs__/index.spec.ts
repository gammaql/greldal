import Knex from "knex";
import { setupKnex } from "../../__specs__/helpers/setup-knex";
import { useDatabaseConnector } from "../..";
import { generate } from "../index";
import { northwindFixture } from './__fixtures__/northwind';

jest.setTimeout(60000);

describe("Generator integration", () => {
    let knex: Knex;
    let teardown: () => Promise<void>;

    beforeAll(async () => {
        knex = setupKnex();
        useDatabaseConnector(knex);
        const fixture = northwindFixture(knex);
        ({teardown} = await fixture.setup());
    });

    afterAll(async () => {
        await teardown();
    });

    it("identifies fields and associations", async () => {
        const generated = await generate({ 
            knex,
            dataSources: {
                transform: {
                    dataSourceName(name: string) {
                        const match = name.match(/^tscope\d+(\S+)/i);
                        return match ? match[1] : name;
                    }
                }
            }
         });
        expect(generated).toMatchSnapshot();
    });
});
