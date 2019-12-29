import * as Knex from "knex";
import { MappedOperation } from "./MappedOperation";
import { OperationResolver } from "./OperationResolver";
import { GraphQLFieldConfigArgumentMap } from "graphql";
import { InvocationMapping, InvocationParam } from "./InvocationMapping";
import { ResolverContext } from "./ResolverContext";
import { UDFInvocationOperationResolver } from "./UDFInvocationOperationResolver";
import { assertConnectorConfigured, globalConnector } from "./utils/connector";
import { values, isString } from "lodash";
import { TypeGuard } from "./utils/util-types";
import { OperationType, operationType } from "./operation-types";

export class MappedUDFInvocationOperation<TArgs extends {}> extends MappedOperation<TArgs> {
    constructor(public readonly mapping: InvocationMapping<TArgs>) {
        super(mapping);
    }

    get operationType() {
        return operationType(this.mapping.type, OperationType.Mutation);
    }

    get defaultArgs(): GraphQLFieldConfigArgumentMap {
        throw new Error("Args must be explicit specified when mapping user defined functions");
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
        ctx: ResolverContext<MappedUDFInvocationOperation<TArgs>, TArgs>,
    ): OperationResolver<any, TArgs, TResolved> {
        return new UDFInvocationOperationResolver<typeof ctx, TArgs, any>(ctx);
    }
}
