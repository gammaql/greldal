import { GraphQLFieldConfigArgumentMap, GraphQLNonNull } from "graphql";

import { SingleSourceDeletionOperationResolver } from "./SingleSourceDeletionOperationResolver";
import { MappedDataSource } from "./MappedDataSource";
import { MappedSingleSourceMutationOperation } from "./MappedSingleSourceMutationOperation";
import { SingleSourceOperationMapping } from "./SingleSourceOperationMapping";
import { MemoizeGetter } from "./utils";
import { ResolverContext } from "./ResolverContext";
import { MaybeArray } from "./util-types";

/**
 * @api-category MapperClass
 */
export class MappedSingleSourceDeletionOperation<
    TSrc extends MappedDataSource,
    TArgs extends {},
    TMapping extends SingleSourceOperationMapping<TSrc, TArgs> = SingleSourceOperationMapping<TSrc, TArgs>
> extends MappedSingleSourceMutationOperation<TSrc, TArgs, TMapping> {
    defaultResolve(
        resolverContext: ResolverContext<MappedSingleSourceDeletionOperation<TSrc, TArgs, TMapping>, TSrc, TArgs>,
    ): Promise<MaybeArray<TSrc["ShallowEntityType"]>> {
        return new SingleSourceDeletionOperationResolver(resolverContext).resolve();
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
