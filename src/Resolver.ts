import { ResolverContext } from "./ResolverContext";
import { MappedDataSource } from "./MappedDataSource";
import { MappedOperation } from "./MappedOperation";

export interface Resolver<
    TCtx extends ResolverContext<MappedOperation<TArgs>, TSrc, TArgs>,
    TSrc extends MappedDataSource,
    TArgs extends {},
    TResolved
> {
    resolverContext: TCtx;
    resolve(): Promise<TResolved>;
}
