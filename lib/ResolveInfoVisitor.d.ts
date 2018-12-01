import { GraphQLResolveInfo } from "graphql";
import { ResolveTree } from "graphql-parse-resolve-info";
import { MappedDataSource } from "./MappedDataSource";
import { Maybe } from "./util-types";
import { MappedAssociation } from "./MappedAssociation";
export declare class ResolveInfoVisitor<TSrc extends MappedDataSource, TParentVisitor extends Maybe<ResolveInfoVisitor<any, any>> = any> {
    originalResolveInfoRoot: GraphQLResolveInfo;
    rootSource: TSrc;
    parentSource?: TParentVisitor | undefined;
    parsedResolveInfo: ResolveTree;
    constructor(originalResolveInfoRoot: GraphQLResolveInfo, rootSource: TSrc, parsedResolveInfo?: ResolveTree, parentSource?: TParentVisitor | undefined);
    visitRelation<A extends MappedAssociation>(association: A): ResolveInfoVisitor<A["target"], any>;
    iterateFieldsOf(typeName: string): IterableIterator<{
        fieldName: string;
        fieldInfo: ResolveTree;
    }>;
}
