import _debug from "debug";
import { MappedDataSource } from "./MappedDataSource";
import { MappedOperation } from "./MappedOperation";
import { ResolverContext } from "./ResolverContext";
import { MultiSelection, MultiSelectionItem, Dict } from "./util-types";
import { MappedAssociation } from "./MappedAssociation";

export abstract class MappedMultiSourceOperation<
    TSrc extends MappedDataSource,
    TArgs extends object
> extends MappedOperation<TArgs> {
    constructor(
        public readonly mapping: MappedOperation<TArgs>["mapping"] & {
            dataSources: <
                TCtx extends ResolverContext<MappedMultiSourceOperation<TSrc, TArgs>, TSrc, TArgs>
            >() => MultiSelection<TSrc, TCtx, MultiSelectionItem<TSrc, TCtx> & {
                deriveWhereParams?: (args: TArgs, association?: MappedAssociation) => Dict;
            }>;
        },
    ) {
        super(mapping);
    }
}
