import { autobind } from "core-decorators";
import _debug from "debug";
import {
    GraphQLFieldConfig,
    GraphQLFieldConfigArgumentMap,
    GraphQLFieldResolver,
    GraphQLOutputType,
    GraphQLResolveInfo,
} from "graphql";
import { identity, uniqueId, isString } from "lodash";
import { getTypeAccessorError } from "./utils/errors";
import { normalizeResultsForSingularity } from "./graphql-type-mapper";
import { Operation } from "./Operation";
import { OperationMapping } from "./OperationMapping";
import { OperationResolver } from "./OperationResolver";
import { MaybePaginatedResolveInfoVisitor } from "./PaginatedResolveInfoVisitor";
import { ResolverContext } from "./ResolverContext";
import { Interceptor, TypeGuard } from "./utils/util-types";
import { MemoizeGetter } from "./utils/utils";
import { OperationType } from "./operation-types";

const debug = _debug("greldal:MappedOperation");

type FieldConfigInterceptor = Interceptor<GraphQLFieldConfig<any, any, any>>;

/**
 * Base class for operations that interact with one or more GRelDAL data sources.
 */
export abstract class MappedOperation<TArgs extends {}> implements Operation {
    /**
     * Distinguishes whether the operation is a query, mutation or subscription
     */
    abstract operationType: OperationType;

    /**
     * Currently attached operation interceptors
     */
    private interceptors: FieldConfigInterceptor[] = [];

    private interceptedFieldConfig?: GraphQLFieldConfig<any, any, any>;

    constructor(public readonly mapping: OperationMapping<TArgs>) {}

    /**
     * Default argument mapping for operation
     *
     * Can be overriden in Operation mapping configuration.
     */
    abstract get defaultArgs(): GraphQLFieldConfigArgumentMap;

    /**
     * GraphQL output type for the result of the operation
     */
    abstract get type(): GraphQLOutputType;

    /**
     * Retrieve default resolver for the operation.
     *
     * A resolver specified in operation mapping will take precedence
     */
    abstract defaultResolver<TResolved>(ctx: any): OperationResolver<any, TArgs, TResolved>;

    /**
     * Construct resolver context used to instantiate the resolver
     */
    async createResolverContext(
        source: any,
        args: TArgs,
        context: any,
        resolveInfo: GraphQLResolveInfo,
        _resolveInfoVisitor?: MaybePaginatedResolveInfoVisitor<any>,
    ) {
        return new ResolverContext(this, source, args, context, resolveInfo);
    }

    /**
     * GraphQL field configuration used to expose the operation.
     *
     * This field configuration can be intercepted through a chain of
     * interceptors before it surfaces to the GraphQL API.
     */
    @MemoizeGetter
    get rootFieldConfig(): GraphQLFieldConfig<any, any, TArgs> {
        return {
            description: this.mapping.description,
            args: this.mappedArgs,
            type: this.type,
            resolve: this.resolve.bind(this),
        };
    }

    /**
     * Get final field config after passing the root field configuration
     * through a chain of interceptors
     */
    get fieldConfig(): GraphQLFieldConfig<any, any, any> {
        if (this.interceptedFieldConfig) return this.interceptedFieldConfig;
        let fieldConfig = this.rootFieldConfig;
        for (const intercept of this.interceptors) {
            fieldConfig = intercept.call(this, fieldConfig);
        }
        this.interceptedFieldConfig = fieldConfig;
        return fieldConfig;
    }

    /**
     * Whether the operation interacts with multiple data sources
     */
    get supportsMultipleDataSources() {
        return false;
    }

    /**
     * Whether multiple resolvers are supported
     */
    get supportsMultipleResolvers() {
        return false;
    }

    /**
     * Mapped argument specifications for the operation
     */
    get mappedArgs(): GraphQLFieldConfigArgumentMap {
        if (this.mapping.args) {
            return this.mapping.args.getMappedArgsFor(undefined);
        }
        return this.defaultArgs;
    }

    /**
     * Name of operation
     */
    get name() {
        const { name } = this.mapping;
        return (isString as TypeGuard<string>)(name) ? name : name.mapped;
    }

