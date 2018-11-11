import { OperationResolver, BaseStoreParams } from "./OperationResolver";
import { MappedDataSource } from "./MappedDataSource";
import { Dict } from "./util-types";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { MappedField } from "./MappedField";
import { MappedAssociation, MappedForeignQuery } from "./MappedAssociation";
import _debug from "debug";
import { indexBy, uid, MemoizeGetter } from "./utils";
import { PartialDeep } from "lodash";
import { ReverseMapper } from "./ReverseMapper";
import { MappedQueryOperation } from "./MappedQueryOperation";
import { OperationMapping } from "./MappedOperation";

const debug = _debug("greldal:QueryOperationResolver");

export interface PrimaryRowMapper {
    readonly propertyPath: string[];
    readonly fetchedColName: string;
}

export interface PreFetchedRowMapper<TResult, TParent> {
    readonly propertyPath: string[];
    readonly result: Promise<TResult[]>;
    readonly reverseAssociate: (parents: TParent[], results: TResult[]) => void;
}

export interface PostFetchedRowMapper<TResult, TParent> {
    readonly propertyPath: string[];
    readonly run: (parents: TParent[]) => Promise<TResult[]>;
    readonly reverseAssociate: (parents: TParent[], results: TResult[]) => void;
}

export interface StoreQueryParams<T extends MappedDataSource> extends BaseStoreParams {
    // Mapping of: aliasedColumnName -> aliasedTableName.columnName
    readonly whereParams: Dict;
    readonly columns: { [k: string]: string }[];
    readonly primaryMappers: PrimaryRowMapper[];
    readonly secondaryMappers: {
        readonly preFetched: PreFetchedRowMapper<any, Partial<T["ShallowRecordType"]>>[];
        readonly postFetched: PostFetchedRowMapper<any, Partial<T["ShallowRecordType"]>>[];
    };
}

export class QueryOperationResolver<TDataSource extends MappedDataSource = any> extends OperationResolver<TDataSource> {
    public operation!: MappedQueryOperation<OperationMapping<TDataSource>>;

    get rootSource(): TDataSource {
        return this.operation.rootSource;
    }

    @MemoizeGetter
    get rootAlias() {
        return this.deriveAlias();
    }

