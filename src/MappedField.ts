import * as t from "io-ts";
import { MaybeArray } from "./util-types";
import { GraphQLInputType, GraphQLOutputType } from "graphql";
import { getTypeAccessorError } from "./errors";

export interface FieldMapping<TMapped extends t.Type<any>, TArgs extends {}> {
    type: TMapped;
    from?: MaybeArray<keyof TArgs>;
    to?: {
        input: GraphQLInputType,
        output: GraphQLOutputType
    };
    description?: string;
    derive?: (args: TArgs) => t.TypeOf<TMapped>;
}

export class MappedField<T extends FieldMapping<any, any>> {
    constructor(private mapping: T) {
    }
    get Type(): t.TypeOf<T["type"]> {
        throw getTypeAccessorError('Type', 'MappedField');
    }
}
