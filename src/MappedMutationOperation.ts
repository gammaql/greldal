import { MappedOperation, OperationMapping, MappedOperationArgs } from "./MappedOperation";
import { GraphQLFieldConfig, GraphQLFieldConfigArgumentMap, GraphQLNonNull } from "graphql";
import { MemoizeGetter } from "./utils";
import { MappedAssociation } from "./MappedAssociation";
import { Dict } from "./util-types";
import { QueryOperationResolver } from "./QueryOperationResolver";

export abstract class MappedMutationOperation<TMapping extends OperationMapping = any> extends MappedOperation<
    TMapping
> {
    opType: "mutation" = "mutation";
}
