import { failure } from "io-ts/lib/PathReporter";
import * as t from "io-ts";

/**
 * Perform runtime type verification using io-ts and throw TypeError on failure
 * 
 * @param type Runtime type representation
 * @param value Value to be validated
 * @returns value casted to runtime type representation
 */
export const assertType = <T> (type: t.Type<T>, value: any, specId: string) => {
    return type.decode(value).getOrElseL(errors => {
        throw new TypeError(`${specId} incorrectly specified:\n${failure(errors).join("\n")}`);
    });
};
