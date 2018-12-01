import { Dict, MaybeMapped, NNil, Maybe, MaybeArrayItem } from "./util-types";
import * as t from "io-ts";
import * as Knex from "knex";
import { GraphQLInputType, GraphQLOutputType } from "graphql";
import { FieldMapping, MappedField } from "./MappedField";
import { AssociationMapping, MappedAssociation } from "./MappedAssociation";
import { StoreQueryParams } from "./QueryOperationResolver";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
export interface DataSourceMapping {
    name: MaybeMapped<string>;
    description?: string;
    fields?: Dict<FieldMapping<any, any>>;
    associations?: Dict<AssociationMapping<any>>;
    rootQuery?: (alias: Maybe<AliasHierarchyVisitor>) => Knex.QueryBuilder;
    connector?: Knex;
}
declare type DataSourceAssociationType<T extends DataSourceMapping, K extends keyof T["associations"]> = MaybeArrayItem<NNil<T["associations"]>[K]>;
declare type AssociatedDataSource<T extends DataSourceMapping, K extends keyof T["associations"]> = ReturnType<DataSourceAssociationType<T, K>["target"]>;
declare type ShallowRecordType<T extends DataSourceMapping> = {
    [K in keyof T["fields"]]: t.TypeOf<NNil<T["fields"]>[K]["type"]>;
};
declare type NestedRecordType<T extends DataSourceMapping> = ShallowRecordType<T> & {
    [K in keyof T["associations"]]: AssociatedDataSource<T, K>["RecordType"];
};
export declare class MappedDataSource<T extends DataSourceMapping = any> {
    private mapping;
    fields: {
        [K in keyof T["fields"]]: MappedField<MappedDataSource<T>, NNil<T["fields"]>[K]>;
    };
    associations: {
        [K in keyof T["associations"]]: MappedAssociation<MappedDataSource<T>>;
    };
    constructor(mapping: T);
    readonly connector: Knex;
    rootQuery(aliasHierarchyVisitor?: Maybe<AliasHierarchyVisitor>): Knex.QueryBuilder;
    readonly mappedName: string;
    readonly shallowMappedName: string;
    readonly storedName: string;
    readonly storedColumnNames: string[];
    readonly shallowRecordProps: t.Props & Dict<t.Type<any>>;
    readonly associationProps: t.Props & Dict<t.Type<any>>;
    readonly recordProps: t.Props & Dict<t.Type<any>>;
    readonly shallowRecordType: t.InterfaceType<t.Props & Dict<t.Type<any, any, unknown>>, t.TypeOfProps<t.Props & Dict<t.Type<any, any, unknown>>>, t.OutputOfProps<t.Props & Dict<t.Type<any, any, unknown>>>, unknown>;
    readonly recordType: t.InterfaceType<t.Props & Dict<t.Type<any, any, unknown>>, t.TypeOfProps<t.Props & Dict<t.Type<any, any, unknown>>>, t.OutputOfProps<t.Props & Dict<t.Type<any, any, unknown>>>, unknown>;
    readonly ShallowRecordType: ShallowRecordType<T>;
    readonly RecordType: NestedRecordType<T>;
    readonly MappingType: T;
    readonly defaultOutputType: GraphQLOutputType;
    readonly defaultShallowInputType: GraphQLInputType;
    readonly defaultShallowOutputType: GraphQLOutputType;
    mapEntities(entities: ShallowRecordType<T>[]): Dict[];
    mapResults(storeParams: StoreQueryParams<MappedDataSource<T>>, rows: Dict[]): Promise<any[]>;
    shallowMapResults(rows: Dict[]): void;
}
export declare const mapDataSource: <T extends DataSourceMapping>(mapping: T) => MappedDataSource<T>;
export {};
