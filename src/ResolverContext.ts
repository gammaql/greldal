import { GraphQLResolveInfo } from "graphql";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { MappedDataSource } from "./MappedDataSource";
import { MappedSingleSourceOperation } from "./MappedSingleSourceOperation";
import { Dict } from "./util-types";
import { MemoizeGetter } from "./utils";
import assert from "assert";
import * as Knex from "knex";
import { uniq } from "lodash";
import { getTypeAccessorError } from "./errors";

export class ResolverContext<
    TMappedOperation extends MappedSingleSourceOperation<TDataSource, TGQLArgs> = MappedSingleSourceOperation<TDataSource, TGQLArgs>,
    TDataSource extends MappedDataSource = MappedDataSource,
    TGQLArgs extends {} = Dict,
    TGQLSource = any,
    TGQLContext = any
> {
    constructor(
        public operation: TMappedOperation,
        public dataSources: TDataSource[],
        public source: TGQLSource,
        public args: TGQLArgs,
        public context: TGQLContext,
        public resolveInfoRoot: GraphQLResolveInfo,
        private _resolveInfoVisitor?: ResolveInfoVisitor<TDataSource, any>,
    ) {}

    @MemoizeGetter
    get resolveInfoVisitor(): ResolveInfoVisitor<TDataSource, any> {
        return (
            this._resolveInfoVisitor ||
            new ResolveInfoVisitor<TDataSource, any>(this.resolveInfoRoot, this.operation.rootSource)
        );
    }

    assertSingleSource(contextDescriptor: string) {
        assert(this.dataSources.length === 1, `${contextDescriptor} expects a single data source in resolver context`);
    }

    getOnlySource(contextDescriptor: string) {
        this.assertSingleSource(contextDescriptor);
        return this.dataSources[0];
    }

    get connectors(): Knex[] {
        return uniq(this.dataSources.map(src => src.connector));
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
