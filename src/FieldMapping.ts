import * as t from "io-ts";
import { StrKey, InstanceOf, Dict } from "./utils/util-types";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { MappedField } from "./MappedField";
import { TypeSpec } from "./utils/types";
import { GraphQLInputType, GraphQLOutputType } from "graphql";

const BaseFieldMappingRT = t.intersection(
    [
        t.type({
            /**
             * @memberof BaseFieldMapping
             */
            type: InstanceOf(TypeSpec),
        }),
        t.partial({
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
    ],
    "BaseFieldMapping",
);

const ColumnFieldMappingRT = t.intersection(
    [
        BaseFieldMappingRT,
        t.partial({
            sourceColumn: t.string,
            sourceTable: t.string,
            isPrimary: t.boolean,
            fromSource: t.Function,
            toSource: t.Function,
        }),
    ],
    "ColumnFieldMapping",
);

const ComputedFieldMappingRT = t.intersection(
    [
        BaseFieldMappingRT,
        t.intersection([
            t.type({
                dependencies: t.array(t.string),
                derive: t.Function,
            }),
            t.partial({
                reduce: t.Function,
            }),
        ]),
    ],
    "ComputedFieldMapping",
);

/**
 *
 * @api-category ConfigType
 */
export interface BaseFieldMapping<TMapped> extends t.TypeOf<typeof BaseFieldMappingRT> {
    type: TypeSpec<TMapped, GraphQLInputType, GraphQLOutputType>;
    getColumnMappingList?: (
        aliasHierarchyVisitor: AliasHierarchyVisitor,
        aliasColumnsToTableScope: boolean,
    ) => ColumnMapping[];
}

/**
 * @api-category ConfigType
 */
type ColumnFieldMapping$1<TMapped = any> = BaseFieldMapping<TMapped> & t.TypeOf<typeof ColumnFieldMappingRT>;

export interface ColumnFieldMapping<TMapped = any> extends ColumnFieldMapping$1<TMapped> {
    fromSource?: (i: any) => TMapped;
    toSource?: (i: TMapped) => any;
}

/**
 * @api-category ConfigType
 */
export type ComputedFieldMapping<TMapped = any, TArgs extends {} = any> = BaseFieldMapping<TMapped> &
    t.TypeOf<typeof ComputedFieldMappingRT> & {
        dependencies: Array<StrKey<TArgs>>;
        derive: (args: TArgs) => TMapped;
        reduce?: (args: TArgs) => Dict;
    };

export const FieldMappingRT = t.union([ColumnFieldMappingRT, ComputedFieldMappingRT], "FieldMapping");

/**
 * @api-category ConfigType
 */
export type FieldMappingArgs<T extends FieldMapping<any, any>> = T extends FieldMapping<any, infer I> ? I : never;

export interface ColumnMapping {
    field: MappedField;
    columnRef: string;
    columnAlias: string;
}

/**
 * @api-category ConfigType
 */
export type FieldMapping<TMapped, TArgs extends {}> =
    | ColumnFieldMapping<TMapped>
    | ComputedFieldMapping<TMapped, TArgs>;
