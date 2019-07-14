import * as Knex from "knex";

import { PaginationConfig, ControlledPaginationConfig, isAutoPaginationConfig } from "./PaginationConfig";
import { Dict, MaybeLazy, MaybePromise } from "./util-types";
import { ResolverContext } from "./ResolverContext";
import { MappedDataSource } from "./MappedDataSource";
import { MappedOperation } from "./MappedOperation";
import { isNumber } from "util";
import { isNil } from "lodash";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
import { ColumnSelection } from "./SingleSourceQueryOperationResolver";
import { AutoDerivedControlledPaginationConfig } from "./AutoDerivedControlledPaginationConfig";
import { SourceAwareResolverContext } from "./SourceAwareResolverContext";
import { MappedSourceAwareOperation } from "./MappedSourceAwareOperation";

const DEFAULT_PAGE_SIZE = 10;

interface PageArgs {
    cursor?: string;
    pageSize?: number;
}

export interface PageInfo {
    prevCursor: MaybeLazy<string>;
    nextCursor: MaybeLazy<string>;
    totalCount: MaybeLazy<MaybePromise<number>>;
}

export interface PageContainer<T> {
    page: {
        pageInfo: PageInfo;
        entities: T[];
    };
}

export type MaybePageContainer<T> = T | T[] | PageContainer<T>;

export class Paginator {
    private config: ControlledPaginationConfig;
    constructor(
        config: PaginationConfig,
        private resolverContext: SourceAwareResolverContext<
            MappedSourceAwareOperation<MappedDataSource, any>,
            MappedDataSource,
            any
        >,
        private aliasHierarchyVisitor: AliasHierarchyVisitor,
    ) {
        this.config = isAutoPaginationConfig(config) ? new AutoDerivedControlledPaginationConfig(config) : config;
    }
    get dataSource() {
        return this.resolverContext.primaryDataSource;
    }
    interceptQuery(qb: Knex.QueryBuilder, selectedColumns: ColumnSelection): Knex.QueryBuilder {
        return this.config.interceptQuery(
            qb,
            this.pageArgs.cursor,
            this.pageSize,
            selectedColumns,
            this.aliasHierarchyVisitor,
        );
    }
    getNextCursor(results: Dict[]): string {
        return this.config.getNextCursor(results, this.aliasHierarchyVisitor);
    }
    getPrevCursor(results: Dict[]): string {
        return this.config.getPrevCursor(results, this.aliasHierarchyVisitor);
    }
    getTotalCount(qb: Knex.QueryBuilder): Promise<number> {
        return this.config.getTotalCount(qb, this.aliasHierarchyVisitor);
    }

    get parsedResolveInfo() {
        return this.resolverContext.primaryPaginatedResolveInfoVisitor!.parsedResolveInfo;
    }

    get parsedPageContainerResolveInfo() {
        return this.parsedResolveInfo.fieldsByTypeName[this.dataSource.pageContainerName];
    }

    get parsedPageInfoResolveInfo() {
        const { pageName } = this.dataSource;
        const { pageInfo } = this.parsedPageContainerResolveInfo.page.fieldsByTypeName[pageName];
        return pageInfo && pageInfo.fieldsByTypeName.GRelDALPageInfo;
    }

    get pageArgs(): PageArgs {
        return this.parsedResolveInfo.fieldsByTypeName[
            this.resolverContext.operation.shallow
                ? this.dataSource.shallowPageContainerName
                : this.dataSource.pageContainerName
        ].page.args;
    }

    get pageSize() {
        const specifiedSize = this.pageArgs.pageSize;
        if (isNumber(specifiedSize)) {
            if (isNumber(this.config.pageSize)) {
                if (this.config.pageSize !== specifiedSize) {
                    throw new Error(`The only permissible value of pageSize is ${this.config.pageSize}`);
                }
                return specifiedSize;
            }
            if (isNil(this.config.pageSize)) return specifiedSize;
            if (isNumber(this.config.pageSize.max)) {
                if (specifiedSize <= this.config.pageSize.max) return specifiedSize;
                throw new Error(`pageSize exceeds maximum permissible value (${this.config.pageSize.max})`);
            }
            return specifiedSize;
        } else {
            if (isNumber(this.config.pageSize)) return this.config.pageSize;
            if (isNil(this.config.pageSize)) return DEFAULT_PAGE_SIZE;
            if (isNumber(this.config.pageSize.default)) return this.config.pageSize.default;
            if (isNumber(this.config.pageSize.max)) {
                if (DEFAULT_PAGE_SIZE < this.config.pageSize.max) return DEFAULT_PAGE_SIZE;
                return this.config.pageSize.max;
            }
            return DEFAULT_PAGE_SIZE;
        }
    }
}
