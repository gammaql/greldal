import _debug from "debug";
import { uniqBy, some, has, transform } from "lodash";

import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { MappedDataSource } from "./MappedDataSource";
import { DataSourceMapping } from "./DataSourceMapping";
import { MappedField } from "./MappedField";
import { MappedSingleSourceOperation } from "./MappedSingleSourceOperation";
import { MappedSingleSourceQueryOperation } from "./MappedSingleSourceQueryOperation";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { Dict, PartialDeep } from "./util-types";
import { indexBy, MemoizeGetter } from "./utils";
import { MappedAssociation } from "./MappedAssociation";
import {
    AssociationFetchConfig,
    isPreFetchConfig,
    AssociationPreFetchConfig,
    isPostFetchConfig,
    AssociationPostFetchConfig,
    isJoinConfig,
    AssociationJoinConfig,
    MappedForeignOperation,
} from "./AssociationMapping";
import { ResolverContext } from "./ResolverContext";
import { SourceAwareOperationResolver, BaseStoreParams } from "./SourceAwareOperationResolver";
import { Paginator, PageContainer } from "./Paginator";
import { MaybePaginatedResolveInfoVisitor, PaginatedResolveInfoVisitor } from "./PaginatedResolveInfoVisitor";
import { SourceAwareResolverContext } from "./SourceAwareResolverContext";

const debug = _debug("greldal:QueryOperationResolver");

/**
 * @api-category ConfigType
 */
export interface PrimaryRowMapper {
    readonly field: MappedField;
    readonly tablePath: string[];
    readonly columnAlias?: string;
}

/**
 * @api-category ConfigType
 */
export interface PreFetchedRowMapper<TResult, TParent> {
    readonly propertyPath: string[];
    readonly result: Promise<TResult[]>;
    readonly reverseAssociate: (parents: TParent[], results: TResult[]) => void;
}

/**
 * @api-category ConfigType
 */
export interface PostFetchedRowMapper<TResult, TParent> {
    readonly propertyPath: string[];
    readonly run: (parents: TParent[]) => Promise<TResult[]>;
    readonly reverseAssociate: (parents: TParent[], results: TResult[]) => void;
}

export type ColumnSelection = { /* Column alias: */ [k: string]: /* Mapped field name: */ string }[];

/**
 * @api-category ConfigType
 */
export interface StoreQueryParams<T extends MappedDataSource> extends BaseStoreParams {
    readonly whereParams: Dict;
    readonly columns: ColumnSelection;
    readonly primaryMappers: PrimaryRowMapper[];
    readonly secondaryMappers: {
        readonly preFetched: PreFetchedRowMapper<any, Partial<T["ShallowEntityType"]>>[];
        readonly postFetched: PostFetchedRowMapper<any, Partial<T["ShallowEntityType"]>>[];
    };
}

/**
 * Implements query operation resolution on a single data source
 *
 * @api-category CRUDResolvers
 */
export class SingleSourceQueryOperationResolver<
    TCtx extends SourceAwareResolverContext<TMappedOperation, TSrc, TArgs>,
    TSrc extends MappedDataSource,
    TMappedOperation extends MappedSingleSourceQueryOperation<TSrc, TArgs>,
    TArgs extends {},
    TResolved
