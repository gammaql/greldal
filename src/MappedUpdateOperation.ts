import { GraphQLFieldConfigArgumentMap, GraphQLNonNull, GraphQLResolveInfo } from "graphql";

import { MappedDataSource } from "./MappedDataSource";
import { MappedMutationOperation } from "./MappedMutationOperation";
import { OperationMapping } from "./MappedOperation";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { UpdateOperationResolver } from "./UpdateOperationResolver";
import { MemoizeGetter } from "./utils";

export class MappedUpdateOperation<
    TSrc extends MappedDataSource,
    TArgs extends {},
    TMapping extends OperationMapping<TSrc, TArgs> = OperationMapping<TSrc, TArgs>
> extends MappedMutationOperation<TSrc, TArgs, TMapping> {
    opType: "mutation" = "mutation";

    defaultResolver(
        source: any,
        context: any,
        args: TArgs,
        resolveInfoRoot: GraphQLResolveInfo,
        resolveInfoVisitor?: ResolveInfoVisitor<any>,
    ): UpdateOperationResolver<TSrc, TArgs, TMapping> {
        return new UpdateOperationResolver<TSrc, TArgs, TMapping>(
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
            update: {
                type: GraphQLNonNull(this.rootSource.defaultShallowInputType),
            },
        };
    }
}
