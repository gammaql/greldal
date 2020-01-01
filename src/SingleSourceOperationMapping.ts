import * as t from "io-ts";

import { OperationMappingRT } from "./OperationMapping";

export const SingleSourceOperationMappingRT = t.intersection(
    [
        OperationMappingRT,
        t.partial({
            rootQuery: t.Function,
            deriveWhereParams: t.Function,
        }),
    ],
    "SingleSourceOperationMapping",
);
