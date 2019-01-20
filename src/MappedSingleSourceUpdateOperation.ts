import { GraphQLFieldConfigArgumentMap, GraphQLNonNull } from "graphql";

import { MappedDataSource } from "./MappedDataSource";
import { MappedSingleSourceMutationOperation } from "./MappedSingleSourceMutationOperation";
import { SingleSourceUpdateOperationResolver } from "./SingleSourceUpdateOperationResolver";
import { MemoizeGetter } from "./utils";
import { ResolverContext } from "./ResolverContext";

/**
 * @api-category MapperClass
 */
export class MappedSingleSourceUpdateOperation<
    TSrc extends MappedDataSource,
    TArgs extends {}
> extends MappedSingleSourceMutationOperation<TSrc, TArgs> {
    opType: "mutation" = "mutation";

    defaultResolver(
        resolverContext: ResolverContext<MappedSingleSourceUpdateOperation<TSrc, TArgs>, TSrc, TArgs>,
    ): SingleSourceUpdateOperationResolver<
        ResolverContext<MappedSingleSourceUpdateOperation<TSrc, TArgs>, TSrc, TArgs>,
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
