import * as t from "io-ts";
import { RegExpType, Predicate } from "./util-types";
import { checkStr, checkRegexp } from "./guards";

export const matchString = (predicate: string | RegExp | Predicate<string>): Predicate<string> =>
    checkStr(predicate)
        ? (i: string) => i == predicate
        : checkRegexp(predicate)
        ? (i: string) => !!i.match(predicate)
        : predicate;
