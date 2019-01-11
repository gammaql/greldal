import { GraphQLOutputType, GraphQLResolveInfo } from "graphql";
import * as t from "io-ts";
import * as Knex from "knex";
import _debug from "debug";
import { MappedDataSource } from "./MappedDataSource";
import { Dict, MakeOptional } from "./util-types";
import { OperationResolver } from "./OperationResolver";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { MappedAssociation } from "./MappedAssociation";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { MappedArgs } from "./MappedArgs";
import { MappedOperation } from "./MappedOperation";

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
        args: TArgs,
        aliasHierarchyVisitor: AliasHierarchyVisitor,
    ): Knex.QueryBuilder;
    deriveWhereParams<T extends OperationMapping<TSrc, TArgs>>(
        this: MappedOperation<TSrc, TArgs, T>,
        args: TArgs,
        association?: MappedAssociation,
    ): Dict;
    args?: MappedArgs<TArgs>;
    resolver<TMapping extends OperationMapping<TSrc, TArgs>>(
        operation: MappedOperation<TSrc, TArgs, TMapping>,
        source: any,
        context: any,
        args: TArgs,
        resolveInfoRoot: GraphQLResolveInfo,
        resolveInfoVisitor?: ResolveInfoVisitor<any>,
    ): OperationResolver<TSrc, TArgs, TMapping>;
}

/**
 * @api-category ConfigType
 */
export type OperationMapping<
    TSrc extends MappedDataSource = MappedDataSource,
    TArgs extends object = {}
> = MakeOptional<
    OperationMappingBase<TSrc, TArgs>,
    "returnType" | "rootQuery" | "deriveWhereParams" | "args" | "resolver"
>;
