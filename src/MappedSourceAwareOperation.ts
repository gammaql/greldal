import { MappedDataSource } from "./MappedDataSource";
import { MappedOperation } from "./MappedOperation";
import { PaginationConfig } from "./PaginationConfig";
import { Maybe } from "./utils/util-types";
import { normalizeResultsForSingularity } from "./graphql-type-mapper";
import { SourceAwareOperationMapping } from "./SourceAwareOperationMapping";
import { GraphQLResolveInfo } from "graphql";
import { MaybePaginatedResolveInfoVisitor } from "./PaginatedResolveInfoVisitor";
import { SourceAwareResolverContext } from "./SourceAwareResolverContext";

export abstract class MappedSourceAwareOperation<
    TSrc extends MappedDataSource,
    TArgs extends object
> extends MappedOperation<TArgs> {
    constructor(public readonly mapping: SourceAwareOperationMapping<TSrc, TArgs>) {
        super(mapping);
    }

    get supportsMultipleDataSources() {
        return false;
    }

    get paginationConfig(): Maybe<PaginationConfig> {
        return this.mapping.paginate;
    }

    normalizeResultsForSingularity(result: any) {
        return normalizeResultsForSingularity(result, this.singular, !!this.paginationConfig);
    }

    async createResolverContext(
        source: any,
        args: TArgs,
        context: any,
        resolveInfo: GraphQLResolveInfo,
        resolveInfoVisitor?: MaybePaginatedResolveInfoVisitor<any>,
    ): Promise<SourceAwareResolverContext<any, any, TArgs>> {
        return SourceAwareResolverContext.create(
            this,
            {} as any,
            source,
            args,
            context,
            resolveInfo,
            resolveInfoVisitor,
        );
    }
}
