"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_parse_resolve_info_1 = require("graphql-parse-resolve-info");
const debug_1 = __importDefault(require("debug"));
const assert = require("assert");
const debug = debug_1.default("greldal:ResolveInfoVisitor");
class ResolveInfoVisitor {
    constructor(originalResolveInfoRoot, rootSource, parsedResolveInfo, parentSource) {
        this.originalResolveInfoRoot = originalResolveInfoRoot;
        this.rootSource = rootSource;
        this.parentSource = parentSource;
        this.parsedResolveInfo =
            parsedResolveInfo ||
                //TODO: Remove any after version incompatibility with typings is resolved
                graphql_parse_resolve_info_1.parseResolveInfo(originalResolveInfoRoot);
    }
    visitRelation(association) {
        const returnTypeName = this.rootSource.mappedName;
        const nextResolveInfo = this.parsedResolveInfo.fieldsByTypeName[returnTypeName][association.mappedName];
        debug("Visiting association:", association.mappedName);
        debug("Deduced next resolve info: %O[fieldsByTypeName][%s][%s] => %O", this.parsedResolveInfo, returnTypeName, association.mappedName, nextResolveInfo);
        assert(nextResolveInfo, `Failed to deduce resolveInfo for next level when visiting association ${association.mappedName} from ${this.rootSource.mappedName}`);
        return new ResolveInfoVisitor(this.originalResolveInfoRoot, association.target, nextResolveInfo, this);
    }
    *iterateFieldsOf(typeName) {
        const fields = this.parsedResolveInfo.fieldsByTypeName[typeName];
        debug("Iterating fields %s -> %O", typeName, fields, this.parsedResolveInfo);
        for (const [fieldName, fieldInfo] of Object.entries(fields)) {
            yield { fieldName, fieldInfo };
        }
    }
}
exports.ResolveInfoVisitor = ResolveInfoVisitor;
//# sourceMappingURL=ResolveInfoVisitor.js.map