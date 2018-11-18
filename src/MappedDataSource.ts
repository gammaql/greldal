import { getTypeAccessorError } from "./errors";
import { TypeGuard, Dict, MaybeMapped, MaybeArray, NNil, Maybe, MaybeArrayItem, KeyOf, ValueOf } from "./util-types";
import {
    isString,
    transform,
    camelCase,
    upperFirst,
    snakeCase,
    castArray,
    forEach,
    reduce,
    MemoObjectIterator,
} from "lodash";
import * as t from "io-ts";
import * as Knex from "knex";
import _debug from "debug";
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
import { MemoizeGetter } from "./utils";
import { StoreQueryParams } from "./QueryOperationResolver";
import { ReverseMapper } from "./ReverseMapper";
import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";

const debug = _debug("greldal:MappedDataSource");

export interface DataSourceMapping {
    name: MaybeMapped<string>;
    description?: string;
    fields?: Dict<FieldMapping<any, any>>;
    associations?: Dict<AssociationMapping<any>>;
    rootQuery?: (alias: Maybe<AliasHierarchyVisitor>) => Knex.QueryBuilder;
    connector?: Knex;
}

type DataSourceAssociationType<T extends DataSourceMapping, K extends keyof T["associations"]> = MaybeArrayItem<
    NNil<T["associations"]>[K]
>;

type AssociatedDataSource<T extends DataSourceMapping, K extends keyof T["associations"]> = ReturnType<
    DataSourceAssociationType<T, K>["target"]
>;

type ShallowRecordType<T extends DataSourceMapping> = {
    [K in keyof T["fields"]]: t.TypeOf<NNil<T["fields"]>[K]["type"]>
};

type NestedRecordType<T extends DataSourceMapping> = ShallowRecordType<T> &
    { [K in keyof T["associations"]]: AssociatedDataSource<T, K>["RecordType"] };

export class MappedDataSource<T extends DataSourceMapping = any> {
    fields: { [K in keyof T["fields"]]: MappedField<MappedDataSource<T>, NNil<T["fields"]>[K]> };
    associations: { [K in keyof T["associations"]]: MappedAssociation<MappedDataSource<T>> };

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
                result[name] = new MappedAssociation(this, name, associationMapping);
            },
            {},
        ) as any;
        debug(
            "Mapped data source with name: %s, fields: %O, associations: %O",
            this.mappedName,
            Object.keys(this.fields),
            Object.keys(this.associations),
        );
        if (mapping.connector) {
            assertSupportedConnector(mapping.connector);
        }
    }

    get connector(): Knex {
        return assertConnectorConfigured(this.mapping.connector || globalConnector);
    }

    rootQuery(aliasHierarchyVisitor?: Maybe<AliasHierarchyVisitor>): Knex.QueryBuilder {
        if (this.mapping.rootQuery) return this.mapping.rootQuery(aliasHierarchyVisitor);
        return aliasHierarchyVisitor
            ? this.connector(`${this.storedName} as ${aliasHierarchyVisitor.alias}`)
            : this.connector(this.storedName);
    }

    @MemoizeGetter
    get mappedName() {
        return (isString as TypeGuard<string>)(this.mapping.name)
            ? upperFirst(camelCase(singularize(this.mapping.name)))
            : this.mapping.name.mapped;
    }

    @MemoizeGetter
    get shallowMappedName() {
        return `Shallow${this.mappedName}`;
    }

    @MemoizeGetter
    get storedName() {
        return (isString as TypeGuard<string>)(this.mapping.name)
            ? snakeCase(pluralize(this.mapping.name))
            : this.mapping.name.stored;
    }

    @MemoizeGetter
    get storedColumnNames() {
        return transform(
            this.fields,
            (result: string[], field: MappedField<MappedDataSource<T>, FieldMapping<any, any>>, name) => {
                if (field.isMappedFromColumn) {
                    result.push(field.sourceColumn!);
                }
            },
            [],
        );
    }

    @MemoizeGetter
    get shallowRecordProps(): t.Props & Dict<t.Type<any>> {
        return transform(
            this.mapping.fields!,
            (result, f, name) => {
                result[name] = f.type;
            },
            {},
        );
    }

    @MemoizeGetter
    get associationProps(): t.Props & Dict<t.Type<any>> {
        const result: t.Props & Dict<t.Type<any>> = {};
        forEach(this.associations, (association, name) => {
            result[name] = association.target.recordType;
        });
        return transform(
            this.associations,
            (result: t.Props, association: MappedAssociation<MappedDataSource<T>>, name: string) => {
                result[name] = association.target.recordType;
            },
            {},
        );
    }

    @MemoizeGetter
    get recordProps(): t.Props & Dict<t.Type<any>> {
        return {
            ...this.shallowRecordProps,
            ...this.associationProps,
        };
    }

    @MemoizeGetter
    get shallowRecordType() {
        return t.type(this.shallowRecordProps);
    }

    @MemoizeGetter
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

    @MemoizeGetter
    get defaultOutputType(): GraphQLOutputType {
        return deriveDefaultOutputType(this);
    }

    @MemoizeGetter
    get defaultShallowInputType(): GraphQLInputType {
        debug("Deriving default shallow input type for: ", this.mappedName);
        return deriveDefaultShallowInputType(this);
    }

    @MemoizeGetter
    get defaultShallowOutputType(): GraphQLOutputType {
        return deriveDefaultShallowOutputType(this);
    }

    mapEntities(entities: ShallowRecordType<T>[]): Dict[] {
        return entities.map(entity =>
            reduce<ShallowRecordType<T>, Dict>(
                entity,
                (result: Dict, val, key: any) => {
                    const field = this.fields[key as keyof T["fields"]];
                    if (field) {
                        result[field.sourceColumn!] = val;
                    }
                    return result;
                },
                {},
            ),
        );
    }

    mapResults(storeParams: StoreQueryParams<MappedDataSource<T>>, rows: Dict[]) {
        return new ReverseMapper(this, storeParams).reverseMap(rows);
    }

    shallowMapResults(rows: Dict[]) {
        rows.map(row => {
            const mappedRow: Dict = {};
            for (const [key, field] of Object.entries<MappedField<MappedDataSource<T>, FieldMapping<any, any>>>(
                this.fields,
            )) {
                mappedRow[field.mappedName] = field.getValue(row);
            }
            return mappedRow;
        });
    }
}

export const mapDataSource = <T extends DataSourceMapping>(mapping: T) => new MappedDataSource<T>(mapping);
