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
const errors_1 = require("./errors");
const lodash_1 = require("lodash");
const t = __importStar(require("io-ts"));
const debug_1 = __importDefault(require("debug"));
const MappedField_1 = require("./MappedField");
const MappedAssociation_1 = require("./MappedAssociation");
const inflection_1 = require("inflection");
const graphql_type_mapper_1 = require("./graphql-type-mapper");
const connector_1 = require("./connector");
const utils_1 = require("./utils");
const ReverseMapper_1 = require("./ReverseMapper");
const debug = debug_1.default("greldal:MappedDataSource");
class MappedDataSource {
    constructor(mapping) {
        this.mapping = mapping;
        this.fields = lodash_1.transform(mapping.fields, (result, fieldMapping, name) => {
            result[name] = new MappedField_1.MappedField(this, name, fieldMapping);
        }, {});
        this.associations = lodash_1.transform(mapping.associations, (result, associationMapping, name) => {
            result[name] = new MappedAssociation_1.MappedAssociation(this, name, associationMapping);
        }, {});
        debug("Mapped data source with name: %s, fields: %O, associations: %O", this.mappedName, Object.keys(this.fields), Object.keys(this.associations));
        if (mapping.connector) {
            connector_1.assertSupportedConnector(mapping.connector);
        }
    }
    get connector() {
        return connector_1.assertConnectorConfigured(this.mapping.connector || connector_1.globalConnector);
    }
    rootQuery(aliasHierarchyVisitor) {
        if (this.mapping.rootQuery)
            return this.mapping.rootQuery(aliasHierarchyVisitor);
        return aliasHierarchyVisitor
            ? this.connector(`${this.storedName} as ${aliasHierarchyVisitor.alias}`)
            : this.connector(this.storedName);
    }
    get mappedName() {
        return lodash_1.isString(this.mapping.name)
            ? lodash_1.upperFirst(lodash_1.camelCase(inflection_1.singularize(this.mapping.name)))
            : this.mapping.name.mapped;
    }
    get shallowMappedName() {
        return `Shallow${this.mappedName}`;
    }
    get storedName() {
        return lodash_1.isString(this.mapping.name)
            ? lodash_1.snakeCase(inflection_1.pluralize(this.mapping.name))
            : this.mapping.name.stored;
    }
    get storedColumnNames() {
        return lodash_1.transform(this.fields, (result, field, name) => {
            if (field.isMappedFromColumn) {
                result.push(field.sourceColumn);
            }
        }, []);
    }
    get shallowRecordProps() {
        return lodash_1.transform(this.mapping.fields, (result, f, name) => {
            result[name] = f.type;
        }, {});
    }
    get associationProps() {
        const result = {};
        lodash_1.forEach(this.associations, (association, name) => {
            result[name] = association.target.recordType;
        });
        return lodash_1.transform(this.associations, (result, association, name) => {
            result[name] = association.target.recordType;
        }, {});
    }
    get recordProps() {
        return Object.assign({}, this.shallowRecordProps, this.associationProps);
    }
    get shallowRecordType() {
        return t.type(this.shallowRecordProps);
    }
    get recordType() {
        return t.type(this.recordProps);
    }
    get ShallowRecordType() {
        throw errors_1.getTypeAccessorError("ShallowRecordType", "MappedDataSource");
    }
    get RecordType() {
        throw errors_1.getTypeAccessorError("NestedRecordType", "MappedDataSource");
    }
    get MappingType() {
        throw errors_1.getTypeAccessorError("MappingType", "MappedDataSource");
    }
    get defaultOutputType() {
        return graphql_type_mapper_1.deriveDefaultOutputType(this);
    }
    get defaultShallowInputType() {
        debug("Deriving default shallow input type for: ", this.mappedName);
        return graphql_type_mapper_1.deriveDefaultShallowInputType(this);
    }
    get defaultShallowOutputType() {
        return graphql_type_mapper_1.deriveDefaultShallowOutputType(this);
    }
    mapEntities(entities) {
        return entities.map(entity => lodash_1.reduce(entity, (result, val, key) => {
            const field = this.fields[key];
            if (field) {
                result[field.sourceColumn] = val;
            }
            return result;
        }, {}));
    }
    mapResults(storeParams, rows) {
        return new ReverseMapper_1.ReverseMapper(this, storeParams).reverseMap(rows);
    }
    shallowMapResults(rows) {
        rows.map(row => {
            const mappedRow = {};
            for (const [key, field] of Object.entries(this.fields)) {
                mappedRow[field.mappedName] = field.getValue(row);
            }
            return mappedRow;
        });
    }
}
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MappedDataSource.prototype, "mappedName", null);
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MappedDataSource.prototype, "shallowMappedName", null);
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MappedDataSource.prototype, "storedName", null);
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MappedDataSource.prototype, "storedColumnNames", null);
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MappedDataSource.prototype, "shallowRecordProps", null);
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MappedDataSource.prototype, "associationProps", null);
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MappedDataSource.prototype, "recordProps", null);
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MappedDataSource.prototype, "shallowRecordType", null);
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MappedDataSource.prototype, "recordType", null);
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MappedDataSource.prototype, "defaultOutputType", null);
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MappedDataSource.prototype, "defaultShallowInputType", null);
__decorate([
    utils_1.MemoizeGetter,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MappedDataSource.prototype, "defaultShallowOutputType", null);
exports.MappedDataSource = MappedDataSource;
exports.mapDataSource = (mapping) => new MappedDataSource(mapping);
//# sourceMappingURL=MappedDataSource.js.map