import { DataSourceMapping, MappedDataSource } from "./MappedDataSource";

export interface AssociationMapping<T extends DataSourceMapping> {
    from: (this: MappedAssociation<AssociationMapping<T>>) => MappedDataSource<T>;
    description?: string;
    join: any;
    preFetch: any;
    postFetch: any;
    reverseAssociateWithParents: any;
}

export class MappedAssociation<T extends AssociationMapping<any> = any> {
    constructor(
        public dataSource: MappedDataSource,
        public mappedName: string,
        private mapping: T
    ) {}

    get from(): MappedDataSource {
        return this.mapping.from.apply(this);
    }

    get description() {
        return this.mapping.description;
    }
}
