import { GraphQLFieldConfigArgumentMap, GraphQLList } from "graphql";

import { SingleSourceInsertionOperationResolver } from "./SingleSourceInsertionOperationResolver";
import { MappedDataSource } from "./MappedDataSource";
import { MappedSingleSourceMutationOperation } from "./MappedSingleSourceMutationOperation";
import { SingleSourceOperationMapping } from "./SingleSourceOperationMapping";
import { MemoizeGetter } from "./utils";
import { ResolverContext } from "./ResolverContext";
import { MaybeArray } from "./util-types";

/**
 * @api-category MapperClass
 */
export class MappedSingleSourceInsertionOperation<
    TSrc extends MappedDataSource,
    TArgs extends {},
    TMapping extends SingleSourceOperationMapping<TSrc, TArgs> = SingleSourceOperationMapping<TSrc, TArgs>
> extends MappedSingleSourceMutationOperation<TSrc, TArgs, TMapping> {
    defaultResolve(
        resolverContext: ResolverContext<MappedSingleSourceInsertionOperation<TSrc, TArgs, TMapping>, TSrc, TArgs>,
    ): Promise<MaybeArray<TSrc["ShallowEntityType"]>> {
        return new SingleSourceInsertionOperationResolver(resolverContext).resolve();
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
