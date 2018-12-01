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
Object.defineProperty(exports, "__esModule", { value: true });
const OperationResolver_1 = require("./OperationResolver");
const lodash_1 = require("lodash");
const QueryOperationResolver_1 = require("./QueryOperationResolver");
const utils_1 = require("./utils");
class UpdateOperationResolver extends OperationResolver_1.OperationResolver {
    get queryResolver() {
        return new QueryOperationResolver_1.QueryOperationResolver(this.operation, this.source, this.context, lodash_1.pick(this.args, "where"), this.resolveInfoRoot, this.resolveInfoVisitor);
    }
    get aliasHierarchyVisitor() {
        return this.queryResolver.aliasHierarchyVisitor;
    }
    get storeParams() {
        return lodash_1.pick(this.queryResolver.storeParams, "whereParams");
    }
    resolve() {
        return __awaiter(this, void 0, void 0, function* () {
            this.queryResolver.resolveFields([], this.aliasHierarchyVisitor, this.rootSource, this.resolveInfoVisitor);
            const queryBuilder = this.rootSource.rootQuery(this.aliasHierarchyVisitor);
            queryBuilder.where(this.storeParams.whereParams);
            if (this.operation.singular)
                queryBuilder.limit(1);
            if (this.supportsReturning)
                queryBuilder.returning(this.rootSource.storedColumnNames);
            const results = yield queryBuilder.update(this.args.update);
            if (this.supportsReturning)
                return this.rootSource.shallowMapResults(results);
            return this.queryResolver.resolve();
        });
    }
}
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], UpdateOperationResolver.prototype, "queryResolver", null);
exports.UpdateOperationResolver = UpdateOperationResolver;
//# sourceMappingURL=UpdateOperationResolver.js.map