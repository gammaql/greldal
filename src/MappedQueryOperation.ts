import { MappedOperation, OperationMapping, MappedOperationArgs } from "./MappedOperation";
import { GraphQLFieldConfig } from "graphql";
export class MappedQueryOperation<TMapping extends OperationMapping = any> extends MappedOperation<TMapping>
    implements GraphQLFieldConfig<any, any, MappedOperationArgs<TMapping>> {}
