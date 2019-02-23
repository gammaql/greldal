import * as t from "io-ts";
import * as Knex from "knex";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { Dict, MaybeMapped, Maybe } from "./util-types";
import { MappedField } from "./MappedField";
import { MappedDataSource } from "./MappedDataSource";
import { MappedAssociation } from "./MappedAssociation";

export const DataSourceMappingRT = t.intersection([
    t.type({
        /**
         * Name of data source
         *
         * This can either be a string or an object with stored and mapped properties
         *
         * @property
         * @memberof DataSourceMapping
         */
        name: MaybeMapped(t.string, t.string),
    }),
    t.partial({
        description: t.string,
        fields: t.Function,
        associations: t.Function,
        rootQuery: t.Function,
        connector: t.object,
    }),
]);

/**
 * Configuration for mapping a data source.
 *
 * Make sure you have seen the Data Mapping Guide
 *
 * @api-category ConfigType
 */
export type DataSourceMapping = t.TypeOf<typeof DataSourceMappingRT> & {
    /**
     * Mapping of fieldNames to Configuration for fields
     *
     * Refer [FieldMapping](api:FieldMapping) for specifics
     */
    fields?: (dataSource: MappedDataSource) => Dict<MappedField>;
    associations?: (dataSource: MappedDataSource) => Dict<MappedAssociation>;
    rootQuery?: (alias: Maybe<AliasHierarchyVisitor>) => Knex.QueryBuilder;
    connector?: Knex;
};