    /**
     * Whether the operation reaches into connected entities through associations
     */
    get shallow() {
        return this.mapping.shallow === true;
    }

    /**
     * Whether the operation resolves to a single entity
     */
    get singular() {
        return this.mapping.singular !== false;
    }

    /**
     * Mapped arguments for the operation
     */
    get args() {
        return this.mapping.args;
    }

    /**
     * Getter to obtain the Type of arguments at type level.
     *
     * Throws if invoked at runtime.
     */
    get ArgsType(): TArgs {
        throw getTypeAccessorError("ArgsType", "MappedOperation");
    }

    /**
     * Attach an interceptor to the current queue of interceptors.
     *
     * Interceptors can transform how the operation is handled. They can change
     * the arguments, add validations, log results before or after resolution
     * or entirely bypass the downstream resolution flow.
     *
     * @param interceptor A function that receives the current field configuration
     *     and returns a new field configuration.
     */
    intercept(interceptor: FieldConfigInterceptor) {
        this.interceptedFieldConfig = undefined;
        this.interceptors.push(interceptor);
    }

    /**
     * Intercept operation resolution with a higher order function.
     *
     * Essentially a convenience wrapper over intercept for the common case when
     * we care about intercepting just the resolver and not the complete field configuration.
     *
     * @param interceptor A function that receives the current resolver and returns
     *    a new resolver which will be called when the operation is invoked.
     *
     *    It is the responsibility of interceptor to invoke the received (old) resolver
     *    unless a complete bypass is intended.
     */
    interceptResolve(interceptor: Interceptor<GraphQLFieldResolver<any, any, TArgs>>) {
        this.intercept(fieldConfig => ({
            ...fieldConfig,
            resolve: (...args) => interceptor(fieldConfig.resolve!)(...args),
        }));
    }

    /**
     * Clone the operation with an independent queue of interceptors
     *
     * Unless list of interceptors is specified, the cloned operation will inherit
     * current queue of interceptors.
     */
    deriveIndependentlyInterceptable(interceptors = [...this.interceptors]): MappedOperation<TArgs> {
        return Object.create(this, {
            interceptors: {
                value: interceptors,
            },
        });
    }

    /**
     * Retrieve resolver for the operation.
     *
     * This will typically be the default resolver for the operation, but
     * can be overriden in the operation mapping
     */
    getResolver(resolverContext: ResolverContext<MappedOperation<TArgs>, any, TArgs>) {
        if (this.mapping.resolver) {
            return {
                resolver: this.mapping.resolver.call(this, resolverContext),
                resolverId: `${this.constructor.name}[mapping][resolve]`,
            };
        } else {
            return {
                resolver: this.defaultResolver(resolverContext),
                resolverId: `${this.constructor.name}[defaultResolve]`,
            };
        }
    }

    /**
     * Wrap result in array if we are supposed to return multiple values.
     * Unwrap result array if singular result is expected.
     *
     * This enables us to write resolvers (esp. those that will only ever return
     * a single entity) that don't care whether result is singular or plural.
     */
    normalizeResultsForSingularity(result: any) {
        return normalizeResultsForSingularity(result, this.singular, false);
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
        resolveInfoVisitor?: MaybePaginatedResolveInfoVisitor<any>,
        interceptResolver: Interceptor<OperationResolver<any, TArgs, any>> = identity,
    ): Promise<any> {
        const resolverContext = await this.createResolverContext(
            source,
            args,
            context,
            resolveInfo,
            resolveInfoVisitor,
        );
        let result;
        let { resolver, resolverId } = this.getResolver(resolverContext);
        resolver = interceptResolver(resolver) || resolver;
        try {
            result = await resolver.resolve();
        } catch (e) {
            const errorId = uniqueId("GRelDAL:ResolverError:");
            console.error(`[${errorId}]`, e);
            const error: any = new Error(`[${errorId}] ${resolverId} faulted`);
            error.originalError = e;
            throw error;
        }
        debug("Resolved result:", result, this.singular);
        const normalizedResult = this.normalizeResultsForSingularity(result);
        debug("Normalized result:", normalizedResult);
        return normalizedResult;
    }
}
