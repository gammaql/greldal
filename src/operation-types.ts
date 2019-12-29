import { isNil } from "lodash";

export enum OperationType {
    Query = "query",
    Mutation = "mutation",
    Subscription = "subscription",
}

export const operationType = (input: string | null | undefined, defaultType: OperationType) => {
    if (isNil(input)) return defaultType;
    switch (input) {
        case OperationType.Query:
            return OperationType.Query;
        case OperationType.Mutation:
            return OperationType.Mutation;
        case OperationType.Subscription:
            return OperationType.Subscription;
    }
    throw new TypeError("Invalid operationType: " + operationType);
};
