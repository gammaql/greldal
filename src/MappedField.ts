import * as t from "io-ts";
import { MaybeArray, TypeGuard, Dict } from "./util-types";
import { GraphQLInputType, GraphQLOutputType } from "graphql";
import { getTypeAccessorError } from "./errors";
import { Memoize } from "lodash-decorators";
import { MappedDataSource } from "./MappedDataSource";
import { deriveFieldOutputType, deriveFieldInputType } from "./graphql-type-mapper";
import { isArray, has, pick } from "lodash";
import assert = require("assert");

export interface BaseFieldMapping<TMapped extends t.Type<any>> {
    type: TMapped;
    to?: {
        input: GraphQLInputType,
        output: GraphQLOutputType
    };
    exposed?: boolean;
    description?: string;
}

export interface ColumnFieldMapping<TMapped extends t.Type<any>> extends BaseFieldMapping<TMapped> {
    sourceColumn: string;
}

export interface ComputedFieldMapping<TMapped extends t.Type<any>, TArgs extends {}> extends BaseFieldMapping<TMapped> {
    dependencies: Array<keyof TArgs>;
    derive: (args: TArgs) => t.TypeOf<TMapped>;
}

export type FieldMapping<TMapped extends t.Type<any>, TArgs extends {}> =
    | ColumnFieldMapping<TMapped>
    | ComputedFieldMapping<TMapped, TArgs>

function isMappedFromColumn(f: FieldMapping<any, any>): f is ColumnFieldMapping<any> {
    return has(f, "sourceColumn");
}

function isComputed(f: FieldMapping<any, any>): f is ComputedFieldMapping<any, any> {
    return has(f, "derive");
}

export type FieldMappingArgs<T extends FieldMapping<any, any>> =
    T extends FieldMapping<infer I, any> ? I : never;

export class MappedField<T extends FieldMapping<any, any> = any> {
    constructor(
        public dataSource: MappedDataSource,
        public mappedName: string,
        private mapping: T
    ) {}

    get isMappedFromColumn() {
        return isMappedFromColumn(this.mapping);
    }

    get isComputed() {
        return isComputed(this.mapping);
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
        return `${this.dataSource.mappedName}[fields][${name}]`;
    }

    getValue(sourceRow: Dict) {
        if (this.isComputed) {
            const {type} = this.mapping;
            const {dependencies, derive} = (this.mapping as ComputedFieldMapping<T["type"], FieldMappingArgs<T>>);
            const args: any = pick(sourceRow, dependencies);
            return derive(args);
        }
        return sourceRow[(this as any as ColumnFieldMapping<T["type"]>).sourceColumn];
    }

    @Memoize
    get outputType(): GraphQLOutputType {
        if (this.mapping.to) {
            return this.mapping.to.output;
        }
        return deriveFieldOutputType(this);
    }

    @Memoize
    get inputType(): GraphQLInputType {
        if (this.mapping.to) {
            return this.mapping.to.input;
        }
        return deriveFieldInputType(this);
    }

    get Type(): t.TypeOf<T["type"]> {
        throw getTypeAccessorError('Type', 'MappedField');
    }
}
