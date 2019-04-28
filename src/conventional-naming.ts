import { MaybeMapped, TypeGuard } from "./util-types";
import { isString } from "util";
import { snakeCase, upperFirst, camelCase } from "lodash";
import { pluralize, singularize } from "inflection";

export const deriveStoredDataSourceName = (name: MaybeMapped<string>) =>
    (isString as TypeGuard<string>)(name) ? snakeCase(pluralize(name)) : name.stored;

export const deriveMappedDataSourceName = (name: MaybeMapped<string>) =>
    (isString as TypeGuard<string>)(name) ? upperFirst(camelCase(singularize(name))) : name.mapped;

export const deriveStoredFieldName = (name: MaybeMapped<string>) =>
    (isString as TypeGuard<string>)(name) ? snakeCase(name) : name.stored;

export const deriveMappedFieldName = (name: MaybeMapped<string>) =>
    (isString as TypeGuard<string>)(name) ? camelCase(singularize(name)) : name.mapped;

