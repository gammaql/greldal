import * as t from "io-ts";
import { Dict, StrKey } from "./util-types";
import { GraphQLInputType, GraphQLOutputType, GraphQLScalarType } from "graphql";
import { MappedDataSource } from "./MappedDataSource";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
export interface BaseFieldMapping<TMapped extends t.Type<any>> {
    type: TMapped;
    to?: GraphQLScalarType | {
        input: GraphQLInputType;
        output: GraphQLOutputType;
    };
    exposed?: boolean;
    description?: string;
    getColumnMappingList?: (aliasHierarchyVisitor: AliasHierarchyVisitor) => ColumnMapping[];
}
export interface ColumnFieldMapping<TMapped extends t.Type<any> = any> extends BaseFieldMapping<TMapped> {
    sourceColumn?: string;
    sourceTable?: string;
}
export interface ComputedFieldMapping<TMapped extends t.Type<any> = any, TArgs extends {} = any> extends BaseFieldMapping<TMapped> {
    dependencies: Array<StrKey<TArgs>>;
    derive: (args: TArgs) => t.TypeOf<TMapped>;
}
export declare type FieldMapping<TMapped extends t.Type<any>, TArgs extends {}> = ColumnFieldMapping<TMapped> | ComputedFieldMapping<TMapped, TArgs>;
export declare type FieldMappingArgs<T extends FieldMapping<any, any>> = T extends FieldMapping<infer I, any> ? I : never;
export interface ColumnMapping {
    field: MappedField;
    columnRef: string;
    columnAlias: string;
}
export declare class MappedField<TSrc extends MappedDataSource = MappedDataSource, TFMapping extends FieldMapping<any, any> = any> {
    dataSource: TSrc;
    mappedName: string;
    private mapping;
    constructor(dataSource: TSrc, mappedName: string, mapping: TFMapping);
    readonly dependencies: MappedField<TSrc>[];
    readonly isMappedFromColumn: boolean;
    readonly isComputed: boolean;
    readonly sourceColumn: string | undefined;
    readonly sourceColumns: string | string[] | undefined;
    readonly exposed: boolean;
    readonly description: string | undefined;
    readonly type: any;
    readonly keyPath: string;
    getValue(sourceRow: Dict): TFMapping["type"]["_A"];
    getColumnMappingList(aliasHierarchyVisitor: AliasHierarchyVisitor): ColumnMapping[];
    readonly outputType: GraphQLOutputType;
    readonly inputType: GraphQLInputType;
    readonly Type: t.TypeOf<TFMapping["type"]>;
}
