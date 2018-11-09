import { GraphQLOutputType, GraphQLList, GraphQLInputType, GraphQLArgumentConfig, GraphQLResolveInfo, GraphQLFieldConfig } from "graphql";
import { autobind } from "core-decorators";
import * as t from "io-ts";
import * as Knex from "knex";
import { MappedDataSource, DataSourceMapping } from "./MappedDataSource";
import { assertType } from "./assertions";
import { Maybe, Dict } from "./util-types";
import { transform } from "lodash";
import { ioToGraphQLInputType, ioToGraphQLOutputType } from "./graphql-type-mapper";
import { Memoize } from "lodash-decorators";
import { OperationResolver } from "./OperationResolver";
import { getTypeAccessorError } from "./errors";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { MappedAssociation } from './MappedAssociation';

export const OperationMapping = t.type({
    name: t.string,
    description: Maybe(t.string),
    returnType: t.Function,
    args: t.any,
    singular: Maybe(t.boolean),
    shallow: Maybe(t.boolean)
});

export interface OperationMapping<TSrc extends MappedDataSource = MappedDataSource> extends t.TypeOf<typeof OperationMapping> {
    rootSource: TSrc;
    returnType: () => t.Type<any>;
    rootQuery?: () => Knex.QueryBuilder;
    deriveWhereParams?: (this: MappedOperation<OperationMapping<any>>, args: Dict, association?: MappedAssociation) => Dict,
    args: { [name: string]: ArgMapping<t.Type<any>> };
    resolver: {
        new(
            operation: MappedOperation,
            source: any,
            context: any,
            args: any,
            resolveInfoRoot: GraphQLResolveInfo,
            resolveInfoVisitor?: ResolveInfoVisitor<any>
        ): OperationResolver
    };
}

export interface ArgMapping<TMapped extends t.Type<any>> {
    type: TMapped;
    to?: GraphQLInputType,
    description?: string;
    defaultValue?: t.TypeOf<TMapped>;
}

export type MappedOperationArgs<TMapping extends OperationMapping> = {
    [K in keyof TMapping["args"]]: t.TypeOf<TMapping["args"][K]["type"]>
}

export class MappedOperation<TMapping extends OperationMapping = any>
    implements GraphQLFieldConfig<any, any, MappedOperationArgs<TMapping>>
{
    constructor(
        private mapping: OperationMapping,
        public opType: "query" | "mutation"
    ) {
        assertType(OperationMapping, mapping);
    }

    get ArgsType(): MappedOperationArgs<TMapping> {
        throw getTypeAccessorError('ArgsType', 'MappedOperation');
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

    @Memoize
    get type() {
        if (this.mapping.returnType) {
            return ioToGraphQLOutputType(
                this.mapping.returnType.apply(this),
                `${this.name}[type]`
            );
        }
        let baseType;
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

    get args() {
        return transform<ArgMapping<any>, GraphQLArgumentConfig>(this.mapping.args, (result, arg, name) => {
            result[name] = {
                type: arg.to ? arg.to : ioToGraphQLInputType(arg.type, `${this.name}[args][${name}]`),
                defaultValue: arg.defaultValue,
                description: arg.description
            };
        }, {})
    }

    public deriveWhereParams(args: Dict, association?: MappedAssociation): Dict {
        if (this.mapping.deriveWhereParams) {
            return this.mapping.deriveWhereParams.call(this, args, association);
        }
        return args.where;
    }

    @autobind
    async resolve(
        source: any,
        args: MappedOperationArgs<TMapping>,
        context: any,
        resolveInfo: GraphQLResolveInfo,
        resolveInfoVisitor?: ResolveInfoVisitor<any>
    ) {
        const Resolver = this.mapping.resolver;
        const resolver: OperationResolver<TMapping["rootSource"], MappedOperationArgs<TMapping>> = 
            new Resolver(this, source, context, args, resolveInfo, resolveInfoVisitor);
        return resolver.resolve();
    }
}

export function mapQuery(mapping: OperationMapping) {
    return new MappedOperation(mapping, "query");
}

export function mapMutation(mapping: OperationMapping) {
    return new MappedOperation(mapping, "mutation");
}
