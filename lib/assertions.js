"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PathReporter_1 = require("io-ts/lib/PathReporter");
exports.assertType = (type, value) => {
    return type.decode(value).getOrElseL(errors => {
        throw new Error(PathReporter_1.failure(errors).join("\n"));
    });
};
//# sourceMappingURL=assertions.js.map