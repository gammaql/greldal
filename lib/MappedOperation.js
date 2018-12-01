"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const core_decorators_1 = require("core-decorators");
const t = __importStar(require("io-ts"));
const debug_1 = __importDefault(require("debug"));
const assertions_1 = require("./assertions");
const util_types_1 = require("./util-types");
const graphql_type_mapper_1 = require("./graphql-type-mapper");
const errors_1 = require("./errors");
const ResolveInfoVisitor_1 = require("./ResolveInfoVisitor");
const utils_1 = require("./utils");
const debug = debug_1.default("greldal:MappedOperation");
exports.OperationMapping = t.type({
    name: t.string,
    description: util_types_1.Maybe(t.string),
    singular: util_types_1.Maybe(t.boolean),
    shallow: util_types_1.Maybe(t.boolean),
});
class MappedOperation {
    constructor(mapping) {
        this.mapping = mapping;
        assertions_1.assertType(exports.OperationMapping, mapping);
    }
    get graphQLOperation() {
        return {
            description: this.mapping.description,
            args: this.args,
            type: this.type,
            resolve: this.resolve.bind(this),
        };
    }
    get ArgsType() {
        throw errors_1.getTypeAccessorError("ArgsType", "MappedOperation");
    }
    get rootSource() {
        return this.mapping.rootSource;
    }
    get name() {
        return this.mapping.name;
    }
    get shallow() {
        return this.mapping.shallow === true;
    }
    get singular() {
        return this.mapping.singular !== false;
    }
    get args() {
        if (this.mapping.args)
            return this.mapping.args;
        return this.defaultArgs;
    }
    get type() {
        if (this.mapping.returnType) {
            return this.mapping.returnType;
        }
        let baseType;
        if (this.shallow) {
            baseType = this.mapping.rootSource.defaultShallowOutputType;
        }
        else {
            baseType = this.mapping.rootSource.defaultOutputType;
        }
        if (this.singular) {
            return baseType;
        }
        return graphql_1.GraphQLList(baseType);
    }
    rootQuery(args, aliasHierachyVisitor) {
        if (this.mapping.rootQuery) {
            return this.mapping.rootQuery.call(this, args, aliasHierachyVisitor);
        }
        return this.rootSource.rootQuery(aliasHierachyVisitor);
    }
    resolve(source, args, context, resolveInfo, resolveInfoVisitor) {
        return __awaiter(this, void 0, void 0, function* () {
            const Resolver = this.mapping.resolver || this.defaultResolver;
            const resolver = new Resolver(this, source, context, args, resolveInfo, resolveInfoVisitor);
            const result = yield resolver.resolve();
            debug("Resolved result:", result, this.singular);
            return graphql_type_mapper_1.normalizeResultsForSingularity(result, this.singular);
        });
    }
    deriveWhereParams(args, association) {
        if (this.mapping.deriveWhereParams) {
            return this.mapping.deriveWhereParams.call(this, args, association);
        }
        return args.where;
    }
}
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MappedOperation.prototype, "graphQLOperation", null);
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MappedOperation.prototype, "type", null);
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, ResolveInfoVisitor_1.ResolveInfoVisitor]),
    __metadata("design:returntype", Promise)
], MappedOperation.prototype, "resolve", null);
exports.MappedOperation = MappedOperation;
//# sourceMappingURL=MappedOperation.js.map