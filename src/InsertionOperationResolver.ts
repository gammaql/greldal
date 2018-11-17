import { MappedDataSource } from "./MappedDataSource";
import { OperationResolver } from "./OperationResolver";
import { reduce } from "lodash";
import { Dict } from "./util-types";
import { supportsReturning } from "./connector";
import { MemoizeGetter } from "./utils";
import _debug from "debug";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";

const debug = _debug("greldal:InsertionOperationResolver");

export class InsertionOperationResolver<T extends MappedDataSource = any> extends OperationResolver<T> {
    @MemoizeGetter
    get entities(): Dict[] {
        if (this.operation.singular) {
            return [this.args.entity];
        } else {
            return this.args.entities as any;
        }
    }

    get aliasHierarchyVisitor() {
        return new AliasHierarchyVisitor().visit(this.rootSource.storedName)!;
    }

    async resolve(): Promise<any> {
        let queryBuilder = this.rootSource.rootQuery(this.aliasHierarchyVisitor);
        const mappedRows = this.rootSource.mapEntities(this.entities);
        debug("Mapped entities to rows:", this.entities, mappedRows);
        if (this.supportsReturning) queryBuilder.returning(this.rootSource.storedColumnNames);
        const results = await queryBuilder.insert(mappedRows);
        // When returning is available we map from returned values to ensure that database level defaults etc. are correctly
        // accounted for:
        if (this.supportsReturning) return this.rootSource.shallowMapResults(results);
        // TODO: Is an extra worth having here for the sake of consistency ?
        return this.entities;
    }
}
