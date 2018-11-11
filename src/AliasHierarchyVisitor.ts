import { uid } from "./utils";
import { Maybe } from "./util-types";

export interface AliasHierarchy {
    alias?: string;
    children?: {
        [key: string]: AliasHierarchy;
    };
}

export class AliasHierarchyVisitor {
    constructor(private hierarchy: AliasHierarchy = {}, public parent: Maybe<AliasHierarchyVisitor> = null) {}

    get alias() {
        return this.hierarchy.alias!;
    }

    visit(childName: string) {
        this.hierarchy.children = this.hierarchy.children || {};
        this.hierarchy.children[childName] = this.hierarchy.children[childName] || {
            alias: uid(childName),
            children: {},
        };
        return new AliasHierarchyVisitor(this.hierarchy.children[childName], this);
    }
}
