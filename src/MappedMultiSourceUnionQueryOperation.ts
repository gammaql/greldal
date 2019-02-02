import { GraphQLFieldConfigArgumentMap, GraphQLList } from "graphql";

import { MappedDataSource } from "./MappedDataSource";
import { MultiSelectionItem, Maybe } from "./util-types";
import { MappedMultiSourceOperation } from "./MappedMultiSourceOperation";
import { ioToGraphQLOutputType, deriveDefaultShallowUnionInputType } from "./graphql-type-mapper";
import * as t from "io-ts";
import { Resolver } from "./Resolver";
import { MultiSourceUnionQueryOperationResolver } from "./MultiSourceUnionQueryOperationResolver";
import { camelCase, upperFirst } from "lodash";

/**
 * @api-category MapperClass
 */
export class MappedMultiSourceUnionQueryOperation<
    TSrc extends MappedDataSource,
    TArgs extends {}
> extends MappedMultiSourceOperation<TSrc, TArgs> {
    constructor(
        public mapping: MappedMultiSourceOperation<TSrc, TArgs>["mapping"] & {
            unionMode: "union" | "unionAll";
        },
    ) {
        super(mapping);
    }

    defaultResolver<TResolved>(ctx: any): Resolver<any, any, TArgs, TResolved> {
        return new MultiSourceUnionQueryOperationResolver(ctx);
    }

    get defaultArgs(): GraphQLFieldConfigArgumentMap {
        return {
            where: {
                type: deriveDefaultShallowUnionInputType(this.dataSources),
            },
        };
    }

    operationType: "query" = "query";

    get dataSources() {
        return Object.values(this.mapping.dataSources()).map((d: MultiSelectionItem<MappedDataSource, any>) =>
            d.selection(),
        );
    }

    get name() {
        return (
            this.mapping.name ||
            `UnionOf${Object.keys(this.mapping.dataSources())
                .map(k => upperFirst(camelCase(k)))
                .join("And")})`
        );
    }

    get outputTypeName() {
        return `${this.name}Output`;
    }

    get type() {
        if (this.mapping.returnType) {
            return this.mapping.returnType;
        }
        const outputType = ioToGraphQLOutputType(
            this.dataSources.reduce(
                (result: Maybe<t.Mixed>, next: MappedDataSource) =>
                    result ? t.intersection<t.Mixed, t.Mixed>([result, next.entityType]) : next.entityType,
                undefined,
            )!,
            this.name,
            this.outputTypeName,
        );
        if (this.singular) {
            return outputType;
        }
        return GraphQLList(outputType);
    }
}
