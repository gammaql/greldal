# About

This is an example application to illustrate various features of GRelDAL.

The data used to populate the sample data store is derived from the Harry Potter universe, built up by J. K. Rowling in the Harry Potter series of books.
All the data used here is publicly available through unrestricted online sources.

## Running the application:

With Postgres:

```
DB_TYPE=PG PG_CONNECTION_STRING=postgresql://postgres:postgres@localhost/greldal_test yarn run start
```

With SQLite:

```
DB_TYPE=SQLITE yarn run start
```

With MySQL:

TBD
