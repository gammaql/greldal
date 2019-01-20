import { GraphQLResolveInfo } from "graphql";
import { ResolveTree, parseResolveInfo } from "graphql-parse-resolve-info";
import { MappedDataSource } from "./MappedDataSource";
import { Maybe } from "./util-types";
import _debug from "debug";
import { MappedAssociation } from "./MappedAssociation";
import assert = require("assert");

const debug = _debug("greldal:ResolveInfoVisitor");

/**
 * Encapsulates the current position while traversing the GraphQLResolveInfo hierarchy while a query is being resolved.
 */
export class ResolveInfoVisitor<
    TSrc extends MappedDataSource,
    TParentVisitor extends Maybe<ResolveInfoVisitor<any, any>> = any
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

    visitRelation<A extends MappedAssociation>(association: A): ResolveInfoVisitor<A["target"], any> {
        const returnTypeName = this.rootSource.mappedName;
        const nextResolveInfo = this.parsedResolveInfo.fieldsByTypeName[returnTypeName][association.mappedName];
        debug("Visiting association:", association.mappedName);
        debug(
            "Deduced next resolve info: %O[fieldsByTypeName][%s][%s] => %O",
            this.parsedResolveInfo,
            returnTypeName,
            association.mappedName,
            nextResolveInfo,
        );
        assert(
            nextResolveInfo,
            `Failed to deduce resolveInfo for next level when visiting association ${association.mappedName} from ${
                this.rootSource.mappedName
            }`,
        );
        return new ResolveInfoVisitor(this.originalResolveInfoRoot, association.target, nextResolveInfo, this);
    }

    *iterateFieldsOf(typeName: string) {
        const fields = this.parsedResolveInfo.fieldsByTypeName[typeName];
        if (!fields) return;
        debug("Iterating fields %s -> %O", typeName, fields, this.parsedResolveInfo);
        for (const [fieldName, fieldInfo] of Object.entries(fields)) {
            yield { fieldName, fieldInfo };
        }
    }
}
