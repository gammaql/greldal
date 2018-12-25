import { MappedOperation, OperationMapping } from "./MappedOperation";

export abstract class MappedMutationOperation<TMapping extends OperationMapping = any> extends MappedOperation<
    TMapping
> {
    opType: "mutation" = "mutation";
}
