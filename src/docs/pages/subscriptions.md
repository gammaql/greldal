import {NextPageLink} from "../components/Link";
import Link from "next/link";
import {CodeSnippet} from "../components/CodeSnippet";

# Subscriptions

It is easy to use [graphql-subscriptions](https://github.com/apollographql/graphql-subscriptions) alongside GRelDAL to support real-time subscriptions.

<CodeSnippet name="mapSchema_insert_subscription" />

NotificationDispatcher facilitates adding interceptors which can receive mutation events and add additional metadata to them, add additional mutation events to be published in same batch or prevent certain mutation events from being dispatched. 

## Notifying about associated data sources

A common use case is that from an application perspective certain entities can be thought of as belonging to other entities. 
So in that case, we would want to trigger mutation events for one or more associated entities when an entitiy is mutated.

For example, if a Comment entity is inserted, then we may want to notify that a Post has been updated. 

Common pattern for this is that in an operation interceptor we can trigger other operations (eg. queries to identify associated models) and trigger additional mutation events for them.

## Notifications from outside GRelDAL

Notifications don't have to originate from inside GRelDAL or even GraphQL operations. It is straightforward to directly use `NotificationDispatcher` and dispatch notifications from anywhere in your application code eg. background jobs, command line scripts etc.

```ts
NotificationDispatcher.dispatch({
    // Type is commonly used to distinguish between notifications
    // in the interceptors
    type: "OrderDispatchCompletion",

    // (Optional) List of entities which were affected by the change
    // that caused this notification
    entities: [
        {id: 10, name: "Key"},
        {id: 11, name: "KeyChain"}
    ],

    // Application specific metadata attached to this notification
    metadata: {
        priority: 1
    }
});
```

<NextPageLink>Best Practices</NextPageLink>
