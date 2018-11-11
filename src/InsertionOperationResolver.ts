import { MappedDataSource } from "./MappedDataSource";
import { OperationResolver } from "./OperationResolver";
import { reduce } from "lodash";
import { Dict } from "./util-types";
import { supportsReturning } from "./connector";
import { MemoizeGetter } from "./utils";
import _debug from "debug";

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

    async resolve(): Promise<any> {
        const rootAlias = this.deriveAlias();
        let queryBuilder = this.rootSource.rootQuery(rootAlias);
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
