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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const ResolveInfoVisitor_1 = require("./ResolveInfoVisitor");
const connector_1 = require("./connector");
class OperationResolver {
    constructor(operation, source, context, args, resolveInfoRoot, _resolveInfoVisitor) {
        this.operation = operation;
        this.source = source;
        this.context = context;
        this.args = args;
        this.resolveInfoRoot = resolveInfoRoot;
        this._resolveInfoVisitor = _resolveInfoVisitor;
    }
    get resolveInfoVisitor() {
        return (this._resolveInfoVisitor ||
            new ResolveInfoVisitor_1.ResolveInfoVisitor(this.resolveInfoRoot, this.operation.rootSource));
    }
    get rootSource() {
        return this.operation.rootSource;
    }
    get connector() {
        return this.rootSource.connector;
    }
    get supportsReturning() {
        return connector_1.supportsReturning(this.connector);
    }
    get name() {
        return this.operation.name;
    }
}
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], OperationResolver.prototype, "resolveInfoVisitor", null);
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], OperationResolver.prototype, "supportsReturning", null);
exports.OperationResolver = OperationResolver;
//# sourceMappingURL=OperationResolver.js.map