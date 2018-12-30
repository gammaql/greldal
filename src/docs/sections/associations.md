# Mapping Queries over Associations

While data sources derived from a single tables are useful in themselves, in larger applications, you'd likely have data stored across multiple tables. After all, the ability to join tables and enforce constraints on connected tables is what makes relational databases so powerful.

GRelDAL makes it easy for you to take advantage of advanced features of relational databases, by providing APIs to link data sources through different loading strategies.

### Associations fetched through join queries

We can configure an association between multiple data sources to use a join.

```ts
const products = mapDataSource({
    name: "Product",
    fields,
    associations: {
        department: {
            target: () => departments,
            singular: true,
            fetchThrough: [
                {
                    join: "leftOuterJoin",
                },
            ],
            associatorColumns: {
                inSource: "department_id",
                inRelated: "id",
            },
        },
    },
});
```

So now, for a query like the following:

```
findManyProducts(where: {release_month: "december"}) {
    id,
    name,
    department {
        id,
        name
    }
}
```

GRelDAL will join the `products` and `departments` table on the `department_id` and `id` columns.

You are not limited in how many tables you can join and how the joins should be performed. Even in case of multiple joins or recursive joins, GRelDAL can take care of reverse mapping the fetched data sets into the hierarchical format your client expects.

```ts
const tags = mapDataSource({
    name: "Tag",
    fields,
    associations: {
        products: {
            target: () => products,
            singular: false,
            fetchThrough: [
                {
                    // Instead of the above configuration based join, we are now tapping into the underlying data access
                    // library - Knex, to perform a join over multiple tables.
                    join: (queryBuilder, aliasTreeVisitor) => {
                        // GRelDAL relies on aliases to alleviate conflicts and to properly map the
                        // fetched data set (tabular) to the format the client expects (hierarchical).
                        //
                        // So we need to use the aliases exposed through aliasTreeVisitor when querying the data source

                        // Lets derive visitors for the tables we intend to join
                        const ptaVisitor = aliasTreeVisitor.visit("product_tag_associators");
                        const productsVisitor = ptaVisitor.visit("products");

                        queryBuilder
                            .leftOuterJoin(
                                // Now we can obtain registered aliases from these visitors and use them in our queries
                                `product_tag_associators as ${ptaVisitor.alias}`,
                                `${ptaVisitor.alias}.tag_id`,
                                `${aliasTreeVisitor.alias}.id`,
                            )
                            .leftOuterJoin(
                                `products as ${productsVisitor.alias}`,
                                `${productsVisitor.alias}.id`,
                                `${ptaVisitor.alias}.product_id`,
                            );

                        // Once we have constructed the query, we are done. We don't have to write any mapping logic
                        // for converting the obtained results into the hierarchy of fields.
                        return productsVisitor;
                    },
                },
            ],
        },
    },
});
```

### Associations fetched through batch queries:

An alternative to joins is to side-load the operations on related data sources.

Note that in the below scenario, when we are fetching a department and related products, we are always making only two queries - irrespective of the number of departments or the number of products we have or how many of them end up in our result set. Both of these queries are batched, and once again we can fall back on GRelDAL do our reverse mapping for us.

```js
const departments = mapDataSource({
    name: "Department",
    fields,
    associations: {
        products: {
            target: () => products,
            singular: false,
            associatorColumns: {
                inSource: "id",
                inRelated: "department_id",
            },
            fetchThrough: [
                // We can define multiple side-loading strategies here.
                //
                // When user queried by id of department, then we don't have to wait for the query on departments to complete
                // before we start fetching products. In case of preFetch strategy, these queries can happen in parallel, because
                // given the parameters used to query the data source we can start a parallel query to fetch all the products in
                // matching departments
                {
                    useIf(operation) {
                        return has(operation.args, ["where", "id"]);
                    },
                    preFetch(operation) {
                        // What preFetch returns is a MappedForeignQuery - which basically points to another operation
                        // in the related data source (findManyProducts) and the arguments needed to initiate this operation.
                        //
                        // Being able to compose operations defined on multiple data sources is one of the most compelling features
                        // of GRelDAL.
                        const department_id: string = operation.args.where.id;
                        return {
                            query: findManyProducts,
                            args: {
                                where: {
                                    department_id,
                                },
                            },
                        };
                    },
                },

                // However if the query parameters to departments are not enough to identify which products we need to fetch,
                // we can wait for the departments
                {
                    postFetch(operation, parents) {
                        // As above, we are instructing GRelDAL to initiate another operation in a foreign data source.
                        // However, in this case this body will execute once the query on parents has finished. So we have an array of
                        // fetched parents at our disposal which we can use to identify additional arguments to narrow down the
                        // subset of products to fetch.
                        return {
                            query: findManyProductsByDepartmentIdList,
                            args: {
                                department_ids: map(parents, "id"),
                            },
                        };
                    },
                },
            ],
        },
    },
});

```
