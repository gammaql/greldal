import * as t from "io-ts";
import * as Knex from "knex";
import { OperationMapping, OperationMappingRT } from "./OperationMapping";
import { OperationResolver } from "./OperationResolver";
import { MappedOperation } from "./MappedOperation";
import { ResolverContext } from "./ResolverContext";
import { MappedArgs } from "./MappedArgs";
import { GraphQLOutputType } from "graphql";
import { MaybeMapped } from "./utils/util-types";

export type InvocationParam = {
    name?: string;
    value: any;
} & (
    | {
          argMode: "IN";
      }
    | {
          argMode: "OUT" | "INOUT";
          select?: boolean;
      }
);

export const InvocationMappingRT = t.intersection([
    OperationMappingRT,
    t.partial({
        type: t.union([t.literal("query"), t.literal("mutation")]),
        deriveParams: t.Function,
        deriveResult: t.Function,
    }),
], "InvocationMapping");

/**
 * @api-category ConfigType
 */
export interface InvocationMapping<TArgs extends {}>
    extends t.TypeOf<typeof InvocationMappingRT>,
        OperationMapping<TArgs> {
    name: MaybeMapped<string>;
    resolver?: <TCtx extends ResolverContext<MappedOperation<TArgs>, TArgs>, TResolved>(
        ctx: TCtx,
    ) => OperationResolver<TCtx, TArgs, TResolved>;
    args: MappedArgs<TArgs>;
    returnType: GraphQLOutputType;
    deriveParams(args: TArgs): InvocationParam[];
    deriveResult?: (output: any) => any;
    connector?: Knex;
}
