import { GraphQLFieldConfigArgumentMap, GraphQLNonNull } from "graphql";
import * as Knex from "knex";

import { MappedAssociation } from "./MappedAssociation";
import { MappedDataSource } from "./MappedDataSource";
import { MappedSingleSourceOperation } from "./MappedSingleSourceOperation";
import { SingleSourceQueryOperationResolver } from "./SingleSourceQueryOperationResolver";
import { Dict, Omit } from "./util-types";
import { MemoizeGetter } from "./utils";
import { isPresetQueryParams } from "./operation-presets";
import { getTypeAccessorError } from "./errors";
import { SourceAwareResolverContext } from "./SourceAwareResolverContext";
import { SourceAwareOperationResolver } from "./SourceAwareOperationResolver";
import { MappedSourceAwareOperation } from "./MappedSourceAwareOperation";

/**
 * @api-category MapperClass
 */
export class MappedSingleSourceQueryOperation<
    TSrc extends MappedDataSource,
    TArgs extends {}
> extends MappedSingleSourceOperation<TSrc, TArgs> {
    operationType: "query" = "query";

    constructor(
        // If resovler is not omitted here then type inference of resolver breaks
        public mapping: Omit<MappedSingleSourceOperation<TSrc, TArgs>["mapping"], "resolver"> & {
            resolver?: <
                TCtx extends SourceAwareResolverContext<MappedSingleSourceQueryOperation<TSrc, TArgs>, TSrc, TArgs>,
                TResolved = any
            >(
                ctx: TCtx,
            ) => SingleSourceQueryOperationResolver<
                TCtx,
                TSrc,
                MappedSingleSourceQueryOperation<TSrc, TArgs>,
                TArgs,
                TResolved
            >;
        },
    ) {
        super(mapping);
        this.validateMapping();
    }

    validateMapping() {
        if (this.mapping.paginate && this.mapping.singular) {
            throw new Error("Pagination is not support for singular query operations");
        }
    }

    defaultResolver(
        resolverContext: SourceAwareResolverContext<MappedSingleSourceQueryOperation<TSrc, TArgs>, TSrc, TArgs>,
    ): SourceAwareOperationResolver<
        SourceAwareResolverContext<MappedSourceAwareOperation<TSrc, TArgs>, TSrc, TArgs>,
        TSrc,
        TArgs,
        any
    > &
        SingleSourceQueryOperationResolver<
            SourceAwareResolverContext<MappedSingleSourceQueryOperation<TSrc, TArgs>, TSrc, TArgs>,
            TSrc,
            MappedSingleSourceQueryOperation<TSrc, TArgs>,
            TArgs,
            any
        > {
        return new SingleSourceQueryOperationResolver(resolverContext);
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

    get ResolverContextType(): SourceAwareResolverContext<MappedSingleSourceQueryOperation<TSrc, TArgs>, TSrc, TArgs> {
        throw getTypeAccessorError("ResolverContextType", "MappedQueryOperation");
    }
}
