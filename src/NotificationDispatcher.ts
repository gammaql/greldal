import * as t from "io-ts";
import { MaybePromise, MaybeArray } from "./util-types";
import { identity, noop, isEmpty } from "lodash";
import { checkArray, checkNil } from "./guards";
import { assertType } from "./assertions";

export enum PrimitiveMutationType {
    Insert = "INSERT",
    Update = "UPDATE",
    Delete = "DELETE"
}

export interface MutationNotification<TEntity extends {} = any> {
    source: string;
    type: string;
    entities: TEntity[];
}

export interface PrimitiveMutationNotification<TEntity extends {}> extends MutationNotification<TEntity> {
    type: PrimitiveMutationType;
}

interface NormalizedNotificationDispatcherConfig {
    intercept: (notification: Array<MutationNotification<any>>) =>
        MaybePromise<Array<MutationNotification<any>>>,
    publish: (notification: MutationNotification<any>) => void
}

const NotificationDispatcherConfigRT = t.intersection([
    t.partial({
        intercept: t.union([
            t.Function,
            t.array(t.Function)
        ])
    }), 
    t.type({
        publish: t.Function
    })
]);

interface NotificationDispatcherConfig extends t.TypeOf<typeof NotificationDispatcherConfigRT> {
    intercept?: MaybeArray<(notification: Array<MutationNotification<any>>) =>
        MaybePromise<Array<MutationNotification<any>>>>,
    publish: (notification: MutationNotification<any>) => void
}

const normalize = ({ intercept, ...rest }: NotificationDispatcherConfig): NormalizedNotificationDispatcherConfig => ({
    ...rest,
    intercept: checkArray(intercept)
        ? async (notifications: Array<MutationNotification<any>>) => {
            if (isEmpty(notifications)) return notifications;
            for (let fn of intercept) {
                notifications = await fn(notifications)
                if (isEmpty(notifications)) return notifications;
            }
            return notifications
        }
        : checkNil(intercept)
        ? identity
        : intercept
})

export const defaultConfig: NormalizedNotificationDispatcherConfig = {
    intercept: identity,
    publish: noop
}

export let config = defaultConfig;

export function configure(cfg: NotificationDispatcherConfig) {
    assertType(NotificationDispatcherConfigRT, cfg, "NotificationDispatcher config");
    config = normalize(cfg);
}

export async function publish<TEntity>(notifications: Array<MutationNotification<TEntity>>) {
    (await config.intercept(notifications)).forEach(config.publish);
}