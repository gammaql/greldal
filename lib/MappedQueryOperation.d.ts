import { MappedOperation, OperationMapping } from "./MappedOperation";
import { GraphQLFieldConfigArgumentMap } from "graphql";
import { QueryOperationResolver } from "./QueryOperationResolver";
export declare class MappedQueryOperation<TMapping extends OperationMapping = any> extends MappedOperation<TMapping> {
    opType: "query";
    defaultResolver: typeof QueryOperationResolver;
    readonly defaultArgs: GraphQLFieldConfigArgumentMap;
}
