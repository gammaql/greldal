import {NextPageLink} from "../components/Link";
import Link from "next/link";
import {CodeSnippet} from "../components/CodeSnippet";

# Mapping Queries over Associations

While data sources derived from a single tables are useful in themselves, in larger applications, you'd likely have data stored across multiple tables. After all, the ability to join tables and enforce constraints on connected tables is what makes relational databases so powerful.

GRelDAL makes it easy for you to take advantage of advanced features of relational databases, by providing APIs to link data sources through different loading strategies.

### Associations fetched through join queries

We can configure an association between multiple data sources to use a join.

<CodeSnippet name="mapAssociation_leftOuterJoin_default" />

So now, for a query like the following:

<CodeSnippet name="mapAssociation_leftOuterJoin_default_query" transform={(content) => content.trim().split('\n').slice(1, -1).join('\n') }/>

GRelDAL will join the `products` and `departments` table on the `department_id` and `id` columns.

You are not limited in how many tables you can join and how the joins should be performed. Even in case of multiple joins or recursive joins, GRelDAL can take care of reverse mapping the fetched data sets into the hierarchical format your client expects.

<CodeSnippet name="mapAssociation_multiJoin_custom" />

### Associations fetched through batch queries:

An alternative to joins is to side-load the operations on related data sources.

Note that in the below scenario, when we are fetching a department and related products, we are always making only two queries - irrespective of the number of departments or the number of products we have or how many of them end up in our result set. Both of these queries are batched, and once again we can fall back on GRelDAL do our reverse mapping for us.

<CodeSnippet name="mapAssociation_sideLoading" />

<NextPageLink>Best Practices</NextPageLink>
