(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{GZYA:function(e,a,n){"use strict";n.r(a);var t=n("wk2l"),s=n("ERkP"),o=n.n(s),r=n("yTr/"),m=n("YNhk");n("jvFD");a.default=function(e){var a=e.components;Object(t.a)(e,["components"]);return o.a.createElement(r.MDXTag,{name:"wrapper",components:a},o.a.createElement(r.MDXTag,{name:"h1",components:a,props:{id:"mapping-queries-over-associations"}},o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"h1",props:{href:"#mapping-queries-over-associations","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"a",props:{className:"icon icon-link"}})),"Mapping Queries over Associations"),o.a.createElement(r.MDXTag,{name:"p",components:a},"While data sources derived from a single tables are useful in themselves, in larger applications, you'd likely have data stored across multiple tables. After all, the ability to join tables and enforce constraints on connected tables is what makes relational databases so powerful."),o.a.createElement(r.MDXTag,{name:"p",components:a},"GRelDAL makes it easy for you to take advantage of advanced features of relational databases, by providing APIs to link data sources through different loading strategies."),o.a.createElement(r.MDXTag,{name:"h3",components:a,props:{id:"associations-fetched-through-join-queries"}},o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"h3",props:{href:"#associations-fetched-through-join-queries","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"a",props:{className:"icon icon-link"}})),"Associations fetched through join queries"),o.a.createElement(r.MDXTag,{name:"p",components:a},"We can configure an association between multiple data sources to use a join."),o.a.createElement(r.MDXTag,{name:"pre",components:a},o.a.createElement(r.MDXTag,{name:"code",components:a,parentName:"pre",props:{className:"hljs language-ts",metaString:""}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"const")," products = mapDataSource({\n    name: ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"Product"'),",\n    fields,\n    associations: mapAssociations({\n        department: {\n            target: ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-function"}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"span",props:{className:"hljs-params"}},"()")," =>")," departments,\n            singular: ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-literal"}},"true"),",\n            fetchThrough: [\n                {\n                    join: ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"leftOuterJoin"'),",\n                },\n            ],\n            associatorColumns: {\n                inSource: ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"department_id"'),",\n                inRelated: ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"id"'),",\n            },\n        },\n    }),\n});")),o.a.createElement(r.MDXTag,{name:"p",components:a},"So now, for a query like the following:"),o.a.createElement(r.MDXTag,{name:"pre",components:a},o.a.createElement(r.MDXTag,{name:"code",components:a,parentName:"pre",props:{metaString:null}},'findManyProducts(where: {release_month: "december"}) {\n    id,\n    name,\n    department {\n        id,\n        name\n    }\n}\n')),o.a.createElement(r.MDXTag,{name:"p",components:a},"GRelDAL will join the ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"products")," and ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"departments")," table on the ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"department_id")," and ",o.a.createElement(r.MDXTag,{name:"inlineCode",components:a,parentName:"p"},"id")," columns."),o.a.createElement(r.MDXTag,{name:"p",components:a},"You are not limited in how many tables you can join and how the joins should be performed. Even in case of multiple joins or recursive joins, GRelDAL can take care of reverse mapping the fetched data sets into the hierarchical format your client expects."),o.a.createElement(r.MDXTag,{name:"pre",components:a},o.a.createElement(r.MDXTag,{name:"code",components:a,parentName:"pre",props:{className:"hljs language-ts",metaString:""}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"const")," tags = mapDataSource({\n    name: ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"Tag"'),",\n    fields,\n    associations: mapAssociations({\n        products: {\n            target: ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-function"}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"span",props:{className:"hljs-params"}},"()")," =>")," products,\n            singular: ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-literal"}},"false"),",\n            fetchThrough: [\n                {\n                    ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// Instead of the above configuration based join, we are now tapping into the underlying data access"),"\n                    ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// library - Knex, to perform a join over multiple tables."),"\n                    join: ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-function"}},"(",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"span",props:{className:"hljs-params"}},"queryBuilder, aliasTreeVisitor"),") =>")," {\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// GRelDAL relies on aliases to alleviate conflicts and to properly map the"),"\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// fetched data set (tabular) to the format the client expects (hierarchical)."),"\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"//"),"\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// So we need to use the aliases exposed through aliasTreeVisitor when querying the data source"),"\n\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// Lets derive visitors for the tables we intend to join"),"\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"const")," ptaVisitor = aliasTreeVisitor.visit(",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"product_tag_associators"'),");\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"const")," productsVisitor = ptaVisitor.visit(",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"products"'),");\n\n                        queryBuilder\n                            .leftOuterJoin(\n                                ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// Now we can obtain registered aliases from these visitors and use them in our queries"),"\n                                ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},"`product_tag_associators as ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"span",props:{className:"hljs-subst"}},"${ptaVisitor.alias}"),"`"),",\n                                ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},"`",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"span",props:{className:"hljs-subst"}},"${ptaVisitor.alias}"),".tag_id`"),",\n                                ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},"`",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"span",props:{className:"hljs-subst"}},"${aliasTreeVisitor.alias}"),".id`"),",\n                            )\n                            .leftOuterJoin(\n                                ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},"`products as ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"span",props:{className:"hljs-subst"}},"${productsVisitor.alias}"),"`"),",\n                                ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},"`",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"span",props:{className:"hljs-subst"}},"${productsVisitor.alias}"),".id`"),",\n                                ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},"`",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"span",props:{className:"hljs-subst"}},"${ptaVisitor.alias}"),".product_id`"),",\n                            );\n\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// Once we have constructed the query, we are done. We don't have to write any mapping logic"),"\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// for converting the obtained results into the hierarchy of fields."),"\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"return")," productsVisitor;\n                    },\n                },\n            ],\n        },\n    }),\n});")),o.a.createElement(r.MDXTag,{name:"h3",components:a,props:{id:"associations-fetched-through-batch-queries"}},o.a.createElement(r.MDXTag,{name:"a",components:a,parentName:"h3",props:{href:"#associations-fetched-through-batch-queries","aria-hidden":"true"}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"a",props:{className:"icon icon-link"}})),"Associations fetched through batch queries:"),o.a.createElement(r.MDXTag,{name:"p",components:a},"An alternative to joins is to side-load the operations on related data sources."),o.a.createElement(r.MDXTag,{name:"p",components:a},"Note that in the below scenario, when we are fetching a department and related products, we are always making only two queries - irrespective of the number of departments or the number of products we have or how many of them end up in our result set. Both of these queries are batched, and once again we can fall back on GRelDAL do our reverse mapping for us."),o.a.createElement(r.MDXTag,{name:"pre",components:a},o.a.createElement(r.MDXTag,{name:"code",components:a,parentName:"pre",props:{className:"hljs language-js",metaString:""}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"const")," departments = mapDataSource({\n    ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-attr"}},"name"),": ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"Department"'),",\n    fields,\n    ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-attr"}},"associations"),": mapAssociations({\n        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-attr"}},"products"),": {\n            ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-attr"}},"target"),": ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-function"}},o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"span",props:{className:"hljs-params"}},"()")," =>")," products,\n            ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-attr"}},"singular"),": ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-literal"}},"false"),",\n            ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-attr"}},"associatorColumns"),": {\n                ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-attr"}},"inSource"),": ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"id"'),",\n                ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-attr"}},"inRelated"),": ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"department_id"'),",\n            },\n            ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-attr"}},"fetchThrough"),": [\n                ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// We can define multiple side-loading strategies here."),"\n                ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"//"),"\n                ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// When user queried by id of department, then we don't have to wait for the query on departments to complete"),"\n                ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// before we start fetching products. In case of preFetch strategy, these queries can happen in parallel, because"),"\n                ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// given the parameters used to query the data source we can start a parallel query to fetch all the products in"),"\n                ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// matching departments"),"\n                {\n                    useIf(operation) {\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"return")," has(operation.args, [",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"where"'),", ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"id"'),"]);\n                    },\n                    preFetch(operation) {\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// What preFetch returns is a MappedForeignQuery - which basically points to another operation"),"\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// in the related data source (findManyProducts) and the arguments needed to initiate this operation."),"\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"//"),"\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// Being able to compose operations defined on multiple data sources is one of the most compelling features"),"\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// of GRelDAL."),"\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"const")," department_id: string = operation.args.where.id;\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"return")," {\n                            ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-attr"}},"query"),": findManyProducts,\n                            ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-attr"}},"args"),": {\n                                ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-attr"}},"where"),": {\n                                    department_id,\n                                },\n                            },\n                        };\n                    },\n                },\n\n                ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// However if the query parameters to departments are not enough to identify which products we need to fetch,"),"\n                ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// we can wait for the departments"),"\n                {\n                    postFetch(operation, parents) {\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// As above, we are instructing GRelDAL to initiate another operation in a foreign data source."),"\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// However, in this case this body will execute once the query on parents has finished. So we have an array of"),"\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// fetched parents at our disposal which we can use to identify additional arguments to narrow down the"),"\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-comment"}},"// subset of products to fetch."),"\n                        ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-keyword"}},"return")," {\n                            ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-attr"}},"query"),": findManyProductsByDepartmentIdList,\n                            ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-attr"}},"args"),": {\n                                ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-attr"}},"department_ids"),": map(parents, ",o.a.createElement(r.MDXTag,{name:"span",components:a,parentName:"code",props:{className:"hljs-string"}},'"id"'),"),\n                            },\n                        };\n                    },\n                },\n            ],\n        },\n    }),\n});")),o.a.createElement(m.b,null,"Best Practices"))}},JGjb:function(e,a,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/mapping-associations",function(){var e=n("GZYA");return{page:e.default||e}}])}},[["JGjb",1,0]]]);