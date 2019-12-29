import { failure } from "io-ts/lib/PathReporter";
import * as t from "io-ts";
import { getOrElse } from "fp-ts/lib/Either";

/**
 * Validate if a value complies with a runtime-type.
 *
 * @private
 * @param type Runtime type
 * @param value Value to be validated
 * @param specId Human friendly descriptor used in validation failure message
 */
export const assertType = <T>(type: t.Type<T>, value: any, specId: string) => {
    return getOrElse<t.Errors, T>((errors: t.Errors) => {
        throw new TypeError(`${specId} incorrectly specified:\n${failure(errors).join("\n")}`);
    })(type.decode(value));
};
