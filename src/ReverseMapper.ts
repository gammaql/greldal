import _debug from "debug";
import { MappedDataSource } from "./MappedDataSource";
import { Dict } from "./utils/util-types";
import { StoreQueryParams, PrimaryRowMapper } from "./SingleSourceQueryOperationResolver";
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
        for (const primaryMapper of this.storeParams.primaryMappers) {
            let curLevel = this.tree;
            for (const tablePathLevel of primaryMapper.tablePath) {
                curLevel.relationMappers[tablePathLevel] = curLevel.relationMappers[tablePathLevel] || {
                    primaryRowMappers: [],
                    relationMappers: {},
                };
                curLevel = curLevel.relationMappers[tablePathLevel];
            }
            curLevel.primaryRowMappers.push(primaryMapper);
        }
        debug("Reverse mapping tree: %O", this.tree);
    }

    private getImmediateColKeys(level: ReverseMapperTree) {
        return uniq(compact(level.primaryRowMappers.map(rowMapper => rowMapper.columnAlias)));
    }

    private getAllDescendantColKeys: (reverseMapperTree: ReverseMapperTree) => string[] = memoize(
        (level: ReverseMapperTree) => {
            const keys: string[] = [];
            keys.push(...this.getImmediateColKeys(level));
            for (const r of Object.values(level.relationMappers)) {
                keys.push(...this.getAllDescendantColKeys(r));
            }
            return keys;
        },
    );

    private reverseMapQueryResults(rows: Dict[], level = this.tree) {
        const list = rows.map(r => pick(r, this.getAllDescendantColKeys(level)));
        if (list.length === 1 && compact(Object.values(list[0])).length === 0) {
            return null;
        }
        const immediateColKeys = this.getImmediateColKeys(level);
        debug("Column keys at current level:", immediateColKeys);
        const grouping = groupBy(list, listItem => JSON.stringify(immediateColKeys.map(key => listItem[key])));
        return Object.values(grouping).map(groupingItem => {
            const entity: any = {};
            const derivations: Array<() => void> = [];
            for (const { field, columnAlias } of level.primaryRowMappers) {
                assert(columnAlias || field.isComputed, "Expected columnAlias to be omitted only for computed field");
                if (columnAlias) {
                    const rowValue = field.fromSource(groupingItem[0][columnAlias]);
                    entity[field.mappedName] = rowValue;
                } else {
                    const rowValue = field.derive!(
                        pick(
                            entity,
                            field.dependencies.map(f => f.mappedName),
                        ),
                    );
                    derivations.push(() => {
                        entity[field.mappedName] = rowValue;
                    });
                }
            }
            for (const derivation of derivations) {
                derivation();
            }
            for (const [relationName, nextLevel] of Object.entries(level.relationMappers)) {
                debug("Traversing to next level:", relationName);
                entity[relationName] = this.reverseMapQueryResults(groupingItem, nextLevel);
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
