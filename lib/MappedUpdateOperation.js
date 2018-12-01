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
const graphql_1 = require("graphql");
const utils_1 = require("./utils");
const UpdateOperationResolver_1 = require("./UpdateOperationResolver");
const MappedMutationOperation_1 = require("./MappedMutationOperation");
class MappedUpdateOperation extends MappedMutationOperation_1.MappedMutationOperation {
    constructor() {
        super(...arguments);
        this.opType = "mutation";
        this.defaultResolver = UpdateOperationResolver_1.UpdateOperationResolver;
    }
    get defaultArgs() {
        return {
            where: {
                type: graphql_1.GraphQLNonNull(this.rootSource.defaultShallowInputType),
            },
            update: {
                type: graphql_1.GraphQLNonNull(this.rootSource.defaultShallowInputType),
            },
        };
    }
}
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MappedUpdateOperation.prototype, "defaultArgs", null);
exports.MappedUpdateOperation = MappedUpdateOperation;
//# sourceMappingURL=MappedUpdateOperation.js.map