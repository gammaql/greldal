import Link from "next/link";
import {LibHeader} from "../components/LibHeader";

<LibHeader />

<div style={{fontSize: "1.5rem", lineHeight: "2.5rem", margin: "2rem 0", fontWeight: 100, color: "slategray"}}>
  GRelDAL is a micro-framework to expose your relational datastore as a GraphQL API powered by Node.js
</div>

The project is hosted on [GitHub](https://github.com/gql-dal/greldal), and has a growing [test suite](https://travis-ci.org/lorefnon/greldal).

GRelDAL is available for use under the [MIT software license](https://github.com/gql-dal/greldal/blob/master/LICENSE).

You can report bugs and discuss features on the [GitHub issues page](https://github.com/gql-dal/greldal/issues).

---

# Status

:warning: GRelDAL is currently in alpha:

Documentation is sparse and APIs are subject to change

# Motive / Goals

GraphQL is a powerful solution for making your server side data available to clients through flexible and bandwidth efficient APIs.

However if your primary data source is a **relational database** then mapping GraphQL queries to efficient database queries can be arduous. With naive hierarchical resolution of resolvers it is very easy to end up with inefficient data access patterns and [N+1 queries](https://stackoverflow.com/questions/97197/what-is-the-n1-select-query-issue). Caching strategies, dataloader etc. partly mitigate the problem but the fact remains that you are not taking the full advantage of the capabilities of your powerful datastore.

GRelDAL is a simple **low level** library that gives you a declaritive API to map your relational data sources to GraphQL APIs. It is data store agnostic thanks to [Knex](https://knexjs.org), the underlying data access library that supports all common databases. Currently MySQL, PostgreSQL and SQLite are well tested.

When you generate your GraphQL API through GRelDAL, you can choose exactly how:

- Your database table schema maps to GraphQL types.
- Your GraphQL queries are mapped to SQL queries, including:
  - which tables can be joined under which circumstances
  - when batched queries can be performed
  - when related rows can be fetched in advance in bulk, etc.

GRelDAL puts you on the _driver's seat_, gives you complete control and takes care of a lot of hairy mapping and reverse-mapping logic for you, allowing you to take full advantage of your database engine. It is assumed that you (or your team) has deep understanding of the capabilities your data source and want to ensure that only efficient queries are allowed and the possibility of client inadvertantly triggering complex inefficient database operations is minimized.

# Installation

```
// Using npm:
npm install --save greldal

// Using yarn:
yarn add greldal
```

# Quick Start

Using GRelDAL involves two steps:

1. Defining data sources mappers
2. Defining operations on these data sources
3. Generating a GraphQL Schema from these operations
4. Exposing this schema through a HTTP Server

## Defining a data source mapper

```ts
import {types, mapDataSource} from "greldal";

const users = mapDataSource({
    name: 'User',
    description: 'users',
    fields: {
        id: {
            type: types.string,
            to: GraphQLID
        },
        name: {
            type: types.string,
        }
    }
});
```

## Defining operations

```ts
import {operationPresets} from "greldal";

const userOperations = operationPresets.all(users);
```

## Generating GraphQL Schema

```ts
import {mapSchema} from "greldal";

const generatedSchema = mapSchema(userOperations);
```

## Exposing GraphQL API

```ts
import express from "express";
import graphqlHTTP from "express-graphql";

const app = express();

app.use(
    "/graphql",
    graphqlHTTP({
        schema: generatedSchema
    })
);

app.listen(4000);
```

## Advanced Features

Above steps have illustrated a very small subset of what GRelDAL has to offer.

GRelDAL provides you control over almost all aspects of your API

- <Link href={`${ROOT_PATH}/mapping-customizations`}><a>Custom mapping</a></Link> of fields, arguments and response objects,
- <Link href={`${ROOT_PATH}/associations`}><a>Associations</a></Link> between data sources,
- Effecient loading of associations via joins or batch queries, etc.

This documentation will evolve in future to cover all of the above.

## Next Steps

- Checkout the [API Docs](https://gql-dal.github.io/greldal/api)
- Expore the [Source Code](https://github.com/gql-dal)
- Create [issues](https://github.com/gql-dal/greldal/issues) for aspects you would like to be prioritized or bugs you enounter.
- Submit [pull requests](https://help.github.com/articles/about-pull-requests/) for enhancements and bug fixes
