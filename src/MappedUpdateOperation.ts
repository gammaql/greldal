import { MappedOperation, OperationMapping, MappedOperationArgs } from "./MappedOperation";
import { GraphQLFieldConfig, GraphQLFieldConfigArgumentMap, GraphQLNonNull } from "graphql";
import { MemoizeGetter } from "./utils";
import { MappedAssociation } from "./MappedAssociation";
import { Dict } from "./util-types";
import { UpdateOperationResolver } from "./UpdateOperationResolver";
import { MappedMutationOperation } from "./MappedMutationOperation";

export class MappedUpdateOperation<TMapping extends OperationMapping = any> extends MappedMutationOperation<TMapping> {
    opType: "mutation" = "mutation";
    defaultResolver = UpdateOperationResolver;

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
