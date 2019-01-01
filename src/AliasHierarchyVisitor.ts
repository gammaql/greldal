import { Maybe } from "./util-types";
import { uniqueId } from "lodash";

/**
 * Internal data structure used by AliasHierarchyVisitor for book-keeping
 * of hierarchy of table aliases when visiting a composite join.
 *
 * Should be manipulated through a visitor only.
 */
export interface AliasHierarchy {
    alias?: string;
    children?: {
        [key: string]: AliasHierarchy;
    };
}

/**
 * Provides a convenient approach to explore and retrieve table aliases when multiple tables are being joined as a part of
 * composite query.
 *
 * Visitors form an internally tracked hierarchy, so we can traverse back to the
 * parent visitor by accessing parent public property.
 *
 * Let us say we have following query:
 *
 * ```
 * SELECT classes.id, teachers.id, teachers.name, students.id, students.name
 * FROM classes
 * LEFT OUTER JOIN users as teachers
 * LEFT OUTER JOIN users as students
 * ```
 *
 * Then our alias hierarchy visitor will visit classes (with the generated alias being something like: GQL_DAL_classes__1) and
 * have a child visitor which will visit users (with generated alias being something like GQL_DAL_teachers_2) which will
 * in turn have another child visitor which will again visit users (with generated alias being something like GQL_DAL_students_3).
 *
 * When we use these aliases, our actual join will end up being something like:
 *
 * ```
 * `classes` as `GQL_DAL_classes__1`
 *     LEFT OUTER JOIN `users` as `GQL_DAL_teachers_2`
 *     LEFT OUTER JOIN `users` as `GQL_DAL_students_3``
 * ```
 *
 * And the complete query will be something like:
 *
 * ```
 * SELECT `GQL_DAL_classes__1`.`id` as `GQL_DAL_classes__1_id`,
 *        `GQL_DAL_teachers__2`.`id` as `GQL_DAL_teachers__2_id`,
 *        `GQL_DAL_teachers__2`.`name` as `GQL_DAL_teachers__2_name`,
 *        `GQL_DAL_students__3`.`id` as `GQL_DAL_students__3_id`,
 *        `GQL_DAL_students__3`.`name` as `GQL_DAL_students__3_name`
 * FROM `classes` as `GQL_DAL_classes__1`
 *     LEFT OUTER JOIN users as `GQL_DAL_teachers_2`
 *     LEFT OUTER JOIN users as `GQL_DAL_students_3``
 * ```
 *
 * Reverse mapper can then use the ALiasHierarchyVisitor tree to reverse map the result set.
 *
 * AliasHierarchyVisitor is just for memoized book-keeping of aliases. The actual query composition logic is implemented in [QueryOperationResolver](api:QueryOperationResolver) and the
 * reverse mapping logic is implemented in [ReverseMapper](api:ReverseMapper).
 *
 * @api-category Utils
 */
export class AliasHierarchyVisitor {
    constructor(private hierarchy: AliasHierarchy = {}, public parent: Maybe<AliasHierarchyVisitor> = null) {}

    /**
     * Get alias for the table in association tree being visited currently.
     *
     * Consumers are expected to use this alias when performing operations on the table
     * which is being currently visited by this visitor.
     *
     * Note that in case a table is being recursively joined, we will recursively visit the joined tables
     * and thus will have different aliases for each join target.
     */
    get alias() {
        return this.hierarchy.alias!;
    }

    /**
     * Keys of previously visited children
     */
    get children(): string[] {
        return Object.keys(this.hierarchy.children || {});
    }

    /**
     * Create an unique alias for specified name
     */
    private createAlias(label: string) {
        return uniqueId(`GQL_DAL_${label}__`);
    }

    /**
     * Visiting an associated table creates a new visitor scoped to that table.
     *
     * visit auto-vivifies children on the fly and is suitable for visiting during
     * query visiting phase.
     */
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

    /**
     * Find nearest child visitor visiting a source of specified name in the hierarchy
     * of visitors.
     *
     * Does not auto-vivify children and is suitable for visiting during reverse-mapping
     * phase.
     */
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
