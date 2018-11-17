import {
    GraphQLOutputType,
    GraphQLList,
    GraphQLInputType,
    GraphQLArgumentConfig,
    GraphQLResolveInfo,
    GraphQLFieldConfig,
    GraphQLFieldConfigArgumentMap,
    GraphQLInputObjectType,
    GraphQLNonNull,
} from "graphql";
import { autobind } from "core-decorators";
import * as t from "io-ts";
import * as Knex from "knex";
import _debug from "debug";
import { MappedDataSource, DataSourceMapping } from "./MappedDataSource";
import { assertType } from "./assertions";
import { Maybe, Dict } from "./util-types";
import { transform, first, isNil } from "lodash";
import { ioToGraphQLInputType, ioToGraphQLOutputType } from "./graphql-type-mapper";
import { OperationResolver } from "./OperationResolver";
import { getTypeAccessorError, expectedOverride } from "./errors";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { MappedAssociation } from "./MappedAssociation";
import { MemoizeGetter } from "./utils";
import { isArray } from "util";
import { MappedQueryOperation } from "./MappedQueryOperation";

const debug = _debug("greldal:MappedOperation");

export const OperationMapping = t.type({
    name: t.string,
    description: Maybe(t.string),
    singular: Maybe(t.boolean),
    shallow: Maybe(t.boolean),
});

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
    rootQuery?: () => Knex.QueryBuilder;
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

export type MappedOperationArgs<TMapping extends OperationMapping> = Dict;

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
        if (this.singular) {
            if (isArray(result)) return first(result);
        } else {
            if (!isArray(result)) return [result];
            if (isNil(result)) return [];
        }
        return result;
    }

    public deriveWhereParams(args: Dict, association?: MappedAssociation): Dict {
        if (this.mapping.deriveWhereParams) {
            return this.mapping.deriveWhereParams.call(this as any, args, association);
        }
        return args.where;
    }
}
