import { MappedOperation, OperationMapping, MappedOperationArgs } from "./MappedOperation";
import { GraphQLFieldConfig, GraphQLFieldConfigArgumentMap, GraphQLList } from "graphql";
import { MemoizeGetter } from "./utils";
import { InsertionOperationResolver } from "./InsertionOperationResolver";
import { MappedMutationOperation } from "./MappedMutationOperation";

export class MappedInsertionOperation<TMapping extends OperationMapping = any> extends MappedMutationOperation<TMapping> {
    defaultResolver = InsertionOperationResolver;

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
