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
const errors_1 = require("./errors");
const graphql_type_mapper_1 = require("./graphql-type-mapper");
const lodash_1 = require("lodash");
const utils_1 = require("./utils");
function isMappedFromColumn(f) {
    return !lodash_1.has(f, "derive");
}
function isComputed(f) {
    return lodash_1.has(f, "derive");
}
class MappedField {
    constructor(dataSource, mappedName, mapping) {
        this.dataSource = dataSource;
        this.mappedName = mappedName;
        this.mapping = mapping;
    }
    get dependencies() {
        if (this.isMappedFromColumn) {
            return [];
        }
        return lodash_1.map(this.mapping.dependencies, name => this.dataSource.fields[name]);
    }
    get isMappedFromColumn() {
        return isMappedFromColumn(this.mapping);
    }
    get isComputed() {
        return isComputed(this.mapping);
    }
    get sourceColumn() {
        if (this.isMappedFromColumn) {
            const mapping = this.mapping;
            return mapping.sourceColumn || lodash_1.snakeCase(this.mappedName);
        }
        return undefined;
    }
    get sourceColumns() {
        if (isMappedFromColumn(this.mapping)) {
            return this.sourceColumn;
        }
        else {
            return this.mapping.dependencies;
        }
    }
    get exposed() {
        return this.mapping.exposed !== false;
    }
    get description() {
        return this.mapping.description;
    }
    get type() {
        return this.mapping.type;
    }
    get keyPath() {
        return `${this.dataSource.mappedName}[fields][${this.mappedName}]`;
    }
    getValue(sourceRow) {
        if (this.isComputed) {
            const { type } = this.mapping;
            const { dependencies, derive } = this.mapping;
            const args = lodash_1.pick(sourceRow, dependencies);
            return derive(args);
        }
        const key = this.sourceColumn;
        if (key) {
            sourceRow[key];
        }
        return undefined;
    }
    getColumnMappingList(aliasHierarchyVisitor) {
        if (this.mapping.getColumnMappingList) {
            return this.mapping.getColumnMappingList(aliasHierarchyVisitor);
        }
        if (this.isMappedFromColumn) {
            const tableAlias = aliasHierarchyVisitor.alias;
            return [
                {
                    field: this,
                    columnRef: `${tableAlias}.${this.sourceColumn}`,
                    columnAlias: `${tableAlias}__${this.mappedName}`,
                },
            ];
        }
        else {
            return lodash_1.transform(this.dependencies, (list, f) => list.push(...f.getColumnMappingList(aliasHierarchyVisitor)), []);
        }
    }
    get outputType() {
        const { to } = this.mapping;
        if (to) {
            if (graphql_1.isScalarType(to)) {
                return to;
            }
            return to.output;
        }
        return graphql_type_mapper_1.deriveFieldOutputType(this);
    }
    get inputType() {
        const { to } = this.mapping;
        if (to) {
            if (graphql_1.isScalarType(to)) {
                return to;
            }
            return to.input;
        }
        return graphql_type_mapper_1.deriveFieldInputType(this);
    }
    get Type() {
        throw errors_1.getTypeAccessorError("Type", "MappedField");
    }
}
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MappedField.prototype, "outputType", null);
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MappedField.prototype, "inputType", null);
exports.MappedField = MappedField;
//# sourceMappingURL=MappedField.js.map