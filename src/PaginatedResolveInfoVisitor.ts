import { MappedDataSource } from "./MappedDataSource";
import Maybe from "graphql/tsutils/Maybe";
import { ResolveInfoVisitor } from "./ResolveInfoVisitor";
import { ResolveTree, parseResolveInfo } from "graphql-parse-resolve-info";
import { GraphQLResolveInfo } from "graphql";

export class PaginatedResolveInfoVisitor<
    TSrc extends MappedDataSource,
    TParentVisitor extends Maybe<MaybePaginatedResolveInfoVisitor<any, any>> = any
> {
    public parsedResolveInfo: ResolveTree;

    constructor(
        public originalResolveInfoRoot: GraphQLResolveInfo,
        public rootSource: TSrc,
        parsedResolveInfo?: ResolveTree,
        public parentSource?: TParentVisitor,
    ) {
        this.parsedResolveInfo =
            parsedResolveInfo ||
            //TODO: Remove any after version incompatibility with typings is resolved
            (parseResolveInfo(originalResolveInfoRoot as any) as any);
    }

    visitPage(): ResolveInfoVisitor<TSrc, PaginatedResolveInfoVisitor<TSrc, TParentVisitor>> {
        return new ResolveInfoVisitor(
            this.originalResolveInfoRoot,
            this.rootSource,
            this.parsedResolveInfo.fieldsByTypeName[this.rootSource.pageName].entities,
            this
        );
    }
}

export type MaybePaginatedResolveInfoVisitor<
    TSrc extends MappedDataSource,
    TParentVisitor extends Maybe<MaybePaginatedResolveInfoVisitor<any, any>> = any
> = ResolveInfoVisitor<TSrc, TParentVisitor> | PaginatedResolveInfoVisitor<TSrc, TParentVisitor>