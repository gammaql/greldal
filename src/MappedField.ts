import * as t from "io-ts";
import { Dict, StrKey, IOType, InstanceOf, GQLInputType, GQLOutputType } from "./util-types";
import { GraphQLInputType, GraphQLOutputType, GraphQLScalarType, isScalarType } from "graphql";
import { getTypeAccessorError } from "./errors";
import { MappedDataSource } from "./MappedDataSource";
import { deriveFieldOutputType, deriveFieldInputType } from "./graphql-type-mapper";
import { has, pick, snakeCase, map, transform } from "lodash";
import { MemoizeGetter } from "./utils";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { assertType } from './assertions';


const BaseFieldMapping = t.intersection([
    t.type({
        type: IOType,
    }),
    t.partial({
        to: t.union([
            InstanceOf(GraphQLScalarType),
            t.type({
                input: GQLInputType,
                output: GQLOutputType,
            }),
        ]),
        exposed: t.boolean,
        description: t.string,
        getColumnMappingList: t.Function,
    }),
]);

const ColumnFieldMapping = t.intersection([
    BaseFieldMapping,
    t.partial({
        sourceColumn: t.string,
        sourceTable: t.string,
    }),
]);

const ComputedFieldMapping = t.intersection([
    BaseFieldMapping,
    t.type({
        dependencies: t.array(t.string),
        derive: t.Function,
    }),
]);

export type BaseFieldMapping<TMapped extends t.Mixed> = t.TypeOf<typeof BaseFieldMapping> & {
    type: TMapped;
    getColumnMappingList?: (aliasHierarchyVisitor: AliasHierarchyVisitor) => ColumnMapping[];
};

export type ColumnFieldMapping<TMapped extends t.Type<any> = any> = BaseFieldMapping<TMapped> &
    t.TypeOf<typeof ColumnFieldMapping>;

export type ComputedFieldMapping<TMapped extends t.Type<any> = any, TArgs extends {} = any> = BaseFieldMapping<
    TMapped
> &
    t.TypeOf<typeof ComputedFieldMapping> & {
        dependencies: Array<StrKey<TArgs>>;
        derive: (args: TArgs) => t.TypeOf<TMapped>;
    };

export const FieldMapping = t.union([
    ColumnFieldMapping,
    ComputedFieldMapping
])

/**
 * @api
 */
export type FieldMapping<TMapped extends t.Type<any>, TArgs extends {}> =
    | ColumnFieldMapping<TMapped>
    | ComputedFieldMapping<TMapped, TArgs>;

function isMappedFromColumn(f: FieldMapping<any, any>): f is ColumnFieldMapping<any> {
    return !has(f, "derive");
}

function isComputed(f: FieldMapping<any, any>): f is ComputedFieldMapping<any, any> {
    return has(f, "derive");
}

export type FieldMappingArgs<T extends FieldMapping<any, any>> = T extends FieldMapping<infer I, any> ? I : never;

export interface ColumnMapping {
    field: MappedField;
    columnRef: string;
    columnAlias: string;
}

export class MappedField<
    TSrc extends MappedDataSource = MappedDataSource,
    TFMapping extends FieldMapping<any, any> = any
> {
    constructor(public dataSource: TSrc, public mappedName: string, private mapping: TFMapping) {
        assertType(FieldMapping, mapping, `Field mapping configuration:\nDataSource[${dataSource.mappedName}][fields][${mappedName}]`);
    }

    get dependencies(): MappedField<TSrc>[] {
        if (this.isMappedFromColumn) {
            return [];
        }
        return map(
            (this.mapping as ComputedFieldMapping).dependencies,
            name => this.dataSource.fields[name] as MappedField<TSrc>,
        );
    }

    get isMappedFromColumn() {
        return isMappedFromColumn(this.mapping);
    }

    get isComputed() {
        return isComputed(this.mapping);
    }

    get sourceColumn() {
        if (this.isMappedFromColumn) {
            const mapping: ColumnFieldMapping<any> = this.mapping;
            return mapping.sourceColumn || snakeCase(this.mappedName);
        }
        return undefined;
    }

    get sourceColumns() {
        if (isMappedFromColumn(this.mapping)) {
            return this.sourceColumn;
        } else {
            return (this.mapping as ComputedFieldMapping<any>).dependencies;
        }
    }

    get exposed() {
        return this.mapping.exposed !== false;
    }

    get description() {
        return this.mapping.description;
    }

    get type() {
        return this.mapping.type;
    }

    get keyPath() {
        return `${this.dataSource.mappedName}[fields][${this.mappedName}]`;
    }

    getValue(sourceRow: Dict) {
        if (this.isComputed) {
            const { dependencies, derive } = this.mapping as ComputedFieldMapping<
                TFMapping["type"],
                FieldMappingArgs<TFMapping>
            >;
            const args: any = pick(sourceRow, dependencies);
            return derive(args);
        }
        const key = this.sourceColumn;
        if (key) {
            sourceRow[key];
        }
        return undefined;
    }

    getColumnMappingList(aliasHierarchyVisitor: AliasHierarchyVisitor): ColumnMapping[] {
        if (this.mapping.getColumnMappingList) {
            return this.mapping.getColumnMappingList(aliasHierarchyVisitor);
        }
        if (this.isMappedFromColumn) {
            const tableAlias = aliasHierarchyVisitor.alias;
            return [
                {
                    field: this,
                    columnRef: `${tableAlias}.${this.sourceColumn}`,
                    columnAlias: `${tableAlias}__${this.mappedName}`,
                },
            ];
        } else {
            return transform<MappedField, ColumnMapping>(
                this.dependencies,
                (list, f) => list.push(...f.getColumnMappingList(aliasHierarchyVisitor)),
                [],
            );
        }
    }

    @MemoizeGetter
    get outputType(): GraphQLOutputType {
        const { to } = this.mapping;
        if (to) {
            if (isScalarType(to)) {
                return to;
            }
            return to.output;
        }
        return deriveFieldOutputType(this);
    }

    @MemoizeGetter
    get inputType(): GraphQLInputType {
        const { to } = this.mapping;
        if (to) {
            if (isScalarType(to)) {
                return to;
            }
            return to.input;
        }
        return deriveFieldInputType(this);
    }

    get Type(): t.TypeOf<TFMapping["type"]> {
        throw getTypeAccessorError("Type", "MappedField");
    }
}
