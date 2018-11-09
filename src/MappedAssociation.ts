import { DataSourceMapping, MappedDataSource } from "./MappedDataSource";

export interface AssociationMapping<T extends DataSourceMapping> {
    from: () => MappedDataSource<T>;
    join: any;
    preFetch: any;
    postFetch: any;
    reverseAssociateWithParents: any;
}

export class MappedAssociation<T extends AssociationMapping<any>> {
    constructor(private mapping: T) {}
}
