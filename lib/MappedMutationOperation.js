"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MappedOperation_1 = require("./MappedOperation");
class MappedMutationOperation extends MappedOperation_1.MappedOperation {
    constructor() {
        super(...arguments);
        this.opType = "mutation";
    }
}
exports.MappedMutationOperation = MappedMutationOperation;
//# sourceMappingURL=MappedMutationOperation.js.map