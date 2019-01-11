import * as t from "io-ts";
import { ExtendsWitness } from "../util-types";
import { MappedDataSource } from "../MappedDataSource";
import { DataSourceMapping } from "../DataSourceMapping";
import { MappedField } from "../MappedField";
import { FieldMapping, FieldMappingArgs } from "../FieldMapping";
import { AssociationMapping } from "../AssociationMapping";

export type _AssociationMappingWitness = ExtendsWitness<
    AssociationMapping<any, any>,
    AssociationMapping<MappedDataSource, MappedDataSource>
>;

export type MappedDataSourceWitness = ExtendsWitness<MappedDataSource<any>, MappedDataSource<DataSourceMapping>>;

export type MappedFieldWitness = ExtendsWitness<MappedField<any, any>, MappedField>;

export type FieldMappingArgsWitness = ExtendsWitness<FieldMappingArgs<any>, FieldMappingArgs<FieldMapping<any, any>>>;

export type FieldMappingWitness = ExtendsWitness<FieldMapping<any, any>, FieldMapping<t.Type<any>, {}>>;
