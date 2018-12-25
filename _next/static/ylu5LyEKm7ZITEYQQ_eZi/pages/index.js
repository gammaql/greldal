(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{248:function(e,a,n){__NEXT_REGISTER_PAGE("/",function(){return e.exports=n(274),{page:e.exports.default}})},274:function(e,a,n){"use strict";n.r(a);var t=n(0),o=n.n(t),r=(n(57),n(87),n(1)),s=n(13),m=n.n(s),p=n(16),c=n.n(p),l=n(58),i=n.n(l),g=function(){return o.a.createElement("div",{style:{display:"flex",flexDirection:"row"},className:"jsx-248315842"},o.a.createElement(c.a,{styleId:"248315842",css:["img.jsx-248315842{height:100px;width:100px;}","h1.jsx-248315842{line-height:100px;margin:0;color:#e535ab;font-size:2.5rem;margin-left:5px;}"]}),o.a.createElement("img",{src:i.a,className:"jsx-248315842"})," ",o.a.createElement("h1",{className:"jsx-248315842"},"GRelDAL"))};function h(e,a){if(null==e)return{};var n,t,o=function(e,a){if(null==e)return{};var n,t,o={},r=Object.keys(e);for(t=0;t<r.length;t++)n=r[t],a.indexOf(n)>=0||(o[n]=e[n]);return o}(e,a);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(t=0;t<r.length;t++)n=r[t],a.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var d=function(e){var a=e.components;h(e,["components"]);return o.a.createElement(r.MDXTag,{name:"wrapper",components:a},o.a.createElement(g,null),o.a.createElement("div",{style:{fontSize:"1.5rem",lineHeight:"2.5rem",margin:"2rem 0",fontWeight:100,color:"slategray"}},"GRelDAL is a micro-framework to expose your relational datastore as a GraphQL API powered by Node.js"),o.a.createElement(r.MDXTag,{name:"p",components:a},"The project is hosted on ",o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"p",props:{href:"https://github.com/gql-dal/greldal"}},"GitHub"),", and has a growing ",o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"p",props:{href:"https://travis-ci.org/lorefnon/greldal"}},"test suite"),"."),o.a.createElement(r.MDXTag,{name:"p",components:a},"GRelDAL is available for use under the ",o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"p",props:{href:"https://github.com/gql-dal/greldal/blob/master/LICENSE"}},"MIT software license"),"."),o.a.createElement(r.MDXTag,{name:"p",components:a},"You can report bugs and discuss features on the ",o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"p",props:{href:"https://github.com/gql-dal/greldal/issues"}},"GitHub issues page"),"."),o.a.createElement(r.MDXTag,{name:"hr",components:a}),o.a.createElement(r.MDXTag,{name:"h1",components:a,props:{id:"status"}},o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"h1",props:{href:"#status","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"a",props:{className:"icon icon-link"}})),"Status"),o.a.createElement(r.MDXTag,{name:"p",components:a},"⚠️ GRelDAL is currently in alpha:"),o.a.createElement(r.MDXTag,{name:"p",components:a},"Documentation is sparse and APIs are subject to change"),o.a.createElement(r.MDXTag,{name:"h1",components:a,props:{id:"motive--goals"}},o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"h1",props:{href:"#motive--goals","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"a",props:{className:"icon icon-link"}})),"Motive / Goals"),o.a.createElement(r.MDXTag,{name:"p",components:a},"GraphQL is a powerful solution for making your server side data available to clients through flexible and bandwidth efficient APIs."),o.a.createElement(r.MDXTag,{name:"p",components:a},"However if your primary data source is a ",o.a.createElement(r.MDXTag,{name:"strong",components:a,parentName:"p"},"relational database")," then mapping GraphQL queries to efficient database queries can be arduous. With naive hierarchical resolution of resolvers it is very easy to end up with inefficient data access patterns and ",o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"p",props:{href:"https://stackoverflow.com/questions/97197/what-is-the-n1-select-query-issue"}},"N+1 queries"),". Caching strategies, dataloader etc. partly mitigate the problem but the fact remains that you are not taking the full advantage of the capabilities of your powerful datastore."),o.a.createElement(r.MDXTag,{name:"p",components:a},"GRelDAL is a simple ",o.a.createElement(r.MDXTag,{name:"strong",components:a,parentName:"p"},"low level")," library that gives you a declaritive API to map your relational data sources to GraphQL APIs. It is data store agnostic thanks to ",o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"p",props:{href:"https://knexjs.org"}},"Knex"),", the underlying data access library that supports all common databases. Currently MySQL, PostgreSQL and SQLite are well tested."),o.a.createElement(r.MDXTag,{name:"p",components:a},"When you generate your GraphQL API through GRelDAL, you can choose exactly how:"),o.a.createElement(r.MDXTag,{name:"ul",components:a},o.a.createElement(r.MDXTag,{name:"li",components:a,parentName:"ul"},"Your database table schema maps to GraphQL types."),o.a.createElement(r.MDXTag,{name:"li",components:a,parentName:"ul"},o.a.createElement(r.MDXTag,{name:"p",components:a,parentName:"li"},"Your GraphQL queries are mapped to SQL queries, including:"),o.a.createElement(r.MDXTag,{name:"ul",components:a,parentName:"li"},o.a.createElement(r.MDXTag,{name:"li",components:a,parentName:"ul"},"which tables can be joined under which circumstances"),o.a.createElement(r.MDXTag,{name:"li",components:a,parentName:"ul"},"when batched queries can be performed"),o.a.createElement(r.MDXTag,{name:"li",components:a,parentName:"ul"},"when related rows can be fetched in advance in bulk, etc.")))),o.a.createElement(r.MDXTag,{name:"p",components:a},"GRelDAL puts you on the ",o.a.createElement(r.MDXTag,{name:"em",components:a,parentName:"p"},"driver's seat"),", gives you complete control and takes care of a lot of hairy mapping and reverse-mapping logic for you, allowing you to take full advantage of your database engine. It is assumed that you (or your team) has deep understanding of the capabilities your data source and want to ensure that only efficient queries are allowed and the possibility of client inadvertantly triggering complex inefficient database operations is minimized."),o.a.createElement(r.MDXTag,{name:"h1",components:a,props:{id:"installation"}},o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"h1",props:{href:"#installation","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"a",props:{className:"icon icon-link"}})),"Installation"),o.a.createElement(r.MDXTag,{name:"pre",components:a},o.a.createElement(r.MDXTag,{name:"code",components:a,parentName:"pre",props:{metaString:null}},"// Using npm:\nnpm install --save greldal\n\n// Using yarn:\nyarn add greldal\n")),o.a.createElement(r.MDXTag,{name:"h1",components:a,props:{id:"quick-start"}},o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"h1",props:{href:"#quick-start","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"a",props:{className:"icon icon-link"}})),"Quick Start"),o.a.createElement(r.MDXTag,{name:"p",components:a},"Using GRelDAL involves two steps:"),o.a.createElement(r.MDXTag,{name:"ol",components:a},o.a.createElement(r.MDXTag,{name:"li",components:a,parentName:"ol"},"Defining data sources mappers"),o.a.createElement(r.MDXTag,{name:"li",components:a,parentName:"ol"},"Defining operations on these data sources"),o.a.createElement(r.MDXTag,{name:"li",components:a,parentName:"ol"},"Generating a GraphQL Schema from these operations"),o.a.createElement(r.MDXTag,{name:"li",components:a,parentName:"ol"},"Exposing this schema through a HTTP Server")),o.a.createElement(r.MDXTag,{name:"h2",components:a,props:{id:"defining-a-data-source-mapper"}},o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"h2",props:{href:"#defining-a-data-source-mapper","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"a",props:{className:"icon icon-link"}})),"Defining a data source mapper"),o.a.createElement(r.MDXTag,{name:"pre",components:a},o.a.createElement(r.MDXTag,{name:"code",components:a,parentName:"pre",props:{className:"hljs language-ts",metaString:""}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"import")," { types, mapDataSource } ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"from")," ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"greldal"'),";\n\n",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"const")," users = mapDataSource({\n    name: ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"User"'),",\n    description: ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"users"'),",\n    fields: {\n        id: {\n            ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"type"),": types.string,\n            to: GraphQLID,\n        },\n        name: {\n            ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"type"),": types.string,\n        },\n    },\n});")),o.a.createElement(r.MDXTag,{name:"p",components:a},"This defines a ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"User")," data source having two fields: ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"id")," and ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"name"),". This essentially maps a ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"users")," table (having two columns ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"id")," and ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"name"),") in database to a ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"GraphQLOutput")," type with two fields ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"id")," (",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"GraphQLID"),") and ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"string")," (",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"GraphQLString"),")."),o.a.createElement(r.MDXTag,{name:"p",components:a},"Note that the above configuration practically has zero duplication of information. We didn't have to specify the name of table this data source was linked to (it was inferred as plural of 'User'). Also, because our column names and field names are same we didn't have to specify them twice. When we have equivalent types available in typescript and GraphQL (eg. ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"string")," and ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"GraphQLString"),") we don't have to specify the type mapping either. GRelDAL leverages convention-over-configuration to minimize the development effort."),o.a.createElement(r.MDXTag,{name:"p",components:a},"However, when we really need, GRelDAL gives us complete control over the mapping. The guide on "),o.a.createElement(m.a,{href:"".concat("/greldal","/mapping-customizations")},o.a.createElement("a",null," Custom mappings ")),"covers this in more detail, but just to get a sense of what is happening here, the above config is equivalent to:",o.a.createElement(r.MDXTag,{name:"pre",components:a},o.a.createElement(r.MDXTag,{name:"code",components:a,parentName:"pre",props:{className:"hljs language-ts",metaString:""}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"const")," users = mapDataSource({\n    name: {\n        mapped: ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"User"'),",\n        stored: ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"users"'),",\n    },\n    fields: {\n        id: {\n            sourceColumn: ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"id"'),",\n            ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"type"),": types.string,\n            to: {\n                input: GraphQLID,\n                output: GraphQLID,\n            },\n        },\n        name: {\n            sourceColumn: ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"name"'),",\n            ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"type"),": types.string,\n            to: {\n                input: GraphQLString,\n                output: GraphQLString,\n            },\n        },\n    },\n});")),o.a.createElement(r.MDXTag,{name:"h2",components:a,props:{id:"defining-operations"}},o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"h2",props:{href:"#defining-operations","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"a",props:{className:"icon icon-link"}})),"Defining operations"),o.a.createElement(r.MDXTag,{name:"p",components:a},"Once we have data sources we can define operations on these data sources."),o.a.createElement(r.MDXTag,{name:"pre",components:a},o.a.createElement(r.MDXTag,{name:"code",components:a,parentName:"pre",props:{className:"hljs language-ts",metaString:""}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"import")," { operationPresets } ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"from")," ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"greldal"'),";\n\n",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"const")," findManyUsers = operationPresets.query.findManyOperation(users);")),o.a.createElement(r.MDXTag,{name:"p",components:a},"GRelDAL comes with some operation presets. These operation presets make it trivial to perform CRUD operations on data sources with minimal code."),o.a.createElement(r.MDXTag,{name:"p",components:a},"The above line of code defines a ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"findMany")," operation on the users data source."),o.a.createElement(r.MDXTag,{name:"h2",components:a,props:{id:"generating-graphql-schema"}},o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"h2",props:{href:"#generating-graphql-schema","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"a",props:{className:"icon icon-link"}})),"Generating GraphQL Schema"),o.a.createElement(r.MDXTag,{name:"p",components:a},"Once we have operations, we can expose them to the GraphQL API by mapping them to a schema."),o.a.createElement(r.MDXTag,{name:"pre",components:a},o.a.createElement(r.MDXTag,{name:"code",components:a,parentName:"pre",props:{className:"hljs language-ts",metaString:""}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"import")," { mapSchema } ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"from")," ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"greldal"'),";\n\n",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"const")," generatedSchema = mapSchema([findManyUsers]);")),o.a.createElement(r.MDXTag,{name:"p",components:a},"The generatedSchema here is a ",o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"p",props:{href:"https://graphql.org/graphql-js/type/#graphqlschema"}},"GraphQLSchema")," instance which graphql-js can use for resoluton of operations."),o.a.createElement(r.MDXTag,{name:"p",components:a},"In this case, the ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"findMany")," operation on users table can be invoked like this:"),o.a.createElement(r.MDXTag,{name:"pre",components:a},o.a.createElement(r.MDXTag,{name:"code",components:a,parentName:"pre",props:{className:"hljs language-ts",metaString:""}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"import")," { graphql } ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"from")," ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"graphql"'),";\n\ngraphql(\n    generatedSchema,\n    ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'`findManyUsers(where: {name: "John"}) {\n        id,\n        name\n    }\n    `'),",\n);")),o.a.createElement(r.MDXTag,{name:"h2",components:a,props:{id:"exposing-graphql-api"}},o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"h2",props:{href:"#exposing-graphql-api","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"a",props:{className:"icon icon-link"}})),"Exposing GraphQL API"),o.a.createElement(r.MDXTag,{name:"p",components:a},"While the ability to query the generated schema directly is useful in itself, most likely you are building a web application and you would like to expose this GraphQL schema through an API over HTTP. "),o.a.createElement(r.MDXTag,{name:"p",components:a},"There are popular libraries already available for this, and this step is the same as what you would do when building any GraphQL API. "),o.a.createElement(r.MDXTag,{name:"p",components:a},"For example, if we are using ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"express")," as our web framework, we can use the ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"express-graphql")," package to expose our GraphQL API."),o.a.createElement(r.MDXTag,{name:"pre",components:a},o.a.createElement(r.MDXTag,{name:"code",components:a,parentName:"pre",props:{className:"hljs language-ts",metaString:""}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"import")," express ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"from")," ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"express"'),";\n",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"import")," graphqlHTTP ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"from")," ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"express-graphql"'),";\n\n",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"const")," app = express();\n\napp.use(\n    ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"/graphql"'),",\n    graphqlHTTP({\n        schema: generatedSchema,\n        graphiql: ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-literal"}},"true"),"\n    }),\n);\n\napp.listen(",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-number"}},"4000"),");")),o.a.createElement(r.MDXTag,{name:"p",components:a},"Now if we visit ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"localhost:4000")," in a browser, we will see a graphiql interface which we can use to query our data source. We can also use any client side library like ",o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"p",props:{href:"https://github.com/apollographql/react-apollo"}},"react-apollo")," to interact with this API. No GRelDAL specific code is required on the client side. "),o.a.createElement(r.MDXTag,{name:"h2",components:a,props:{id:"advanced-features"}},o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"h2",props:{href:"#advanced-features","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"a",props:{className:"icon icon-link"}})),"Advanced Features"),o.a.createElement(r.MDXTag,{name:"p",components:a},"Above steps have illustrated a very small subset of what GRelDAL has to offer."),o.a.createElement(r.MDXTag,{name:"p",components:a},"GRelDAL provides you control over almost all aspects of your API"),o.a.createElement(r.MDXTag,{name:"ul",components:a},o.a.createElement(r.MDXTag,{name:"li",components:a,parentName:"ul"},o.a.createElement(m.a,{href:"".concat("/greldal","/mapping-customizations")},o.a.createElement("a",null,"Custom mapping"))," of fields, arguments and response objects,"),o.a.createElement(r.MDXTag,{name:"li",components:a,parentName:"ul"},o.a.createElement(m.a,{href:"".concat("/greldal","/associations")},o.a.createElement("a",null,"Associations"))," between data sources,"),o.a.createElement(r.MDXTag,{name:"li",components:a,parentName:"ul"},"Efficient loading of associations via joins or batch queries, etc.")),o.a.createElement(r.MDXTag,{name:"p",components:a},"This documentation will evolve in future to cover all of the above."),o.a.createElement(r.MDXTag,{name:"h2",components:a,props:{id:"next-steps"}},o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"h2",props:{href:"#next-steps","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"a",props:{className:"icon icon-link"}})),"Next Steps"),o.a.createElement(r.MDXTag,{name:"ul",components:a},o.a.createElement(r.MDXTag,{name:"li",components:a,parentName:"ul"},"Checkout the ",o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"li",props:{href:"https://gql-dal.github.io/greldal/api"}},"API Docs")),o.a.createElement(r.MDXTag,{name:"li",components:a,parentName:"ul"},"Expore the ",o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"li",props:{href:"https://github.com/gql-dal"}},"Source Code")),o.a.createElement(r.MDXTag,{name:"li",components:a,parentName:"ul"},"Create ",o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"li",props:{href:"https://github.com/gql-dal/greldal/issues"}},"issues")," for aspects you would like to be prioritized or bugs you enounter."),o.a.createElement(r.MDXTag,{name:"li",components:a,parentName:"ul"},"Submit ",o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"li",props:{href:"https://help.github.com/articles/about-pull-requests/"}},"pull requests")," for enhancements and bug fixes")))},u=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return[{id:"status",level:1,title:o.a.createElement(o.a.Fragment,null,o.a.createElement(r.MDXTag,{name:"a",components:e,props:{href:"#status","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:e,parentName:"a",props:{className:"icon icon-link"}})),"Status"),children:[]},{id:"motive--goals",level:1,title:o.a.createElement(o.a.Fragment,null,o.a.createElement(r.MDXTag,{name:"a",components:e,props:{href:"#motive--goals","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:e,parentName:"a",props:{className:"icon icon-link"}})),"Motive / Goals"),children:[]},{id:"installation",level:1,title:o.a.createElement(o.a.Fragment,null,o.a.createElement(r.MDXTag,{name:"a",components:e,props:{href:"#installation","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:e,parentName:"a",props:{className:"icon icon-link"}})),"Installation"),children:[]},{id:"quick-start",level:1,title:o.a.createElement(o.a.Fragment,null,o.a.createElement(r.MDXTag,{name:"a",components:e,props:{href:"#quick-start","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:e,parentName:"a",props:{className:"icon icon-link"}})),"Quick Start"),children:[{id:"defining-a-data-source-mapper",level:2,title:o.a.createElement(o.a.Fragment,null,o.a.createElement(r.MDXTag,{name:"a",components:e,props:{href:"#defining-a-data-source-mapper","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:e,parentName:"a",props:{className:"icon icon-link"}})),"Defining a data source mapper"),children:[]},{id:"defining-operations",level:2,title:o.a.createElement(o.a.Fragment,null,o.a.createElement(r.MDXTag,{name:"a",components:e,props:{href:"#defining-operations","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:e,parentName:"a",props:{className:"icon icon-link"}})),"Defining operations"),children:[]},{id:"generating-graphql-schema",level:2,title:o.a.createElement(o.a.Fragment,null,o.a.createElement(r.MDXTag,{name:"a",components:e,props:{href:"#generating-graphql-schema","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:e,parentName:"a",props:{className:"icon icon-link"}})),"Generating GraphQL Schema"),children:[]},{id:"exposing-graphql-api",level:2,title:o.a.createElement(o.a.Fragment,null,o.a.createElement(r.MDXTag,{name:"a",components:e,props:{href:"#exposing-graphql-api","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:e,parentName:"a",props:{className:"icon icon-link"}})),"Exposing GraphQL API"),children:[]},{id:"advanced-features",level:2,title:o.a.createElement(o.a.Fragment,null,o.a.createElement(r.MDXTag,{name:"a",components:e,props:{href:"#advanced-features","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:e,parentName:"a",props:{className:"icon icon-link"}})),"Advanced Features"),children:[]},{id:"next-steps",level:2,title:o.a.createElement(o.a.Fragment,null,o.a.createElement(r.MDXTag,{name:"a",components:e,props:{href:"#next-steps","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:e,parentName:"a",props:{className:"icon icon-link"}})),"Next Steps"),children:[]}]}]},E=n(34),D=n(23);a.default=function(){return o.a.createElement(D.a,{sidebar:o.a.createElement(E.a,null,u())},o.a.createElement(d,null))}}},[[248,1,0]]]);