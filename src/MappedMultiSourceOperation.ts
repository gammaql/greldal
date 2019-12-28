import _debug from "debug";
import { MappedDataSource } from "./MappedDataSource";
import { MultiSelection, MultiSelectionItem, Dict } from "./util-types";
import { MappedAssociation } from "./MappedAssociation";
import { GraphQLResolveInfo } from "graphql";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { MappedSourceAwareOperation } from "./MappedSourceAwareOperation";
import { SourceAwareResolverContext } from "./SourceAwareResolverContext";

export type DataSourceTypes<
    TOp extends MappedMultiSourceOperation<TSrc, TArgs>,
    TSrc extends MappedDataSource,
    TArgs extends {}
> = {
    [K in keyof ReturnType<TOp["mapping"]["dataSources"]>]: ReturnType<
        ReturnType<TOp["mapping"]["dataSources"]>[K]["selection"]
    >;
};

export abstract class MappedMultiSourceOperation<
    TSrc extends MappedDataSource,
    TArgs extends object
> extends MappedSourceAwareOperation<TSrc, TArgs> {
    constructor(
        public readonly mapping: MappedSourceAwareOperation<TSrc, TArgs>["mapping"] & {
            dataSources: <
                TCtx extends SourceAwareResolverContext<MappedMultiSourceOperation<TSrc, TArgs>, TSrc, TArgs>
            >() => MultiSelection<
                TSrc,
                TCtx,
                MultiSelectionItem<TSrc, TCtx> & {
                    deriveWhereParams?: (args: TArgs, association?: MappedAssociation) => Dict;
                }
            >;
        },
    ) {
        super(mapping);
    }

    get supportsMultipleDataSources() {
        return true;
    }

    async createResolverContext(
        source: any,
        args: TArgs,
        context: any,
        resolveInfo: GraphQLResolveInfo,
        resolveInfoVisitor?: ResolveInfoVisitor<any>,
    ): Promise<SourceAwareResolverContext<MappedMultiSourceOperation<TSrc, TArgs>, TSrc, TArgs>> {
        return SourceAwareResolverContext.create(
            this,
            this.mapping.dataSources(),
            source,
            args,
            context,
            resolveInfo,
            resolveInfoVisitor,
        );
    }

    async *iterateDataSources<
        TCtx extends SourceAwareResolverContext<MappedMultiSourceOperation<TSrc, TArgs>, TSrc, TArgs>
    >(resolverContext: TCtx) {
        for (const [key, { shouldUse, ...dataSourceConfig }] of Object.entries(this.mapping.dataSources())) {
            if (!shouldUse || (await shouldUse(resolverContext))) {
                const dataSource = dataSourceConfig.selection();
                yield { key, dataSource, dataSourceConfig };
            }
        }
    }
}
