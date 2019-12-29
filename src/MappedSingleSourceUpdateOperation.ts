import { GraphQLFieldConfigArgumentMap, GraphQLNonNull } from "graphql";

import { MappedDataSource } from "./MappedDataSource";
import { MappedSingleSourceMutationOperation } from "./MappedSingleSourceMutationOperation";
import { SingleSourceUpdateOperationResolver } from "./SingleSourceUpdateOperationResolver";
import { MemoizeGetter } from "./utils/utils";
import { SourceAwareResolverContext } from "./SourceAwareResolverContext";

/**
 * @api-category MapperClass
 */
export class MappedSingleSourceUpdateOperation<
    TSrc extends MappedDataSource,
    TArgs extends {}
> extends MappedSingleSourceMutationOperation<TSrc, TArgs> {
    opType: "mutation" = "mutation";

    defaultResolver(
        resolverContext: SourceAwareResolverContext<MappedSingleSourceUpdateOperation<TSrc, TArgs>, TSrc, TArgs>,
    ): SingleSourceUpdateOperationResolver<
        SourceAwareResolverContext<MappedSingleSourceUpdateOperation<TSrc, TArgs>, TSrc, TArgs>,
        TSrc,
        TArgs,
        any
    > {
        return new SingleSourceUpdateOperationResolver(resolverContext);
    }

    @MemoizeGetter
    get defaultArgs(): GraphQLFieldConfigArgumentMap {
        return {
            where: {
                type: GraphQLNonNull(this.rootSource.defaultShallowInputType),
            },
            update: {
                type: GraphQLNonNull(this.rootSource.defaultShallowInputType),
            },
        };
    }
}