> extends SourceAwareOperationResolver<TCtx, TSrc, TArgs, TResolved> {
    resultRows?: Dict[];
    aliasColumnsToTableScope: boolean = true;
    private paginator?: Paginator;

    constructor(public resolverContext: TCtx) {
        super(resolverContext);
        if (this.operation.paginationConfig) {
            this.paginator = new Paginator(
                this.operation.paginationConfig,
                resolverContext,
                this.aliasHierarchyVisitor,
            );
        }
    }

    @MemoizeGetter
    get aliasHierarchyVisitor() {
        const source = this.resolverContext.primaryDataSource;
        return this.getAliasHierarchyVisitorFor(source);
    }

    @MemoizeGetter
    get storeParams(): StoreQueryParams<TCtx["DataSourceType"]> {
        const source = this.resolverContext.primaryDataSource;
        const storeParams = {
            whereParams: this.resolverContext.primaryDataSource.mapQueryParams(
                this.resolverContext.operation.deriveWhereParams(this.resolverContext.primaryResolveInfoVisitor
                    .parsedResolveInfo.args as any),
                this.getAliasHierarchyVisitorFor(source),
            ),
            queryBuilder: this.createRootQueryBuilder(source),
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

    async resolve(): Promise<TResolved> {
        const source = this.resolverContext.primaryDataSource;
        return this.wrapInTransaction(async () => {
            this.resolveFields<TSrc>(
                [],
                this.getAliasHierarchyVisitorFor(source),
                source,
                this.resolverContext.primaryResolveInfoVisitor,
            );
            const resultRows = await this.runQuery();
            if (this.paginator) {
                this.resultRows = resultRows.slice(0, this.paginator.pageSize);
            } else {
                this.resultRows = resultRows;
            }
            debug("Fetched rows:", this.resultRows);
            const entities: TSrc["EntityType"][] = await source.mapRowsToEntities(this.resultRows!, this
                .storeParams as any);
            if (this.paginator) {
                const pageInfoResolveInfo = this.paginator.parsedPageInfoResolveInfo;
                let totalCount: number;
                if (pageInfoResolveInfo && pageInfoResolveInfo.totalCount) {
                    totalCount = await this.paginator!.getTotalCount(this.getQueryBuilder());
                }
                const pageContainer: PageContainer<TSrc["EntityType"]> = {
                    page: {
                        pageInfo: {
                            prevCursor: () => this.paginator!.getPrevCursor(resultRows),
                            nextCursor: () => this.paginator!.getNextCursor(resultRows),
                            totalCount: totalCount!,
                        },
                        entities,
                    },
                };
                return pageContainer as any;
            }
            return entities as any;
        });
    }

    getQueryBuilder() {
        return this.resolverContext.operation.interceptQueryByArgs(
            this.storeParams.queryBuilder.where(this.storeParams.whereParams),
            this.resolverContext.args,
        );
    }

    async runQuery() {
        let queryBuilder = this.getQueryBuilder().clone();
        if (this.paginator) {
            this.resolverContext.primaryPaginatedResolveInfoVisitor!.parsedResolveInfo;
            queryBuilder = this.paginator.interceptQuery(queryBuilder, this.storeParams.columns);
        }
        if (this.resolverContext.operation.singular) {
            const { primaryColumnNames } = this.resolverContext.primaryDataSource;
            const { alias } = this.aliasHierarchyVisitor;
            if (primaryColumnNames.length > 0) {
                const primaryColsSatisfied = !some(
                    primaryColumnNames,
                    colName => !has(this.storeParams.whereParams, `${alias}.${colName}`),
                );
                if (!primaryColsSatisfied) {
                    const pkQueryBuilder = queryBuilder
                        .clone()
                        .columns(primaryColumnNames.map(c => `${alias}.${c}`))
                        .limit(1);
                    const pkVals: Dict[] = await pkQueryBuilder;
                    const whereParams = transform(
                        pkVals[0],
                        (result: Dict, primaryColVal, primaryColName) => {
                            result[`${alias}.${primaryColName}`] = primaryColVal;
                        },
                        {},
                    );
                    queryBuilder.clearWhere().where(whereParams);
                }
            }
        }
        const rows = await queryBuilder.columns(this.storeParams.columns);
        return rows;
    }

    resolveFields<TCurSrc extends MappedDataSource>(
        tablePath: string[] = [],
        aliasHierarchyVisitor: AliasHierarchyVisitor,
        dataSource: TCurSrc,
        resolveInfoVisitor: ResolveInfoVisitor<TCurSrc>,
        typeName = this.resolverContext.operation.shallow ? dataSource.shallowMappedName : dataSource.mappedName,
        ignoreMissing = false,
    ) {
        for (const { fieldName } of resolveInfoVisitor!.iterateFieldsOf(typeName)) {
            this.resolveFieldName(
                fieldName,
                tablePath,
                aliasHierarchyVisitor,
                dataSource,
                resolveInfoVisitor,
                ignoreMissing,
            );
        }
    }

    private resolveFieldName<
        TCurSrcMapping extends DataSourceMapping,
        TCurSrc extends MappedDataSource<TCurSrcMapping>
    >(
        fieldName: keyof TCurSrc["fields"] | keyof TCurSrc["associations"],
        tablePath: string[],
        aliasHierarchyVisitor: AliasHierarchyVisitor,
        dataSource: MappedDataSource<TCurSrcMapping>,
        resolveInfoVisitor: ResolveInfoVisitor<TCurSrc>,
        ignoreMissing = false,
    ) {
        const fieldName_: any = fieldName;
        const field: MappedField<MappedDataSource<TCurSrcMapping>> = (dataSource.fields as Dict<
            MappedField<MappedDataSource<TCurSrcMapping>>
        >)[fieldName_];
        if (field) {
            debug("Identified field corresponding to fieldName %s -> %O", fieldName, field);
            this.deriveColumnsForField(field, tablePath, aliasHierarchyVisitor, this.aliasColumnsToTableScope);
            return;
        }
        if (!this.resolverContext.operation.shallow) {
            const association = (dataSource.associations as Dict<MappedAssociation<MappedDataSource<TCurSrcMapping>>>)[
                fieldName_
            ];
            if (association) {
                debug("Identified candidate associations corresponding to fieldName %s -> %O", fieldName, association);
                const fetchConfig = association.getFetchConfig<TCtx, TSrc, TMappedOperation, TArgs>(this);
                if (!fetchConfig) {
                    throw new Error("Unable to resolve association through any of the specified fetch configurations");
                }
                this.resolveAssociation(association, fetchConfig, tablePath, aliasHierarchyVisitor, resolveInfoVisitor);
                return;
            }
        }
        if (ignoreMissing) return;
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
                reverseAssociate: association.associateResultsWithParents(fetchConfig as AssociationPreFetchConfig<
                    any,
                    any
                >),
                result: this.invokeSideLoader(
                    () => association.preFetch(fetchConfig as AssociationPreFetchConfig<any, any>, this),
                    associationVisitor,
                ),
            });
        } else if (isPostFetchConfig(fetchConfig)) {
            this.storeParams.secondaryMappers.postFetched.push({
                propertyPath: tablePath,
                reverseAssociate: association.associateResultsWithParents(fetchConfig as AssociationPostFetchConfig<
                    any,
                    any
                >),
                run: async (parents: PartialDeep<TCurSrc["EntityType"]>[]) =>
                    this.invokeSideLoader(
                        () => association.postFetch(fetchConfig as AssociationPostFetchConfig<any, any>, this, parents),
                        associationVisitor,
                    ),
            });
        } else if (isJoinConfig(fetchConfig)) {
            if (associationVisitor instanceof PaginatedResolveInfoVisitor) {
                throw new Error("Pagination is current not supported with joined associations");
            }
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
        const relDataSource: MappedDataSource = association.target;
        const nextAliasHierarchyVisitor = association.join(
            fetchConfig,
            this.storeParams.queryBuilder,
            aliasHierarchyVisitor,
        );
        this.resolverContext.primaryDataSource.mapQueryParams(
            this.resolverContext.operation.deriveWhereParams(
                resolveInfoVisitor.parsedResolveInfo.args as any,
                association,
            ),
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
        sideLoad: <TArgs extends {}>() => MappedForeignOperation<MappedSingleSourceOperation<TCurSrc, TArgs>>,
        associationVisitor: MaybePaginatedResolveInfoVisitor<TCurSrc>,
    ) {
        const { operation: query, args } = sideLoad();
        return query.resolve(
            this.resolverContext.source,
            args,
            this.resolverContext.context,
            this.resolverContext.resolveInfoRoot,
            associationVisitor,
            resolver => {
                const r = resolver as SourceAwareOperationResolver<any, any, any, any>;
                r.isDelegated = true;
                r.activeTransaction = this.activeTransaction;
                return r;
            },
        );
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
        aliasColumnsToTableScope = true,
    ): any {
        field.getColumnMappingList(aliasHierarchyVisitor, aliasColumnsToTableScope).forEach(colMapping => {
            this.storeParams.columns.push({
                [colMapping.columnAlias]: colMapping.columnRef,
            });
            this.storeParams.primaryMappers.push({
                field: colMapping.field,
                tablePath,
                columnAlias: colMapping.columnAlias,
            });
        });
        if (field.isComputed) {
            this.storeParams.primaryMappers.push({
                field,
                tablePath,
            });
        }
    }

    get primaryFieldMappers() {
        const { primaryFields } = this.resolverContext.operation.rootSource;
        if (primaryFields.length === 0) {
            throw new Error("DeletionPreset requires some fields to be marked as primary");
        }
        const primaryMappers = uniqBy(
            this.storeParams.primaryMappers.filter(pm => pm.field.isPrimary),
            pm => pm.field.mappedName,
        );
        if (primaryMappers.length !== primaryFields.length) {
            throw new Error(
                `Not all primary keys included in query. Found ${primaryMappers.length} instead of ${primaryFields.length}`,
            );
        }
        return primaryMappers;
    }
}
