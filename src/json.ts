import * as t from "io-ts";
import { isNil } from 'lodash';
import { Validation } from "io-ts";

const stringifyCache = new WeakMap();

const cachedStringify = <T extends {}> (input: T) => {
    if (isNil(input)) return undefined;
    const cached = stringifyCache.get(input);
    if (cached) return cached;
    const stringified = JSON.stringify(input);
    stringifyCache.set(input, stringified);
    return stringified;
}

export class JSONType<RT> extends t.Type<RT, string, unknown> {
    readonly _tag: 'JSONType' = 'JSONType';
    constructor(
        public type: t.Type<RT>,
        public name = `JSON(${type.name})`
    ) {
        super(
            name,
            type.is,
            (i: unknown, c: t.Context) => {
                const validation = type.validate(i, c);
                if (validation.isLeft()) return validation as any;
                try {
                    cachedStringify(validation);
                    return t.success(i);
                } catch (e) {
                    return t.failure(i, c);
                }
            },
            cachedStringify
        );
    }
    decode(input: string): Validation<RT> {
        try {
            const parsed = JSON.parse(input);
            return this.type.decode(parsed);
        } catch (e) {
            t.failure(input, []);  
        }
        return JSON.parse(input);
    }
}

export const json = <T> (baseType: t.Type<T>, name?: string) => new JSONType<T>(baseType, name);