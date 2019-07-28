import * as t from "io-ts";
import * as Knex from "knex";
import { OperationMapping, OperationMappingRT } from "./OperationMapping";
import { OperationResolver } from "./OperationResolver";
import { MappedOperation } from "./MappedOperation";
import { ResolverContext } from "./ResolverContext";
import { MappedArgs } from "./MappedArgs";
import { GraphQLOutputType } from "graphql";
import { MaybeMapped } from "./util-types";

export type UDFParam = {
    name?: string;
    value: any;
} & (
    | {
          type: "IN";
      }
    | {
          type: "OUT" | "INOUT";
          select?: boolean;
      });

export const UDFInvocationMappingRT = t.intersection([
    OperationMappingRT,
    t.partial({
        type: t.union([t.literal("query"), t.literal("mutation")]),
        deriveParams: t.Function,
        deriveResult: t.Function,
    }),
]);

/**
 * @api-category ConfigType
 */
export interface UDFInvocationMapping<TArgs extends {}>
    extends t.TypeOf<typeof UDFInvocationMappingRT>,
        OperationMapping<TArgs> {
    name: MaybeMapped<string>;
    resolver?: <TCtx extends ResolverContext<MappedOperation<TArgs>, TArgs>, TResolved>(
        ctx: TCtx,
    ) => OperationResolver<TCtx, TArgs, TResolved>;
    args: MappedArgs<TArgs>;
    returnType: GraphQLOutputType;
    deriveParams(args: TArgs): UDFParam[];
    deriveResult?: (output: any, selectedParams: any) => any;
    connector?: Knex;
}
