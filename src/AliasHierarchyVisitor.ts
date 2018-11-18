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

    get children() {
        return Object.keys(this.hierarchy.children || {});
    }

    visit(childName: string): AliasHierarchyVisitor {
        if (!this.hierarchy.children) {
            this.hierarchy.children = {};
        }
        if (!this.hierarchy.children[childName]) {
            this.hierarchy.children[childName] = {
                alias: uid(childName),
                children: {},
            };
        }
        const child = this.hierarchy.children[childName];
        return new AliasHierarchyVisitor(child, this);
    }

    recursivelyVisit(childName: string): Maybe<AliasHierarchyVisitor> {
        const child = this.hierarchy.children && this.hierarchy.children[childName];
        if (child) return new AliasHierarchyVisitor(child, this);
        for (const c of this.children) {
            const descendant: Maybe<AliasHierarchyVisitor> = this.visit(c).recursivelyVisit(childName);
            if (descendant) {
                return descendant;
            }
        }
        return null;
    }
}
