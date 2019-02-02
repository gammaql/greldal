import * as t from "io-ts";
import { Dict, IOType } from './util-types';
import { GraphQLInputType, GraphQLOutputType, isScalarType } from "graphql";
import { getTypeAccessorError } from "./errors";
import { MappedDataSource } from "./MappedDataSource";
import { deriveFieldOutputType, deriveFieldInputType } from "./graphql-type-mapper";
import { snakeCase, map, transform, pick, has, reduce } from "lodash";
import { MemoizeGetter } from "./utils";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { assertType } from "./assertions";
import {
    FieldMapping,
    FieldMappingRT,
    ComputedFieldMapping,
    ColumnFieldMapping,
    ColumnMapping,
    FieldMappingArgs,
} from "./FieldMapping";

function isMappedFromColumn(f: FieldMapping<any, any>): f is ColumnFieldMapping<any> {
    return !has(f, "derive");
}

function isComputed(f: FieldMapping<any, any>): f is ComputedFieldMapping<any, any> {
    return has(f, "derive");
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

    get type(): t.Type<any> {
        return this.mapping.type;
    }

    get keyPath() {
        return `${this.dataSource.mappedName}[fields][${this.mappedName}]`;
    }

    get derive() {
        if (isComputed(this.mapping)) return this.mapping.derive;
        return undefined;
    }

    getColumnMappingList(
        aliasHierarchyVisitor: AliasHierarchyVisitor,
        aliasColumnsToTableScope = true,
    ): ColumnMapping[] {
        if (this.mapping.getColumnMappingList) {
            return this.mapping.getColumnMappingList(aliasHierarchyVisitor, aliasColumnsToTableScope);
        }
        if (this.isMappedFromColumn) {
            const tableAlias = aliasHierarchyVisitor.alias;
            return [
                {
                    field: this,
                    columnRef: `${tableAlias}.${this.sourceColumn}`,
                    columnAlias: aliasColumnsToTableScope ? `${tableAlias}__${this.mappedName}` : this.mappedName,
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

    reduce(partialDBRow: Dict, value: any): Dict {
        if (this.sourceColumn) {
            partialDBRow[this.sourceColumn] = this.type.encode(value);
            return partialDBRow;
        }
        const { mapping } = this;
        if (isComputed(mapping) && mapping.reduce) {
            return mapping.reduce(partialDBRow);
        }
        return partialDBRow;
    }
}
