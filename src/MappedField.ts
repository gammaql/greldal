import * as t from "io-ts";
import { Dict, Maybe } from "./util-types";
import { GraphQLInputType, GraphQLOutputType, isScalarType } from "graphql";
import { getTypeAccessorError } from "./errors";
import { MappedDataSource } from "./MappedDataSource";
import { deriveFieldOutputType, deriveFieldInputType } from "./graphql-type-mapper";
import { snakeCase, map, transform, pick, has } from "lodash";
import { MemoizeGetter } from "./utils";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { assertType } from "./assertions";
import assert from "assert";
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
 * Represents a field that has been mapped from one or more columns in a data source
 *
 * Encapsulates the difference between primary and computed fields
 *
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

    /**
     * If the field is directly mapped from a column.
     *
     * Returns false for computed fields
     */
    get isMappedFromColumn() {
        return isMappedFromColumn(this.mapping);
    }

    /**
     * If the field corresponds to a primary key in backing table
     */
    get isPrimary() {
        if (isMappedFromColumn(this.mapping)) {
            return (this.mapping as ColumnFieldMapping<any>).isPrimary;
        }
        return false;
    }

    /**
     * If this is a computed field
     */
    get isComputed() {
        return isComputed(this.mapping);
    }

    /**
     * The name of column which this field is mapped from
     *
     * Returns undefined for computed fields
     */
    get sourceColumn() {
        if (this.isMappedFromColumn) {
            const mapping: ColumnFieldMapping<any> = this.mapping;
            return mapping.sourceColumn || snakeCase(this.mappedName);
        }
        return undefined;
    }

    /**
     * Names of all the columns which this field is derived from.
     *
     * For directly mapped column fields, this will always have a singular entry - the name of backing column.
     * For derived columns it will contain list of dependencies
     */
    get sourceColumns() {
        if (isMappedFromColumn(this.mapping)) {
            return [this.sourceColumn!];
        } else {
            return this.dependencies.reduce((result: string[], dependency: MappedField<any>) => {
                result.push(...dependency.sourceColumns);
                return result;
            }, []);
        }
    }

    /**
     * If this field is exposed in the GraphQL API
     */
    get exposed() {
        return this.mapping.exposed !== false;
    }

    /**
     * Description of this field - available to clients through the GraphQL API for exposed fields
     */
    get description() {
        return this.mapping.description;
    }

    /**
     * io-ts runtime time for validating values of this field
     */
    get type(): t.Type<any> {
        return this.mapping.type;
    }

    /**
     * Human friendly represenation of the path of the field relative to data source - primarily useful for logging and debugging
     */
    get keyPath() {
        return `${this.dataSource.mappedName}[fields][${this.mappedName}]`;
    }

    /**
     * Field derivation function - undefined if the field is not a computed field
     */
    get derive() {
        if (isComputed(this.mapping)) return this.mapping.derive;
        return undefined;
    }

    /**
     * Get aliased name for the column, derived from table alias.
     *
     * Throws for computed columns
     */
    getColumnAlias(tableAlias: Maybe<string>) {
        assert(this.isMappedFromColumn, "Field is not mapped from column");
        if (!tableAlias) return this.sourceColumn;
        return `${tableAlias}__${this.sourceColumn}`;
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
                    columnAlias: this.getColumnAlias(aliasColumnsToTableScope ? tableAlias : undefined)!,
                },
            ];
        } else {
            return transform(
                this.dependencies,
                (list: ColumnMapping[], f: MappedField) => list.push(...f.getColumnMappingList(aliasHierarchyVisitor)),
                [],
            );
        }
    }

    /**
     * GraphQL output type for this field
     */
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

    /**
     * GraphQL input type for this field
     */
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

    /**
     * Getter useful to get the static type for this field.
     *
     * Useful only in mapped/computed typescript types - will throw if actually invoked.
     */
    get Type(): t.TypeOf<TFMapping["type"]> {
        throw getTypeAccessorError("Type", "MappedField");
    }

    /**
     * Get the value for this field given a source row obtained from the data source
     */
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

    /**
     * Reducer mapping a partial row (from data source) to a partial entity.
     *
     * Reduce functions from all fields can be composed to arrive at a Shallow entity (excluding associations) from the data source row.
     */
    reduce(partialRow: Dict, value: any): Dict {
        if (this.sourceColumn) {
            partialRow[this.sourceColumn] = this.type.encode(value);
            return partialRow;
        }
        const { mapping } = this;
        if (isComputed(mapping) && mapping.reduce) {
            return mapping.reduce(partialRow);
        }
        return partialRow;
    }
}

/**
 * @api-category PrimaryAPI
 */
export const mapFields = <TFieldMapping extends Dict<FieldMapping<t.Type<any>, TArgs>>, TArgs extends {}>(
    fields: TFieldMapping,
) => <TSrc extends MappedDataSource>(
    dataSource: TSrc,
): { [K in keyof TFieldMapping]: MappedField<TSrc, TFieldMapping[K]> } =>
    transform(
        fields,
        (result: Dict, fieldMapping, name) => {
            result[name] = new MappedField(dataSource, name, fieldMapping);
        },
        {},
    ) as any;
