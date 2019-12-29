import * as t from "io-ts";
import { isNil } from "lodash";
import { Validation } from "io-ts";
import { Maybe } from "./util-types";

export class MaybeType<RT> extends t.Type<Maybe<RT>, any, unknown> {
    readonly _tag: "MaybeType" = "MaybeType";
    constructor(public type: t.Type<RT>, public name = `Maybe(${type.name})`) {
        super(
            name,
            type.is,
            (i: unknown, c: t.Context) => {
                if (isNil(i)) return t.success(i as any);
                return type.validate(i, c);
            },
            t.identity,
        );
    }
    decode(input: any): Validation<Maybe<RT>> {
        if (isNil(input)) return t.success(input);
        return this.type.decode(input);
    }
}

export const maybe = <T>(baseType: t.Type<T, any>, name?: string) => new MaybeType<T>(baseType, name);

export const maybeArray = <T>(baseType: t.Type<T, any>, name?: string) => t.union([baseType, t.array(baseType)], name);
