import { OperationMapping } from "./MappedOperation";
import { GraphQLFieldConfigArgumentMap } from "graphql";
import { UpdateOperationResolver } from "./UpdateOperationResolver";
import { MappedMutationOperation } from "./MappedMutationOperation";
export declare class MappedUpdateOperation<TMapping extends OperationMapping = any> extends MappedMutationOperation<TMapping> {
    opType: "mutation";
    defaultResolver: typeof UpdateOperationResolver;
    readonly defaultArgs: GraphQLFieldConfigArgumentMap;
}
