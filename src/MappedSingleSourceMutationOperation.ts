import { noop } from "lodash";

import { MappedSingleSourceOperation } from "./MappedSingleSourceOperation";
import { MappedDataSource } from "./MappedDataSource";
import { SourceAwareOperationResolver } from "./SourceAwareOperationResolver";
import { Dict } from "./util-types";
import { SourceAwareResolverContext } from "./SourceAwareResolverContext";

export interface MutationPublishPayload {
    source: string;
    type: "INSERT" | "UPDATE" | "DELETE";
    primary: Dict[];
}

/**
 * @api-category MapperClass
 */
export abstract class MappedSingleSourceMutationOperation<
    TSrc extends MappedDataSource,
    TArgs extends {}
> extends MappedSingleSourceOperation<TSrc, TArgs> {
    constructor(
        public mapping: MappedSingleSourceOperation<TSrc, TArgs>["mapping"] & {
            resolver?: <
                TCtx extends SourceAwareResolverContext<MappedSingleSourceMutationOperation<TSrc, TArgs>, TSrc, TArgs>,
                TResolved
            >(
                ctx: TCtx,
            ) => SourceAwareOperationResolver<TCtx, TSrc, TArgs, TResolved>;
            publish?: (payload: MutationPublishPayload) => void;
        },
    ) {
        super(mapping);
    }
    operationType: "mutation" = "mutation";

    get publish() {
        return this.mapping.publish || noop;
    }
}
