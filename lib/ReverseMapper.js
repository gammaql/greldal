"use strict";
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
const debug_1 = __importDefault(require("debug"));
const lodash_1 = require("lodash");
const debug = debug_1.default("greldal:ReverseMapper");
class ReverseMapper {
    constructor(rootSource, storeParams) {
        this.rootSource = rootSource;
        this.storeParams = storeParams;
        this.tree = {
            fields: {},
            relations: {},
        };
        this.getAllDescendantColKeys = lodash_1.memoize((level) => {
            const keys = [];
            keys.push(...Object.values(level.fields));
            for (const r of Object.values(level.relations)) {
                keys.push(...this.getAllDescendantColKeys(r));
            }
            return keys;
        });
        this.populateReverseTree();
        debug("Reverse mapping tree: %O", this.tree);
    }
    reverseMap(rows, shallow = false) {
        return __awaiter(this, void 0, void 0, function* () {
            debug("Reverse mapping rows:", rows);
            const hierarchy = this.reverseMapQueryResults(rows, this.tree);
            if (!shallow) {
                const { secondaryMappers } = this.storeParams;
                for (const { propertyPath, result, reverseAssociate } of secondaryMappers.preFetched) {
                    const parents = this.extractEntitiesAtPath(propertyPath.slice(0, -1), hierarchy);
                    reverseAssociate(parents, yield result);
                }
                for (const { propertyPath, run, reverseAssociate } of secondaryMappers.postFetched) {
                    const parents = this.extractEntitiesAtPath(propertyPath.slice(0, -1), hierarchy);
                    reverseAssociate(parents, yield run(parents));
                }
            }
            debug("Reverse mapped hierarchy: %O", hierarchy);
            return hierarchy;
        });
    }
    populateReverseTree() {
        for (const { fetchedColName, propertyPath } of this.storeParams.primaryMappers) {
            let curLevel = this.tree;
            for (const k of propertyPath.slice(0, -1)) {
                curLevel.relations[k] = curLevel.relations[k] || {
                    fields: {},
                    relations: {},
                };
                curLevel = curLevel.relations[k];
            }
            curLevel.fields[lodash_1.last(propertyPath)] = fetchedColName;
        }
    }
    getImmediateColKeys(level) {
        return Object.values(level.fields);
    }
    reverseMapQueryResults(rows, level = this.tree) {
        const list = rows.map(r => lodash_1.pick(r, this.getAllDescendantColKeys(level)));
        if (list.length === 1 && lodash_1.compact(Object.values(list[0])).length === 0) {
            return null;
        }
        const imKeys = this.getImmediateColKeys(level);
        debug("Column keys at current level:", imKeys);
        const grouping = lodash_1.groupBy(list, r => JSON.stringify(imKeys.map(k => r[k])));
        return Object.values(grouping).map(g => {
            const entity = {};
            for (const [fname, fkey] of Object.entries(level.fields)) {
                entity[fname] = g[0][fkey];
            }
            for (const [rname, nextLevel] of Object.entries(level.relations)) {
                debug("Traversing to next level:", rname);
                entity[rname] = this.reverseMapQueryResults(g, nextLevel);
            }
            // debug("entity: %O", entity);
            return entity;
        });
    }
    extractEntitiesAtPath(path, hierarchy) {
        if (path.length === 0) {
            return hierarchy;
        }
        const curPath = path[0];
        const entities = hierarchy.map(e => e[curPath]);
        return this.extractEntitiesAtPath(path.slice(1), entities);
    }
}
exports.ReverseMapper = ReverseMapper;
//# sourceMappingURL=ReverseMapper.js.map