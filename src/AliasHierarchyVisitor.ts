import { Maybe } from "./util-types";
import { uniqueId } from "lodash";

export interface AliasHierarchy {
    alias?: string;
    children?: {
        [key: string]: AliasHierarchy;
    };
}

/**
 * Provides a convenient approach to explore and retrieve table aliases when multiple tables are being joined as a part of
 * composite query.
 */
export class AliasHierarchyVisitor {
    constructor(private hierarchy: AliasHierarchy = {}, public parent: Maybe<AliasHierarchyVisitor> = null) {}

    get alias() {
        return this.hierarchy.alias!;
    }

    get children() {
        return Object.keys(this.hierarchy.children || {});
    }

    private createAlias(label: string) {
        return uniqueId(`GQL_DAL_${label}__`);
    }

    visit(childName: string): AliasHierarchyVisitor {
        if (!this.hierarchy.children) {
            this.hierarchy.children = {};
        }
        if (!this.hierarchy.children[childName]) {
            this.hierarchy.children[childName] = {
                alias: this.createAlias(childName),
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
