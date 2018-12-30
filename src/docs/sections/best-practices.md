# Best Practices

Following best practices are strongly recommended by the developers of GRelDAL based on their experience of working with ambitious data driven applications.

## Ensure that database schema is in Source Control

GRelDAL currently doesn't do anything to ensure that the fields defined in data store are in sync with the database schema and you are responsible for ensuring that they don't go out of sync.

One of the most practical ways to ensure this is to use [migrations](https://knexjs.org/#Migrations) and ensure that any schema changes are tracked in version control.

For the same reason we also insist on having integration tests which test against an actual database on which the migrations have been run before each deployment.

Because our underlying data access layer Knex already has good migration support and cli, GRelDAL doesn't provide any additional utilities for database schema management.

## Ensure backward compatibility of APIs

It is also recommended to have a snapshot test of the output of `printSchema(generatedSchema)`, where [printSchema](https://graphql.org/graphql-js/utilities/#printschema) is a function exposed from `graphql-js` which prints out a human readable description of the schema and types involved in [GraphQL SDL](https://alligator.io/graphql/graphql-sdl/) format.

It is useful for auditing changes in the exposed API as the application involves. GraphQL APIs are generally expected to be forever backward compatible and auditing of the schema is a practical way of ensuring that.

The schema snapshot also serves as contract document that describes your API in an industry standard format.
