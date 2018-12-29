import { GraphQLFieldConfigArgumentMap, GraphQLInputType, GraphQLArgumentConfig } from "graphql";
import * as t from "io-ts";
import * as Knex from "knex";
import { forEach, transform } from "lodash";

import { getTypeAccessorError } from "./errors";
import { ioToGraphQLInputType } from "./graphql-type-mapper";
import { Dict, GQLInputType, IOType } from "./util-types";

export const ArgMapping = t.intersection([
    t.partial({
        to: GQLInputType,
        description: t.string,
        interceptQuery: t.Function,
        defaultValue: t.any,
    }),
    t.type({
        type: IOType,
    }),
]);

export interface ArgMapping<TMapped extends t.Type<any>> extends t.TypeOf<typeof ArgMapping> {
    type: TMapped;
    to?: GraphQLInputType;
    description?: string;
    defaultValue?: t.TypeOf<TMapped>;
    interceptQuery?: (qb: Knex.QueryBuilder, value: t.TypeOf<TMapped>, args: Dict) => Knex.QueryBuilder;
}

export type ArgMappingDict<TArgs extends {} = Dict> = { [K in keyof TArgs]: ArgMapping<t.Type<TArgs[K]>> };

export type ArgsType<T extends ArgMappingDict> = { [K in keyof T]: T[K]["type"] };

export class MappedArgs<TArgs extends object = Dict> {
    constructor(private mapping: ArgMappingDict<TArgs>) {}

    get ArgsType(): TArgs {
        throw getTypeAccessorError("ArgsType", "MappedArgs");
    }

    get ArgsMappingType(): ArgMappingDict<TArgs> {
        throw getTypeAccessorError("ArgsMappingType", "MappedArgs");
    }

    get args(): GraphQLFieldConfigArgumentMap {
        return transform<ArgMapping<t.Type<any>>, GraphQLArgumentConfig>(
            this.mapping,
            (result, arg, name) => {
                result[name] = {
                    type: ioToGraphQLInputType(arg.type, `args[${name}]`),
                    defaultValue: arg.defaultValue,
                    description: arg.description,
                };
            },
            {},
        );
    }

    interceptQuery(qb: Knex.QueryBuilder, args: TArgs) {
        forEach(this.mapping, (arg, name) => {
            if (arg.interceptQuery) {
                qb = arg.interceptQuery(qb, args[name as keyof TArgs], args) || qb;
            }
        });
        return qb;
    }
}

export function mapArgs<TArgs extends object>(mapping: ArgMappingDict<TArgs>) {
    return new MappedArgs<TArgs>(mapping);
}
