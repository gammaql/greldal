import * as Knex from "knex";
import { MappedOperation } from "./MappedOperation";
import { OperationResolver } from "./OperationResolver";
import { GraphQLFieldConfigArgumentMap } from "graphql";
import { UDFInvocationMapping, UDFParam } from "./UDFInvocationMapping";
import { ResolverContext } from "./ResolverContext";
import { UDFInvocationOperationResolver } from "./UDFInvocationOperationResolver";
import { assertConnectorConfigured, globalConnector } from "./connector";
import { values, isString } from "lodash";
import { TypeGuard } from "./util-types";

export class MappedUDFInvocationOperation<TArgs extends {}> extends MappedOperation<TArgs> {
    constructor(public readonly mapping: UDFInvocationMapping<TArgs>) {
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

    deriveParams(args: TArgs): UDFParam[] {
        const { deriveParams } = this.mapping;
        if (deriveParams) return deriveParams(args);
        return values(args).map(value => ({
            value,
            type: "IN",
        }));
    }

    deriveResult(output: any, selectedParams: any) {
        const { deriveResult } = this.mapping;
        if (deriveResult) return deriveResult(output, selectedParams);
        return output;
    }

    defaultResolver<TResolved>(
        ctx: ResolverContext<MappedUDFInvocationOperation<TArgs>, TArgs>,
    ): OperationResolver<any, TArgs, TResolved> {
        return new UDFInvocationOperationResolver<typeof ctx, TArgs, any>(ctx);
    }
}
