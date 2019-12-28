export interface InvocableArg<TKey extends string, TVal> {
    name: TKey;
    type: TVal;
    argMode: ArgMode
}

export type ArgMode = 
    | "IN"
    | "OUT"
    | "INOUT";

export interface ArgSpec<TArgs extends {}, TKey extends keyof TArgs> {
    mode: ArgMode;
    name: TKey;
}

// TODO: Can this be improved to ensure inclusion of all keys
export type ArgSpecsFor<TArgs extends {}> =
    Array<ArgSpec<TArgs, keyof TArgs>>
