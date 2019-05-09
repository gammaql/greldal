import { GraphQLFieldConfig } from "graphql";

export interface Operation {
    operationType: "query" | "mutation" | "subscription";
    name: string;
    fieldConfig: GraphQLFieldConfig<any, any, any>;
}
