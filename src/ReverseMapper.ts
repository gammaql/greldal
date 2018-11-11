import _debug from "debug";
import { DataSourceMapping, MappedDataSource } from "./MappedDataSource";
import { Maybe, Dict } from "./util-types";
import { StoreQueryParams } from "./QueryOperationResolver";
import { MappedOperation, OperationMapping } from "./MappedOperation";
import { last, memoize, pick, compact, groupBy } from "lodash";

const debug = _debug("greldal:ReverseMapper");

export interface ReverseMapperTree {
    readonly fields: Dict<Maybe<string>>;
    readonly relations: Dict<ReverseMapperTree>;
}

export class ReverseMapper<T extends MappedDataSource> {
    public tree: ReverseMapperTree = {
        fields: {},
        relations: {},
    };

    constructor(
        private rootSource: T,
        private storeParams: StoreQueryParams<T>,
        private operation: MappedOperation<OperationMapping<T>>,
    ) {
        this.populateReverseTree();
    }

    async reverseMap(rows: Dict[]) {
        debug("Reverse mapping rows:", rows);
        const hierarchy = this.reverseMapQueryResults(rows, this.tree)!;
        if (!this.operation.shallow) {
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
        debug("Reverse mapped hierarchy:", hierarchy);
        return hierarchy;
    }

    private populateReverseTree() {
        for (const { fetchedColName, propertyPath } of this.storeParams.primaryMappers) {
            let curLevel = this.tree;
            for (const k of propertyPath.slice(0, -1)) {
                curLevel.relations[k] = curLevel.relations[k] || {
                    fields: {},
                    relations: {},
                };
                curLevel = curLevel.relations[k];
            }
            curLevel.fields[last(propertyPath as any)! as any] = fetchedColName;
        }
    }

    private getImmediateColKeys(level: ReverseMapperTree) {
        return Object.values(level.fields) as string[];
    }

    private getAllDescendantColKeys: (l: ReverseMapperTree) => string[] = memoize((level: ReverseMapperTree) => {
        const keys: any[] = [];
        keys.push(...Object.values(level.fields));
        for (const r of Object.values(level.relations)) {
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
        const grouping = groupBy(list, r => JSON.stringify(imKeys.map(k => r[k])));
        return Object.values(grouping).map(g => {
            const entity: any = {};
            for (const [fname, fkey] of Object.entries(level.fields)) {
                entity[fname] = g[0][fkey!];
            }
            for (const [rname, nextLevel] of Object.entries(level.relations)) {
                entity[rname] = this.reverseMapQueryResults(g, nextLevel);
            }
            // debug("entity: %O", entity);
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
