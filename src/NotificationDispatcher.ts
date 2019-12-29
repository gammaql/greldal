import * as t from "io-ts";
import { MaybePromise, MaybeArray, Predicate, RegExpType } from "./util-types";
import { identity, noop, isEmpty, constant } from "lodash";
import { checkArray, checkNil, checkFn } from "./guards";
import { assertType } from "./assertions";
import { maybeArray } from "./maybe";
import { matchString } from "./predicate";

export enum PrimitiveMutationType {
    Insert = "INSERT",
    Update = "UPDATE",
    Delete = "DELETE",
}

export interface MutationNotification<TEntity extends {} = any> {
    source: string;
    type: string;
    entities: TEntity[];
}

export interface PrimitiveMutationNotification<TEntity extends {}> extends MutationNotification<TEntity> {
    type: PrimitiveMutationType;
}

interface NotificationDispatchInterceptor {
    (notification: Array<MutationNotification<any>>): MaybePromise<Array<MutationNotification<any>>>;
}

const StringPredicateRT = t.union([t.string, RegExpType, t.Function]);

const NotificationDispatchInterceptorConfigRT = t.intersection([
    t.partial({
        type: StringPredicateRT,
        source: StringPredicateRT,
    }),
    t.type({
        intercept: t.union([t.Function, t.boolean]),
    }),
]);

interface NotificationDispatchInterceptorConfig extends t.TypeOf<typeof NotificationDispatchInterceptorConfigRT> {
    type?: string | RegExp | Predicate<string>;
    source?: string | RegExp | Predicate<string>;
    retainRest?: boolean;
    intercept: NotificationDispatchInterceptor | boolean;
}

interface NormalizedNotificationDispatcherConfig {
    intercept: NotificationDispatchInterceptor;
    publish: (notification: MutationNotification<any>) => void;
}

const NotificationDispatcherConfigRT = t.intersection([
    t.partial({
        intercept: maybeArray(t.union([t.Function, NotificationDispatchInterceptorConfigRT])),
    }),
    t.type({
        publish: t.Function,
    }),
]);

interface NotificationDispatcherConfig extends t.TypeOf<typeof NotificationDispatcherConfigRT> {
    intercept?: MaybeArray<NotificationDispatchInterceptor | NotificationDispatchInterceptorConfig>;
    publish: (notification: MutationNotification<any>) => void;
}

const normalizeInterceptor = (i: NotificationDispatchInterceptorConfig | NotificationDispatchInterceptor) => {
    if (checkFn(i)) return i;
    const checkSource = checkNil(i.source) ? constant(true) : matchString(i.source);
    const checkType = checkNil(i.type) ? constant(true) : matchString(i.type);
    const intercept = checkFn(i.intercept)
        ? i.intercept
        : i.intercept
        ? (identity as NotificationDispatchInterceptor)
        : constant([]);
    return async (narr: MutationNotification[]): Promise<MutationNotification[]> => {
        const retained: MutationNotification[] = [];
        const consumed: MutationNotification[] = [];
        for (const n of narr) {
            if (checkSource(n.source) && checkType(n.type)) {
                consumed.push(n);
            } else if (i.retainRest !== false) {
                retained.push(n);
            }
        }
        const intercepted = await intercept(consumed);

        return intercepted.concat(retained);
    };
};

const normalize = (c: NotificationDispatcherConfig): NormalizedNotificationDispatcherConfig => {
    let intercept: NotificationDispatchInterceptor;
    if (checkNil(c.intercept)) intercept = identity;
    else if (checkArray(c.intercept)) {
        const steps = c.intercept.map(i => normalizeInterceptor(i));
        intercept = async (notifications: MutationNotification<any>[]) => {
            for (const step of steps) {
                if (isEmpty(notifications)) return notifications;
                notifications = await step(notifications);
            }
            return notifications;
        };
    } else intercept = normalizeInterceptor(c.intercept);
    return { ...c, intercept };
};

export const defaultConfig: NormalizedNotificationDispatcherConfig = {
    intercept: identity,
    publish: noop,
};

export let config = defaultConfig;

export function configure(cfg: NotificationDispatcherConfig) {
    assertType(NotificationDispatcherConfigRT, cfg, "NotificationDispatcher config");
    config = normalize(cfg);
}

export async function publish<TEntity>(notifications: Array<MutationNotification<TEntity>>) {
    const intercepted = await config.intercept(notifications);
    intercepted.forEach(config.publish);
}
