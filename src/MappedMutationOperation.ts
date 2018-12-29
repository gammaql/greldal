import { MappedOperation, OperationMapping } from "./MappedOperation";
import { MappedDataSource } from "./MappedDataSource";
import { Dict } from "./util-types";

export abstract class MappedMutationOperation<
    TSrc extends MappedDataSource,
    TArgs extends {},
    TMapping extends OperationMapping<TSrc, TArgs> = any
> extends MappedOperation<TSrc, TArgs, TMapping> {
    opType: "mutation" = "mutation";
}
