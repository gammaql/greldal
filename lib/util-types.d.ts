import * as t from "io-ts";
import { Dictionary, Omit } from "lodash";
/** Convenience utility types */
export declare const Maybe: (type: t.Type<any, any, unknown>) => t.UnionType<(t.Type<any, any, unknown> | t.NullType | t.UndefinedType)[], any, any, unknown>;
export declare const Mapped: (type: t.Type<any, any, unknown>) => t.InterfaceType<{
    stored: t.Type<any, any, unknown>;
    mapped: t.Type<any, any, unknown>;
}, t.TypeOfProps<{
    stored: t.Type<any, any, unknown>;
    mapped: t.Type<any, any, unknown>;
}>, t.OutputOfProps<{
    stored: t.Type<any, any, unknown>;
    mapped: t.Type<any, any, unknown>;
}>, unknown>;
export declare const MaybeMapped: (type: t.Type<any, any, unknown>) => t.UnionType<(t.Type<any, any, unknown> | t.InterfaceType<{
    stored: t.Type<any, any, unknown>;
    mapped: t.Type<any, any, unknown>;
}, t.TypeOfProps<{
    stored: t.Type<any, any, unknown>;
    mapped: t.Type<any, any, unknown>;
}>, t.OutputOfProps<{
    stored: t.Type<any, any, unknown>;
    mapped: t.Type<any, any, unknown>;
}>, unknown>)[], any, any, unknown>;
export declare type Maybe<T> = null | undefined | T;
export declare type NNil<T> = Exclude<T, undefined | null>;
export interface Dict<T = any> extends Dictionary<T> {
}
export interface Lazy<T> {
    (): T;
}
export declare type MaybeLazy<T> = T | Lazy<T>;
export declare type MaybeArray<T> = T | T[];
export declare type MaybeArrayItem<T extends MaybeArray<any>> = T extends MaybeArray<infer I> ? I : never;
export interface Factory<T> {
    (...args: any[]): T;
}
export interface Newable<T> {
    new (...args: any[]): T;
}
export declare type StrKey<T> = keyof T & string;
export declare type IdxKey<T> = keyof T & number;
export declare type Normalizer<PreNormalizedT, NormalizedT> = (v: PreNormalizedT) => NormalizedT;
export declare type MandateProps<T, P extends keyof T> = Omit<T, P> & {
    [K in keyof Pick<T, P>]-?: T[K];
};
export declare type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any;
export declare type Fn<A extends any[] = any[], R = any> = (...args: A) => R;
export declare type TypeGuard<S> = (v: any) => v is S;
export declare type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export declare type ReplaceWith<TSource, TKey, TSub = never> = {
    [K in keyof TSource]: K extends TKey ? TSub : TSource[K];
};
export interface Mapped<TMapped, TStored = TMapped> {
    mapped: TMapped;
    stored: TStored;
}
export declare type MaybeMapped<T> = T | Mapped<T>;
export declare type KeyOf<T> = keyof T;
export declare type ValueOf<T> = T[KeyOf<T>];
