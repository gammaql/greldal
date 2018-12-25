import {
    GraphQLOutputType,
    GraphQLList,
    GraphQLInputType,
    GraphQLResolveInfo,
    GraphQLFieldConfig,
    GraphQLFieldConfigArgumentMap,
} from "graphql";
import { autobind } from "core-decorators";
import * as t from "io-ts";
import * as Knex from "knex";
import _debug from "debug";
import { MappedDataSource } from "./MappedDataSource";
import { assertType } from "./assertions";
import { Maybe, Dict } from "./util-types";
import { normalizeResultsForSingularity } from "./graphql-type-mapper";
import { OperationResolver } from "./OperationResolver";
import { getTypeAccessorError } from "./errors";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { MappedAssociation } from "./MappedAssociation";
import { MemoizeGetter } from "./utils";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";

const debug = _debug("greldal:MappedOperation");

export const OperationMapping = t.intersection([
    t.type({
        name: t.string,
    }),
    t.partial({
        description: t.string,
        singular: t.boolean,
        shallow: t.boolean,
        rootQuery: t.Function,
        deriveWhereParams: t.Function
    })
])

export interface OperationResolverClass {
    new (
        operation: MappedOperation,
        source: any,
        context: any,
        args: any,
        resolveInfoRoot: GraphQLResolveInfo,
        resolveInfoVisitor?: ResolveInfoVisitor<any>,
    ): OperationResolver;
}

export interface OperationMapping<TSrc extends MappedDataSource = MappedDataSource>
    extends t.TypeOf<typeof OperationMapping> {
    rootSource: TSrc;
    returnType?: GraphQLOutputType;
    rootQuery?: (
        this: MappedOperation<OperationMapping<any>>,
        args: Dict,
        aliasHierarchyVisitor: AliasHierarchyVisitor,
    ) => Knex.QueryBuilder;
    deriveWhereParams?: (
        this: MappedOperation<OperationMapping<any>>,
        args: Dict,
        association?: MappedAssociation,
    ) => Dict;
    args?: GraphQLFieldConfigArgumentMap;
    resolver?: OperationResolverClass;
}

export interface ArgMapping<TMapped extends t.Type<any>> {
    type: TMapped;
    to?: GraphQLInputType;
    description?: string;
    defaultValue?: t.TypeOf<TMapped>;
}

export type MappedOperationArgs<T> = Dict;

export abstract class MappedOperation<TMapping extends OperationMapping = any> {
    constructor(protected mapping: OperationMapping) {
        assertType(OperationMapping, mapping);
    }

    abstract opType: "query" | "mutation";

    @MemoizeGetter
    get graphQLOperation(): GraphQLFieldConfig<any, any> {
        return {
            description: this.mapping.description,
            args: this.args,
            type: this.type,
            resolve: this.resolve.bind(this),
        };
    }

    get ArgsType(): MappedOperationArgs<TMapping> {
        throw getTypeAccessorError("ArgsType", "MappedOperation");
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

    get args(): GraphQLFieldConfigArgumentMap {
        if (this.mapping.args) return this.mapping.args;
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

    abstract get defaultArgs(): GraphQLFieldConfigArgumentMap;

    abstract defaultResolver: OperationResolverClass;

    rootQuery(args: Dict, aliasHierachyVisitor: AliasHierarchyVisitor): Knex.QueryBuilder {
        if (this.mapping.rootQuery) {
            return this.mapping.rootQuery.call(this, args, aliasHierachyVisitor);
        }
        return this.rootSource.rootQuery(aliasHierachyVisitor);
    }

    @autobind
    async resolve(
        source: any,
        args: MappedOperationArgs<TMapping>,
        context: any,
        resolveInfo: GraphQLResolveInfo,
        resolveInfoVisitor?: ResolveInfoVisitor<any>,
    ) {
        const Resolver = this.mapping.resolver || this.defaultResolver;
        const resolver: OperationResolver<TMapping["rootSource"], MappedOperationArgs<TMapping>> = new Resolver(
            this,
            source,
            context,
            args,
            resolveInfo,
            resolveInfoVisitor,
        );
        const result = await resolver.resolve();
        debug("Resolved result:", result, this.singular);
        return normalizeResultsForSingularity(result, this.singular);
    }

    public deriveWhereParams(args: Dict, association?: MappedAssociation): Dict {
        if (this.mapping.deriveWhereParams) {
            return this.mapping.deriveWhereParams.call(this as any, args, association);
        }
        return args.where;
    }
}
