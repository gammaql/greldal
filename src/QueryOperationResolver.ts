import { OperationResolver, BaseStoreParams } from "./OperationResolver";
import { MappedDataSource } from "./MappedDataSource";
import { Dict } from "./util-types";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { MappedField } from "./MappedField";
import {
    MappedAssociation,
    MappedForeignQuery,
    AssociationFetchConfig,
    isPreFetchConfig,
    isPostFetchConfig,
    AssociationJoinConfig,
    isJoinConfig,
} from "./MappedAssociation";
import _debug from "debug";
import { indexBy, MemoizeGetter } from "./utils";
import { PartialDeep } from "lodash";
import { ReverseMapper } from "./ReverseMapper";
import { MappedQueryOperation } from "./MappedQueryOperation";
import { OperationMapping } from "./MappedOperation";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";

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

    @MemoizeGetter
    get aliasHierarchyVisitor() {
        return new AliasHierarchyVisitor().visit(this.rootSource.storedName)!;
    }

    get rootSource(): TDataSource {
        return this.operation.rootSource;
    }

    @MemoizeGetter
    get storeParams(): StoreQueryParams<TDataSource> {
        const storeParams = {
            whereParams: this.mapWhereArgs(
                this.operation.deriveWhereParams(this.resolveInfoVisitor.parsedResolveInfo.args),
                this.aliasHierarchyVisitor,
            ),
            queryBuilder: this.operation.rootQuery(this.args, this.aliasHierarchyVisitor),
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
        this.resolveFields<TDataSource>([], this.aliasHierarchyVisitor, this.rootSource, this.resolveInfoVisitor);
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
        aliasHierarchyVisitor: AliasHierarchyVisitor,
        dataSource: TCurSrc,
        resolveInfoVisitor: ResolveInfoVisitor<TCurSrc>,
    ) {
        const typeName = this.operation.shallow ? dataSource.shallowMappedName : dataSource.mappedName;
        for (const { fieldName } of resolveInfoVisitor!.iterateFieldsOf(typeName)) {
            this.resolveFieldName(fieldName, tablePath, aliasHierarchyVisitor, dataSource, resolveInfoVisitor);
        }
    }

    private resolveFieldName<TCurSrc extends MappedDataSource>(
        fieldName: keyof TCurSrc["fields"],
        tablePath: string[],
        aliasHierarchyVisitor: AliasHierarchyVisitor,
        dataSource: TCurSrc,
        resolveInfoVisitor: ResolveInfoVisitor<TCurSrc>,
    ) {
        const field = dataSource.fields[fieldName];
        if (field) {
            debug("Identified field corresponding to fieldName %s -> %O", fieldName, field);
            this.deriveColumnsForField(field, tablePath, aliasHierarchyVisitor);
            return;
        }
        if (!this.operation.shallow) {
            const association = dataSource.associations[fieldName];
            if (association) {
                debug("Identified candidate associations corresponding to fieldName %s -> %O", fieldName, association);
                const fetchConfig = association.getFetchConfig(this);
                if (!fetchConfig) {
                    throw new Error("Unable to resolve association through any of the specified fetch configurations");
                }
                this.resolveAssociation(association, fetchConfig, tablePath, aliasHierarchyVisitor, resolveInfoVisitor);
                return;
            }
        }
        throw new Error(`Unable to resovle fieldName ${fieldName} in dataSource: ${dataSource.mappedName}`);
    }

    private resolveAssociation<TCurSrc extends MappedDataSource>(
        association: MappedAssociation<TCurSrc>,
        fetchConfig: AssociationFetchConfig<TCurSrc, any>,
        tablePath: string[],
        aliasHierarchyVisitor: AliasHierarchyVisitor,
        resolveInfoVisitor: ResolveInfoVisitor<TCurSrc>,
    ) {
        const associationVisitor = resolveInfoVisitor.visitRelation(association);
        if (isPreFetchConfig(fetchConfig)) {
            this.storeParams.secondaryMappers.preFetched.push({
                propertyPath: tablePath,
                reverseAssociate: association.associateResultsWithParents(fetchConfig),
                result: this.invokeSideLoader(() => association.preFetch(fetchConfig, this), associationVisitor),
            });
        } else if (isPostFetchConfig(fetchConfig)) {
            this.storeParams.secondaryMappers.postFetched.push({
                propertyPath: tablePath,
                reverseAssociate: association.associateResultsWithParents(fetchConfig),
                run: async (parents: PartialDeep<TCurSrc["RecordType"]>[]) =>
                    this.invokeSideLoader(() => association.postFetch(fetchConfig, this, parents), associationVisitor),
            });
        } else if (isJoinConfig(fetchConfig)) {
            this.deriveJoinedQuery(association, fetchConfig, tablePath, aliasHierarchyVisitor, associationVisitor);
        } else {
            throw new Error(`Every specified association should be resolvable through a preFetch, postFetch or join`);
        }
    }

    private deriveJoinedQuery<TCurSrc extends MappedDataSource>(
        association: MappedAssociation<TCurSrc>,
        fetchConfig: AssociationJoinConfig<TCurSrc, any>,
        tablePath: string[],
        aliasHierarchyVisitor: AliasHierarchyVisitor,
        resolveInfoVisitor: ResolveInfoVisitor<TCurSrc>,
    ) {
        const sourceAlias = aliasHierarchyVisitor.alias;
        const relDataSource: MappedDataSource = association.target;
        const nextAliasHierarchyVisitor = association.join(
            fetchConfig,
            this.storeParams.queryBuilder,
            aliasHierarchyVisitor,
        );
        this.mapWhereArgs(
            this.operation.deriveWhereParams(resolveInfoVisitor.parsedResolveInfo.args, association),
            nextAliasHierarchyVisitor,
        );
        this.resolveFields(
            tablePath.concat(association.mappedName),
            nextAliasHierarchyVisitor,
            relDataSource,
            resolveInfoVisitor,
        );
    }

    private invokeSideLoader<TCurSrc extends MappedDataSource>(
        sideLoad: () => MappedForeignQuery,
        associationVisitor: ResolveInfoVisitor<TCurSrc>,
    ) {
        const { query, args } = sideLoad();
        return query.resolve(this.source, args, this.context, this.resolveInfoRoot, associationVisitor);
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

    private deriveColumnsForField(
        field: MappedField,
        tablePath: string[],
        aliasHierarchyVisitor: AliasHierarchyVisitor,
    ): any {
        field.getColumnMappingList(aliasHierarchyVisitor).forEach(colMapping => {
            this.storeParams.columns.push({
                [colMapping.columnAlias]: colMapping.columnRef,
            });
            this.storeParams.primaryMappers.push({
                propertyPath: tablePath.concat(field.mappedName),
                fetchedColName: colMapping.columnAlias,
            });
        });
    }

    protected mapWhereArgs(whereArgs: Dict, aliasHierarchyVisitor: AliasHierarchyVisitor) {
        const whereParams: Dict = {};
        Object.entries(whereArgs).forEach(([name, arg]) => {
            const field = this.rootSource.fields[name];
            if (field) {
                whereParams[`${aliasHierarchyVisitor.alias}.${field.sourceColumn}`] = arg;
                return;
            }
        });
        return whereParams;
    }
}
