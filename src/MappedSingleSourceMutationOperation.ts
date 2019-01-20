import { MappedSingleSourceOperation } from "./MappedSingleSourceOperation";
import { MappedDataSource } from "./MappedDataSource";
import { ResolverContext } from "./ResolverContext";
import { SourceAwareOperationResolver } from "./SourceAwareOperationResolver";

/**
 * @api-category MapperClass
 */
export abstract class MappedSingleSourceMutationOperation<
    TSrc extends MappedDataSource,
    TArgs extends {}
> extends MappedSingleSourceOperation<TSrc, TArgs> {
    constructor(
        public mapping: MappedSingleSourceOperation<TSrc, TArgs>["mapping"] & {
            resolver?: <
                TCtx extends ResolverContext<MappedSingleSourceMutationOperation<TSrc, TArgs>, TSrc, TArgs>,
                TResolved
            >(
                ctx: TCtx,
            ) => SourceAwareOperationResolver<TCtx, TSrc, TArgs, TResolved>;
        },
    ) {
        super(mapping);
    }
    opType: "mutation" = "mutation";
}
