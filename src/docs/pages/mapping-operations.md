import {NextPageLink, Link} from "../components/Link";
import {CodeSnippet} from "../components/CodeSnippet";

# Mapping Operations

GRelDAL supports two types of GraphQL operations: [Queries and Mutations](https://graphql.org/learn/schema/#the-query-and-mutation-types).

Let us say we have following data source mapping:

<CodeSnippet name="mapDataSource_user_simple" />

Now we want to allow users to operate on this data source.
The most convenient way to make this happen is through one of pre-defined operation presets.

```ts
import { operationPresets } from "greldal";

const schema = mapSchema([operationPresets.query.findOneOperation(users)]);
```

A `findOne` operation allows us to query the users table like this:

```
query {
    findOneUser(where: {id: 1}) {
        id
        name
    }
}
```

This will result in an SQL query like:

```sql
select
    `GQL_DAL_users__4`.`id` as `GQL_DAL_users__4__id`,
    `GQL_DAL_users__4`.`name` as `GQL_DAL_users__4__name`
from `users` as `GQL_DAL_users__4`
where `GQL_DAL_users__4`.`id` = 1
limit 1
```

The preset assumes that the properties of `args.where` map exactly to field names and we want to fetch results that match all of these values.

## Pagination support

It is possible to add pagination support for `findManyOperation` through `paginatedFindManyOperation` preset:

```ts
mapSchema([operationPresets.paginatedFindManyOperation(users)]);
```

The default implementation assumes sequentially incrementing primary fields and will fail if that is not the case.

We can separately configure a monotically increasing column to be used as a cursor:

```ts
mapSchema([
    operationPresets.paginatedFindManyOperation(users, mapping => ({
        ...mapping,
        cursorColumn: "ts",
    })),
]);
```

This results in GraphQL types like:

```
type GRelDALPageInfo {
  prevCursor: String
  nextCursor: String
  totalCount: Int
}

type query {
  findManyUsers(where: UserInput!): UserPageContainer
}

type User {
  id: ID
  name: String
  age: Int
}

type UserPage {
  pageInfo: GRelDALPageInfo
  entities: [User]
}

type UserPageContainer {
  page(cursor: String, pageSize: Int): UserPage
}
```
---

## Beyond CRUD Operations

In real world applications we would often want more flexibility in terms of how the arguments map to queries.

We will see a couple of approaches for this:

## Computed Fields

One approach that we have <Link href="mapping-data-sources#computed-fields">already seen</Link> is by defining computed fields in the data source mapping. GRelDQL can automatically resolve computed fields by mapping them to underlying concrete fields and deriving computed values from them.

## Argument Mapping

We can also specify the exact arguments we want to expose in our operation and how they map to SQL:

```ts
const argMapping = mapArgs({
    fullName: mapFields({
        description: "Full name of user",
        type: t.string,
        interceptQuery: (queryBuilder: Knex.QueryBuilder, value: string) => {
            const names = value.split(" ");
            return queryBuilder.where({
                first_name: names[0],
                last_name: names[1],
            });
        },
    }),
});

const schema = mapSchema([
    new MappedSingleSourceQueryOperation({
        name: "findUsersByFullName",
        rootSource: mappedDataSource,
        singular: true,
        args: argMapping,
    }),
]);
```

## Custom (operation) resolvers

Often your business logic will not exactly map to a single database operation, and you'd want to execute custom logic in your resolvers.

At a broad level we can have two potential scenarios:

### Resolvers that don't need database access at all

GRelDAL is primarily helpful for mapping GraphQL APIs to databases. However in many cases, a few resolvers will simply call external APIs, or do some in-memory computation, or access a local file etc. and return data. 

GRelDAL doesn't have anything to make such use cases easier, but it does make it easy to have such resolvers live alongside GRelDAL powered resolvers, and be a part of the same GraphQL without any schema-stitching. 

`mapSchema` function accepts an array of operations. These operations are objects that conform to the `Operation` interface.

<CodeSnippet name="Operation_type" />

The `fieldConfig` property here is any graphql-js compatible [FieldConfig](https://github.com/graphql/graphql-js/blob/49d86bbc810d1203aa3f7d93252e51f257d9460f/docs/APIReference-TypeSystem.md#graphqlobjecttype).

**Examples:**

**Simple Custom operation (without any args):**

<CodeSnippet name="AdhocOperation_withoutArgs" />

**Custom operation that accepts args:**

<CodeSnippet name="AdhocOperation_withDefaultArgs" />

### Resolvers that need database access

We can use the above approach to interact with database directly using Knex (or any other library). But GRelDAL makes this
use case slightly simpler through `SourceAwareOperationResolver` class.

More often than not, a resolver will delegate to one or more of other operation resolvers as illustrated below:

```ts
import {SourceAwareOperationResolver, MappedSingleSourceQueryOperation} from "greldal";

const findOperation = operationPresets.query.findOneOperation(users);

class CustomFindOperationResolver extends SourceAwareOperationResolver {
    resolve() {
        return findOperation.resolve({
            this.source,
            {
                department_id: this.args.department
            },
            this.context,
            this.resolveInfoRoot
        });
    }
}

const schema = mapSchema([
    new MappedSingleSourceQueryOperation({
        name: 'findByDepartmentId',
        rootSource: users,
        singular: true,
        args: mapArgs({
            department: {
                type: t.string
            }
        }),
        resolver: (operation, source, context, args, resolveInfoRoot) =>
            new CustomFindOperationResolver(
                operation,
                source,
                context,
                args,
                resolveInfoRoot
            )
    })
]);
```

Note that we delegated to just a single operation here (`findOperation`) but we could have delegated to multiple operations and then combined their values, which is common in practice.

It is also occasionally useful to have `resolver` function return different resolvers based on the context. So we can choose different resolution strategies (eg. whether or not to query a view) based on what is being queried.

GRelDAL makes it easy to model complex business logic as a composition of individual operations by leveraging delegation.

## Writing custom operation mapping

While custom resolvers are flexible enough for most common scenarios, in some cases it may be helpful to write a custom operation mapping which provides a more granular control over how an operation is mapped to the graphql API.

This approach involves extending the `MappedOperation` or `MappedSourceAwareOperation` class and providing a custom implementation for the `graphQLOperation` getter.

---

<NextPageLink>Mapping Associations</NextPageLink>
