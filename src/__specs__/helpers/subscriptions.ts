import { ExecutionResult } from "graphql";
import { ExecutionResultDataDefault } from "graphql/execution/execute";
import { isFunction } from "lodash";

const isAsyncIterator = (i: any): i is AsyncIterator<any> => i && isFunction(i.next);

export const getSubscriptionResults = (count = 1) => async (
    resultIterator: ExecutionResult<ExecutionResultDataDefault> | AsyncIterator<ExecutionResult<ExecutionResultDataDefault>>
): Promise<ExecutionResult<ExecutionResultDataDefault>[]> => {
    if (!isAsyncIterator(resultIterator)) return [resultIterator];
    const returned: any = [];
    let idx = 0;
    while (true) {
        const { done, value } = await resultIterator.next();
        if (done) return returned;
        returned.push(value);
        idx += 1;
        if (idx === count) return returned;
    }
}