import {NextPageLink} from "../components/Link";
import Link from "next/link";
import {CodeSnippet} from "../components/CodeSnippet";

# Stored Procedures

GRelDAL supports mapping GraphQL Operations to stored procedures or user defined functions.

## User defined functions: 

From [Wikipedia](https://en.wikipedia.org/wiki/User-defined_function): 

> In relational database management systems, a user-defined function provides a mechanism for extending the functionality of the database server by adding a function, that can be evaluated in standard query language (usually SQL) statements. 

Here is an example of a simple UDF that adds two numbers: 

<CodeSnippet name="udf_example" stripHeadLines={1} stripTailLines={1} />

We can map this UDF to a GrelDAL operation using the `mapUserDefinedFunction` function: 

<CodeSnippet name="udf_mapping" />

We can expose this operation in the GraphQL API by passing the above to the `mapSchema` function similar to any other operation.

Once exposed, we can use GraphQL to perform the operation: 

<CodeSnippet name="udf_mapping_usage" />

## Stored Procedures:

From [Wikipedia](https://en.wikipedia.org/wiki/Stored_procedure)

> A stored procedure (also termed proc, storp, sproc, StoPro, StoredProc, StoreProc, sp, or SP) is a subroutine available to applications that access a relational database management system (RDBMS). Such procedures are stored in the database data dictionary.

Stored procedures are usually more powerful than User defined functions in that they can perform transactions and return multiple values. 

The syntax of defining stored procedures differs across databases: 

Here is an example of defining a stored procedure in MySQL: 

<CodeSnippet name="stored_proc_mysql_example" stripHeadLines={1} stripTailLines={1} />

Here is the equivalent in PostgreSQL (using PL/PgSQL): 

<CodeSnippet name="stored_proc_pg_example" stripHeadLines={1} stripTailLines={1} />

We can map this stored proc to a GrelDAL operation using the `mapStoredProcedure` function: 

<CodeSnippet name="stored_proc_mapping" />

We can expose this operation in the GraphQL API by passing the above to the `mapSchema` function similar to any other operation.

Once exposed, we can use GraphQL to perform the operation: 

<CodeSnippet name="stored_proc_mapping_usage" />

<NextPageLink>Subscriptions</NextPageLink>