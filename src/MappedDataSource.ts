import { getTypeAccessorError } from "./errors";
import { Memoize } from "lodash-decorators";
import { Mapped, TypeGuard, Dict, MaybeMapped, MaybeArray, NNil, Maybe, MaybeArrayItem } from "./util-types";
import { isString, transform, camelCase, upperFirst, snakeCase, castArray, forEach } from 'lodash';
import * as t from "io-ts";
import * as Knex from "knex";
import { GraphQLInputType, GraphQLOutputType } from "graphql";
import { FieldMapping, MappedField } from "./MappedField";
import { AssociationMapping, MappedAssociation } from "./MappedAssociation";
import { singularize, pluralize } from "inflection";
import {
    deriveDefaultShallowOutputType,
    deriveDefaultOutputType,
    deriveDefaultShallowInputType,
} from "./graphql-type-mapper";
import { assertSupportedConnector, globalConnector, assertConnectorConfigured } from "./connector";

export interface DataSourceMapping {
    name: MaybeMapped<string>;
    description?: string;
    fields?: Dict<FieldMapping<any, any>>;
    associations?: Dict<MaybeArray<AssociationMapping<any>>>;
    rootQuery?: (alias: Maybe<string>) => Knex.QueryBuilder;
    connector?: Knex;
}

type DataSourceAssociationType<T extends DataSourceMapping, K extends keyof T["associations"]> = MaybeArrayItem<
    NNil<T["associations"]>[K]
>;

type AssociatedDataSource<T extends DataSourceMapping, K extends keyof T["associations"]> = ReturnType<
    DataSourceAssociationType<T, K>["from"]
>;

type ShallowRecordType<T extends DataSourceMapping> = {
    [K in keyof T["fields"]]: t.TypeOf<NNil<T["fields"]>[K]["type"]>
};

type NestedRecordType<T extends DataSourceMapping> = ShallowRecordType<T> &
    { [K in keyof T["associations"]]: AssociatedDataSource<T, K>["RecordType"] };

export class MappedDataSource<T extends DataSourceMapping = any> {
    fields: { [K in keyof T["fields"]]: MappedField<MappedDataSource<T>, NNil<T["fields"]>[K]> };
    associations: { [K in keyof T["associations"]]: MappedAssociation<MappedDataSource<T>>[] };

    constructor(private mapping: T) {
        this.fields = transform(
            mapping.fields!,
            (result, fieldMapping, name) => {
                result[name] = new MappedField(this, name, fieldMapping);
            },
            {},
        ) as any;
        this.associations = transform(
            mapping.associations!,
            (result, associationMapping, name) => {
                result[name] = castArray(associationMapping).map(assoc => new MappedAssociation(this, name, assoc));
            },
            {},
        ) as any;
        if (mapping.connector) {
            assertSupportedConnector(mapping.connector);
        }
    }

    get connector(): Knex {
        return assertConnectorConfigured(this.mapping.connector || globalConnector);
    }

    rootQuery(alias: Maybe<string>): Knex.QueryBuilder {
        if (this.mapping.rootQuery) return this.mapping.rootQuery(alias);
        return alias ? this.connector(`${this.storedName} as ${alias}`) : this.connector(this.storedName);
    }

    @Memoize
    get mappedName() {
        return (isString as TypeGuard<string>)(this.mapping.name)
            ? upperFirst(camelCase(singularize(this.mapping.name)))
            : this.mapping.name.mapped;
    }

    @Memoize
    get storedName() {
        return (isString as TypeGuard<string>)(this.mapping.name)
            ? snakeCase(pluralize(this.mapping.name))
            : this.mapping.name.stored;
    }

    @Memoize
    get shallowRecordProps(): t.Props & Dict<t.Type<any>> {
        return transform(
            this.mapping.fields!,
            (result, f, name) => {
                result[name] = f.type;
            },
            {},
        );
    }

    @Memoize
    get associationProps(): t.Props & Dict<t.Type<any>> {
        const result: t.Props & Dict<t.Type<any>> = {};
        forEach(this.associations, (associations, name) => {
            if (associations.length > 0) {
                result[name] = associations[0].from.recordType;
            }
        });
        return transform(
            this.associations,
            (
                result: t.Props,
                associations: MappedAssociation<MappedDataSource<T>>[],
                name: string,
            ) => {
                if (associations.length > 0) {
                    result[name] = associations[0].from.recordType;
                }
            },
            {},
        );
    }

    @Memoize
    get recordProps(): t.Props & Dict<t.Type<any>> {
        return {
            ...this.shallowRecordProps,
            ...this.associationProps,
        };
    }

    @Memoize
    get shallowRecordType() {
        return t.type(this.shallowRecordProps);
    }

    @Memoize
    get recordType() {
        return t.type(this.recordProps);
    }

    get ShallowRecordType(): ShallowRecordType<T> {
        throw getTypeAccessorError("ShallowRecordType", "MappedDataSource");
    }

    get RecordType(): NestedRecordType<T> {
        throw getTypeAccessorError("NestedRecordType", "MappedDataSource");
    }

    get MappingType(): T {
        throw getTypeAccessorError("MappingType", "MappedDataSource");
    }

    @Memoize
    get defaultOutputType(): GraphQLOutputType {
        return deriveDefaultOutputType(this);
    }

    @Memoize
    get defaultShallowInputType(): GraphQLInputType {
        return deriveDefaultShallowInputType(this);
    }

    @Memoize
    get defaultShallowOutputType(): GraphQLOutputType {
        return deriveDefaultShallowOutputType(this);
    }
}

export const mapDataSource = <T extends DataSourceMapping>(mapping: T) => new MappedDataSource<T>(mapping);
