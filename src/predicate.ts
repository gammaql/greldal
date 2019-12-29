import { some } from "lodash";
import { Predicate, MaybeArray, Maybe } from "./util-types";
import { checkStr, checkRegexp, checkArray, checkNil } from "./guards";

export const matchString = (
    predicate: MaybeArray<string | RegExp | Predicate<string>>,
): Predicate<Maybe<string>> =>
    checkArray(predicate)
        ? (i: Maybe<string>) => !checkNil(i) && some(predicate, p => matchString(p)(i))
        : checkStr(predicate)
        ? (i: Maybe<string>) => i === predicate
        : checkRegexp(predicate)
        ? (i: Maybe<string>) => !checkNil(i) && !! i.match(predicate)
        : (i: Maybe<string>) => !checkNil(i) && predicate(i);
