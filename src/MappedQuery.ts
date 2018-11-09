import { MappedDataSource } from "./MappedDataSource";

export interface QueryMapping {
    name: string;
    description?: string;
}

export const mapQuery = <T extends MappedDataSource<any>>() => {

}
