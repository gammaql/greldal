import { UDFMapping } from "./UDFMapping";

export class MappedUDF<TArgs> {
    constructor(
        public mapping: UDFMapping<TArgs>
    ) {}
}

export const mapFunction = <TArgs> (mapping: UDFMapping<TArgs>) => new MappedUDF(mapping);
