import { Link } from "../components/Link";

# Type Safety

GRelDAL is written in TypeScript and comes with type definitions. However having type definitions and being type safe are two different things.

GRelDAL attempts to balance a compromise between type-safety and ease of use. If enforcement of type-safety causes the APIs to significantly depart from
idomatic JavaScript or TypeScript conventions we are usually willing to compromise on type-safety.

Having said that, we do make a sincere attempt to ensure that as many bugs are caught at the compile time as opposed to run time and your contributions to make this better are very much appreciated.

In addition, if the error checking has to happen at runtime we try to fail-fast with clear error messages up-front.

## Runtime Type Validators

In the introduction section, we saw that stores are defined like this:

```ts
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

The type specifications (eg. `types.string`) in the mapping above are referred to as runtime types, and they validate the type of arguments at runtime.
They are not implemented inside GRelDAL - rather, we use [io-ts](https://github.com/gcanti/io-ts), an excellent library by [Giulio Canti](https://mobile.twitter.com/GiulioCanti).

You may wonder that given GRaphQL already does validation of types at boundaries, why bother with this at all.

There are two reasons:

1. We can extract out static types from these runtime types. This enables us to write type-safe code, when using TypeScript, without ever having to define any additional types. We can simply derive the types of the entities from the data source mapping itself and if you use incorrect fields or arguments, your code will fail to compile.

2. Runtime types are composable and support [refinements](https://github.com/gcanti/io-ts#refinements), so you can embed generic validation logic in the runtime types and share them across field mappings & argument mappings across multiple stores and operations.

We not only extract static types from runtime types, we also derive GraphQL types from them - so you have to specify only the runtime types for most cases.
In some cases automatic type derivations are not possible and you may need to specify the GraphQL types separately - as is the case with `GraphQLID` in the snippet above.
The inferred GraphQL type would have been `GraphQLString` but because we have specified `GraphQLID` it would take precedence.
