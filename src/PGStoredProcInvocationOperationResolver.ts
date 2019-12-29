import { BaseResolver } from "./BaseResolver";
import { ResolverContext } from "./ResolverContext";
import { MappedStoredProcInvocationOperation } from "./MappedStoredProcInvocationOperation";
import { isNil, get } from "lodash";
import { inspect } from "util";

export class PGStoredProcInvocationOperationResolver<
    TCtx extends ResolverContext<MappedStoredProcInvocationOperation<TArgs>, TArgs>,
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
        let result: any = {};
        await knex.transaction(async trx => {
            const paramPlaceholders = [];
            const paramBindings = [];
            for (let i = 0; i < params.length; i++) {
                const param = params[i];
                paramPlaceholders.push("?");
                paramBindings.push(isNil(param.value) ? null : param.value);
            }
            result = await trx.raw(`CALL ??(${paramPlaceholders.join(", ")})`, [
                procedureName,
                ...paramBindings,
            ]);
        });

        return this.operation.deriveResult(get(result, ["rows", 0]));
    }
}
