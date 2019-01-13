import { GraphQLFieldConfigArgumentMap, GraphQLNonNull } from "graphql";

import { MappedDataSource } from "./MappedDataSource";
import { MappedMutationOperation } from "./MappedMutationOperation";
import { OperationMapping } from "./OperationMapping";
import { UpdateOperationResolver } from "./UpdateOperationResolver";
import { MemoizeGetter } from "./utils";
import { ResolverContext } from "./ResolverContext";
import { MaybeArray } from "./util-types";

/**
 * @api-category MapperClass
 */
export class MappedUpdateOperation<
    TSrc extends MappedDataSource,
    TArgs extends {},
    TMapping extends OperationMapping<TSrc, TArgs> = OperationMapping<TSrc, TArgs>
> extends MappedMutationOperation<TSrc, TArgs, TMapping> {
    opType: "mutation" = "mutation";

    defaultResolve(
        resolverContext: ResolverContext<MappedUpdateOperation<TSrc, TArgs, TMapping>, TSrc, TArgs>,
    ): Promise<MaybeArray<TSrc["ShallowEntityType"]>> {
        return new UpdateOperationResolver(resolverContext).resolve();
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
