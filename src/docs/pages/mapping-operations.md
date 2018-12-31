import Link from "next/link";

# Mapping Operations

GRelDAL supports two types of GraphQL operations: [Queries and Mutations](https://graphql.org/learn/schema/#the-query-and-mutation-types).

Let us say we have following data source mapping:

```ts
const users = mapDataSource({
    name: "User",
    fields: {
        id: {
            to: GraphQLID,
            type: types.number
        },
        name: {
            type: types.string,
        },
    },
});
```

Now we want to allow users to operate on this data source.
The most convenient way to make this happen is through one of pre-defined operation presets.

```ts
import {operationPresets} from "greldal";

const schema = mapSchema([
    operationPresets.query.findOneOperation(users)
]);
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

In real world applications we would probably want more flexibility in terms of how the arguments map to queries.

We will see a couple of approaches for this:

## Computed Fields

One approach that we have already seen is by defining computed fields in the data source mapping. GRelDQL can automatically resolve computed fields by mapping them to underlying concrete fields and deriving computed values from them.

## Argument Mapping

We can also specify the exact arguments we want to expose in our operation and how they map to SQL:

```ts
const argMapping = mapArgs({
    fullName: {
        description: "Full name of user",
        type: t.string,
        interceptQuery: (queryBuilder: Knex.QueryBuilder, value: string) => {
            const names = value.split(" ");
            return queryBuilder.where({
                first_name: names[0],
                last_name: names[1],
            });
        },
    },
});

const schema = mapSchema([
    new MappedQueryOperation({
        name: "findUsersByFullName",
        rootSource: mappedDataSource,
        singular: true,
        args: argMapping,
    }),
]);
```

## Writing custom resolvers

This is the most flexible option: A custom resolver is a class that extends from OperationResolver and implements a resolve function that contains the logic of the operation and returns what the API expects.

More often than not, a resolver will delegate to one or more of other operations as illustrated below:

```ts
import {OperationResolver} from "greldal";

const findOperation = operationPresets.query.findOneOperation(users);

class CustomFindOperationResolver extends OperationResolver {
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

const schema = mapSchema({
    new MappedQueryOperation({
        name: 'findByDepartmentId',
        rootSource: users,
        singular: true,
        args: mapArgs({
            department: {
                type: t.string
            }
        }),
        resolver; (operation, source, context, args, resolveInfoRoot) =>
            new CustomFindOperationResolver(
                operation,
                source,
                context,
                args,
                resolveInfoRoot
            )
    })
});
```

GRelDAL makes it easy to model complex business logic as a composition of individual operations by leveraging delegation.

## Writing custom operation mapping

While custom resolvers are flexible enough for most common scenarios, in some cases it may be helpful to write a custom operation mapping which provides a more granular control over how an operation is mapped to the graphql API.

This approach involves extending the MappedOperation class and providing a custom implementation for the graphQLOperation getter.

---

<Link href={`${ROOT_PATH}/mapping-associations`}><a>Next: <strong>(Mapping Associations)</strong> →</a></Link>
