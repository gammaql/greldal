import { GraphQLResolveInfo } from "graphql";
import { MappedDataSource } from "./MappedDataSource";
import { OperationMapping } from "./OperationMapping";
import { QueryOperationResolver } from "./QueryOperationResolver";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { MappedQueryOperation } from "./MappedQueryOperation";

export interface QueryOperationMapping<TSrc extends MappedDataSource = MappedDataSource, TArgs extends object = {}>
    extends OperationMapping<TSrc, TArgs> {
    resolver?: <TMapping extends QueryOperationMapping<TSrc, TArgs> & OperationMapping<TSrc, TArgs>>(
        operation: MappedQueryOperation<TSrc, TArgs, TMapping>,
        source: any,
        context: any,
        args: TArgs,
        resolveInfoRoot: GraphQLResolveInfo,
        resolveInfoVisitor?: ResolveInfoVisitor<any>,
    ) => QueryOperationResolver<TSrc, TArgs, TMapping>;
}
