import { GraphQLFieldConfigArgumentMap, GraphQLList } from "graphql";

import { SingleSourceInsertionOperationResolver } from "./SingleSourceInsertionOperationResolver";
import { MappedDataSource } from "./MappedDataSource";
import { MappedSingleSourceMutationOperation } from "./MappedSingleSourceMutationOperation";
import { MemoizeGetter } from "./utils/utils";
import { ResolverContext } from "./ResolverContext";
import { SourceAwareResolverContext } from "./SourceAwareResolverContext";

/**
 * @api-category MapperClass
 */
export class MappedSingleSourceInsertionOperation<
    TSrc extends MappedDataSource,
    TArgs extends {}
> extends MappedSingleSourceMutationOperation<TSrc, TArgs> {
    defaultResolver(
        resolverContext: SourceAwareResolverContext<MappedSingleSourceInsertionOperation<TSrc, TArgs>, TSrc, TArgs>,
    ): SingleSourceInsertionOperationResolver<
        SourceAwareResolverContext<MappedSingleSourceInsertionOperation<TSrc, TArgs>, TSrc, TArgs>,
        TSrc,
        TArgs,
        any
    > {
        return new SingleSourceInsertionOperationResolver(resolverContext);
    }

    @MemoizeGetter
    get defaultArgs(): GraphQLFieldConfigArgumentMap {
        if (this.singular) {
            return {
                entity: {
                    type: this.rootSource.defaultShallowInputType,
                },
            };
        } else {
            return {
                entities: {
                    type: GraphQLList(this.rootSource.defaultShallowInputType),
                },
            };
        }
    }
}
