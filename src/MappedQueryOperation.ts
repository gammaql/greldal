import { GraphQLFieldConfigArgumentMap, GraphQLNonNull } from "graphql";
import * as Knex from "knex";

import { MappedAssociation } from "./MappedAssociation";
import { MappedDataSource } from "./MappedDataSource";
import { MappedOperation } from "./MappedOperation";
import { QueryOperationResolver } from "./QueryOperationResolver";
import { Dict, MaybeArray, Omit } from "./util-types";
import { MemoizeGetter } from "./utils";
import { isPresetQueryParams } from "./operation-presets";
import { ResolverContext } from "./ResolverContext";
import { OperationMapping } from "./OperationMapping";
import { getTypeAccessorError } from "./errors";

export type QueryOperationMapping<TSrc extends MappedDataSource, TArgs extends {}> = Omit<
    OperationMapping<TSrc, TArgs>,
    "resolve"
> & {
    resolve?: <
        TRCtx extends ResolverContext<
            MappedQueryOperation<TSrc, TArgs, QueryOperationMapping<TSrc, TArgs>>,
            TSrc,
            TArgs
        >
    >(
        resolverContext: TRCtx,
    ) => Promise<MaybeArray<TSrc["EntityType"]>>;
};

/**
 * @api-category MapperClass
 */

export class MappedQueryOperation<
    TSrc extends MappedDataSource,
    TArgs extends {},
    TMapping extends QueryOperationMapping<TSrc, TArgs> = QueryOperationMapping<TSrc, TArgs>
> extends MappedOperation<TSrc, TArgs, TMapping> {
    opType: "query" = "query";

    defaultResolve(
        resolverContext: ResolverContext<MappedQueryOperation<TSrc, TArgs, TMapping>, TSrc, TArgs>,
    ): Promise<MaybeArray<TSrc["EntityType"]>> {
        return new QueryOperationResolver(resolverContext).resolve();
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
        if (isPresetQueryParams(args)) {
            return args.where;
        }
        return {};
    }

    get ResolverContextType(): ResolverContext<MappedQueryOperation<TSrc, TArgs, TMapping>, TSrc, TArgs> {
        throw getTypeAccessorError("ResolverContextType", "MappedQueryOperation");
    }
}
