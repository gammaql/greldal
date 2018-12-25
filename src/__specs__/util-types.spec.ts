import { InstanceOf, IOType } from "../util-types";
import * as t from "io-ts";
import { assertType } from "../assertions";

test("InstanceType", () => {
    class User {
        constructor(public name: string, public age: number) {}
    }
    const UserInstance = InstanceOf(User);
    const family = t.type({
        members: t.array(UserInstance),
        address: t.string,
    });
    const familyInst: t.TypeOf<typeof family> = {
        address: "221 B Baker Street",
        members: [new User("John Doe", 30)],
    };
    const user: t.TypeOf<typeof UserInstance> = {
        name: "John Doe",
        age: 10,
    };
    expect(() => assertType(UserInstance, user)).toThrowErrorMatchingInlineSnapshot(
        `"Invalid value {\\"name\\":\\"John Doe\\",\\"age\\":10} supplied to : Instance<User>"`,
    );

    expect(() => assertType(UserInstance, new User("John Doe", 30))).not.toThrowError();

    expect(() =>
        assertType(family, {
            members: [new User("John Doe", 30), new User("Jane Doe", 30)],
            address: "221 B Baker Street",
        }),
    ).not.toThrowError();
    expect(() => assertType(family, {})).toThrowErrorMatchingInlineSnapshot(`
"Invalid value undefined supplied to : { members: Array<Instance<User>>, address: string }/members: Array<Instance<User>>
Invalid value undefined supplied to : { members: Array<Instance<User>>, address: string }/address: string"
`);
    expect(() =>
        assertType(family, {
            address: "221 B Baker Street",
            members: [new User("John Doe", 30), 100],
        }),
    ).toThrowErrorMatchingInlineSnapshot(
        `"Invalid value 100 supplied to : { members: Array<Instance<User>>, address: string }/members: Array<Instance<User>>/1: Instance<User>"`,
    );
});

test("IOType", () => {
    expect(() => {
        assertType(IOType, t.string)
    }).not.toThrow();
    expect(() => {
        assertType(IOType, t.type({
            name: t.string,
            age: t.number
        }));
    }).not.toThrow();
    expect(() => {
        assertType(IOType, IOType)
    }).not.toThrow();
})