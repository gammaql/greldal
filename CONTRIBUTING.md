# Contributing

First off, thanks for taking the time to contribute! 

GRelDAL welcomes contributions in form of bug reports, bug fixes, code contributions to add new features and enhancements and documentation enhancements. 

In case of code contributions, please note that GRelDAL takes backward compatibility very seriously and unless absolutely needed backward incompatible changes are to be avoided. Also if needed at all, the older behavior would have to go through a deprecation cycle (over one major release).

# Terminolgy

Unless otherwise specified in the context, following terms can be assumed to have these semantics in the context of GRelDAL: 

## DataSource

dataSource (camel-cased, concatenated) always refers to a `MappedDataSource` instance returned by `mapDataSource` function, which can be used to interact with a backend data source (eg. database table, view etc.)

## Row

A row returned returned from a database query

## Column

A column in a relational database.

## Entity

Plain javascript object that represents an entity in the application. Business logic in application code is always expected to interact with mapped entities as opposed to rows or instances of library defined classes. 
