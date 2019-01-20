import { GraphQLFieldConfigArgumentMap, GraphQLInputType, GraphQLInputObjectType } from "graphql";

import { MappedDataSource } from "./MappedDataSource";
import { Dict } from "./util-types";
import { MappedMultiSourceOperation } from "./MappedMultiSourceOperation";
import { ioToGraphQLOutputType } from "./graphql-type-mapper";
import * as t from "io-ts";
import { Resolver } from "./Resolver";

/**
 * @api-category MapperClass
 */
export class MappedMultiSourceUnionQueryOperation<
    TSrc extends MappedDataSource,
    TArgs extends {}
> extends MappedMultiSourceOperation<TSrc, TArgs> {
    defaultResolver<TResolved>(ctx: any): Resolver<any, any, TArgs, TResolved> {
        throw new Error("Method not implemented.");
    }
    get defaultArgs(): GraphQLFieldConfigArgumentMap {
        return {
            where: {
                type: new GraphQLInputObjectType({
                    name: this.name,
                    fields: Object.entries(this.mapping.dataSources).reduce(
                        (result: Dict<GraphQLInputType>, [name, dataSource]: [string, MappedDataSource]) => {
                            result[name] = dataSource.defaultShallowInputType;
                            return result;
                        },
                        {},
                    ),
                }),
            },
        };
    }

    opType: "query" = "query";

    get name() {
        return (
            this.mapping.name ||
            `UnionOf(${Object.values(this.mapping.dataSources)
                .map(d => d.name)
                .join(",")})`
        );
    }

    get type() {
        return (
            this.mapping.returnType ||
            ioToGraphQLOutputType(
                Object.values(this.mapping.dataSources).reduce(
                    (result, next) => t.intersection(result, next.EntityType),
                    t.any,
                ),
                this.name,
            )
        );
    }

    resolve(): any {
        throw new Error("Not implemented yet");
    }
}
