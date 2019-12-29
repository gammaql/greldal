import * as t from "io-ts";
import { MappedDataSource } from "./MappedDataSource";
import { OperationMapping, OperationMappingRT } from "./OperationMapping";
import { OperationResolver } from "./OperationResolver";
import { PaginationConfigRT, PaginationConfig } from "./PaginationConfig";
import { SourceAwareResolverContext } from "./SourceAwareResolverContext";
import { MappedSourceAwareOperation } from "./MappedSourceAwareOperation";

export const SourceAwareOperationMappingRT = t.intersection([
    OperationMappingRT,
    t.partial({
        paginate: PaginationConfigRT,
    }),
    t.type({
        name: t.string,
    }),
], "SourceAwareOperationMapping");

/**
 * @api-category ConfigType
 */
export interface SourceAwareOperationMapping<TSrc extends MappedDataSource, TArgs extends {}>
    extends t.TypeOf<typeof SourceAwareOperationMappingRT>,
        OperationMapping<TArgs> {
    resolver?: <
        TCtx extends SourceAwareResolverContext<MappedSourceAwareOperation<TSrc, TArgs>, TSrc, TArgs>,
        TResolved
    >(
        ctx: TCtx,
    ) => OperationResolver<TCtx, TArgs, TResolved>;
    paginate?: PaginationConfig;
    name: string;
}
