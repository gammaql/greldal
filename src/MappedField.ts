import * as t from "io-ts";
import { StrKey, IOType, InstanceOf, GQLInputType, GQLOutputType, Dict } from './util-types';
import { GraphQLInputType, GraphQLOutputType, GraphQLScalarType, isScalarType } from "graphql";
import { getTypeAccessorError } from "./errors";
import { MappedDataSource } from "./MappedDataSource";
import { deriveFieldOutputType, deriveFieldInputType } from "./graphql-type-mapper";
import { has, snakeCase, map, transform, pick } from "lodash";
import { MemoizeGetter } from "./utils";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { assertType } from "./assertions";

const BaseFieldMappingRT = t.intersection([
    t.type({
        /**
         * @memberof BaseFieldMapping
         */
        type: IOType,
    }),
    t.partial({
        /**
         * @memberof BaseFieldMapping
         */
        to: t.union([
            InstanceOf(GraphQLScalarType),
            t.type({
                input: GQLInputType,
                output: GQLOutputType,
            }),
        ]),

        /**
         * @memberof BaseFieldMapping
         */
        exposed: t.boolean,

        /**
         * @memberof BaseFieldMapping
         */
        description: t.string,

        /**
         * @memberof BaseFieldMapping
         */
        getColumnMappingList: t.Function,
    }),
]);


const ColumnFieldMappingRT = t.intersection([
    BaseFieldMappingRT,
    t.partial({
        sourceColumn: t.string,
        sourceTable: t.string,
        isPrimary: t.boolean
    }),
]);

const ComputedFieldMappingRT = t.intersection([
    BaseFieldMappingRT,
    t.type({
        dependencies: t.array(t.string),
        derive: t.Function,
    }),
]);

/**
 * 
 * @api-category ConfigType
 */
export type BaseFieldMapping<TMapped extends t.Mixed> = t.TypeOf<typeof BaseFieldMappingRT> & {
    type: TMapped;
    getColumnMappingList?: (aliasHierarchyVisitor: AliasHierarchyVisitor) => ColumnMapping[];
};

/**
 * @api-category ConfigType
 */
export type ColumnFieldMapping<TMapped extends t.Type<any> = any> = BaseFieldMapping<TMapped> &
    t.TypeOf<typeof ColumnFieldMappingRT>;

/**
 * @api-category ConfigType
 */
export type ComputedFieldMapping<TMapped extends t.Type<any> = any, TArgs extends {} = any> = BaseFieldMapping<
    TMapped
> &
    t.TypeOf<typeof ComputedFieldMappingRT> & {
        dependencies: Array<StrKey<TArgs>>;
        derive: (args: TArgs) => t.TypeOf<TMapped>;
    };

export const FieldMappingRT = t.union([ColumnFieldMappingRT, ComputedFieldMappingRT]);

/**
 * @api-category ConfigType
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

/**
 * @api-category ConfigType
 */
export type FieldMappingArgs<T extends FieldMapping<any, any>> = T extends FieldMapping<infer I, any> ? I : never;


export interface ColumnMapping {
    field: MappedField;
    columnRef: string;
    columnAlias: string;
}

/**
 * @api-category MapperClass
 */
export class MappedField<
    TSrc extends MappedDataSource = MappedDataSource,
    TFMapping extends FieldMapping<any, any> = any
> {
    constructor(public dataSource: TSrc, public mappedName: string, private mapping: TFMapping) {
        assertType(
            FieldMappingRT,
            mapping,
            `Field mapping configuration:\nDataSource<${dataSource.mappedName}>[fields][${mappedName}]`,
        );
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

    get isPrimary() {
        if (isMappedFromColumn(this.mapping)) {
            return (this.mapping as ColumnFieldMapping<any>).isPrimary;
        }
        return false;
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
            return [this.sourceColumn!];
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

    get derive() {
        if (isComputed(this.mapping)) return this.mapping.derive;
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
            return sourceRow[key];
        }
    }
}

