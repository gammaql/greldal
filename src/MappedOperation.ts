import { GraphQLOutputType, GraphQLList } from "graphql";
import * as t from "io-ts";
import { MappedDataSource } from "./MappedDataSource";
import { assertType } from "./assertions";

const OperationMapping = t.type({
    returnType: t.Function,
    singular: t.union([t.boolean, t.undefined]),
    shallow: t.union([t.boolean, t.undefined])
});

export interface OperationMapping extends t.TypeOf<typeof OperationMapping> {
    dataSource: MappedDataSource;
    returnType: () => GraphQLOutputType;
}

export class MappedOperation {
    constructor(
        private mapping: OperationMapping,
        private opType: "input" | "output"
    ) {
        assertType(OperationMapping, mapping);
    }
    get shallow() {
        return this.mapping.shallow === true;
    }
    get singular() {
        return this.mapping.singular !== false;
    }
    get type() {
        if (this.mapping.returnType) {
            return this.mapping.returnType.apply(this);
        }
        let baseType;
        if (this.opType === "input") {
            baseType = this.mapping.dataSource.defaultShallowInputType;
        } else if (this.shallow) {
            baseType = this.mapping.dataSource.defaultShallowOutputType;
        } else {
            baseType = this.mapping.dataSource.defaultOutputType;
        }
        if (this.singular) {
            return baseType;
        }
        return GraphQLList(baseType);
    }
}
