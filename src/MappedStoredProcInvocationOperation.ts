import * as Knex from "knex";
import { MappedOperation } from "./MappedOperation";
import { OperationResolver } from "./OperationResolver";
import { GraphQLFieldConfigArgumentMap } from "graphql";
import { ResolverContext } from "./ResolverContext";
import { assertConnectorConfigured, globalConnector } from "./connector";
import { values, isString } from "lodash";
import { TypeGuard } from "./util-types";
import { InvocationParam, InvocationMapping } from "./InvocationMapping";
import { MySQLStoredProcInvocationOperationResolver } from "./MySQLStoredProcInvocationOperationResolver";
import { PGStoredProcInvocationOperationResolver } from "./PGStoredProcInvocationOperationResolver";

export class MappedStoredProcInvocationOperation<TArgs extends {}> extends MappedOperation<TArgs> {
    constructor(public readonly mapping: InvocationMapping<TArgs>) {
        super(mapping);
    }

    get operationType() {
        return this.mapping.type || "mutation";
    }

    get defaultArgs(): GraphQLFieldConfigArgumentMap {
        throw new Error("Args must be explicit specified when mapping stored procedures");
    }

    get type() {
        return this.mapping.returnType;
    }

    get connector(): Knex {
        return assertConnectorConfigured(this.mapping.connector || globalConnector);
    }

    get procedureName(): string {
        return (isString as TypeGuard<string>)(this.mapping.name) ? this.mapping.name : this.mapping.name.stored;
    }

    deriveParams(args: TArgs): InvocationParam[] {
        const { deriveParams } = this.mapping;
        if (deriveParams) return deriveParams(args);
        return values(args).map(value => ({
            value,
            argMode: "IN",
        }));
    }

    deriveResult(output: any) {
        const { deriveResult } = this.mapping;
        if (deriveResult) return deriveResult(output);
        return output;
    }

    defaultResolver<TResolved>(
        ctx: ResolverContext<MappedStoredProcInvocationOperation<TArgs>, TArgs>,
    ): OperationResolver<any, TArgs, TResolved> {
        switch (this.connector().client.dialect) {
            case 'mysql':
            case 'mysql2':
                return new MySQLStoredProcInvocationOperationResolver<typeof ctx, TArgs, any>(ctx);
            case 'pg':
                return new PGStoredProcInvocationOperationResolver<typeof ctx, TArgs, any>(ctx);
        }
        throw new Error('GRelDAL does not support stored procedures for this dialect')
    }
}
