import { GraphQLOutputType } from "graphql";
import * as t from "io-ts";
import * as Knex from "knex";
import _debug from "debug";
import { MappedDataSource } from "./MappedDataSource";
import { Dict, MakeOptional } from "./util-types";
import { MappedAssociation } from "./MappedAssociation";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { MappedArgs } from "./MappedArgs";
import { MappedOperation } from "./MappedOperation";
import { ResolverContext } from "./ResolverContext";

export const OperationMapping = t.intersection([
    t.type({
        name: t.string,
    }),
    t.partial({
        description: t.string,
        singular: t.boolean,
        shallow: t.boolean,
        rootQuery: t.Function,
        deriveWhereParams: t.Function,
        // args: InstanceOf(MappedArgs),
    }),
]);

/**
 * @api-category ConfigType
 */
export interface OperationMappingBase<TSrc extends MappedDataSource = MappedDataSource, TArgs extends object = {}>
    extends t.TypeOf<typeof OperationMapping> {
    rootSource: TSrc;
    returnType?: GraphQLOutputType;
    rootQuery<T extends OperationMapping<TSrc, TArgs>>(
        this: MappedOperation<TSrc, TArgs, T>,
        dataSource: TSrc,
        args: TArgs,
        aliasHierarchyVisitor: AliasHierarchyVisitor,
    ): Knex.QueryBuilder;
    deriveWhereParams<T extends OperationMapping<TSrc, TArgs>>(
        this: MappedOperation<TSrc, TArgs, T>,
        args: TArgs,
        association?: MappedAssociation,
    ): Dict;
    args?: MappedArgs<TArgs>;
    resolve<TRCtx extends ResolverContext<MappedOperation<TSrc, TArgs, OperationMapping<TSrc, TArgs>>, TSrc, TArgs>>(
        resolverContext: TRCtx,
    ): Promise<any>;
}

/**
 * User specified configuration for mapping a data source operation to
 *
 * @api-category ConfigType
 */
type OperationMapping_<TSrc extends MappedDataSource = MappedDataSource, TArgs extends object = {}> = MakeOptional<
    OperationMappingBase<TSrc, TArgs>,
    "returnType" | "rootQuery" | "deriveWhereParams" | "args" | "resolve"
>;

export interface OperationMapping<TSrc extends MappedDataSource = MappedDataSource, TArgs extends object = {}>
    extends OperationMapping_<TSrc, TArgs> {}
