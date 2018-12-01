# Associations

While data sources derived from a single tables are useful in themselves, in larger applications, you'd likely have data stored across multiple tables.

GRelDAL makes it easy for you to take advantage of advanced features of relational databases, by providing APIs to link data sources through different loading strategies.

### Associations fetched through join queries

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

### Associations fetched through batch queries:

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
                {
                    useIf(operation) {
                        return has(operation.args, ["where", "id"]);
                    },
                    preFetch(operation) {
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
                {
                    postFetch(operation, parents) {
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
