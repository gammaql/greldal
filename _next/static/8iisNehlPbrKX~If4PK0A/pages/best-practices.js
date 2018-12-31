(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{535:function(e,a,n){__NEXT_REGISTER_PAGE("/best-practices",function(){return e.exports=n(536),{page:e.exports.default}})},536:function(e,a,n){"use strict";n.r(a);var t=n(0),o=n.n(t),r=n(1);function s(e,a){if(null==e)return{};var n,t,o=function(e,a){if(null==e)return{};var n,t,o={},r=Object.keys(e);for(t=0;t<r.length;t++)n=r[t],a.indexOf(n)>=0||(o[n]=e[n]);return o}(e,a);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(t=0;t<r.length;t++)n=r[t],a.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}a.default=function(e){var a=e.components;s(e,["components"]);return o.a.createElement(r.MDXTag,{name:"wrapper",components:a},o.a.createElement(r.MDXTag,{name:"h1",components:a,props:{id:"best-practices"}},o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"h1",props:{href:"#best-practices","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"a",props:{className:"icon icon-link"}})),"Best Practices"),o.a.createElement(r.MDXTag,{name:"p",components:a},"Following best practices are strongly recommended by the developers of GRelDAL based on their experience of working with ambitious data driven applications."),o.a.createElement(r.MDXTag,{name:"h2",components:a,props:{id:"ensure-that-database-schema-is-in-source-control"}},o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"h2",props:{href:"#ensure-that-database-schema-is-in-source-control","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"a",props:{className:"icon icon-link"}})),"Ensure that database schema is in Source Control"),o.a.createElement(r.MDXTag,{name:"p",components:a},"GRelDAL currently doesn't do anything to ensure that the fields defined in data store are in sync with the database schema and you are responsible for ensuring that they don't go out of sync."),o.a.createElement(r.MDXTag,{name:"p",components:a},"One of the most practical ways to ensure this is to use ",o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"p",props:{href:"https://knexjs.org/#Migrations"}},"migrations")," and ensure that any schema changes are tracked in version control."),o.a.createElement(r.MDXTag,{name:"p",components:a},"For the same reason we also insist on having integration tests which test against an actual database on which the migrations have been run before each deployment."),o.a.createElement(r.MDXTag,{name:"p",components:a},"Because our underlying data access layer Knex already has good migration support and cli, GRelDAL doesn't provide any additional utilities for database schema management."),o.a.createElement(r.MDXTag,{name:"h2",components:a,props:{id:"ensure-backward-compatibility-of-apis"}},o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"h2",props:{href:"#ensure-backward-compatibility-of-apis","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"a",props:{className:"icon icon-link"}})),"Ensure backward compatibility of APIs"),o.a.createElement(r.MDXTag,{name:"p",components:a},"It is also recommended to have a snapshot test of the output of ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"printSchema(generatedSchema)"),", where ",o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"p",props:{href:"https://graphql.org/graphql-js/utilities/#printschema"}},"printSchema")," is a function exposed from ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"graphql-js")," which prints out a human readable description of the schema and types involved in ",o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"p",props:{href:"https://alligator.io/graphql/graphql-sdl/"}},"GraphQL SDL")," format."),o.a.createElement(r.MDXTag,{name:"p",components:a},"It is useful for auditing changes in the exposed API as the application involves. GraphQL APIs are generally expected to be forever backward compatible and auditing of the schema is a practical way of ensuring that."),o.a.createElement(r.MDXTag,{name:"p",components:a},"The schema snapshot also serves as contract document that describes your API in an industry standard format."))}}},[[535,1,0]]]);