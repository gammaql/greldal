import * as t from "io-ts";
import { MaybeArray, TypeGuard, Dict, StrKey } from "./util-types";
import { GraphQLInputType, GraphQLOutputType } from "graphql";
import { getTypeAccessorError } from "./errors";
import { MappedDataSource } from "./MappedDataSource";
import { deriveFieldOutputType, deriveFieldInputType } from "./graphql-type-mapper";
import { isArray, has, pick, snakeCase, map } from "lodash";
import assert = require("assert");
import { MemoizeGetter } from "./utils";

export interface BaseFieldMapping<TMapped extends t.Type<any>> {
    type: TMapped;
    to?: {
        input: GraphQLInputType;
        output: GraphQLOutputType;
    };
    exposed?: boolean;
    description?: string;
}

export interface ColumnFieldMapping<TMapped extends t.Type<any> = any> extends BaseFieldMapping<TMapped> {
    sourceColumn?: string;
}

export interface ComputedFieldMapping<TMapped extends t.Type<any> = any, TArgs extends {} = any>
    extends BaseFieldMapping<TMapped> {
    dependencies: Array<StrKey<TArgs>>;
    derive: (args: TArgs) => t.TypeOf<TMapped>;
}

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

export class MappedField<
    TSrc extends MappedDataSource = MappedDataSource,
    TFMapping extends FieldMapping<any, any> = any
> {
    constructor(public dataSource: TSrc, public mappedName: string, private mapping: TFMapping) {}

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
            const { type } = this.mapping;
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

    @MemoizeGetter
    get outputType(): GraphQLOutputType {
        if (this.mapping.to) {
            return this.mapping.to.output;
        }
        return deriveFieldOutputType(this);
    }

    @MemoizeGetter
    get inputType(): GraphQLInputType {
        if (this.mapping.to) {
            return this.mapping.to.input;
        }
        return deriveFieldInputType(this);
    }

    get Type(): t.TypeOf<TFMapping["type"]> {
        throw getTypeAccessorError("Type", "MappedField");
    }
}
