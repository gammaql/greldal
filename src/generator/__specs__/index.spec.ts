import Knex from "knex";
import { setupKnex } from "../../__specs__/helpers/setup-knex";
import { useDatabaseConnector } from "../..";
import { generate } from "../index";
import { northwindFixture } from './__fixtures__/northwind';
import { reportErrors } from '../../__specs__/test-helpers';

jest.setTimeout(60000);

describe("Generator integration", () => {
    let knex: Knex;
    let teardown: () => Promise<void>;

    beforeAll(async () => {
        await reportErrors(async () => {
            knex = setupKnex();
            useDatabaseConnector(knex);
            const fixture = northwindFixture(knex, 'tscope_1');
            const setupResult = await fixture.setup();
            ({teardown} = setupResult);
        });
    });

    afterAll(async () => {
        await reportErrors(async () => {
            await teardown();
        });
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
