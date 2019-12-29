import { isArray, isFunction, isNil } from "lodash";
import { TypeGuard } from "./util-types";
import { isString, isRegExp } from "util";

export const checkArray = isArray as TypeGuard<any[]>;

export const checkNil = isNil as TypeGuard<null | undefined>;

export const checkFn = isFunction as TypeGuard<Function>;

export const checkStr = isString as TypeGuard<String>;

export const checkRegexp = isRegExp as TypeGuard<RegExp>;
