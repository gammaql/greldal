import * as Knex from "knex";
import { first, values } from "lodash";

export const getCount = async (qb: Knex.QueryBuilder) => Number(first(values(first(await qb.count<any>()))));
