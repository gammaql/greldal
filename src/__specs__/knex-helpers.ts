import * as Knex from "knex";
import { first, values } from "lodash";

export const getCount = async (qb: Knex.QueryBuilder) => first(values(first(await qb.count()))) as number;
