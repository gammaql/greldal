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
import { OperationResolver } from "./OperationResolver";
import { getTypeAccessorError } from "./errors";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { MemoizeGetter } from "./utils";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { OperationMapping } from "./OperationMapping";

const debug = _debug("greldal:MappedOperation");

/**
 * @api-category MapperClass
 */
export abstract class MappedOperation<
    TSrc extends MappedDataSource,
    TArgs extends object,
    TMapping extends OperationMapping<TSrc, TArgs> = OperationMapping<TSrc, TArgs>
> {
    constructor(public readonly mapping: TMapping) {
        assertType(OperationMapping, mapping, `Operation configuration: ${mapping.name}`);
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

    get ArgsType(): TArgs {
        throw getTypeAccessorError("ArgsType", "MappedOperation");
    }

    abstract get defaultArgs(): GraphQLFieldConfigArgumentMap;

    abstract defaultResolver(
        source: any,
        context: any,
        args: TArgs,
        resolveInfoRoot: GraphQLResolveInfo,
        resolveInfoVisitor?: ResolveInfoVisitor<any>,
    ): OperationResolver<TSrc, TArgs, TMapping>;

    rootQuery(args: TArgs, aliasHierachyVisitor: AliasHierarchyVisitor): Knex.QueryBuilder {
        if (this.mapping.rootQuery) {
            return this.mapping.rootQuery.call<
                MappedOperation<TSrc, TArgs, TMapping>,
                [TArgs, AliasHierarchyVisitor],
                Knex.QueryBuilder
            >(this, args, aliasHierachyVisitor);
        }
        return this.rootSource.rootQueryBuilder(aliasHierachyVisitor);
    }

    @autobind
    async resolve(
        source: any,
        args: TArgs,
        context: any,
        resolveInfo: GraphQLResolveInfo,
        resolveInfoVisitor?: ResolveInfoVisitor<any>,
    ) {
        let resolver: OperationResolver<TSrc, TArgs, TMapping, TArgs>;
        if (this.mapping.resolver) {
            resolver = this.mapping.resolver<TMapping>(this, source, context, args, resolveInfo, resolveInfoVisitor);
        } else {
            resolver = this.defaultResolver(source, context, args, resolveInfo, resolveInfoVisitor);
        }
        let result;
        try {
            result = await resolver.resolve();
        } catch (e) {
            console.error(e);
            const error: any = new Error(`${resolver.constructor.name || "resolver"} faulted`);
            error.originalError = e;
            throw error;
        }
        debug("Resolved result:", result, this.singular);
        return normalizeResultsForSingularity(result, this.singular);
    }
}
