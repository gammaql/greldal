import { GraphQLFieldConfigArgumentMap, GraphQLNonNull } from "graphql";
import * as Knex from "knex";

import { MappedAssociation } from "./MappedAssociation";
import { MappedDataSource } from "./MappedDataSource";
import { MappedSingleSourceOperation } from "./MappedSingleSourceOperation";
import { SingleSourceQueryOperationResolver } from "./SingleSourceQueryOperationResolver";
import { Dict, MaybeArray, Omit } from "./util-types";
import { MemoizeGetter } from "./utils";
import { isPresetQueryParams } from "./operation-presets";
import { ResolverContext } from "./ResolverContext";
import { SingleSourceOperationMapping } from "./SingleSourceOperationMapping";
import { getTypeAccessorError } from "./errors";

export type SingleSourceQueryOperationMapping<TSrc extends MappedDataSource, TArgs extends {}> = Omit<
SingleSourceOperationMapping<TSrc, TArgs>,
    "resolve"
> & {
    resolve?: <
        TRCtx extends ResolverContext<
            MappedSingleSourceQueryOperation<TSrc, TArgs, SingleSourceQueryOperationMapping<TSrc, TArgs>>,
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

export class MappedSingleSourceQueryOperation<
    TSrc extends MappedDataSource,
    TArgs extends {},
    TMapping extends SingleSourceQueryOperationMapping<TSrc, TArgs> = SingleSourceQueryOperationMapping<TSrc, TArgs>
> extends MappedSingleSourceOperation<TSrc, TArgs, TMapping> {
    opType: "query" = "query";

    defaultResolve(
        resolverContext: ResolverContext<MappedSingleSourceQueryOperation<TSrc, TArgs, TMapping>, TSrc, TArgs>,
    ): Promise<MaybeArray<TSrc["EntityType"]>> {
        return new SingleSourceQueryOperationResolver(resolverContext).resolve();
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

    get ResolverContextType(): ResolverContext<MappedSingleSourceQueryOperation<TSrc, TArgs, TMapping>, TSrc, TArgs> {
        throw getTypeAccessorError("ResolverContextType", "MappedQueryOperation");
    }
}
