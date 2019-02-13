import { property } from "lodash";
import { Dict } from "./util-types";

/**
 * Creates an object mapping the items of a collection by a property.
 *
 * @param arr collection of items to be indexed
 * @param path property path eg. "foo.bar", "foo[0]"
 */
export const indexBy = <T>(arr: T[], path: string) => {
    const prop = property<T, string>(path);
    return arr.reduce((result: Dict<T>, item) => {
        result[prop(item)] = item;
        return result;
    }, {}) as Dict<T>;
};

/**
 * Decorator for a getter which assigns the result of first invocation of getter as
 * the equivalent property of the class
 */
export function MemoizeGetter(_target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const { get } = descriptor;
    if (!get) {
        throw new Error("MemoizeGetter can only be applied to a getter");
    }
    descriptor.get = function() {
        const value = get.apply(this);
        Object.defineProperty(this, propertyKey, { value });
        return value;
    };
}