    @MemoizeGetter
    get storeParams(): StoreQueryParams<TDataSource> {
        const storeParams = {
            whereParams: this.mapWhereArgs(
                this.operation.deriveWhereParams(this.resolveInfoVisitor.parsedResolveInfo.args),
                this.rootAlias,
            ),
            queryBuilder: this.rootSource.rootQuery(this.rootAlias),
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

    async resolve() {
        this.resolveFields<TDataSource>([], [this.rootAlias], this.rootSource, this.resolveInfoVisitor);
        const resultRows = await this.runQuery();
        debug("Fetched rows:", resultRows);
        return this.rootSource.mapResults(this.storeParams as any, resultRows);
    }

    async runQuery() {
        const qb = this.storeParams.queryBuilder.where(this.storeParams.whereParams);
        if (this.operation.singular) qb.limit(1);
        return await qb.columns(this.storeParams.columns);
    }

    resolveFields<TCurSrc extends MappedDataSource>(
        tablePath: string[] = [],
        aliasList: string[],
        dataSource: TCurSrc,
        resolveInfoVisitor: ResolveInfoVisitor<TCurSrc>,
    ) {
        const typeName = this.operation.shallow ? dataSource.shallowMappedName : dataSource.mappedName;
        for (const { fieldName } of resolveInfoVisitor!.iterateFieldsOf(typeName)) {
            this.resolveFieldName(fieldName, tablePath, aliasList, dataSource, resolveInfoVisitor);
        }
    }

    private resolveFieldName<TCurSrc extends MappedDataSource>(
        fieldName: keyof TCurSrc["fields"],
        tablePath: string[],
        aliasList: string[],
        dataSource: TCurSrc,
        resolveInfoVisitor: ResolveInfoVisitor<TCurSrc>,
    ) {
        const field = dataSource.fields[fieldName];
        if (field) {
            debug("Identified field corresponding to fieldName %s -> %O", fieldName, field);
            this.deriveColumnsForField(field, tablePath, aliasList);
            return;
        }
        if (!this.operation.shallow) {
            const associations = dataSource.associations[fieldName];
            debug("Identified candidate associations corresponding to fieldName %s -> %O", fieldName, associations);
            if (associations) {
                for (const assoc of associations) {
                    if (!assoc.useIf || assoc.useIf(this)) {
                        debug("Identified association corresponding to fieldName %s -> %O", fieldName, assoc);
                        this.resolveAssociation(assoc, tablePath, aliasList, resolveInfoVisitor);
                        return;
                    }
                }
            }
        }
        throw new Error(`Unable to resovle fieldName ${fieldName} in dataSource: ${dataSource.mappedName}`);
    }

    private resolveAssociation<TCurSrc extends MappedDataSource>(
        association: MappedAssociation<TCurSrc>,
        tablePath: string[],
        aliasList: string[],
        resolveInfoVisitor: ResolveInfoVisitor<TCurSrc>,
    ) {
        const associationVisitor = resolveInfoVisitor.visitRelation(association);
        if (association.preFetch) {
            this.storeParams.secondaryMappers.preFetched.push({
                propertyPath: tablePath,
                reverseAssociate: association.associateResultsWithParents,
                result: this.invokeSideLoader(() => association.preFetch!(this), associationVisitor),
            });
        } else if (association.postFetch) {
            this.storeParams.secondaryMappers.postFetched.push({
                propertyPath: tablePath,
                reverseAssociate: association.associateResultsWithParents,
                run: async (parents: PartialDeep<TCurSrc["RecordType"]>[]) =>
                    this.invokeSideLoader(() => association.postFetch!(this, parents), associationVisitor),
            });
        } else if (association.join) {
            this.deriveJoinedQuery(association, tablePath, aliasList, associationVisitor);
        } else {
            throw new Error(`Every specified association should be resolvable through a preFetch, postFetch or join`);
        }
    }

    private deriveJoinedQuery<TCurSrc extends MappedDataSource>(
        association: MappedAssociation<TCurSrc>,
        tablePath: string[],
        aliasList: string[],
        resolveInfoVisitor: ResolveInfoVisitor<TCurSrc>,
    ) {
        const sourceAlias = aliasList[aliasList.length - 1];
        const relDataSource: MappedDataSource = association.from;
        const alias = uid(relDataSource.storedName);
        this.storeParams.queryBuilder = association.join(this.storeParams.queryBuilder, alias, sourceAlias);
        this.mapWhereArgs(
            this.operation.deriveWhereParams(resolveInfoVisitor.parsedResolveInfo.args, association),
            alias,
        );
        this.resolveFields(tablePath.concat(association.mappedName), aliasList.concat(alias), relDataSource, resolveInfoVisitor);
    }

    private invokeSideLoader<TCurSrc extends MappedDataSource>(
        sideLoad: () => MappedForeignQuery,
        associationVisitor: ResolveInfoVisitor<TCurSrc>,
    ) {
        const { query, args } = sideLoad();
        return query.resolve(this.source, this.context, args, this.resolveInfoRoot, associationVisitor);
    }

    associateResultsWithParents<TCurSrc extends MappedDataSource>(association: MappedAssociation<TCurSrc>) {
        if (!association.associatorColumns) {
            throw new Error(
                "Either association.associatorColumns or association.associateResultsWithParents is mandatory",
            );
        }
        return (parents: Dict[], results: Dict[]) => {
            debug("associating results with parents -- parents: %O, results: %O", parents, results);
            const { inSource, inRelated } = association.associatorColumns!;
            const parentsIndex = indexBy(parents, inSource);
            results.forEach(result => {
                const pkey = result[inRelated] as any;
                if (!pkey) return;
                const parent = parentsIndex[pkey] as any;
                if (!parent) return;
                if (association.singular) {
                    parent[association.mappedName] = result;
                } else {
                    parent[association.mappedName] = parent[association.mappedName] || [];
                    parent[association.mappedName].push(result);
                }
            });
        };
    }

    private deriveColumnsForField(field: MappedField, tablePath: string[], aliasList: string[]): any {
        const tableAlias = aliasList[aliasList.length - 1];
        const prop = `${tableAlias}__${field.mappedName}`;
        if (field.isMappedFromColumn) {
            this.storeParams.columns.push({
                [prop]: `${tableAlias}.${field.sourceColumn}`,
            });
            this.storeParams.primaryMappers.push({
                propertyPath: tablePath.concat(field.mappedName),
                fetchedColName: prop,
            });
        } else {
            field.dependencies.forEach(f => this.deriveColumnsForField(f, tablePath, aliasList));
        }
    }
}
