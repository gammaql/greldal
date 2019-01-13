import { GraphQLFieldConfigArgumentMap, GraphQLNonNull, GraphQLResolveInfo } from "graphql";

import { DeletionOperationResolver } from "./DeletionOperationResolver";
import { MappedDataSource } from "./MappedDataSource";
import { MappedMutationOperation } from "./MappedMutationOperation";
import { OperationMapping } from "./OperationMapping";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { MemoizeGetter } from "./utils";
import { ResolverContext } from "./ResolverContext";
import { MaybeArray } from "./util-types";

/**
 * @api-category MapperClass
 */
export class MappedDeletionOperation<
    TSrc extends MappedDataSource,
    TArgs extends {},
    TMapping extends OperationMapping<TSrc, TArgs> = OperationMapping<TSrc, TArgs>
> extends MappedMutationOperation<TSrc, TArgs, TMapping> {
    defaultResolve(
        resolverContext: ResolverContext<MappedDeletionOperation<TSrc, TArgs, TMapping>, TSrc, TArgs>,
    ): Promise<MaybeArray<TSrc["ShallowEntityType"]>> {
        return new DeletionOperationResolver(resolverContext).resolve();
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
