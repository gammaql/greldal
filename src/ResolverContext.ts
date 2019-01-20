import { GraphQLResolveInfo } from "graphql";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { MappedDataSource } from "./MappedDataSource";
import { Dict, MultiSelection, TypeGuard } from "./util-types";
import { MemoizeGetter } from "./utils";
import assert from "assert";
import * as Knex from "knex";
import { uniq, isArray } from "lodash";
import { getTypeAccessorError } from "./errors";
import { MappedOperation } from "./MappedOperation";

export class ResolverContext<
    TMappedOperation extends MappedOperation<TGQLArgs>,
    TDataSource extends MappedDataSource | never,
    TGQLArgs extends {},
    TGQLSource = any,
    TGQLContext = any
> {
    static async create<
        TMappedOperation extends MappedOperation<TGQLArgs>,
        TDataSource extends MappedDataSource,
        TGQLArgs extends {},
        TGQLSource = any,
        TGQLContext = any
    >(
        operation: TMappedOperation,
        dataSources: MultiSelection<
            TDataSource,
            ResolverContext<TMappedOperation, TDataSource, TGQLArgs, TGQLSource, TGQLContext>
        >,
        source: TGQLSource,
        args: TGQLArgs,
        context: TGQLContext,
        resolveInfoRoot: GraphQLResolveInfo,
        resolveInfoVisitor?: ResolveInfoVisitor<TDataSource, any>,
    ) {
        const resolverContext = new ResolverContext<TMappedOperation, TDataSource, TGQLArgs, TGQLSource, TGQLContext>(
            operation,
            dataSources,
            source,
            args,
            context,
            resolveInfoRoot,
            resolveInfoVisitor,
        );
        await resolverContext.init();
        return resolverContext;
    }

    static derive<
        TMappedOperation extends MappedOperation<TGQLArgs>,
        TDataSource extends MappedDataSource,
        TGQLArgs extends {} = Dict,
        TGQLSource = any,
        TGQLContext = any
    >(
        operation: TMappedOperation,
        dataSources: Array<{ dataSource: TDataSource }>,
        source: TGQLSource,
        args: TGQLArgs,
        context: TGQLContext,
        resolveInfoRoot: GraphQLResolveInfo,
        resolveInfoVisitor?: ResolveInfoVisitor<TDataSource, any>,
    ) {
        return new ResolverContext<TMappedOperation, TDataSource, TGQLArgs, TGQLSource, TGQLContext>(
            operation,
            dataSources,
            source,
            args,
            context,
            resolveInfoRoot,
            resolveInfoVisitor,
        );
    }

    private constructor(
        public operation: TMappedOperation,
        private dataSources:
            | MultiSelection<
                  TDataSource,
                  ResolverContext<TMappedOperation, TDataSource, TGQLArgs, TGQLSource, TGQLContext>
              >
            | Array<{ dataSource: TDataSource }>,
        public source: TGQLSource,
        public args: TGQLArgs,
        public context: TGQLContext,
        public resolveInfoRoot: GraphQLResolveInfo,
        private _resolveInfoVisitor?: ResolveInfoVisitor<TDataSource, any>,
    ) {
        if ((isArray as TypeGuard<Array<{ dataSource: TDataSource }>>)(this.dataSources)) {
            this.selectedDataSources.push(...this.dataSources);
        }
    }

    readonly selectedDataSources: Array<{ dataSource: TDataSource }> = [];

    async init() {
        await this.identifySelectedDataSources();
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
    get primaryResolveInfoVisitor(): ResolveInfoVisitor<TDataSource, any> {
        return (
            this._resolveInfoVisitor ||
            new ResolveInfoVisitor<TDataSource, any>(this.resolveInfoRoot, this.primaryDataSource)
        );
    }

    get connectors(): Knex[] {
        return uniq(this.selectedDataSources.map(({ dataSource }) => dataSource.connector));
    }

    get DataSourceType(): TDataSource {
        throw getTypeAccessorError("DataSourceType", "ResolverContext");
    }

    get GQLArgsType(): TGQLArgs {
        throw getTypeAccessorError("GQLArgsType", "ResolverContext");
    }

    get GQLSourceType(): TGQLSource {
        throw getTypeAccessorError("GQLSourceType", "ResolverContext");
    }

    get GQLContextType(): TGQLContext {
        throw getTypeAccessorError("GQLContextType", "ResolverContext");
    }

    get MappedOperationType(): TMappedOperation {
        throw getTypeAccessorError("MappedOperationType", "ResolverContext");
    }
}
