import { GraphQLFieldConfigArgumentMap, GraphQLNonNull, GraphQLResolveInfo } from "graphql";
import * as Knex from "knex";

import { MappedAssociation } from "./MappedAssociation";
import { MappedDataSource } from "./MappedDataSource";
import { MappedOperation, OperationMapping } from "./MappedOperation";
import { QueryOperationResolver } from "./QueryOperationResolver";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { Dict } from "./util-types";
import { MemoizeGetter } from "./utils";
import { isPresetQueryArgs } from "./operation-presets";

/**
 * @api-category MapperClass
 */
export class MappedQueryOperation<
    TSrc extends MappedDataSource,
    TArgs extends {},
    TMapping extends OperationMapping<TSrc, TArgs> = OperationMapping<TSrc, TArgs>
> extends MappedOperation<TSrc, TArgs, TMapping> {
    opType: "query" = "query";

    defaultResolver(
        source: any,
        context: any,
        args: TArgs,
        resolveInfoRoot: GraphQLResolveInfo,
        resolveInfoVisitor?: ResolveInfoVisitor<any>,
    ): QueryOperationResolver<TSrc, TArgs, TMapping> {
        return new QueryOperationResolver<TSrc, TArgs, TMapping>(
            this,
            source,
            context,
            args,
            resolveInfoRoot,
            resolveInfoVisitor,
        );
    }

    @MemoizeGetter
    get defaultArgs(): GraphQLFieldConfigArgumentMap {
        return {
            where: {
                type: GraphQLNonNull(this.rootSource.defaultShallowInputType),
            },
        };
    }

    interceptQueryByArgs(qb: Knex.QueryBuilder, args: TArgs) {
        if (this.mapping.args) {
            return this.mapping.args.interceptQuery(qb, args);
        }
        return qb;
    }

    deriveWhereParams(args: TArgs, association?: MappedAssociation): Dict {
        if (this.mapping.deriveWhereParams) {
            return this.mapping.deriveWhereParams.call(this, args, association);
        }
        if (isPresetQueryArgs(args)) {
            return args.where;
        }
        return {};
    }
}
