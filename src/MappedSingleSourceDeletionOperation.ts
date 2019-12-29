import { GraphQLFieldConfigArgumentMap, GraphQLNonNull } from "graphql";

import { SingleSourceDeletionOperationResolver } from "./SingleSourceDeletionOperationResolver";
import { MappedDataSource } from "./MappedDataSource";
import { MappedSingleSourceMutationOperation } from "./MappedSingleSourceMutationOperation";
import { MemoizeGetter } from "./utils/utils";
import { SourceAwareResolverContext } from "./SourceAwareResolverContext";

/**
 * @api-category MapperClass
 */
export class MappedSingleSourceDeletionOperation<
    TSrc extends MappedDataSource,
    TArgs extends {}
> extends MappedSingleSourceMutationOperation<TSrc, TArgs> {
    constructor(
        public mapping: MappedSingleSourceMutationOperation<TSrc, TArgs>["mapping"] & {
            resolver?: <
                TCtx extends SourceAwareResolverContext<MappedSingleSourceDeletionOperation<TSrc, TArgs>, TSrc, TArgs>,
                TResolved
            >(
                ctx: TCtx,
            ) => SingleSourceDeletionOperationResolver<TCtx, TSrc, TArgs, TResolved>;
        },
    ) {
        super(mapping);
    }

    defaultResolver(
        resolverContext: SourceAwareResolverContext<MappedSingleSourceDeletionOperation<TSrc, TArgs>, TSrc, TArgs>,
    ): SingleSourceDeletionOperationResolver<
        SourceAwareResolverContext<MappedSingleSourceDeletionOperation<TSrc, TArgs>, TSrc, TArgs>,
        TSrc,
        TArgs,
        any
    > {
        return new SingleSourceDeletionOperationResolver(resolverContext);
    }

    @MemoizeGetter
    get defaultArgs(): GraphQLFieldConfigArgumentMap {
        return {
            where: {
                type: GraphQLNonNull(this.rootSource.defaultShallowInputType),
            },
        };
    }
}
