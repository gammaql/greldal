import * as Knex from "knex";

import { identity } from "lodash";
import { MappedMultiSourceUnionQueryOperation } from "./MappedMultiSourceUnionQueryOperation";
import { MappedDataSource } from "./MappedDataSource";
import { SourceAwareOperationResolver } from "./SourceAwareOperationResolver";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { Dict } from "./util-types";
import { DataSourceTypes, MappedMultiSourceOperation } from "./MappedMultiSourceOperation";
import { StoreQueryParams, SingleSourceQueryOperationResolver } from "./SingleSourceQueryOperationResolver";
import { MappedSingleSourceQueryOperation } from "./MappedSingleSourceQueryOperation";
import { ReverseMapper } from "./ReverseMapper";
import { SourceAwareResolverContext } from "./SourceAwareResolverContext";

export type MultiStoreParams<
    TOp extends MappedMultiSourceOperation<TSrc, TArgs>,
    TSrc extends MappedDataSource,
    TArgs extends {}
> = { [K in keyof DataSourceTypes<TOp, TSrc, TArgs>]: StoreQueryParams<DataSourceTypes<TOp, TSrc, TArgs>[K]> };

export class MultiSourceUnionQueryOperationResolver<
    TCtx extends SourceAwareResolverContext<MappedMultiSourceUnionQueryOperation<TSrc, TArgs>, TSrc, TArgs>,
    TSrc extends MappedDataSource,
    TArgs extends {},
    TResolved
> extends SourceAwareOperationResolver<TCtx, TSrc, TArgs, TResolved> {
    constructor(public resolverContext: TCtx) {
        super(resolverContext);
    }
    get operation(): MappedMultiSourceUnionQueryOperation<TSrc, TArgs> {
        return this.resolverContext.operation;
    }
    async resolve(): Promise<TResolved> {
        let queryBuilder: Knex.QueryBuilder;
        const aliasHierarchyVisitor = new AliasHierarchyVisitor();
        aliasHierarchyVisitor.createAlias = identity;
        const resolvers: Dict<
            SingleSourceQueryOperationResolver<
                SourceAwareResolverContext<MappedSingleSourceQueryOperation<TSrc, TArgs>, TSrc, TArgs, any, any>,
                TSrc,
                any,
                TArgs,
                any
            >
        > = {};
        return this.wrapInTransaction(async () => {
            for await (const { key, dataSource, dataSourceConfig } of this.resolverContext.operation.iterateDataSources<
                SourceAwareResolverContext<MappedMultiSourceUnionQueryOperation<any, TArgs>, TSrc, TArgs, any, any>
            >(this.resolverContext)) {
                const { resolver: _oldResolver, ...mapping } = this.operation.mapping;
                const deriveWhereParams: any = dataSourceConfig.deriveWhereParams;
                const subVisitor = aliasHierarchyVisitor.visit(dataSource.storedName);
                const operation = new MappedSingleSourceQueryOperation<typeof dataSource, TArgs>({
                    ...mapping,
                    deriveWhereParams,
                    rootSource: dataSource,
                });
                const resolverContext = SourceAwareResolverContext.derive(
                    operation,
                    [{ dataSource }],
                    this.resolverContext.source,
                    this.resolverContext.args,
                    this.resolverContext.context,
                    this.resolverContext.resolveInfoRoot,
                );
                const resolver = new SingleSourceQueryOperationResolver<
                    typeof resolverContext,
                    TSrc,
                    typeof operation,
                    TArgs,
                    any
                >(resolverContext);
                resolver.isDelegated = true;
                resolver.activeTransaction = this.activeTransaction;
                resolver.aliasColumnsToTableScope = false;
                resolvers[key] = resolver;
                await resolver.resolveFields(
                    [],
                    subVisitor,
                    dataSource,
                    resolverContext.primaryResolveInfoVisitor,
                    this.operation.outputTypeName,
                    true,
                );
            }
            const resolverEntries = Object.entries(resolvers);

            for (const [key, resolver] of resolverEntries) {
                const { rootSource } = resolver.operation;
                const subVisitor = aliasHierarchyVisitor.visit(rootSource.storedName);
                if (!queryBuilder) {
                    queryBuilder = rootSource.rootQueryBuilder(subVisitor).transacting(this.activeTransaction!);
                    this.applyStoreQueryParamsFrom(resolver, queryBuilder);
                } else {
                    const _this = this;
                    queryBuilder[this.operation.mapping.unionMode](function() {
                        _this.applyStoreQueryParamsFrom(
                            resolver,
                            this.from(`${rootSource.storedName} as ${subVisitor.alias}`),
                        );
                    });
                }
            }
            if (this.operation.singular) queryBuilder.limit(1);
            const rows = await queryBuilder;
            const reverseMapper = new ReverseMapper(
                resolverEntries.reduce(
                    (
                        result,
                        [
                            ,
                            {
                                storeParams: { columns, primaryMappers, secondaryMappers },
                            },
                        ],
                    ) => {
                        result.columns.push(...columns);
                        result.primaryMappers.push(...primaryMappers);
                        result.secondaryMappers.preFetched.push(...secondaryMappers.preFetched);
                        result.secondaryMappers.postFetched.push(...secondaryMappers.postFetched);
                        return result;
                    },
                    {
                        whereParams: {},
                        queryBuilder,
                        columns: [],
                        primaryMappers: [],
                        secondaryMappers: {
                            preFetched: [],
                            postFetched: [],
                        },
                    } as StoreQueryParams<TSrc>,
                ),
            );
            const entities: any = await reverseMapper.reverseMap(rows);
            return entities;
        });
    }

    private applyStoreQueryParamsFrom(
        resolver: SingleSourceQueryOperationResolver<
            SourceAwareResolverContext<MappedSingleSourceQueryOperation<TSrc, TArgs>, TSrc, TArgs, any, any>,
            TSrc,
            any,
            TArgs,
            any
        >,
        queryBuilder: Knex.QueryBuilder,
    ) {
        resolver.resolverContext.operation
            .interceptQueryByArgs(queryBuilder.where(resolver.storeParams.whereParams), resolver.args)
            .columns(resolver.storeParams.columns);
    }
}
