"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeAccessorError = (name, parent) => new Error(`Property ${name} must not be accessed directly. ` +
    `Use typeof ${parent}Instance.${name} to get the ${name} type for this ${parent}`);
exports.expectedOverride = () => new Error("Expected to be overriden in child class");
//# sourceMappingURL=errors.js.map