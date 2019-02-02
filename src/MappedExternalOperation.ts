import { GraphQLFieldConfig } from "graphql";

export interface MappedExternalOperation {
    operationType: "query" | "mutation";
    name: string;
    fieldConfig:  GraphQLFieldConfig<any, any, any>;
}