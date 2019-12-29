import { GraphQLResolveInfo } from "graphql";
import { getTypeAccessorError } from "./utils/errors";
import { MappedOperation } from "./MappedOperation";

export class ResolverContext<
    TMappedOperation extends MappedOperation<TGQLArgs>,
    TGQLArgs extends {},
    TGQLSource = any,
    TGQLContext = any
> {
    constructor(
        public operation: TMappedOperation,
        public source: TGQLSource,
        public args: TGQLArgs,
        public context: TGQLContext,
        public resolveInfoRoot: GraphQLResolveInfo,
    ) {}

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
