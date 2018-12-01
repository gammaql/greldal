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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OperationResolver_1 = require("./OperationResolver");
const utils_1 = require("./utils");
const debug_1 = __importDefault(require("debug"));
const AliasHierarchyVisitor_1 = require("./AliasHierarchyVisitor");
const debug = debug_1.default("greldal:InsertionOperationResolver");
class InsertionOperationResolver extends OperationResolver_1.OperationResolver {
    get entities() {
        if (this.operation.singular) {
            return [this.args.entity];
        }
        else {
            return this.args.entities;
        }
    }
    get aliasHierarchyVisitor() {
        return new AliasHierarchyVisitor_1.AliasHierarchyVisitor().visit(this.rootSource.storedName);
    }
    resolve() {
        return __awaiter(this, void 0, void 0, function* () {
            let queryBuilder = this.rootSource.rootQuery(this.aliasHierarchyVisitor);
            const mappedRows = this.rootSource.mapEntities(this.entities);
            debug("Mapped entities to rows:", this.entities, mappedRows);
            if (this.supportsReturning)
                queryBuilder.returning(this.rootSource.storedColumnNames);
            const results = yield queryBuilder.insert(mappedRows);
            // When returning is available we map from returned values to ensure that database level defaults etc. are correctly
            // accounted for:
            if (this.supportsReturning)
                return this.rootSource.shallowMapResults(results);
            // TODO: Is an extra worth having here for the sake of consistency ?
            return this.entities;
        });
    }
}
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], InsertionOperationResolver.prototype, "entities", null);
exports.InsertionOperationResolver = InsertionOperationResolver;
//# sourceMappingURL=InsertionOperationResolver.js.map