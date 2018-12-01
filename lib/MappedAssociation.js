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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inflection_1 = require("inflection");
const errors_1 = require("./errors");
const lodash_1 = require("lodash");
const debug_1 = __importDefault(require("debug"));
const utils_1 = require("./utils");
const util_1 = require("util");
const debug = debug_1.default("greldal:MappedAssociation");
function isPreFetchConfig(config) {
    return util_1.isFunction(config.preFetch);
}
exports.isPreFetchConfig = isPreFetchConfig;
function isPostFetchConfig(config) {
    return util_1.isFunction(config.postFetch);
}
exports.isPostFetchConfig = isPostFetchConfig;
function isJoinConfig(config) {
    return lodash_1.has(config, "join");
}
exports.isJoinConfig = isJoinConfig;
class MappedAssociation {
    constructor(dataSource, mappedName, mapping) {
        this.dataSource = dataSource;
        this.mappedName = mappedName;
        this.mapping = mapping;
    }
    get singular() {
        if (lodash_1.isBoolean(this.mapping.singular)) {
            return this.mapping.singular;
        }
        return inflection_1.singularize(this.mappedName) === this.mappedName;
    }
    get target() {
        return this.mapping.target.apply(this);
    }
    get description() {
        return this.mapping.description;
    }
    getFetchConfig(operation) {
        for (const config of this.mapping.fetchThrough) {
            if (!config.useIf || config.useIf.call(this, operation)) {
                return config;
            }
        }
        return null;
    }
    preFetch(preFetchConfig, operation) {
        return preFetchConfig.preFetch.call(this, operation);
    }
    postFetch(postFetchConfig, operation, parents) {
        return postFetchConfig.postFetch.call(this, operation, parents);
    }
    join(joinConfig, queryBuilder, aliasHierarchyVisitor) {
        if (util_1.isFunction(joinConfig.join)) {
            return joinConfig.join(queryBuilder, aliasHierarchyVisitor);
        }
        if (util_1.isString(joinConfig.join) && lodash_1.isPlainObject(this.associatorColumns)) {
            const { storedName } = this.target;
            const sourceAlias = aliasHierarchyVisitor.alias;
            const nextAliasHierarchyVisitor = aliasHierarchyVisitor.visit(storedName);
            const { alias } = nextAliasHierarchyVisitor;
            queryBuilder[joinConfig.join](`${storedName} as ${alias}`, `${sourceAlias}.${this.associatorColumns.inSource}`, `${alias}.${this.associatorColumns.inRelated}`);
            return nextAliasHierarchyVisitor;
        }
        throw new Error(`Not enough information to autoJoin association. Specify a join function`);
    }
    isAutoJoinable(joinConfig) {
        return util_1.isString(joinConfig.join) && lodash_1.isPlainObject(this.associatorColumns);
    }
    associateResultsWithParents(fetchConfig) {
        return (parents, results) => {
            if (fetchConfig.associateResultsWithParents) {
                return fetchConfig.associateResultsWithParents.call(this, parents, results);
            }
            debug("associating results with parents -- parents: %O, results: %O", parents, results);
            if (!this.mapping.associatorColumns) {
                throw new Error("Either associatorColumns or associateResultsWithParents must be specified");
            }
            const { inRelated, inSource } = this.mapping.associatorColumns;
            const parentsIndex = utils_1.indexBy(parents, inSource);
            results.forEach(result => {
                const pkey = result[inRelated];
                if (!pkey)
                    return;
                const parent = parentsIndex[pkey];
                if (!parent)
                    return;
                if (this.mapping.singular) {
                    parent[this.mappedName] = result;
                }
                else {
                    parent[this.mappedName] = parent[this.mappedName] || [];
                    parent[this.mappedName].push(result);
                }
            });
        };
    }
    get associatorColumns() {
        return this.mapping.associatorColumns;
    }
    get DataSourceType() {
        throw errors_1.getTypeAccessorError("DataSourceType", "MappedAssociation");
    }
    get AssociatedDataSourceType() {
        throw errors_1.getTypeAccessorError("AssociatedDataSourceType", "MappedAssociation");
    }
    get SourceRecordType() {
        throw errors_1.getTypeAccessorError("SourceRecordType", "MappedAssociation");
    }
    get AssociatedRecordType() {
        throw errors_1.getTypeAccessorError("AssociatedRecordType", "MappedAssociation");
    }
}
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MappedAssociation.prototype, "singular", null);
exports.MappedAssociation = MappedAssociation;
//# sourceMappingURL=MappedAssociation.js.map