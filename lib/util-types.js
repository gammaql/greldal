"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const t = __importStar(require("io-ts"));
/** Convenience utility types */
exports.Maybe = (type) => t.union([type, t.undefined, t.null]);
exports.Mapped = (type) => t.type({
    stored: type,
    mapped: type,
});
exports.MaybeMapped = (type) => t.union([type, exports.Mapped(type)]);
//# sourceMappingURL=util-types.js.map