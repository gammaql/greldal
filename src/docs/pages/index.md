import {NextPageLink, Link} from "../components/Link";
import {LibHeader} from "../components/LibHeader";
import {CodeSnippet} from "../components/CodeSnippet";

<LibHeader />

<div style={{fontSize: "1.5rem", lineHeight: "2.5rem", margin: "2rem 0", fontWeight: 500, color: "slategray"}}>
  GRelDAL is a micro-framework for exposing your relational datastore as a GraphQL API powered by Node.js
</div>

The project is hosted on [GitHub](https://github.com/gammaql/greldal), and has a growing [test suite](https://travis-ci.org/gammaql/greldal).

GRelDAL is available for use under the [MIT software license](https://github.com/gammaql/greldal/blob/master/LICENSE).

You can report bugs on the [GitHub issues page](https://github.com/gammaql/greldal/issues).

# Motive / Goals

[GraphQL](https://graphql.org/) is a powerful solution for making your server side data available to clients through a flexible and bandwidth efficient API.

However, if your primary data source is a **relational database** then mapping GraphQL queries to efficient database queries can be arduous. With naive hierarchical resolution of resolvers it is very easy to end up with inefficient data access patterns and [N+1 queries](https://stackoverflow.com/questions/97197/what-is-the-n1-select-query-issue). Caching strategies, dataloader etc. partly mitigate the problem but the fact remains that you are not taking the full advantage of the capabilities of your powerful datastore.

GRelDAL is a simple **low level** library that gives you a declaritive API to map your relational data sources to GraphQL APIs. It is data store agnostic thanks to [Knex](https://knexjs.org), the underlying data access library that supports all common databases. Currently MySQL, PostgreSQL and SQLite are well tested.

When you generate your GraphQL API through GRelDAL, you can choose exactly how:

- Your database table schema maps to GraphQL types.
- Your GraphQL queries are mapped to SQL queries, including:
  - which tables can be joined under which circumstances
  - when batched queries can be performed
  - when related rows can be fetched in advance in bulk, etc.

GRelDAL puts you on the _driver's seat_, gives you complete control and takes care of a lot of hairy mapping and reverse-mapping logic for you, allowing you to take full advantage of your database engine. It is assumed that you (or your team) has deep understanding of the capabilities your datastore and want to ensure that only efficient queries are allowed and the possibility of a client inadvertantly triggering complex inefficient database operations is minimized.

# Installation

```sh
// Using npm:
npm install --save greldal

// Using yarn:
yarn add greldal
```

# Quick Start

## What you already need to know ?

In order to use GRelDAL you need to have a basic understanding of GraphQL. We don't cover GraphQL features in the docs here, but many great resources are available online, a particularly good example being [How to GraphQL](https://www.howtographql.com/).

You also need to have a good grasp over Javascript. Most examples here use ES6 features. If terms like harmony imports, arrow functions, destructuring sound unfamiliar, you may want to start out by reading [Javascript for impatient programmers](http://exploringjs.com/impatient-js/) and [Exploring ES6](http://exploringjs.com/es6/), both authored by Dr. Axel Rauschmayer.

[TypeScript](http://typescriptlang.org) is not required, but recommended for larger projects. GRelDAL itself is written in TypeScript and comes with type definitions. We take a pragmatic stance towards <Link href="type-safety">Type Safety</Link>

## Try in your browser

You can try out GRelDAL in the <Link href="playground">browser based playground</Link> without installing anything. 

The playground is currently experimental and offers a limited set of features.

## Our pre-configured starter project

GRelDAL core library is fairly un-opinionated. 

However, to make getting started easier, we provide an official seed starter project that has some opinionated defaults pre-configured.

To get started you can `git clone https://github.com/gammaql/greldal-starter.git` and start tinkering with the application without having to worry about the initial boilerplate.

## Basic Usage

Using GRelDAL involves two steps:

1. Configuring a Knex instance
2. Defining data sources mappers
3. Defining operations on these data sources
4. Generating a GraphQL Schema from these operations
5. Exposing this schema through a HTTP Server

### Configuring a Knex instance

GRelDAL uses Knex to connect to databases. We need to provide GRelDAL a knex instance configured to connect to our database of choice.

```ts
import Knex from "knex";
import {useDatabaseConnector} from "greldal";

const knex =  Knex({
    client: 'pg',
    connection: process.env.DATABASE_URL
});

useDatabaseConnector(knex)
```

More details around Knex initialization are available in the [Knex documentation](https://knexjs.org/#Installation-client). 

While the above code illustrates usage with postgres, Knex supports all major databases. GRelDAL officially supports `Postgres`,
`MySQL` & `SQLite` at the moment.

GRelDAL supports polyglot persistence through DataSource level connectors.

### Defining a data source mapper

<CodeSnippet name="mapDataSource_user_simple" />

This defines a `User` data source having three fields: `id`, `name` and `age`. This essentially maps a `users` table (having two columns `id` and `name`) in database to a `GraphQLOutput` type with three fields `id` (type: `GraphQLID`), `name` (type: `GraphQLString`) and `age` (type: `GraphQLInt`).

Note that the above configuration practically has zero duplication of information. We didn't have to specify the name of table this data source was linked to (it was inferred as plural of 'User'). 

Also, because our column names and field names are same we didn't have to specify them twice. When we have equivalent types available in typescript and GraphQL (eg. `string` and `GraphQLString`) we don't have to specify the type mapping either. GRelDAL leverages [convention-over-configuration](https://en.wikipedia.org/wiki/Convention_over_configuration) to minimize the development effort.

### Defining operations

Once we have data sources, we can define operations on these data sources.

```ts
import { operationPresets } from "greldal";

const findManyUsers = operationPresets.query.findManyOperation(users);
```

GRelDAL comes with some operation presets. These operation presets make it trivial to perform CRUD operations on data sources with minimal code.

The above line of code defines a `findMany` operation on the users data source.

The section on <Link>Mapping Operations</Link> covers more ground on defining custom operations and reusing operations.

### Generating GraphQL Schema

Once we have operations, we can expose them to the GraphQL API by mapping them to a schema:

```ts
import { mapSchema } from "greldal";

const generatedSchema = mapSchema([findManyUsers]);
```

The `generatedSchema` here is a [GraphQLSchema](https://graphql.org/graphql-js/type/#graphqlschema) instance which [graphql-js](https://graphql.org/graphql-js) can use for resoluton of operations.

In this case, the `findMany` operation on users table can be invoked like this:

```ts
import { graphql } from "graphql";

graphql(
    generatedSchema,
    `findManyUsers(where: {name: "John"}) {
        id,
        name
    }
    `,
);
```

### Exposing GraphQL API

While the ability to query the generated schema directly is useful in itself, most likely you are building a web application and you would like to expose this GraphQL schema through an API over HTTP.

There are popular libraries already available for this, and this step is the same as what you would do when building any GraphQL API.

For example, if we are using [express](https://expressjs.com/) as our web framework, we can use the [express-graphql](https://github.com/graphql/express-graphql) package to expose our GraphQL API.

```ts
import express from "express";
import graphqlHTTP from "express-graphql";

const app = express();

app.use(
    "/graphql",
    graphqlHTTP({
        schema: generatedSchema,
        graphiql: true
    }),
);

app.listen(4000);
```

Now if we visit [`localhost:4000`](http://localhost:4000) in a browser, we will see a [graphiql](https://github.com/graphql/graphiql) interface which we can use to query our data source. We can also use any client side library like [react-apollo](https://github.com/apollographql/react-apollo) to interact with this API. No GRelDAL specific code is required on the client side.

### Where to go next ?

GRelDAL <Link href="guides">guides</Link> cover most important features and going through the guides will enable you hit the ground running building real world applications in no time.

You can also checkout the <Link href="api">API Documentation</Link>, <Link>Architecture Overview</Link> and <a href="https://github.com/gammaql/greldal">Source Code</a>.
