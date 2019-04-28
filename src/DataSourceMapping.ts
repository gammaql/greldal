import * as t from "io-ts";
import * as Knex from "knex";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { Dict, MaybeMappedRT, Maybe } from "./util-types";
import { MappedField } from "./MappedField";
import { MappedDataSource } from "./MappedDataSource";
import { MappedAssociation } from "./MappedAssociation";

export const DataSourceMappingRT = t.intersection([
    t.type({
        /**
         * Name of the data source.
         *
         * This can either be a string or an object with stored and mapped properties.
         *
         * If provided as a string, then the mapped name of the data source
         * will be PascalCased singular variant of the name, and the stored name
         * will be the snake_cased pluralized variant.
         *
         * Eg. if name is specified either as "ProductManager" or "product_managers",
         * in both cases they will be normalized as:
         *
         * ```
         * {
         *     stored: 'product_managers',
         *     mapped: 'ProductManager'
         * }
         * ```
         *
         * Unless rootQuery is specified, the stored name will be used to identify the table to connect to.
         *
         * If exposed, the GraphQL type names are derived from the mapped name:
         *
         * - `ProductManager` - primary GraphQL output type for the entity
         * - `ShallowProductManager` - GraphQL output type containing only the fields and not associations
         * - `ProductManagerInput` - GraphQL input type for the entity
         * - `ShallowProductManagerInput` - Graphql input type for shallow entity (excludes associations)
         *
         * @property
         * @memberof DataSourceMapping
         */
        name: MaybeMappedRT(t.string, t.string),
    }),
    t.partial({
        /**
         * Human friendly description of an entity from this data source.
         */
        description: t.string,
        fields: t.Function,
        associations: t.Function,
        rootQuery: t.Function,
        connector: t.object,
    }),
]);

/**
 * Make sure you have gone through the [DataSource Mapping](guide:mapping-data-sources) guide first, which provides a high level overview of how data mapping works in practice
 * in GRelDAL.
 *
 * A DataSource mapping facilitates the mapping between the persistence layer and the application level entities.
 *
 * It has following major responsibilities:
 *
 * 1. To specify how the data source connects to the persistence layer.
 * 2. To describe the shape of a `row` stored in the persistence layer
 * 3. To describe the shape of an `entity` exposed to the application layer.
 * 4. To define the mapping between the two representations so an entity can be coverted to a row and vice versa.
 * 5. To define how this data source can connect to other data sources through joins or side-loading
 *
 * @api-category ConfigType
 */
export interface DataSourceMapping extends t.TypeOf<typeof DataSourceMappingRT> {
    /**
     * Field mapping obtained from [mapFields](api:mapFields)
     */
    fields?: (dataSource: MappedDataSource) => Dict<MappedField>;

    /**
     * Association mapping obtained from [mapAssociations](api:mapAssociations)
     */
    associations?: (dataSource: MappedDataSource) => Dict<MappedAssociation>;

    /**
     * By default dataSources will connect to a table matching storedName.
     *
     * Using a rootQuery we can configure the data source to connect to a different table, or a join of multiple tables.
     * Note that when working with joins, it is generally recommended to use associations over mapping to joined tables.
     */
    rootQuery?: (alias: Maybe<AliasHierarchyVisitor>) => Knex.QueryBuilder;

    /**
     * Dedicated Knex instance to be used for this data source.
     *
     * If not provided, the knex instance globally configured through [useDatabaseConnector](api:useDatabaseConnector) will be used.
     *
     * DataSource specific connector is primarily useful for supporting polyglot persistence and enables use of different
     * databases within the application.
     */
    connector?: Knex;
}
