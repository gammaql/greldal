import { MappedSingleSourceOperation } from "./MappedSingleSourceOperation";
import { MappedDataSource } from "./MappedDataSource";
import { SingleSourceOperationMapping } from "./SingleSourceOperationMapping";

/**
 * @api-category MapperClass
 */
export abstract class MappedSingleSourceMutationOperation<
    TSrc extends MappedDataSource,
    TArgs extends {},
    TMapping extends SingleSourceOperationMapping<TSrc, TArgs> = any
> extends MappedSingleSourceOperation<TSrc, TArgs, TMapping> {
    opType: "mutation" = "mutation";
}
