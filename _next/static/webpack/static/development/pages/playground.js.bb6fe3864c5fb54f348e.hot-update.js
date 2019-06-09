webpackHotUpdate("static/development/pages/playground.js",{

/***/ "../../lib/SingleSourceDeletionOperationResolver.js":
/*!***************************************************************************************!*\
  !*** /host/Users/loref/Projects/greldal/lib/SingleSourceDeletionOperationResolver.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __webpack_require__(/*! lodash */ "../../node_modules/lodash/lodash.js");
const utils_1 = __webpack_require__(/*! ./utils */ "../../lib/utils.js");
const MappedSingleSourceQueryOperation_1 = __webpack_require__(/*! ./MappedSingleSourceQueryOperation */ "../../lib/MappedSingleSourceQueryOperation.js");
const ResolverContext_1 = __webpack_require__(/*! ./ResolverContext */ "../../lib/ResolverContext.js");
const SingleSourceQueryOperationResolver_1 = __webpack_require__(/*! ./SingleSourceQueryOperationResolver */ "../../lib/SingleSourceQueryOperationResolver.js");
const SourceAwareOperationResolver_1 = __webpack_require__(/*! ./SourceAwareOperationResolver */ "../../lib/SourceAwareOperationResolver.js");
/**
 * Opinionated resolver for deletion of one or more entities from a single data source.
 *
 * Sample GraphQL request:
 *
 * ```graphql
 * mutation {
 *     deleteManyUser(where: {id: 1}) {
 *         id, name
 *     }
 * }
 * ```
 *
 * Assumes that:
 *
 * 1. Fields used to query the data-source are available through a where argument
 * 2. result fields in query correspond to mapped field names in data source
 *
 * 1 is not a hard assumption and custom argument mapping can be specified through args property in the OperationMapping.
 *
 * See ArgMapping.interceptQuery
 *
 * @api-category CRUDResolvers
 */
class SingleSourceDeletionOperationResolver extends SourceAwareOperationResolver_1.SourceAwareOperationResolver {
    get queryResolver() {
        const _a = this.resolverContext.operation.mapping, { resolver: _oldResolver } = _a, mapping = __rest(_a, ["resolver"]);
        const operation = new MappedSingleSourceQueryOperation_1.MappedSingleSourceQueryOperation(mapping);
        const resolverContext = ResolverContext_1.ResolverContext.derive(operation, this.resolverContext.selectedDataSources, this.resolverContext.source, this.resolverContext.args, this.resolverContext.context, this.resolverContext.resolveInfoRoot, this.resolverContext.primaryResolveInfoVisitor);
        const resolver = new SingleSourceQueryOperationResolver_1.SingleSourceQueryOperationResolver(resolverContext);
        resolver.isDelegated = true;
        return resolver;
    }
    get delegatedResolvers() {
        return [this.queryResolver];
    }
    get aliasHierarchyVisitor() {
        return this.queryResolver.getAliasHierarchyVisitorFor(this.resolverContext.primaryDataSource);
    }
    get storeParams() {
        return lodash_1.pick(this.queryResolver.storeParams, "whereParams");
    }
    async resolve() {
        let primaryKeyValues;
        const rootSource = this.resolverContext.primaryDataSource;
        const result = await this.wrapInTransaction(async () => {
            const mappedRows = await this.queryResolver.resolve();
            primaryKeyValues = this.extractPrimaryKeyValues(this.queryResolver.primaryFieldMappers, this.queryResolver.resultRows);
            if (primaryKeyValues.length === 0) {
                throw new Error("Refusing to execute unbounded delete operation");
            }
            let queryBuilder = this.createRootQueryBuilder(rootSource);
            this.queryByPrimaryKeyValues(queryBuilder, primaryKeyValues);
            queryBuilder = this.queryResolver.operation.interceptQueryByArgs(queryBuilder, this.resolverContext.args);
            await queryBuilder.del();
            return mappedRows;
        });
        this.operation.publish({
            source: rootSource.mappedName,
            type: "DELETE",
            primary: rootSource.mapRowsToShallowEntities(primaryKeyValues),
        });
        return result;
    }
}
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", SingleSourceQueryOperationResolver_1.SingleSourceQueryOperationResolver),
    __metadata("design:paramtypes", [])
], SingleSourceDeletionOperationResolver.prototype, "queryResolver", null);
exports.SingleSourceDeletionOperationResolver = SingleSourceDeletionOperationResolver;
//# sourceMappingURL=SingleSourceDeletionOperationResolver.js.map

/***/ })

})
//# sourceMappingURL=playground.js.bb6fe3864c5fb54f348e.hot-update.js.map