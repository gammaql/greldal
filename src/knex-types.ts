import * as Knex from "knex";
import { Maybe } from "./util-types";

export interface QBFactory {
    (alias: Maybe<string>): Knex.QueryBuilder;
}
