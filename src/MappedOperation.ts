import { OperationMappingRT } from "./OperationMapping";
import * as t from "io-ts";
import _debug from "debug";
import { MemoizeGetter } from "./utils";
import {
    GraphQLFieldConfig,
    GraphQLFieldConfigArgumentMap,
    GraphQLResolveInfo,
    GraphQLOutputType,
    GraphQLFieldResolver,
} from "graphql";
import { getTypeAccessorError } from "./errors";
import { MappedArgs } from "./MappedArgs";
import { autobind } from "core-decorators";
import { ResolverContext } from "./ResolverContext";
import { Resolver } from "./Resolver";
import { normalizeResultsForSingularity } from "./graphql-type-mapper";
import { MappedExternalOperation } from "./MappedExternalOperation";
import { PaginationConfig } from "./PaginationConfig";
import { Maybe, Interceptor } from "./util-types";
import { MaybePaginatedResolveInfoVisitor } from "./PaginatedResolveInfoVisitor";
import { uniqueId, identity } from 'lodash';

const debug = _debug("greldal:MappedOperation");

type FieldConfigInterceptor = Interceptor<GraphQLFieldConfig<any, any, any>>;

export abstract class MappedOperation<TArgs extends object> implements MappedExternalOperation {
    abstract operationType: "query" | "mutation";
    private interceptors: FieldConfigInterceptor[] = [];
    private interceptedFieldConfig?: GraphQLFieldConfig<any, any, any>;

    constructor(
        public readonly mapping: t.TypeOf<typeof OperationMappingRT> & {
            /**
             * GraphQL return type (or output type) of this operation
             *
             * (Surfaced as-is to GraphQL)
             * (Not used internally by GRelDAL)
             */
            returnType?: GraphQLOutputType;

            /**
             * Mapped operation arguments. This would be obtained by invoking the mapArgs function
             */
            args?: MappedArgs<TArgs>;
            resolver?: <TCtx extends ResolverContext<MappedOperation<TArgs>, any, TArgs>, TResolved>(
                ctx: TCtx,
            ) => Resolver<TCtx, any, TArgs, TResolved>;
            paginate?: PaginationConfig;
        },
    ) {}

    abstract get defaultArgs(): GraphQLFieldConfigArgumentMap;
    abstract get type(): GraphQLOutputType;
    abstract defaultResolver<TResolved>(ctx: any): Resolver<any, any, TArgs, TResolved>;

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

    get paginationConfig(): Maybe<PaginationConfig> {
        return this.mapping.paginate;
    }

    get mappedArgs(): GraphQLFieldConfigArgumentMap {
        if (this.mapping.args) {
            return this.mapping.args.getMappedArgsFor(undefined);
        }
        return this.defaultArgs;
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

    async createResolverContext(
        source: any,
        args: TArgs,
        context: any,
        resolveInfo: GraphQLResolveInfo,
        resolveInfoVisitor?: MaybePaginatedResolveInfoVisitor<any>,
    ): Promise<ResolverContext<any, any, TArgs>> {
        return ResolverContext.create(this, {} as any, source, args, context, resolveInfo, resolveInfoVisitor);
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
        interceptResolver: Interceptor<Resolver<any, any, TArgs, {}>> = identity
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
        return normalizeResultsForSingularity(result, this.singular, !!this.paginationConfig);
    }
}
