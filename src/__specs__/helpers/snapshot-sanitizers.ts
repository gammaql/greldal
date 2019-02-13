import { isString, isFunction } from "lodash";
import { isObject } from "util";
import Maybe from "graphql/tsutils/Maybe";

const replaceCode = (err: string) => err.replace(/\[GRelDAL:\S+Error:\d+\]/, "[GRelDAL:ERR_CODE_OMITTED]");

export const removeErrorCodes = (errors: Maybe<any[]>) =>
    (errors || []).map(err => {
        if (isString(err)) return replaceCode(err);
        if (isObject(err) && err.message) return replaceCode(err.message);
        if (isObject(err) && isFunction(err.toString)) return replaceCode(err.toString());
        return replaceCode(`${err}`);
    });
