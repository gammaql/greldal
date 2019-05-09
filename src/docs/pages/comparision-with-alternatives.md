# Comparision with Alternatives

GRelDAL is not the only solution in this space. While we provide brief notes below on why you might (or might not) want to use GRelDAL instead of some of the alternatives, please keep in mind that we (the maintainers of GRelDAL) don't have indepth experience in these solutions and we encourage you to conduct your own evaluation before picking a solution that is the right fit for your use cases.

## Why use GRelDAL instead of alternatives ?

- Unlike services like **Prisma** and **Hasura**, GRelDAL does not involve a separate managed backend service or an infrastructure component. You don't deploy GRelDAL as a service and interact with it. You also don't need to send across your data to some managed third party application. Instead, you simply use GRelDAL as a library and build your application around it. GRelDAL has no opinions on how you manage and scale your application, it is just another javascript library in your stack.

- Unlike solutions like **Hasura** & **Postgraphile**, GRelDAL is not tied to a single data store. You can use one of the many supported relational databases.

- Unlike **Prisma**, GRelDAL doesn't aim to provide just an alternative for your ORM. It aims to provide an alternative for both your ORM as well as your API builder. Through a single library you map your database layer to a GraphQL API that you expose to clients. The mapping layer is flexible enough to accomodate your business logic through custom resolvers, interceptors and virtual fields. No schema stitching is required - there is one single GraphQL API.

## When can the alternatives be better solutions ?

- GRelDAL currently isn't the ideal solution if the response payload of your requests is too large to fit into memory. The logic for transforming database query results into the shape requested by the GraphQL client assumes that the resolved dataset fits in memory.

- GRelDAL is slower than solutions like Postgraphile which do all the data transformations within the database before they get transmitted down the wire. We believe this is an acceptable compromise that enables us to integrate better with business logic written in javascript/typescript and support polyglot persistence.

- GRelDAL strives to be typesafe (if you use TypeScript) but it doesn't guarantee absense of runtime errors for database operations - solutions like Prisma and Hasura (written in Scala and Haskell respectively) may offer stronger guarantees by relying on the powerful type systems of these languages. We will continually strive for improvement around this, but we consider basing our solution on TypeScript to be a good decision for more cohesive & flexible integration with applications where business logic is implemented in javascript/typescript.

- GRelDAL doesn't handle scaling, migrations, database management for you. It is assumed that you are choosing GRelDAL because you want to retain control over database management aspects and have the requisite expertise.

---

If you maintain, use or are enthusiastic about one of the third party solutions mentioned, and find any inaccurancies in the notes above, please send a pull request to fix them.
