import { MaybePromise } from "./util-types";

export type MultiSelectorOptions<TTgt, TCtx> = Array<{
    selection: () => MaybePromise<TTgt>;
    shouldUse?: (ctx: TCtx) => Promise<boolean>;
}>;

export class MultiSelector<TTgt, TCtx> {
    constructor(private options: MultiSelectorOptions<TTgt, TCtx>) {}

    async selectFirstMatch(ctx: TCtx, requireCondition = false) {
        for await (const target of this.iterateMatches(ctx, requireCondition)) {
            return target;
        }
    }

    async selectAllMatches(ctx: TCtx, requireCondition = false) {
        const targets: TTgt[] = [];
        for await (const target of this.iterateMatches(ctx, requireCondition)) {
            targets.push(target);
        }
        return targets;
    }

    async *iterateMatches(ctx: TCtx, requireCondition = false) {
        for (const option of this.options) {
            if ((option.shouldUse && (await option.shouldUse(ctx))) || !requireCondition) {
                yield await option.selection();
            }
        }
    }
}
