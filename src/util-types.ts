import { Dictionary, Omit } from "lodash";

/** Convenience utility types */

export type Maybe<T> = null | undefined | T;

export type NNil<T> = Exclude<T, undefined | null>;

export interface Dict<T = any> extends Dictionary<T> {}

export interface Lazy<T> {
    (): T;
}

export type MaybeLazy<T> = T | Lazy<T>;
export type MaybeArray<T> = T | T[];

export interface Factory<T> {
    (...args: any[]): T;
}

export interface Newable<T> {
    new (...args: any[]): T;
}

export type StrKey<T> = keyof T & string;
export type IdxKey<T> = keyof T & number;

export type Normalizer<PreNormalizedT, NormalizedT> = (v: PreNormalizedT) => NormalizedT;

export type MandateProps<T, P extends keyof T> = Omit<T, P> & { [K in keyof Pick<T, P>]-?: T[K] };

export type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any;

export type Fn<A extends any[] = any[], R = any> = (...args: A) => R;

export type TypeGuard<S> = (v: any) => v is S;

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type ReplaceWith<TSource, TKey, TSub = never> = {
    [K in keyof TSource]: K extends TKey ? TSub : TSource[K];
}

export interface Mapped<TMapped, TStored = TMapped> {
    mapped: TMapped,
    stored: TStored
}

export type MaybeMapped<T> = T | Mapped<T>;
