import { GraphQLFieldConfigArgumentMap, GraphQLList, GraphQLOutputType, GraphQLResolveInfo } from "graphql";
import * as t from "io-ts";
import * as Knex from "knex";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { assertType } from "./utils/assertions";
import { getTypeAccessorError } from "./utils/errors";
import { MappedAssociation } from "./MappedAssociation";
import { MappedDataSource } from "./MappedDataSource";
import { MappedSourceAwareOperation } from "./MappedSourceAwareOperation";
import { OperationMappingRT } from "./OperationMapping";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { SourceAwareOperationResolver } from "./SourceAwareOperationResolver";
import { Dict } from "./utils/util-types";
import { MemoizeGetter } from "./utils/utils";
import { SourceAwareResolverContext } from "./SourceAwareResolverContext";

type RCtx<TSrc extends MappedDataSource, TArgs extends object> = SourceAwareResolverContext<
    MappedSingleSourceOperation<TSrc, TArgs>,
    TSrc,
    TArgs
>;

export const SingleSourceOperationMappingRT = t.intersection([
    OperationMappingRT,
    t.partial({
        rootQuery: t.Function,
        deriveWhereParams: t.Function,
    }),
]);

/**
 * A MappedOperation encapsulates the logic and information needed to map an operation
 * on a data source to a GraphQL Query/Mutation
 *
 * A MappedOperation is expected to not contain the actual logic for the operation - it delegates
 * to a Resolver class which will handle how this operation can be resolved in the context of
 * specified data source using the provided args.
 *
 * MappedOperation is primarily concerned with selection of appropriate data sources (if more than one
 * are specified), selection of an appropriate resolver (if more than one are specified) and delegating
 * to the selected resolver for perforrming the actual operation in database.
 *
 * Creating a custom sub-class of a MappedOperation is usually not required for most common use cases
 * because most use cases are better served by a custom resolver used with either MappedQueryOperation
 * or MappedMutationOperation, both of which descend from this class.
 *
 * In rare cases, sub-classing MappedOperation (or one of its descendants) can be beneficial when
 * consumer wants a more control over the mapping of operation to GraphQL layer than is possible through
 * the OperationMapping configuration.
 *
 * Example of such use cases include:
 *
 * - When GraphQL args can not be deduced from a static configuration and need to be defined dynamically
 * - Arbitrary adhoc (potentially async) transformation of args before delegating to a resolver.
 *
 * @api-category MapperClass
 */
export abstract class MappedSingleSourceOperation<
    TSrc extends MappedDataSource,
    TArgs extends object
> extends MappedSourceAwareOperation<TSrc, TArgs> {
    constructor(
        public mapping: MappedSourceAwareOperation<TSrc, TArgs>["mapping"] & {
            rootSource: TSrc;

            rootQuery?: (
                dataSource: TSrc,
                args: TArgs,
                aliasHierarchyVisitor?: AliasHierarchyVisitor | null,
            ) => Knex.QueryBuilder;

            deriveWhereParams?: (args: TArgs, association?: MappedAssociation) => Dict;

            resolver?: <
                TCtx extends SourceAwareResolverContext<MappedSingleSourceOperation<TSrc, TArgs>, TSrc, TArgs>,
                TResolved
            >(
                ctx: TCtx,
            ) => SourceAwareOperationResolver<TCtx, TSrc, TArgs, TResolved>;
        },
    ) {
        super(mapping);
        assertType(SingleSourceOperationMappingRT, mapping, `Operation configuration: ${mapping.name}`);
    }

    get rootSource() {
        return this.mapping.rootSource;
    }

    get mappedArgs(): GraphQLFieldConfigArgumentMap {
        if (this.mapping.args) {
            return this.mapping.args.getMappedArgsFor(this.rootSource);
        }
        return this.defaultArgs;
    }

    @MemoizeGetter
    get type(): GraphQLOutputType {
        if (this.mapping.returnType) {
            return this.mapping.returnType;
        }
        let baseType: GraphQLOutputType;
        const { rootSource } = this.mapping;
        if (this.paginationConfig) {
            if (this.shallow) {
                return rootSource.paginatedShallowOutputType;
            } else {
                return rootSource.paginatedOutputType;
            }
        }
        if (this.shallow) {
            baseType = rootSource.defaultShallowOutputType;
        } else {
            baseType = rootSource.defaultOutputType;
        }
        if (this.singular) {
            return baseType;
        } else {
            return GraphQLList(baseType);
        }
    }

    get ResolverContextType(): RCtx<TSrc, TArgs> {
        throw getTypeAccessorError("ResolverContextType", "MappedOperation");
    }

    rootQuery(dataSource: TSrc, args: TArgs, aliasHierachyVisitor: AliasHierarchyVisitor | null): Knex.QueryBuilder {
        if (this.mapping.rootQuery) {
            return this.mapping.rootQuery.call<
                MappedSingleSourceOperation<TSrc, TArgs>,
                [TSrc, TArgs, AliasHierarchyVisitor | null],
                Knex.QueryBuilder
            >(this, dataSource, args, aliasHierachyVisitor);
        }
        return dataSource.rootQueryBuilder(aliasHierachyVisitor);
    }

    async createResolverContext(
        source: any,
        args: TArgs,
        context: any,
        resolveInfo: GraphQLResolveInfo,
        resolveInfoVisitor?: ResolveInfoVisitor<any>,
    ): Promise<RCtx<TSrc, TArgs>> {
        return SourceAwareResolverContext.create(
            this,
            { [this.rootSource.mappedName]: { selection: () => this.rootSource } },
            source,
            args,
            context,
            resolveInfo,
            resolveInfoVisitor,
        );
    }
}
