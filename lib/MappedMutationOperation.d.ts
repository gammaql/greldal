import { MappedOperation, OperationMapping } from "./MappedOperation";
export declare abstract class MappedMutationOperation<TMapping extends OperationMapping = any> extends MappedOperation<TMapping> {
    opType: "mutation";
}
