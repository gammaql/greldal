import { GraphQLFieldConfigArgumentMap, GraphQLNonNull, GraphQLResolveInfo } from "graphql";

import { DeletionOperationResolver } from "./DeletionOperationResolver";
import { MappedDataSource } from "./MappedDataSource";
import { MappedMutationOperation } from "./MappedMutationOperation";
import { OperationMapping } from "./MappedOperation";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { MemoizeGetter } from "./utils";

export class MappedDeletionOperation<
    TSrc extends MappedDataSource,
    TArgs extends {},
    TMapping extends OperationMapping<TSrc, TArgs> = OperationMapping<TSrc, TArgs>
> extends MappedMutationOperation<TSrc, TArgs, TMapping> {
    defaultResolver(
        source: any,
        context: any,
        args: TArgs,
        resolveInfoRoot: GraphQLResolveInfo,
        resolveInfoVisitor?: ResolveInfoVisitor<any>,
    ): DeletionOperationResolver<TSrc, TArgs, TMapping> {
        return new DeletionOperationResolver<TSrc, TArgs, TMapping>(
            this,
            source,
            context,
            args,
            resolveInfoRoot,
            resolveInfoVisitor,
        );
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
