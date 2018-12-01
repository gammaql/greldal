import { Dict, Maybe } from "./util-types";
export declare const isntString: (str: any) => boolean;
export declare const indexBy: <T>(arr: T[], path: string) => Dict<T>;
export declare function interceptThrough<T>(val: T, interceptor: Maybe<(v: T) => Maybe<T>>): T;
export declare const uid: (label: string) => string;
export declare function MemoizeGetter(target: any, propertyKey: string, descriptor: PropertyDescriptor): void;
