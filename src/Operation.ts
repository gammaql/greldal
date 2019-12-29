import { GraphQLFieldConfig } from "graphql";
import { OperationType } from "./operation-types";

// @snippet:start Operation_type

/**
 * Interface that all operations application must confirm to.
 *
 * These operations may be source aware (which interact with GRelDAL data sources)
 * or completely generic (which may simply wrap graphql.js compatible resolvers).
 */
export interface Operation {
    operationType: OperationType;
    name: string;
    fieldConfig: GraphQLFieldConfig<any, any, any>;
}

// @snippet:end
