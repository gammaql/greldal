import { GraphQLFieldConfigArgumentMap, GraphQLList } from "graphql";

import { MappedDataSource } from "./MappedDataSource";
import { MultiSelectionItem } from "./utils/util-types";
import { MappedMultiSourceOperation } from "./MappedMultiSourceOperation";
import { deriveDefaultShallowUnionInputType } from "./graphql-type-mapper";
import * as types from "./utils/types";
import { MultiSourceUnionQueryOperationResolver } from "./MultiSourceUnionQueryOperationResolver";
import { camelCase, upperFirst } from "lodash";
import { SourceAwareOperationResolver } from "./SourceAwareOperationResolver";
import { OperationType } from "./operation-types";

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

    defaultResolver<TResolved>(ctx: any): SourceAwareOperationResolver<any, any, TArgs, TResolved> {
        return new MultiSourceUnionQueryOperationResolver(ctx);
    }

    get defaultArgs(): GraphQLFieldConfigArgumentMap {
        return {
            where: {
                type: deriveDefaultShallowUnionInputType(this.dataSources),
            },
        };
    }

    operationType = OperationType.Query;

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
        const outputType = types.intersection(
            this.outputTypeName,
            this.dataSources.map(d => d.entityTypeSpec),
        );
        if (this.singular) {
            return outputType.graphQLOutputType;
        }
        return GraphQLList(outputType.graphQLOutputType);
    }
}
