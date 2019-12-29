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
    abstract operationType: OperationType;
    private interceptors: FieldConfigInterceptor[] = [];
    private interceptedFieldConfig?: GraphQLFieldConfig<any, any, any>;

    constructor(public readonly mapping: OperationMapping<TArgs>) {}

    abstract get defaultArgs(): GraphQLFieldConfigArgumentMap;
    abstract get type(): GraphQLOutputType;
    abstract defaultResolver<TResolved>(ctx: any): OperationResolver<any, TArgs, TResolved>;

    async createResolverContext(
        source: any,
        args: TArgs,
        context: any,
        resolveInfo: GraphQLResolveInfo,
        _resolveInfoVisitor?: MaybePaginatedResolveInfoVisitor<any>,
    ) {
        return new ResolverContext(this, source, args, context, resolveInfo);
    }

    @MemoizeGetter
    get rootFieldConfig(): GraphQLFieldConfig<any, any, TArgs> {
        return {
            description: this.mapping.description,
            args: this.mappedArgs,
            type: this.type,
            resolve: this.resolve.bind(this),
        };
    }

    get fieldConfig(): GraphQLFieldConfig<any, any, any> {
        if (this.interceptedFieldConfig) return this.interceptedFieldConfig;
        let fieldConfig = this.rootFieldConfig;
        for (const intercept of this.interceptors) {
            fieldConfig = intercept.call(this, fieldConfig);
        }
        this.interceptedFieldConfig = fieldConfig;
        return fieldConfig;
    }

    get supportsMultipleDataSources() {
        return false;
    }

    get supportsMultipleResolvers() {
        return false;
    }

    get mappedArgs(): GraphQLFieldConfigArgumentMap {
        if (this.mapping.args) {
            return this.mapping.args.getMappedArgsFor(undefined);
        }
        return this.defaultArgs;
    }

    get name() {
        const { name } = this.mapping;
        return (isString as TypeGuard<string>)(name) ? name : name.mapped;
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

    get ArgsType(): TArgs {
        throw getTypeAccessorError("ArgsType", "MappedOperation");
    }

    intercept(interceptor: FieldConfigInterceptor) {
        this.interceptedFieldConfig = undefined;
        this.interceptors.push(interceptor);
    }

    interceptResolve(interceptor: Interceptor<GraphQLFieldResolver<any, any, TArgs>>) {
        this.intercept(fieldConfig => ({
            ...fieldConfig,
            resolve: (...args) => interceptor(fieldConfig.resolve!)(...args),
        }));
    }

    deriveIndependentlyInterceptable(interceptors = [...this.interceptors]): MappedOperation<TArgs> {
        return Object.create(this, {
            interceptors: {
                value: interceptors,
            },
        });
    }

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
