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
            // const toSelect = [];
            for (let i = 0; i < params.length; i++) {
                // const placeholder = `@p${i}`;
                const param = params[i];
                /* if (param.argMode === 'OUT' || param.argMode === 'INOUT') {
                    // paramPlaceholders.push(placeholder);
                    // toSelect.push([placeholder, param.name]);
                    if (param.argMode === 'INOUT') {
                        await trx.raw(`SELECT ? INTO ${placeholder};`, [
                            isNil(param.value) ? null : param.value
                        ])
                    }
                } else { */
                paramPlaceholders.push("?");
                paramBindings.push(isNil(param.value) ? null : param.value);
                /* } */
            }
            /* const */ result = await trx.raw(`CALL ??(${paramPlaceholders.join(", ")})`, [
                procedureName,
                ...paramBindings,
            ]); /*
            for (const [placeholder, key] of toSelect) {
                result[key!] = await trx.raw(`SELECT ?`, [placeholder!]);
            } */
        });

        return this.operation.deriveResult(get(result, ["rows", 0]));
    }
}
