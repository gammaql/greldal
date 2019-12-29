import { ArgSpecsFor } from "./InvocableMapping";

export interface StoredProcMapping<TArgs> {
    name: string;
    args: ArgSpecsFor<TArgs>;
}
