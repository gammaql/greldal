import { GraphQLOutputType } from "graphql";
import * as t from "io-ts";
import * as Knex from "knex";
import _debug from "debug";
import { MappedDataSource } from "./MappedDataSource";
import { Dict, MakeOptional } from "./util-types";
import { MappedAssociation } from "./MappedAssociation";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { MappedArgs } from "./MappedArgs";
import { MappedSingleSourceOperation } from "./MappedSingleSourceOperation";
import { ResolverContext } from "./ResolverContext";

export const SingleSourceOperationMappingRT = t.intersection([
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
export interface SingleSourceOperationMappingBase<TSrc extends MappedDataSource = MappedDataSource, TArgs extends object = {}>
    extends t.TypeOf<typeof SingleSourceOperationMappingRT> {
    rootSource: TSrc;
    returnType?: GraphQLOutputType;
    rootQuery<T extends SingleSourceOperationMapping<TSrc, TArgs>>(
        this: MappedSingleSourceOperation<TSrc, TArgs, T>,
        dataSource: TSrc,
        args: TArgs,
        aliasHierarchyVisitor: AliasHierarchyVisitor,
    ): Knex.QueryBuilder;
    deriveWhereParams<T extends SingleSourceOperationMapping<TSrc, TArgs>>(
        this: MappedSingleSourceOperation<TSrc, TArgs, T>,
        args: TArgs,
        association?: MappedAssociation,
    ): Dict;
    args?: MappedArgs<TArgs>;
    resolve<TRCtx extends ResolverContext<MappedSingleSourceOperation<TSrc, TArgs, SingleSourceOperationMapping<TSrc, TArgs>>, TSrc, TArgs>>(
        resolverContext: TRCtx,
    ): Promise<any>;
}

/**
 * User specified configuration for mapping a data source operation to
 *
 * @api-category ConfigType
 */
type SingleSourceOperationMapping_<TSrc extends MappedDataSource = MappedDataSource, TArgs extends object = {}> = MakeOptional<
    SingleSourceOperationMappingBase<TSrc, TArgs>,
    "returnType" | "rootQuery" | "deriveWhereParams" | "args" | "resolve"
>;

export interface SingleSourceOperationMapping<TSrc extends MappedDataSource = MappedDataSource, TArgs extends object = {}>
    extends SingleSourceOperationMapping_<TSrc, TArgs> {}
