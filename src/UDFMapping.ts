import { ArgSpecsFor } from "./InvocableMapping";

export interface UDFMapping<TArgs> {
    name: string,
    args: ArgSpecsFor<TArgs>
}