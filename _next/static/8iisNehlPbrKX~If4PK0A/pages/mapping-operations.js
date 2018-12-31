(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{548:function(e,a,n){__NEXT_REGISTER_PAGE("/mapping-operations",function(){return e.exports=n(549),{page:e.exports.default}})},549:function(e,a,n){"use strict";n.r(a);var t=n(0),s=n.n(t),o=n(1),p=n(6),r=n.n(p);function m(e,a){if(null==e)return{};var n,t,s=function(e,a){if(null==e)return{};var n,t,s={},o=Object.keys(e);for(t=0;t<o.length;t++)n=o[t],a.indexOf(n)>=0||(s[n]=e[n]);return s}(e,a);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)n=o[t],a.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(s[n]=e[n])}return s}a.default=function(e){var a=e.components;m(e,["components"]);return s.a.createElement(o.MDXTag,{name:"wrapper",components:a},s.a.createElement(o.MDXTag,{name:"h1",components:a,props:{id:"mapping-operations"}},s.a.createElement(o.MDXTag,{name:"a",components:a,parentName:"h1",props:{href:"#mapping-operations","aria-hidden":"true"}},s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"a",props:{className:"icon icon-link"}})),"Mapping Operations"),s.a.createElement(o.MDXTag,{name:"p",components:a},"GRelDAL supports two types of GraphQL operations: ",s.a.createElement(o.MDXTag,{name:"a",components:a,parentName:"p",props:{href:"https://graphql.org/learn/schema/#the-query-and-mutation-types"}},"Queries and Mutations"),"."),s.a.createElement(o.MDXTag,{name:"p",components:a},"Let us say we have following data source mapping:"),s.a.createElement(o.MDXTag,{name:"pre",components:a},s.a.createElement(o.MDXTag,{name:"code",components:a,parentName:"pre",props:{className:"hljs language-ts",metaString:""}},s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"const")," users = mapDataSource({\n    name: ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"User"'),",\n    fields: {\n        id: {\n            to: GraphQLID,\n            ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"type"),": types.number\n        },\n        name: {\n            ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"type"),": types.string,\n        },\n    },\n});")),s.a.createElement(o.MDXTag,{name:"p",components:a},"Now we want to allow users to operate on this data source.\nThe most convenient way to make this happen is through one of pre-defined operation presets."),s.a.createElement(o.MDXTag,{name:"pre",components:a},s.a.createElement(o.MDXTag,{name:"code",components:a,parentName:"pre",props:{className:"hljs language-ts",metaString:""}},s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"import")," {operationPresets} ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"from")," ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"greldal"'),";\n\n",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"const")," schema = mapSchema([\n    operationPresets.query.findOneOperation(users)\n]);")),s.a.createElement(o.MDXTag,{name:"p",components:a},"A ",s.a.createElement(o.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"findOne")," operation allows us to query the users table like this:"),s.a.createElement(o.MDXTag,{name:"pre",components:a},s.a.createElement(o.MDXTag,{name:"code",components:a,parentName:"pre",props:{metaString:null}},"query {\n    findOneUser(where: {id: 1}) {\n        id\n        name\n    }\n}\n")),s.a.createElement(o.MDXTag,{name:"p",components:a},"This will result in an SQL query like:"),s.a.createElement(o.MDXTag,{name:"pre",components:a},s.a.createElement(o.MDXTag,{name:"code",components:a,parentName:"pre",props:{className:"hljs language-sql",metaString:""}},s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"select"),"\n    ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},"`GQL_DAL_users__4`"),".",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},"`id`")," ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"as")," ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},"`GQL_DAL_users__4__id`"),",\n    ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},"`GQL_DAL_users__4`"),".",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},"`name`")," ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"as")," ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},"`GQL_DAL_users__4__name`"),"\n",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"from")," ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},"`users`")," ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"as")," ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},"`GQL_DAL_users__4`"),"\n",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"where")," ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},"`GQL_DAL_users__4`"),".",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},"`id`")," = ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-number"}},"1"),"\n",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"limit")," ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-number"}},"1"))),s.a.createElement(o.MDXTag,{name:"p",components:a},"The preset assumes that the properties of ",s.a.createElement(o.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"args.where")," map exactly to field names and we want to fetch results that match all of these values."),s.a.createElement(o.MDXTag,{name:"p",components:a},"In real world applications we would probably want more flexibility in terms of how the arguments map to queries."),s.a.createElement(o.MDXTag,{name:"p",components:a},"We will see a couple of approaches for this:"),s.a.createElement(o.MDXTag,{name:"h2",components:a,props:{id:"computed-fields"}},s.a.createElement(o.MDXTag,{name:"a",components:a,parentName:"h2",props:{href:"#computed-fields","aria-hidden":"true"}},s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"a",props:{className:"icon icon-link"}})),"Computed Fields"),s.a.createElement(o.MDXTag,{name:"p",components:a},"One approach that we have already seen is by defining computed fields in the data source mapping. GRelDQL can automatically resolve computed fields by mapping them to underlying concrete fields and deriving computed values from them."),s.a.createElement(o.MDXTag,{name:"h2",components:a,props:{id:"argument-mapping"}},s.a.createElement(o.MDXTag,{name:"a",components:a,parentName:"h2",props:{href:"#argument-mapping","aria-hidden":"true"}},s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"a",props:{className:"icon icon-link"}})),"Argument Mapping"),s.a.createElement(o.MDXTag,{name:"p",components:a},"We can also specify the exact arguments we want to expose in our operation and how they map to SQL:"),s.a.createElement(o.MDXTag,{name:"pre",components:a},s.a.createElement(o.MDXTag,{name:"code",components:a,parentName:"pre",props:{className:"hljs language-ts",metaString:""}},s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"const")," argMapping = mapArgs({\n    fullName: {\n        description: ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"Full name of user"'),",\n        ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"type"),": t.string,\n        interceptQuery: ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-function"}},"(",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"span",props:{className:"hljs-params"}},"queryBuilder: Knex.QueryBuilder, value: ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"span",props:{className:"hljs-built_in"}},"string")),") =>")," {\n            ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"const")," names = value.split(",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'" "'),");\n            ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"return")," queryBuilder.where({\n                first_name: names[",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-number"}},"0"),"],\n                last_name: names[",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-number"}},"1"),"],\n            });\n        },\n    },\n});\n\n",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"const")," schema = mapSchema([\n    ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"new")," MappedQueryOperation({\n        name: ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"findUsersByFullName"'),",\n        rootSource: mappedDataSource,\n        singular: ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-literal"}},"true"),",\n        args: argMapping,\n    }),\n]);")),s.a.createElement(o.MDXTag,{name:"h2",components:a,props:{id:"writing-custom-resolvers"}},s.a.createElement(o.MDXTag,{name:"a",components:a,parentName:"h2",props:{href:"#writing-custom-resolvers","aria-hidden":"true"}},s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"a",props:{className:"icon icon-link"}})),"Writing custom resolvers"),s.a.createElement(o.MDXTag,{name:"p",components:a},"This is the most flexible option: A custom resolver is a class that extends from OperationResolver and implements a resolve function that contains the logic of the operation and returns what the API expects."),s.a.createElement(o.MDXTag,{name:"p",components:a},"More often than not, a resolver will delegate to one or more of other operations as illustrated below:"),s.a.createElement(o.MDXTag,{name:"pre",components:a},s.a.createElement(o.MDXTag,{name:"code",components:a,parentName:"pre",props:{className:"hljs language-ts",metaString:""}},s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"import")," {OperationResolver} ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"from")," ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"greldal"'),";\n\n",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"const")," findOperation = operationPresets.query.findOneOperation(users);\n\n",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"class")," CustomFindOperationResolver ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"extends")," OperationResolver {\n    resolve() {\n        ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"return")," findOperation.resolve({\n            ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"this"),".source,\n            {\n                department_id: ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"this"),".args.department\n            },\n            ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"this"),".context,\n            ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"this"),".resolveInfoRoot\n        });\n    }\n}\n\n",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"const")," schema = mapSchema({\n    ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"new")," MappedQueryOperation({\n        name: ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},"'findByDepartmentId'"),",\n        rootSource: users,\n        singular: ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-literal"}},"true"),",\n        args: mapArgs({\n            department: {\n                ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"type"),": t.string\n            }\n        }),\n        resolver; ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-function"}},"(",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"span",props:{className:"hljs-params"}},"operation, source, context, args, resolveInfoRoot"),") =>"),"\n            ",s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"new")," CustomFindOperationResolver(\n                operation,\n                source,\n                context,\n                args,\n                resolveInfoRoot\n            )\n    })\n});")),s.a.createElement(o.MDXTag,{name:"p",components:a},"GRelDAL makes it easy to model complex business logic as a composition of individual operations by leveraging delegation."),s.a.createElement(o.MDXTag,{name:"h2",components:a,props:{id:"writing-custom-operation-mapping"}},s.a.createElement(o.MDXTag,{name:"a",components:a,parentName:"h2",props:{href:"#writing-custom-operation-mapping","aria-hidden":"true"}},s.a.createElement(o.MDXTag,{name:"span",components:a,parentName:"a",props:{className:"icon icon-link"}})),"Writing custom operation mapping"),s.a.createElement(o.MDXTag,{name:"p",components:a},"While custom resolvers are flexible enough for most common scenarios, in some cases it may be helpful to write a custom operation mapping which provides a more granular control over how an operation is mapped to the graphql API."),s.a.createElement(o.MDXTag,{name:"p",components:a},"This approach involves extending the MappedOperation class and providing a custom implementation for the graphQLOperation getter."),s.a.createElement(o.MDXTag,{name:"hr",components:a}),s.a.createElement(r.a,{href:"".concat("/greldal","/mapping-associations")},s.a.createElement("a",null,"Next: ",s.a.createElement("strong",null,"(Mapping Associations)")," →")))}}},[[548,1,0]]]);