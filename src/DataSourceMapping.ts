import * as t from "io-ts";
import * as Knex from "knex";
import { FieldMapping } from "./FieldMapping";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { Dict, MaybeMapped, Maybe } from "./util-types";
import { AssociationMapping } from "./AssociationMapping";

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
        fields: t.dictionary(t.string, t.object),
        associations: t.dictionary(t.string, t.object),
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
    fields?: Dict<FieldMapping<any, any>>;
    associations?: Dict<AssociationMapping<any>>;
    rootQuery?: (alias: Maybe<AliasHierarchyVisitor>) => Knex.QueryBuilder;
    connector?: Knex;
};
