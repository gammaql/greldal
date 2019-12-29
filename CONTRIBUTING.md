# Contributing

First off, thanks for taking the time to contribute! 

GRelDAL welcomes contributions in form of:

1. Bug reports (Use github issues), 
2. Bug fixes (Use github pull requests or email patches to the collaborators), 
3. Other code contributions that add new features and enhancements 
4. Improvements to documentation

In case of code contributions, please note that GRelDAL takes backward compatibility very seriously and unless absolutely needed backward incompatible changes are to be avoided. Also if needed at all, the older behavior will have to go through a deprecation cycle (over one major release).

# Terminology

Unless otherwise specified in the context, following terms can be assumed to have these semantics in the context of GRelDAL: 

## DataSource

dataSource (camel-cased, concatenated) always refers to a `MappedDataSource` instance returned by `mapDataSource` function, which can be used to interact with a backend data source (eg. database table, view etc.)

## Row

A row of a table returned from a database query

## Column

A column in a relational database table.

## Entity

Plain javascript object that represents an entity in the application. Business logic in application code is always expected to interact with mapped entities as opposed to rows or instances of library defined classes. 

## Operation

A GRelDAL Operation is an operation against a data source such as simple CRUD operations (query, delete, update, insert) or custom user defined operations. 

Operations represent individual steps in business process and can be composed together to form larger workflows.

# Writing documentation

It is important to have documentation with small and to-the-point illustrative examples wherever possible. 

GRelDAL uses [snippet-collector](https://www.npmjs.com/package/snippet-collector) to extract examples from our test suite, which ensures:

1. Examples are actually runnable, and don't have typos or errors. 
2. Examples are easier to keep up to date as the library evolves.

In addition, it is important to:

1. Have API docs for all newly added code
2. Link to APIs from user manual and vice versa

The documentation site uses Next.js as a static site generator and uses (github-flavored) markdown format for content.
Usually markdown files are named by dasherizing the page heading so they are easy to find using github's file finder. For minor changes (eg. typos) it is perfectly fine to edit the markdown files from github itself and sending a PR.

English is not the first language for any of the project maintainers, so any help around documentation is highly appreciated. Also, translations in other languages would be really appreciated.

Please don't send PRs against the gh-pages branch. The documentation site is auto-generated. Project maintainers will deploy that using the `deploy:site` npm script.

# Coding conventions

While GRelDAL can be used from both JavaScript and TypeScript, code contributions to the library must always be in TypeScript and should strive to be type-safe as much as reasonably possible.

Following general practices are recommended: 

1. Don't create a class where a function would suffice
2. Instead of large functions, create smaller functions/methods and compose them so the intent is easy to grok by looking at a fewer lines of code. 
3. ES6 Classes are preferrable over usage of function prototype.
4. Don't change indentation or reformat existing code. The codebase is configured to use prettier to ensure a consistent styling - run `yarn run format` before submitting PRs.
5. For code that heavily uses generics - keep covariance and contravariant behavior in mind and ensure that whenever generics have default type parameters, type with specified params is always compatible with the type with default params (`Foo<A, B> extends Foo` for all `A`, `B` that are allowed). If this doesn't hold true, one of the following may be required:
  1. Add restrictions to generic type params, or
  2. Change default type params, or
  3. Remove the defaults entirely.
6. Prefix generic type params with `T` eg. `TArgs`.
7. Use yarn to add/remove dependencies and ensure that `yarn.lock` is up to date.

