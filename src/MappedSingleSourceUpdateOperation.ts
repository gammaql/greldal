import { GraphQLFieldConfigArgumentMap, GraphQLNonNull } from "graphql";

import { MappedDataSource } from "./MappedDataSource";
import { MappedSingleSourceMutationOperation } from "./MappedSingleSourceMutationOperation";
import { SingleSourceOperationMapping } from "./SingleSourceOperationMapping";
import { SingleSourceUpdateOperationResolver } from "./SingleSourceUpdateOperationResolver";
import { MemoizeGetter } from "./utils";
import { ResolverContext } from "./ResolverContext";
import { MaybeArray } from "./util-types";

/**
 * @api-category MapperClass
 */
export class MappedSingleSourceUpdateOperation<
    TSrc extends MappedDataSource,
    TArgs extends {},
    TMapping extends SingleSourceOperationMapping<TSrc, TArgs> = SingleSourceOperationMapping<TSrc, TArgs>
> extends MappedSingleSourceMutationOperation<TSrc, TArgs, TMapping> {
    opType: "mutation" = "mutation";

    defaultResolve(
        resolverContext: ResolverContext<MappedSingleSourceUpdateOperation<TSrc, TArgs, TMapping>, TSrc, TArgs>,
    ): Promise<MaybeArray<TSrc["ShallowEntityType"]>> {
        return new SingleSourceUpdateOperationResolver(resolverContext).resolve();
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
