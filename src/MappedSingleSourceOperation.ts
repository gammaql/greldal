import {
    GraphQLOutputType,
    GraphQLList,
    GraphQLResolveInfo,
    GraphQLFieldConfig,
    GraphQLFieldConfigArgumentMap,
} from "graphql";
import { autobind } from "core-decorators";
import * as Knex from "knex";
import _debug from "debug";
import { MappedDataSource } from "./MappedDataSource";
import { assertType } from "./assertions";
import { normalizeResultsForSingularity } from "./graphql-type-mapper";
import { getTypeAccessorError } from "./errors";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { MemoizeGetter } from "./utils";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { SingleSourceOperationMapping, SingleSourceOperationMappingRT } from './SingleSourceOperationMapping';
import { ResolverContext } from "./ResolverContext";
import { DataSourceMapping } from "./DataSourceMapping";
import { ExtendsWitness } from "./util-types";

const debug = _debug("greldal:MappedOperation");

type RCtx<
    TSrc extends MappedDataSource,
    TArgs extends object,
    TMapping extends SingleSourceOperationMapping<TSrc, TArgs>
> = ResolverContext<MappedSingleSourceOperation<TSrc, TArgs, TMapping>, TSrc, TArgs>;

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
    TArgs extends object,
    TMapping extends SingleSourceOperationMapping<TSrc, TArgs> = SingleSourceOperationMapping<TSrc, TArgs>
> {
    constructor(public readonly mapping: TMapping) {
        assertType(SingleSourceOperationMappingRT, mapping, `Operation configuration: ${mapping.name}`);
    }

    abstract opType: "query" | "mutation";

    @MemoizeGetter
    get graphQLOperation(): GraphQLFieldConfig<any, any, TArgs> {
        return {
            description: this.mapping.description,
            args: this.mappedArgs,
            type: this.type,
            resolve: this.resolve.bind(this),
        };
    }

    get rootSource(): TMapping["rootSource"] {
        return this.mapping.rootSource;
    }

    get name() {
        return this.mapping.name;
    }

    get shallow() {
        return this.mapping.shallow === true;
    }

    get singular() {
        return this.mapping.singular !== false;
    }

    get args() {
        return this.mapping.args;
    }

    get mappedArgs(): GraphQLFieldConfigArgumentMap {
        if (this.mapping.args) {
            return this.mapping.args.mappedArgs;
        }
        return this.defaultArgs;
    }

    @MemoizeGetter
    get type(): GraphQLOutputType {
        if (this.mapping.returnType) {
            return this.mapping.returnType;
        }
        let baseType: GraphQLOutputType;
        if (this.shallow) {
            baseType = this.mapping.rootSource.defaultShallowOutputType;
        } else {
            baseType = this.mapping.rootSource.defaultOutputType;
        }
        if (this.singular) {
            return baseType;
        }
        return GraphQLList(baseType);
    }

    get MappingType(): TMapping {
        throw getTypeAccessorError("MappingType", "MappedOperation");
    }

    get ArgsType(): TArgs {
        throw getTypeAccessorError("ArgsType", "MappedOperation");
    }

    get ResolverContextType(): RCtx<TSrc, TArgs, TMapping> {
        throw getTypeAccessorError("ResolverContextType", "MappedOperation");
    }

    abstract get defaultArgs(): GraphQLFieldConfigArgumentMap;

    abstract defaultResolve(resolverContext: RCtx<TSrc, TArgs, TMapping>): Promise<any>;

    rootQuery(dataSource: TSrc, args: TArgs, aliasHierachyVisitor: AliasHierarchyVisitor): Knex.QueryBuilder {
        if (this.mapping.rootQuery) {
            return this.mapping.rootQuery.call<
                MappedSingleSourceOperation<TSrc, TArgs, TMapping>,
                [TSrc, TArgs, AliasHierarchyVisitor],
                Knex.QueryBuilder
            >(this, dataSource, args, aliasHierachyVisitor);
        }
        return dataSource.rootQueryBuilder(aliasHierachyVisitor);
    }

    /**
     *
     * @param source
     * @param args
     * @param context
     * @param resolveInfo
     * @param resolveInfoVisitor
     */
    @autobind
    async resolve(
        source: any,
        args: TArgs,
        context: any,
        resolveInfo: GraphQLResolveInfo,
        resolveInfoVisitor?: ResolveInfoVisitor<any>,
    ): Promise<any> {
        const resolverContext: RCtx<TSrc, TArgs, TMapping> = new ResolverContext<
            MappedSingleSourceOperation<TSrc, TArgs, TMapping>,
            TSrc,
            TArgs
        >(this, [this.rootSource], source, args, context, resolveInfo, resolveInfoVisitor);
        let result;
        let resolve;
        let resolveId;
        if (this.mapping.resolve) {
            resolve = this.mapping.resolve;
            resolveId = `${this.constructor.name}[mapping][resolve]`;
        } else {
            resolve = this.defaultResolve;
            resolveId = `${this.constructor.name}[defaultResolve]`;
        }
        try {
            result = await resolve(resolverContext);
        } catch (e) {
            console.error(e);
            const error: any = new Error(`${resolveId} faulted`);
            error.originalError = e;
            throw error;
        }
        debug("Resolved result:", result, this.singular);
        return normalizeResultsForSingularity(result, this.singular);
    }
}

type MappedOperationWitness1<
    TSrc extends MappedDataSource,
    TArgs extends {},
    TMapping extends SingleSourceOperationMapping<TSrc, TArgs>
> = ExtendsWitness<MappedSingleSourceOperation<TSrc, TArgs, TMapping>, MappedSingleSourceOperation<TSrc, TArgs, SingleSourceOperationMapping<TSrc, TArgs>>>;
