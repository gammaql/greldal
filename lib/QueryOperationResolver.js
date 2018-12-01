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
const MappedAssociation_1 = require("./MappedAssociation");
const debug_1 = __importDefault(require("debug"));
const utils_1 = require("./utils");
const AliasHierarchyVisitor_1 = require("./AliasHierarchyVisitor");
const debug = debug_1.default("greldal:QueryOperationResolver");
class QueryOperationResolver extends OperationResolver_1.OperationResolver {
    get aliasHierarchyVisitor() {
        return new AliasHierarchyVisitor_1.AliasHierarchyVisitor().visit(this.rootSource.storedName);
    }
    get rootSource() {
        return this.operation.rootSource;
    }
    get storeParams() {
        const storeParams = {
            whereParams: this.mapWhereArgs(this.operation.deriveWhereParams(this.resolveInfoVisitor.parsedResolveInfo.args), this.aliasHierarchyVisitor),
            queryBuilder: this.operation.rootQuery(this.args, this.aliasHierarchyVisitor),
            columns: [],
            primaryMappers: [],
            secondaryMappers: {
                preFetched: [],
                postFetched: [],
            },
        };
        debug("storeParams:", storeParams);
        return storeParams;
    }
    resolve() {
        return __awaiter(this, void 0, void 0, function* () {
            this.resolveFields([], this.aliasHierarchyVisitor, this.rootSource, this.resolveInfoVisitor);
            const resultRows = yield this.runQuery();
            debug("Fetched rows:", resultRows);
            return this.rootSource.mapResults(this.storeParams, resultRows);
        });
    }
    runQuery() {
        return __awaiter(this, void 0, void 0, function* () {
            const qb = this.storeParams.queryBuilder.where(this.storeParams.whereParams);
            if (this.operation.singular)
                qb.limit(1);
            return yield qb.columns(this.storeParams.columns);
        });
    }
    resolveFields(tablePath = [], aliasHierarchyVisitor, dataSource, resolveInfoVisitor) {
        const typeName = this.operation.shallow ? dataSource.shallowMappedName : dataSource.mappedName;
        for (const { fieldName } of resolveInfoVisitor.iterateFieldsOf(typeName)) {
            this.resolveFieldName(fieldName, tablePath, aliasHierarchyVisitor, dataSource, resolveInfoVisitor);
        }
    }
    resolveFieldName(fieldName, tablePath, aliasHierarchyVisitor, dataSource, resolveInfoVisitor) {
        const field = dataSource.fields[fieldName];
        if (field) {
            debug("Identified field corresponding to fieldName %s -> %O", fieldName, field);
            this.deriveColumnsForField(field, tablePath, aliasHierarchyVisitor);
            return;
        }
        if (!this.operation.shallow) {
            const association = dataSource.associations[fieldName];
            if (association) {
                debug("Identified candidate associations corresponding to fieldName %s -> %O", fieldName, association);
                const fetchConfig = association.getFetchConfig(this);
                if (!fetchConfig) {
                    throw new Error("Unable to resolve association through any of the specified fetch configurations");
                }
                this.resolveAssociation(association, fetchConfig, tablePath, aliasHierarchyVisitor, resolveInfoVisitor);
                return;
            }
        }
        throw new Error(`Unable to resovle fieldName ${fieldName} in dataSource: ${dataSource.mappedName}`);
    }
    resolveAssociation(association, fetchConfig, tablePath, aliasHierarchyVisitor, resolveInfoVisitor) {
        const associationVisitor = resolveInfoVisitor.visitRelation(association);
        if (MappedAssociation_1.isPreFetchConfig(fetchConfig)) {
            this.storeParams.secondaryMappers.preFetched.push({
                propertyPath: tablePath,
                reverseAssociate: association.associateResultsWithParents(fetchConfig),
                result: this.invokeSideLoader(() => association.preFetch(fetchConfig, this), associationVisitor),
            });
        }
        else if (MappedAssociation_1.isPostFetchConfig(fetchConfig)) {
            this.storeParams.secondaryMappers.postFetched.push({
                propertyPath: tablePath,
                reverseAssociate: association.associateResultsWithParents(fetchConfig),
                run: (parents) => __awaiter(this, void 0, void 0, function* () { return this.invokeSideLoader(() => association.postFetch(fetchConfig, this, parents), associationVisitor); }),
            });
        }
        else if (MappedAssociation_1.isJoinConfig(fetchConfig)) {
            this.deriveJoinedQuery(association, fetchConfig, tablePath, aliasHierarchyVisitor, associationVisitor);
        }
        else {
            throw new Error(`Every specified association should be resolvable through a preFetch, postFetch or join`);
        }
    }
    deriveJoinedQuery(association, fetchConfig, tablePath, aliasHierarchyVisitor, resolveInfoVisitor) {
        const sourceAlias = aliasHierarchyVisitor.alias;
        const relDataSource = association.target;
        const nextAliasHierarchyVisitor = association.join(fetchConfig, this.storeParams.queryBuilder, aliasHierarchyVisitor);
        this.mapWhereArgs(this.operation.deriveWhereParams(resolveInfoVisitor.parsedResolveInfo.args, association), nextAliasHierarchyVisitor);
        this.resolveFields(tablePath.concat(association.mappedName), nextAliasHierarchyVisitor, relDataSource, resolveInfoVisitor);
    }
    invokeSideLoader(sideLoad, associationVisitor) {
        const { query, args } = sideLoad();
        return query.resolve(this.source, args, this.context, this.resolveInfoRoot, associationVisitor);
    }
    associateResultsWithParents(association) {
        if (!association.associatorColumns) {
            throw new Error("Either association.associatorColumns or association.associateResultsWithParents is mandatory");
        }
        return (parents, results) => {
            debug("associating results with parents -- parents: %O, results: %O", parents, results);
            const { inSource, inRelated } = association.associatorColumns;
            const parentsIndex = utils_1.indexBy(parents, inSource);
            results.forEach(result => {
                const pkey = result[inRelated];
                if (!pkey)
                    return;
                const parent = parentsIndex[pkey];
                if (!parent)
                    return;
                if (association.singular) {
                    parent[association.mappedName] = result;
                }
                else {
                    parent[association.mappedName] = parent[association.mappedName] || [];
                    parent[association.mappedName].push(result);
                }
            });
        };
    }
    deriveColumnsForField(field, tablePath, aliasHierarchyVisitor) {
        field.getColumnMappingList(aliasHierarchyVisitor).forEach(colMapping => {
            this.storeParams.columns.push({
                [colMapping.columnAlias]: colMapping.columnRef,
            });
            this.storeParams.primaryMappers.push({
                propertyPath: tablePath.concat(field.mappedName),
                fetchedColName: colMapping.columnAlias,
            });
        });
    }
    mapWhereArgs(whereArgs, aliasHierarchyVisitor) {
        const whereParams = {};
        Object.entries(whereArgs).forEach(([name, arg]) => {
            const field = this.rootSource.fields[name];
            if (field) {
                whereParams[`${aliasHierarchyVisitor.alias}.${field.sourceColumn}`] = arg;
                return;
            }
        });
        return whereParams;
    }
}
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], QueryOperationResolver.prototype, "aliasHierarchyVisitor", null);
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], QueryOperationResolver.prototype, "storeParams", null);
exports.QueryOperationResolver = QueryOperationResolver;
//# sourceMappingURL=QueryOperationResolver.js.map