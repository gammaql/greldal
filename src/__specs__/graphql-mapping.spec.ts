import { mapToGraphQLInputType, types, mapToGraphQLOutputType } from "..";

describe("Graphql Type mapping", () => {
    const UserRT = types.interface({
        name: types.string,
        age: types.integer,
    });
    const DepartmentRT = types.interface({
        name: types.string,
        id: types.integer,
        users: types.array(UserRT),
    });
    describe("Input type mapping", () => {
        test("simple scalars", () => {
            expect(mapToGraphQLInputType(types.string)).toMatchInlineSnapshot(`"String"`);
            expect(mapToGraphQLInputType(types.number)).toMatchInlineSnapshot(`"Float"`);
            expect(mapToGraphQLInputType(types.integer)).toMatchInlineSnapshot(`"Int"`);
            expect(mapToGraphQLInputType(types.boolean)).toMatchInlineSnapshot(`"Boolean"`);

            expect(mapToGraphQLInputType(types.date)).toMatchInlineSnapshot(`"Date"`);
            expect(mapToGraphQLInputType(types.dateTime)).toMatchInlineSnapshot(`"DateTime"`);
        });
        test("complex types", () => {
            const UserGT = mapToGraphQLInputType(UserRT);
            expect(UserGT).toMatchInlineSnapshot(`"{ name: string, age: Integer }"`);
            expect(mapToGraphQLInputType(DepartmentRT)).toMatchInlineSnapshot(
                `"{ name: string, id: Integer, users: Array<{ name: string, age: Integer }> }"`,
            );
        });
    });
    describe("Output type mapping", () => {
        test("simple scalars", () => {
            expect(mapToGraphQLOutputType(types.string)).toMatchInlineSnapshot(`"String"`);
            expect(mapToGraphQLOutputType(types.number)).toMatchInlineSnapshot(`"Float"`);
            expect(mapToGraphQLOutputType(types.integer)).toMatchInlineSnapshot(`"Int"`);
            expect(mapToGraphQLOutputType(types.boolean)).toMatchInlineSnapshot(`"Boolean"`);

            expect(mapToGraphQLOutputType(types.date)).toMatchInlineSnapshot(`"Date"`);
            expect(mapToGraphQLOutputType(types.dateTime)).toMatchInlineSnapshot(`"DateTime"`);
        });
        test("complex types", () => {
            const UserGT = mapToGraphQLOutputType(UserRT);
            expect(UserGT).toMatchInlineSnapshot(`"{ name: string, age: Integer }"`);
            expect(mapToGraphQLOutputType(DepartmentRT)).toMatchInlineSnapshot(
                `"{ name: string, id: Integer, users: Array<{ name: string, age: Integer }> }"`,
            );
        });
    });
});
