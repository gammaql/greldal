<p align="center">
  <a href="https://gammaql.github.io/greldal/#basic-usage" title="GRelDAL Home page">
    <img src="https://raw.githubusercontent.com/gammaql/greldal/master/src/docs/assets/banner.png" width="600" />
  </a>
</p>

<p align="center">
  <strong>A simple micro-framework to expose your relational datastore as a GraphQL API (powered by Node.js).</strong>
</p>

<p align="center">
  <a href="https://gammaql.github.io/greldal/">Documentation</a> | <a href="https://github.com/gammaql/greldal/issues">Issues</a> | <a href="https://gammaql.github.io/greldal/api">API Docs</a>
</p>

---

[GraphQL](https://graphql.org/) is a powerful solution for making your server side data available to clients through a flexible and bandwidth efficient API.

However, if your primary data source is a **relational database** then mapping GraphQL queries to efficient database queries can be arduous. With naive hierarchical resolution of resolvers it is very easy to end up with inefficient data access patterns and [N+1 queries](https://stackoverflow.com/questions/97197/what-is-the-n1-select-query-issue). Caching strategies, dataloader etc. partly mitigate the problem but the fact remains that you are not taking the full advantage of the capabilities of your powerful datastore.

GRelDAL is a **low level** library that gives you a declaritive API to map your relational data sources to GraphQL APIs. It is data store agnostic thanks to [Knex](https://knexjs.org), the underlying data access library that supports all common databases. Currently MySQL, PostgreSQL and SQLite are well tested.

<br>
<br>

When you generate your GraphQL API through GRelDAL, you can choose exactly how:

- Your database table schema maps to GraphQL types.
- Your GraphQL queries are mapped to SQL queries, including:
  - which tables can be joined under which circumstances
  - when batched queries can be performed
  - when related rows can be fetched in advance in bulk, etc.

<br>
<br>

Plus, unlike many other similar solutions, GRelDAL has first class support for **subscriptions**, **stored procedures**, **user defined functions**, **JSON/XML/binary data** and **custom column types**.

<a href="https://gammaql.github.io/greldal/#basic-usage" title="Basic Usage">
  <img src="https://raw.githubusercontent.com/gammaql/greldal/master/src/docs/assets/get-started-icon.png" />
</a>

---

[![Build Status](https://travis-ci.org/gammaql/greldal.svg?branch=master)](https://travis-ci.org/gammaql/greldal)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fgammaql%2Fgreldal.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fgammaql%2Fgreldal?ref=badge_shield)

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fgammaql%2Fgreldal.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fgammaql%2Fgreldal?ref=badge_large)
