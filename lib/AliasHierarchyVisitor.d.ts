import { Maybe } from "./util-types";
export interface AliasHierarchy {
    alias?: string;
    children?: {
        [key: string]: AliasHierarchy;
    };
}
export declare class AliasHierarchyVisitor {
    private hierarchy;
    parent: Maybe<AliasHierarchyVisitor>;
    constructor(hierarchy?: AliasHierarchy, parent?: Maybe<AliasHierarchyVisitor>);
    readonly alias: string;
    readonly children: string[];
    visit(childName: string): AliasHierarchyVisitor;
    recursivelyVisit(childName: string): Maybe<AliasHierarchyVisitor>;
}
