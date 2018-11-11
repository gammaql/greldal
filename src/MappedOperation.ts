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
import { MappedDataSource, DataSourceMapping } from "./MappedDataSource";
import { assertType } from "./assertions";
import { Maybe, Dict } from "./util-types";
import { transform, first } from "lodash";
import { ioToGraphQLInputType, ioToGraphQLOutputType } from "./graphql-type-mapper";
import { OperationResolver } from "./OperationResolver";
import { getTypeAccessorError } from "./errors";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { MappedAssociation } from "./MappedAssociation";
import { MemoizeGetter } from "./utils";
import { isArray } from "util";

export const OperationMapping = t.type({
    name: t.string,
    description: Maybe(t.string),
    returnType: Maybe(t.Function),
    singular: Maybe(t.boolean),
    shallow: Maybe(t.boolean),
});

export interface OperationMapping<TSrc extends MappedDataSource = MappedDataSource>
    extends t.TypeOf<typeof OperationMapping> {
    rootSource: TSrc;
    returnType: undefined | (() => t.Type<any>);
    rootQuery?: () => Knex.QueryBuilder;
    deriveWhereParams?: (
        this: MappedOperation<OperationMapping<any>>,
        args: Dict,
        association?: MappedAssociation,
    ) => Dict;
    args?: GraphQLFieldConfigArgumentMap;
    resolver: {
        new (
            operation: MappedOperation,
            source: any,
            context: any,
            args: any,
            resolveInfoRoot: GraphQLResolveInfo,
            resolveInfoVisitor?: ResolveInfoVisitor<any>,
        ): OperationResolver;
    };
}

export interface ArgMapping<TMapped extends t.Type<any>> {
    type: TMapped;
    to?: GraphQLInputType;
    description?: string;
    defaultValue?: t.TypeOf<TMapped>;
}

export type MappedOperationArgs<TMapping extends OperationMapping> = Dict;

export class MappedOperation<TMapping extends OperationMapping = any>
    implements GraphQLFieldConfig<any, any> /*, MappedOperationArgs<TMapping>*/ {
    constructor(private mapping: OperationMapping, public opType: "query" | "mutation") {
        assertType(OperationMapping, mapping);
    }

    @MemoizeGetter
    get graphQLOperation() {
        return {
            name: this.name,
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

    @MemoizeGetter
    get type(): GraphQLOutputType {
        if (this.mapping.returnType) {
            return ioToGraphQLOutputType(this.mapping.returnType.apply(this), `${this.name}[type]`);
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

    @MemoizeGetter
    get args(): GraphQLFieldConfigArgumentMap {
        if (this.mapping.args) return this.mapping.args;
        return {
            where: {
                type: GraphQLNonNull(this.rootSource.defaultShallowInputType),
            },
        };
    }

    public deriveWhereParams(args: Dict, association?: MappedAssociation): Dict {
        if (this.mapping.deriveWhereParams) {
            return this.mapping.deriveWhereParams.call(this as any, args, association);
        }
        return args.where;
    }

    @autobind
    async resolve(
        source: any,
        args: any /* MappedOperationArgs<TMapping> */,
        context: any,
        resolveInfo: GraphQLResolveInfo,
        resolveInfoVisitor?: ResolveInfoVisitor<any>,
    ) {
        const Resolver = this.mapping.resolver;
        const resolver: OperationResolver<TMapping["rootSource"] /*, MappedOperationArgs<TMapping>*/> = new Resolver(
            this,
            source,
            context,
            args,
            resolveInfo,
            resolveInfoVisitor,
        );
        const result = await resolver.resolve();
        if (this.singular && isArray(result)) return first(result);
        if (!this.singular && !isArray(result)) return [result];
    }
}

export function mapQuery(mapping: OperationMapping) {
    return new MappedOperation(mapping, "query");
}

export function mapMutation(mapping: OperationMapping) {
    return new MappedOperation(mapping, "mutation");
}
