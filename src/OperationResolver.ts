import { ResolverContext } from "./ResolverContext";
import { MappedOperation } from "./MappedOperation";

export interface OperationResolver<
    TCtx extends ResolverContext<MappedOperation<TArgs>, TArgs>,
    TArgs extends {},
    TResolved
> {
    resolverContext: TCtx;
    resolve(): Promise<TResolved>;
}
