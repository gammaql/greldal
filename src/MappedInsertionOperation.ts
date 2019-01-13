import { GraphQLFieldConfigArgumentMap, GraphQLList } from "graphql";

import { InsertionOperationResolver } from "./InsertionOperationResolver";
import { MappedDataSource } from "./MappedDataSource";
import { MappedMutationOperation } from "./MappedMutationOperation";
import { OperationMapping } from "./OperationMapping";
import { MemoizeGetter } from "./utils";
import { ResolverContext } from "./ResolverContext";
import { MaybeArray } from "./util-types";

/**
 * @api-category MapperClass
 */
export class MappedInsertionOperation<
    TSrc extends MappedDataSource,
    TArgs extends {},
    TMapping extends OperationMapping<TSrc, TArgs> = OperationMapping<TSrc, TArgs>
> extends MappedMutationOperation<TSrc, TArgs, TMapping> {
    defaultResolve(
        resolverContext: ResolverContext<MappedInsertionOperation<TSrc, TArgs, TMapping>, TSrc, TArgs>,
    ): Promise<MaybeArray<TSrc["ShallowEntityType"]>> {
        return new InsertionOperationResolver(resolverContext).resolve();
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
