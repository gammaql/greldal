import { OperationMapping } from "./MappedOperation";
import { GraphQLFieldConfigArgumentMap } from "graphql";
import { DeletionOperationResolver } from "./DeletionOperationResolver";
import { MappedMutationOperation } from "./MappedMutationOperation";
export declare class MappedDeletionOperation<TMapping extends OperationMapping = any> extends MappedMutationOperation<TMapping> {
    defaultResolver: typeof DeletionOperationResolver;
    readonly defaultArgs: GraphQLFieldConfigArgumentMap;
}
