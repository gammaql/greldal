import { GraphQLFieldConfigArgumentMap, GraphQLList, GraphQLResolveInfo } from "graphql";

import { InsertionOperationResolver } from "./InsertionOperationResolver";
import { MappedDataSource } from "./MappedDataSource";
import { MappedMutationOperation } from "./MappedMutationOperation";
import { OperationMapping } from "./MappedOperation";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { MemoizeGetter } from "./utils";
import { forEach } from "lodash";

/**
 * @api-category MapperClass
 */
export class MappedInsertionOperation<
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
    ): InsertionOperationResolver<TSrc, TArgs, TMapping> {
        return new InsertionOperationResolver<TSrc, TArgs, TMapping>(
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
