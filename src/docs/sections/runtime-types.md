# Runtime Type Validators

In the introduction section, we saw that stores are defined like this:

```
import { types, mapDataSource } from "greldal";

const users = mapDataSource({
    name: "User",
    description: "users",
    fields: {
        id: {
            type: types.string,
            to: GraphQLID,
        },
        name: {
            type: types.string,
        },
    },
});
```

In this post, we explore more on the type specifications (eg. `types.string`) in the mapping above.

These type specifications are referred to as runtime types, and they validate the type of arguments at runtime. They are not implemented inside GRelDAL, but we use [io-ts](https://github.com/gcanti/io-ts), an excellent library by [Giulio Canti](https://mobile.twitter.com/GiulioCanti).

You may wonder that given GRaphQL already does validation of types at boundaries, why bother with this at all.

There are two reasons:

1. We can extract out static types from these runtime types. This enables us to write type-safe code, when using TypeScript, without ever having to define any additional types. We can simply derive the types of the entities from the data source mapping itself and if you use incorrect fields or arguments, your code will fail to compile.

2. Runtime types are composable and support [refinements](https://github.com/gcanti/io-ts#refinements), so you can embed generic validation logic in the runtime types and share them across field mappings & argument mappings across multiple stores and operations.
