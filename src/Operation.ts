import { GraphQLFieldConfig } from "graphql";

// @snippet:start Operation_type

export interface Operation {
    operationType: "query" | "mutation" | "subscription";
    name: string;
    fieldConfig: GraphQLFieldConfig<any, any, any>;
}

// @snippet:end
