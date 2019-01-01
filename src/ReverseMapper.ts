import _debug from "debug";
import { MappedDataSource } from "./MappedDataSource";
import { Dict } from "./util-types";
import { StoreQueryParams, PrimaryRowMapper } from "./QueryOperationResolver";
import { memoize, pick, compact, groupBy, uniq } from "lodash";
import assert from "assert";

const debug = _debug("greldal:ReverseMapper");

export interface ReverseMapperTree {
    readonly primaryRowMappers: PrimaryRowMapper[];
    readonly relationMappers: Dict<ReverseMapperTree>;
}

/**
 * Utility to reverse map flattened tabular resultset obtained from a database query to a hierarchy of entities
 */
export class ReverseMapper<T extends MappedDataSource> {
    public tree: ReverseMapperTree = {
        primaryRowMappers: [],
        relationMappers: {},
    };

    constructor(private storeParams: StoreQueryParams<T>) {
        this.populateReverseTree();
    }

    async reverseMap(rows: Dict[], shallow = false) {
        debug("Reverse mapping rows:", rows);
        const hierarchy = this.reverseMapQueryResults(rows, this.tree)!;
        if (!shallow) {
            const { secondaryMappers } = this.storeParams;
            for (const { propertyPath, result, reverseAssociate } of secondaryMappers.preFetched) {
                const parents = this.extractEntitiesAtPath(propertyPath.slice(0, -1), hierarchy);
                reverseAssociate(parents, await result);
            }
            for (const { propertyPath, run, reverseAssociate } of secondaryMappers.postFetched) {
                const parents = this.extractEntitiesAtPath(propertyPath.slice(0, -1), hierarchy);
                reverseAssociate(parents, await run(parents));
            }
        }
        debug("Reverse mapped hierarchy: %O", hierarchy);
        return hierarchy;
    }

    private populateReverseTree() {
        debug("Populating reverseTree using storeParams: %O", this.storeParams);
        console.log("this.storeParams.primaryMappers =>", this.storeParams);
        for (const primaryMapper of this.storeParams.primaryMappers) {
            let curLevel = this.tree;
            for (const k of primaryMapper.tablePath) {
                curLevel.relationMappers[k] = curLevel.relationMappers[k] || {
                    primaryRowMappers: [],
                    relationMappers: {},
                };
                curLevel = curLevel.relationMappers[k];
            }
            curLevel.primaryRowMappers.push(primaryMapper);
        }
        debug("Reverse mapping tree: %O", this.tree);
    }

    private getImmediateColKeys(level: ReverseMapperTree) {
        return uniq(compact(level.primaryRowMappers.map(f => f.columnAlias)));
    }

    private getAllDescendantColKeys: (l: ReverseMapperTree) => string[] = memoize((level: ReverseMapperTree) => {
        const keys: string[] = [];
        keys.push(...this.getImmediateColKeys(level));
        for (const r of Object.values(level.relationMappers)) {
            keys.push(...this.getAllDescendantColKeys(r));
        }
        return keys;
    });

    private reverseMapQueryResults(rows: Dict[], level = this.tree) {
        const list = rows.map(r => pick(r, this.getAllDescendantColKeys(level)));
        if (list.length === 1 && compact(Object.values(list[0])).length === 0) {
            return null;
        }
        const imKeys = this.getImmediateColKeys(level);
        debug("Column keys at current level:", imKeys);
        const grouping = groupBy(list, r => JSON.stringify(imKeys.map(k => r[k])));
        return Object.values(grouping).map(g => {
            const entity: any = {};
            for (const { field, columnAlias } of level.primaryRowMappers) {
                assert(columnAlias || field.isComputed, "Expected columnAlias to be omitted only for computed field");
                if (columnAlias) {
                    entity[field.mappedName] = g[0][columnAlias];
                } else {
                    entity[field.mappedName] = field.derive!(pick(entity, field.dependencies.map(f => f.mappedName)));
                }
            }
            for (const [rname, nextLevel] of Object.entries(level.relationMappers)) {
                debug("Traversing to next level:", rname);
                entity[rname] = this.reverseMapQueryResults(g, nextLevel);
            }
            return entity;
        });
    }

    private extractEntitiesAtPath(path: string[], hierarchy: any[]): any[] {
        if (path.length === 0) {
            return hierarchy;
        }
        const curPath = path[0];
        const entities = hierarchy.map(e => e[curPath]);
        return this.extractEntitiesAtPath(path.slice(1), entities);
    }
}
