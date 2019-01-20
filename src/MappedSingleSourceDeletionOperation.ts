import { GraphQLFieldConfigArgumentMap, GraphQLNonNull } from "graphql";

import { SingleSourceDeletionOperationResolver } from "./SingleSourceDeletionOperationResolver";
import { MappedDataSource } from "./MappedDataSource";
import { MappedSingleSourceMutationOperation } from "./MappedSingleSourceMutationOperation";
import { MemoizeGetter } from "./utils";
import { ResolverContext } from "./ResolverContext";
import { MaybeArray } from "./util-types";

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
                TCtx extends ResolverContext<MappedSingleSourceDeletionOperation<TSrc, TArgs>, TSrc, TArgs>,
                TResolved
            >(
                ctx: TCtx,
            ) => SingleSourceDeletionOperationResolver<TCtx, TSrc, TArgs, TResolved>;
        },
    ) {
        super(mapping);
    }

    defaultResolver(
        resolverContext: ResolverContext<MappedSingleSourceDeletionOperation<TSrc, TArgs>, TSrc, TArgs>,
    ): SingleSourceDeletionOperationResolver<
        ResolverContext<MappedSingleSourceDeletionOperation<TSrc, TArgs>, TSrc, TArgs>,
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
