"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class AliasHierarchyVisitor {
    constructor(hierarchy = {}, parent = null) {
        this.hierarchy = hierarchy;
        this.parent = parent;
    }
    get alias() {
        return this.hierarchy.alias;
    }
    get children() {
        return Object.keys(this.hierarchy.children || {});
    }
    visit(childName) {
        if (!this.hierarchy.children) {
            this.hierarchy.children = {};
        }
        if (!this.hierarchy.children[childName]) {
            this.hierarchy.children[childName] = {
                alias: utils_1.uid(childName),
                children: {},
            };
        }
        const child = this.hierarchy.children[childName];
        return new AliasHierarchyVisitor(child, this);
    }
    recursivelyVisit(childName) {
        const child = this.hierarchy.children && this.hierarchy.children[childName];
        if (child)
            return new AliasHierarchyVisitor(child, this);
        for (const c of this.children) {
            const descendant = this.visit(c).recursivelyVisit(childName);
            if (descendant) {
                return descendant;
            }
        }
        return null;
    }
}
exports.AliasHierarchyVisitor = AliasHierarchyVisitor;
//# sourceMappingURL=AliasHierarchyVisitor.js.map