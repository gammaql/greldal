import { OperationMapping } from "./MappedOperation";
import { GraphQLFieldConfigArgumentMap } from "graphql";
import { InsertionOperationResolver } from "./InsertionOperationResolver";
import { MappedMutationOperation } from "./MappedMutationOperation";
export declare class MappedInsertionOperation<TMapping extends OperationMapping = any> extends MappedMutationOperation<TMapping> {
    defaultResolver: typeof InsertionOperationResolver;
    readonly defaultArgs: GraphQLFieldConfigArgumentMap;
}
