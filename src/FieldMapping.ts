import * as t from "io-ts";
import { StrKey, IOType, InstanceOf, GQLInputType, GQLOutputType, Dict } from "./utils/util-types";
import { GraphQLScalarType } from "graphql";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { MappedField } from "./MappedField";

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
        isPrimary: t.boolean,
    }),
]);

const ComputedFieldMappingRT = t.intersection([
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
]);

/**
 *
 * @api-category ConfigType
 */
export type BaseFieldMapping<TMapped extends t.Mixed> = t.TypeOf<typeof BaseFieldMappingRT> & {
    type: TMapped;
    getColumnMappingList?: (
        aliasHierarchyVisitor: AliasHierarchyVisitor,
        aliasColumnsToTableScope: boolean,
    ) => ColumnMapping[];
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
        reduce?: (args: TArgs) => Dict;
    };

export const FieldMappingRT = t.union([ColumnFieldMappingRT, ComputedFieldMappingRT]);

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
export type FieldMapping<TMapped extends t.Type<any>, TArgs extends {}> =
    | ColumnFieldMapping<TMapped>
    | ComputedFieldMapping<TMapped, TArgs>;
