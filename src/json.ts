import * as t from "io-ts";
import { Left, Right } from "fp-ts/lib/Either";

const stringifyCache = new WeakMap();

const cachedStringify = <T extends {}> (input: T) => {
    const cached = stringifyCache.get(input);
    if (cached) return cached;
    const stringified = JSON.stringify(input);
    stringifyCache.set(input, stringified);
    return stringified;
}

export const json = <T> (baseRT: t.Type<T>) => new t.Type<T, string>(
    `JSON(${baseRT.name})`,
    baseRT.is,
    (i, c) => {
        const validation = baseRT.validate(i, c);
        if (validation.isLeft()) return validation as any;
        try {
            cachedStringify(validation);
            return new Right(i);
        } catch (e) {
            return new Left(e);
        }
    },
    cachedStringify
)
