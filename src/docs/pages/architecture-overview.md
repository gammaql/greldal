import NotificationBanner from '../components/NotificationBanner';

<NotificationBanner>
⚠️ This document is not an introduction for beginners. If you are new to GRelDAL it is strongly recommended that you first go through the Quick Start section and the guides first.
</NotificationBanner>

# Architecture Overview

This post describes the architecture of GRelDAL at a high level. The primary intended audience are the potential contributors. For lower level specifics, readers are encouraged to read the source.

It is also advisable to go through the terminology section of the API Overview before going through the content below.

There are four primary concepts around which GRelDAL is built:

1. Mapped Data Sources
2. Mapped Operations
3. Operation Resolvers
4. Operation Presets

## Mapped data sources

Mapped data sources represent a source in a relational database (usually a table, or a view, sometimes a joined table) which can serve as our primary source of truth.

It is the responsibility of a `MappedDataSource` instance to talk to the data source it represents. In many cases the actual data structure we expose to the application layer (referred here as Entities) differs from the table schema of the data source and in these cases it is the responsibility of the mapped data source to transparently convert between these representations and shield the application from having to know about the table schema.

Unlike ORMs, GRelDAL recommends usage of plain old javascript objects as entities.

A `MappedDataSource` instance can be constructed by calling the `mapDataSource` function, which accepts a mapping configuration.
This mapping configuration determines:

1. How the columns (in the source) are mapped to fields (of the entity).
2. What other data sources this data source can be associated with, and how can these associations be loaded.

Data sources can "cooperate" (by transforming a shared query builder) when the operation spans over multiple data sources - eg. when performing operations on join tables.

## Mapped Operations

Operations generalize the concepts of Queries and mutations in GraphQL.

```
Operation // Abstract interface for an operation mapSchema can handle (1)
   ^
   |
   |_ MappedOperation // Base class for GRelDAL aware operations
         ^
         |
         |_ MappedSingleSourceOperation    // Base class for operations that operates on a single primary source
         |     ^
         |     |_ MappedSingleSourceQueryOperation
         |     |_ MappedSingleSourceInsertionOperation
         |     |_ MappedSingleSourceUpdateOperation
         |     |_ MappedSingleSourceDeletionOperation
         |
         |_ MappedMultiSourceOperation    // Base class for operations that operate on multiple sources
               ^
               |_ MappedMultiSourceUnionQueryOperation

```

Operations delegate the actual resolution to an associated operation resolver. All the information that the resolver may need are encapsulated in the ResolverContext DTO which is instantiated by the Operation implementation. 


## Operation Resolvers

Operation resolvers implement the actual logic for resolving the operations. All the `MappedOperation` implementations defined by GRelDAL are associated with corresponding default resolvers, however they can be overriden through operation mapping configuration.

```
Operation                                                                                                      OperationResolver
   ^                                                                                                                          ^
   |                                                                                                                          |
   |_ MappedOperation                                                                          SourceAwareOperationResolver___|
         ^                                                                                                         ^
         |                                                                                                         |
         |_ MappedSingleSourceOperation                                                                            |
         |     ^                                                                                                   |
         |     |_ MappedSingleSourceQueryOperation ------ (defaults to)->     SingleSourceQueryOperationResolver __|
         |     |_ MappedSingleSourceInsertionOperation -- (defaults to)-> SingleSourceInsertionOperationResolver __|
         |     |_ MappedSingleSourceUpdateOperation ----- (defaults to)->    SingleSourceUpdateOperationResolver __|
         |     |_ MappedSingleSourceDeletionOperation --- (defaults to)->  SingleSourceDeletionOperationResolver __|
         |                                                                                                         |
         |_ MappedMultiSourceOperation                                                                             |
               ^                                                                                                   |
               |_ MappedMultiSourceUnionQueryOperation -- (defaults to)-> MultiSourceUnionQueryOperationResolver __|

```

Query resolvers can also "delegate" through "side-loading" - this is a better alternative to hierarchical resolution in GraphQL that often results in N+1 query patterns because side-loading supports batch resolution and resolved results are automatically mapped and associated to parent entities.

## Operation Presets

Operation presets are pre-configured operation for common use cases (CRUD operations).

Despite being pre-configured presets afford a great deal of flexibility because it accomodates custom transformation of mapping through interceptors.

# Operation resolution process

GRelDAL is designed to work with graphql.js - the reference implementation of GraphQL provided by facebook.

`mapSchema` function constructs a graphql.js compatible schema from a collection of GRelDAL operations. Every operation has a fieldConfig getter that returns a graphql.js compatible fieldConfig. Application can associate interceptors for the fieldConfig which can transform how an operation is mapped to a query/mutation field.

Most of the GraphQL types are derived from the DataSource mapping configuration.

Resolution of a typical GraphQL Query looks something like this:

```
              ___
               |                                         Parsing of GraphQL DSL
               |                                             |
               |                                             |
In graphql.js -|                                             V
               |                                         Identify fieldConfig using query/mutation name
               |                                             |
               |                                             V
               |                                         Invoke fieldConfig.resolve
               |                                             |
              _|_                  ___                       V
               |                    |                    Initialize ResolverContext (1)
               |                    |                        |
               |                    |                        V
               |                    |                    Locate OperationResolver implementation
               |                 In |                        |
               |    MappedOperation |                        V
               |                    |                    Initialize OperationResolver with resolverContext
               |                    |                        |
               |                    |                        V
               |                   -+-                   Invoke OperationResolver#resolve
               |                    |                        |
               |                    |                        V
               |                    |                    Invoke dataSource methods to construct SQL query
           In  |                In  |                        |
      GRelDAL  | OperationResolver  |_                       V
               |                    |                    Invoke Knex to construct SQL query
               |                    |                        |
               |                    |                        V
               |                    | In                 Use configured data source connector to run SQL
               |                    | MappedDataSource       |
               |                    |                        |
               |                    |                        V
               |                    |                    Transform response to format expected in the GraphQL Query
               |                    |                        |
               |                    |                        V
              _|_                  _|_                   Return response
In graphql.js  |                                             |
               |                                             V
              _|_                                        Recursively visit and validate response

```
