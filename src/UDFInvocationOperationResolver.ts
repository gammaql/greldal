import { BaseResolver } from "./BaseResolver";
import { ResolverContext } from "./ResolverContext";
import { MappedUDFInvocationOperation } from "./MappedUDFInvocationOperation";
import { get } from "lodash";

export class UDFInvocationOperationResolver<
    TCtx extends ResolverContext<MappedUDFInvocationOperation<TArgs>, TArgs>,
    TArgs extends {},
    TResolved
> extends BaseResolver<TCtx, TArgs, TResolved> {
    /**
     * Should be overriden in sub-class with the logic of resolution
     */
    async resolve(): Promise<any> {
        const params = this.operation.deriveParams(this.args);
        const knex = this.operation.connector;
        const { procedureName } = this.operation;
        const result = await knex
            .select("*")
            .from(
                knex.raw(`??(${params.map(() => "?").join(" ,")})`, [
                    procedureName,
                    ...params.map(({ value }) => value),
                ]),
            );
        const invocationResult = get(result, [0, procedureName]);
        return this.operation.deriveResult(invocationResult, {});
    }
}
