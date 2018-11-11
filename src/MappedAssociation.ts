import { MappedDataSource } from "./MappedDataSource";
import { singularize } from "inflection";
import { QueryOperationResolver } from "./QueryOperationResolver";
import { getTypeAccessorError } from "./errors";
import { MappedOperation } from "./MappedOperation";
import { PartialDeep, isBoolean, isPlainObject } from "lodash";
import _debug from "debug";
import * as Knex from "knex";
import { indexBy, MemoizeGetter } from "./utils";
import { isString, isFunction } from "util";
import { TypeGuard } from "./util-types";

const debug = _debug("greldal:MappedAssociation");

export interface MappedForeignQuery<M extends MappedOperation = MappedOperation> {
    query: M;
    args: M["ArgsType"];
}

export type JoinTypeId =
    | "innerJoin"
    | "leftJoin"
    | "leftOuterJoin"
    | "rightJoin"
    | "rightOuterJoin"
    | "outerJoin"
    | "fullOuterJoin"
    | "crossJoin";

export interface AssociationMapping<TSrc extends MappedDataSource = any, TTgt extends MappedDataSource = any> {
    from: (this: MappedAssociation<TSrc, TTgt>) => TTgt;
    description?: string;
    join: JoinTypeId | ((qb: Knex.QueryBuilder) => Knex.QueryBuilder);
    singular?: boolean;
    associatorColumns?: {
        inSource: string;
        inRelated: string;
    };
    preFetch?: (this: MappedAssociation<TSrc, TTgt>, operation: QueryOperationResolver) => MappedForeignQuery;
    postFetch?: (
        this: MappedAssociation<TSrc, TTgt>,
        operation: QueryOperationResolver,
        parents: PartialDeep<TSrc["RecordType"]>[],
    ) => MappedForeignQuery;
    associateResultsWithParents: (
        this: MappedAssociation<TSrc, TTgt>,
        parents: PartialDeep<TSrc["RecordType"]>[],
        results: PartialDeep<TTgt["RecordType"]>[],
    ) => void;
    useIf?: (this: MappedAssociation<TSrc, TTgt>, operation: QueryOperationResolver<any>) => boolean;
}

export class MappedAssociation<TSrc extends MappedDataSource = any, TTgt extends MappedDataSource = any> {
    constructor(public dataSource: TSrc, public mappedName: string, private mapping: AssociationMapping<TSrc, TTgt>) {}

    @MemoizeGetter
    get singular() {
        if (isBoolean(this.mapping.singular)) {
            return this.mapping.singular;
        }
        return singularize(this.mappedName) === this.mappedName;
    }

    get from(): TTgt {
        return this.mapping.from.apply(this);
    }

    get description() {
        return this.mapping.description;
    }

    get useIf() {
        return this.mapping.useIf;
    }

    @MemoizeGetter
    get preFetch() {
        if (this.mapping.preFetch) {
            return this.mapping.preFetch.bind(this);
        }
    }

    @MemoizeGetter
    get postFetch() {
        if (this.mapping.postFetch) {
            return this.mapping.postFetch.bind(this);
        }
    }

    join(qb: Knex.QueryBuilder, alias: string, sourceAlias: string): Knex.QueryBuilder {
        if ((isFunction as TypeGuard<Function>)(this.mapping.join)) {
            return this.mapping.join(qb);
        }
        if ((isString as TypeGuard<JoinTypeId>)(this.mapping.join) && isPlainObject(this.associatorColumns)) {
            return qb[this.mapping.join](
                `${this.from.storedName} as ${alias}`,
                `${sourceAlias}.${this.associatorColumns!.inSource}`,
                `${alias}.${this.associatorColumns!.inRelated}`,
            );
        }
        throw new Error(`Not enough information to autoJoin association. Specify a join function`);
    }

    get isAutoJoinable() {
        return isString(this.mapping.join) && isPlainObject(this.associatorColumns);
    }

    associateResultsWithParents(
        parents: PartialDeep<TSrc["RecordType"]>[],
        results: PartialDeep<TTgt["RecordType"]>[],
    ) {
        if (this.join) {
            throw new Error("Not applicable for join based associations");
        }
        if (this.mapping.associateResultsWithParents) {
            // TODO Fix type conflict here
            return this.mapping.associateResultsWithParents.apply(this, [parents, results]);
        }
        debug("associating results with parents -- parents: %O, results: %O", parents, results);
        if (!this.mapping.associatorColumns) {
            throw new Error("Either associatorColumns or associateResultsWithParents must be specified");
        }
        const { inRelated, inSource } = this.mapping.associatorColumns!;
        const parentsIndex = indexBy(parents, inSource);
        results.forEach(result => {
            const pkey = result[inRelated] as any;
            if (!pkey) return;
            const parent = parentsIndex[pkey] as any;
            if (!parent) return;
            if (this.mapping.singular) {
                parent[this.mappedName] = result;
            } else {
                parent[this.mappedName] = parent[this.mappedName] || [];
                parent[this.mappedName].push(result);
            }
        });
    }

    get associatorColumns() {
        return this.mapping.associatorColumns;
    }

    get DataSourceType(): TSrc {
        throw getTypeAccessorError("DataSourceType", "MappedAssociation");
    }

    get AssociatedDataSourceType(): TTgt {
        throw getTypeAccessorError("AssociatedDataSourceType", "MappedAssociation");
    }

    get SourceRecordType(): TSrc["RecordType"] {
        throw getTypeAccessorError("SourceRecordType", "MappedAssociation");
    }

    get AssociatedRecordType(): TTgt["RecordType"] {
        throw getTypeAccessorError("AssociatedRecordType", "MappedAssociation");
    }
}
