import * as Knex from "knex";

import { Maybe } from "./util-types";
import { expectedOverride } from "./errors";
import { OperationResolver } from "./OperationResolver";
import { ResolverContext } from "./ResolverContext";
import { MappedOperation } from ".";

export interface BaseStoreParams {
    queryBuilder: Knex.QueryBuilder;
}

/**
 * Base class for operation resolvers that need to interact with one or more mapped data sources
 *
 * @api-category CRUDResolvers
 */
export class BaseResolver<TCtx extends ResolverContext<MappedOperation<TArgs>, TArgs>, TArgs extends {}, TResolved>
    implements OperationResolver<TCtx, TArgs, TResolved> {
    isDelegated: boolean | undefined;

    constructor(public resolverContext: TCtx) {}

    /**
     * Parsed arguments received from the API client
     */
    get args() {
        return this.resolverContext.args;
    }

    /**
     * Should be overriden in sub-class with the logic of resolution
     */
    async resolve(): Promise<any> {
        throw expectedOverride();
    }

    /**
     * The operation being resolved
     *
     * @type MappedOperation
     */
    get operation(): TCtx["MappedOperationType"] {
        return this.resolverContext.operation;
    }

    /**
     * Can be overriden to return a collection of resolver instances that we are delegating to.
     *
     * This is required for sharing the same transactions across the root resolver and all the
     * delegated resolvers
     */
    get delegatedResolvers(): OperationResolver<TCtx, TArgs, TResolved>[] {
        return [];
    }

    /**
     * Get name of current operation
     */
    get name() {
        return this.resolverContext.operation.name;
    }
}
