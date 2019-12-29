import {isArray, isNil} from "lodash";
import { TypeGuard } from "./util-types";

export const checkArray = isArray as TypeGuard<any[]>;

export const checkNil = isNil as TypeGuard<null | undefined>;
