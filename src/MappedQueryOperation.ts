import { MappedOperation, OperationMapping } from "./MappedOperation";
import { GraphQLFieldConfigArgumentMap, GraphQLNonNull } from "graphql";
import { MemoizeGetter } from "./utils";
import { QueryOperationResolver } from "./QueryOperationResolver";

export class MappedQueryOperation<TMapping extends OperationMapping = any> extends MappedOperation<TMapping> {
    opType: "query" = "query";
    defaultResolver = QueryOperationResolver;

    @MemoizeGetter
    get defaultArgs(): GraphQLFieldConfigArgumentMap {
        return {
            where: {
                type: GraphQLNonNull(this.rootSource.defaultShallowInputType),
            },
        };
    }
}
