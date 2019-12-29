import { MappedSourceAwareOperation } from "./MappedSourceAwareOperation";
import * as Knex from "knex";
import { MappedDataSource } from "./MappedDataSource";
import { ResolverContext } from "./ResolverContext";
import { MultiSelection, TypeGuard, Maybe } from "./utils/util-types";
import { GraphQLResolveInfo } from "graphql";
import { isArray, uniq } from "lodash";
import { MaybePaginatedResolveInfoVisitor, PaginatedResolveInfoVisitor } from "./PaginatedResolveInfoVisitor";
import { MemoizeGetter } from "./utils/utils";
import assert = require("assert");
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { getTypeAccessorError } from "./utils/errors";

export class SourceAwareResolverContext<
    TMappedOperation extends MappedSourceAwareOperation<TDataSource, TGQLArgs>,
    TDataSource extends MappedDataSource,
    TGQLArgs extends {},
    TGQLSource = any,
    TGQLContext = any
> extends ResolverContext<TMappedOperation, TGQLArgs, TGQLSource, TGQLContext> {
    static async create<
        TMappedOperation extends MappedSourceAwareOperation<TSrc, TGQLArgs>,
        TSrc extends MappedDataSource,
        TGQLArgs extends {},
        TGQLSource = any,
        TGQLContext = any
    >(
        operation: TMappedOperation,
        dataSources: MultiSelection<TSrc, ResolverContext<TMappedOperation, TGQLArgs, TGQLSource, TGQLContext>>,
        source: TGQLSource,
        args: TGQLArgs,
        context: TGQLContext,
        resolveInfoRoot: GraphQLResolveInfo,
        resolveInfoVisitor?: MaybePaginatedResolveInfoVisitor<TSrc, any>,
    ) {
        const resolverContext = new SourceAwareResolverContext(
            operation,
            dataSources,
            source,
            args,
            context,
            resolveInfoRoot,
            resolveInfoVisitor,
        );
        return resolverContext.init();
    }
    static derive<
        TMappedOperation extends MappedSourceAwareOperation<TDataSource, TGQLArgs>,
        TDataSource extends MappedDataSource,
        TGQLArgs extends {},
        TGQLSource = any,
        TGQLContext = any
    >(
        operation: TMappedOperation,
        dataSources: Array<{ dataSource: TDataSource }>,
        source: TGQLSource,
        args: TGQLArgs,
        context: TGQLContext,
        resolveInfoRoot: GraphQLResolveInfo,
        resolveInfoVisitor?: MaybePaginatedResolveInfoVisitor<TDataSource, any>,
    ) {
        const resolverContext = new SourceAwareResolverContext(
            operation,
            dataSources,
            source,
            args,
            context,
            resolveInfoRoot,
            resolveInfoVisitor,
        );
        return resolverContext;
    }

    readonly selectedDataSources: Array<{ dataSource: TDataSource }> = [];

    private constructor(
        public operation: TMappedOperation,
        private dataSources:
            | MultiSelection<
                  TDataSource,
                  SourceAwareResolverContext<TMappedOperation, TDataSource, TGQLArgs, TGQLSource, TGQLContext>
              >
            | Array<{ dataSource: TDataSource }>,
        public source: TGQLSource,
        public args: TGQLArgs,
        public context: TGQLContext,
        public resolveInfoRoot: GraphQLResolveInfo,
        private _resolveInfoVisitor?: MaybePaginatedResolveInfoVisitor<TDataSource, any>,
    ) {
        super(operation, source, args, context, resolveInfoRoot);
        if ((isArray as TypeGuard<Array<{ dataSource: TDataSource }>>)(this.dataSources)) {
            this.selectedDataSources.push(...this.dataSources);
        }
    }

    async init() {
        await this.identifySelectedDataSources();
        return this;
    }

    private async identifySelectedDataSources() {
        assert(this.selectedDataSources.length === 0, "Applicable data sources have already been identified");
        for (const [, { selection, shouldUse, ...restParams }] of Object.entries(this.dataSources)) {
            if (!shouldUse || (await shouldUse(this))) {
                this.selectedDataSources.push({
                    dataSource: selection(),
                    ...restParams,
                });
                if (!this.operation.supportsMultipleDataSources) break;
            }
        }
        Object.freeze(this.selectedDataSources);
    }

    get primaryDataSource() {
        const numSources = this.selectedDataSources.length;
        if (numSources === 1) {
            return this.selectedDataSources[0].dataSource;
        }
        if (numSources == 0) {
            throw new Error("No dataSources available");
        }
        throw new Error(`Cannot identify singular primary data source among ${numSources} selected`);
    }

    @MemoizeGetter
    get primaryPaginatedResolveInfoVisitor(): Maybe<PaginatedResolveInfoVisitor<TDataSource, any>> {
        if (!this.operation.paginationConfig) return null;
        if (this._resolveInfoVisitor) {
            if (!(this._resolveInfoVisitor instanceof PaginatedResolveInfoVisitor)) {
                throw new Error("Expected provided resolveInfoVisitor to be instance of PaginatedResolveInfoVisitor");
            }
            return this._resolveInfoVisitor;
        }
        return new PaginatedResolveInfoVisitor(this.resolveInfoRoot, this.primaryDataSource);
    }

    @MemoizeGetter
    get primaryResolveInfoVisitor(): ResolveInfoVisitor<TDataSource, any> {
        if (this.operation.paginationConfig) {
            return this.primaryPaginatedResolveInfoVisitor!.visitPage();
        }
        if (this._resolveInfoVisitor) {
            if (!(this._resolveInfoVisitor instanceof ResolveInfoVisitor)) {
                throw new Error("Expected provided resolveInfoVisitor to be instance of ResolveInfoVisitor");
            }
            return this._resolveInfoVisitor;
        }
        return new ResolveInfoVisitor<TDataSource, any>(this.resolveInfoRoot, this.primaryDataSource);
    }

    get connectors(): Knex[] {
        return uniq(this.selectedDataSources.map(({ dataSource }) => dataSource.connector));
    }

    get DataSourceType(): TDataSource {
        throw getTypeAccessorError("DataSourceType", "ResolverContext");
    }
}
