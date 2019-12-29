import { some } from "lodash";
import { Predicate, MaybeArray } from "./util-types";
import { checkStr, checkRegexp, checkArray } from "./guards";

export const matchString = (predicate: MaybeArray<string | RegExp | Predicate<string>>): Predicate<string> =>
    checkArray(predicate)
        ? (i: string) => some(predicate, p => matchString(p)(i))
        : checkStr(predicate)
        ? (i: string) => i == predicate
        : checkRegexp(predicate)
        ? (i: string) => !!i.match(predicate)
        : predicate;
