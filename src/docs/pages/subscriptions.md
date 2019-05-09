import {NextPageLink} from "../components/Link";
import Link from "next/link";
import {CodeSnippet} from "../components/CodeSnippet";

# Subscriptions

It is easy to use [graphql-subscriptions](https://github.com/apollographql/graphql-subscriptions) alongside GRelDAL to support real-time subscriptions.

<CodeSnippet name="mapSchema_insert_subscription" />

Currently there is no explicit support of tracking change in associated data sources. This is likely to be added in near future.

<NextPageLink>Best Practices</NextPageLink>
