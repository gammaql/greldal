import { getTypeAccessorError } from "./errors";
import { Memoize } from "lodash-decorators";
import { Mapped, TypeGuard, Dict, MaybeMapped, MaybeArray, NNil } from "./util-types";
import { isString, transform, camelCase, upperFirst, snakeCase } from "lodash";
import * as t from "io-ts";
import { GraphQLInputType, GraphQLOutputType } from "graphql";
import { FieldMapping, MappedField } from "./MappedField";
import { AssociationMapping, MappedAssociation } from "./MappedAssociation";
import { singularize, pluralize } from "inflection";
import { deriveDefaultShallowOutputType, deriveDefaultOutputType, deriveDefaultShallowInputType } from "./graphql-type-mapper";

export interface DataSourceMapping {
    name: MaybeMapped<string>;
    description?: string;
    fields?: Dict<FieldMapping<any, any>>
    associations?: Dict<AssociationMapping<any>>
}

type ShallowRecordType<T extends DataSourceMapping> = {
    [K in keyof T["fields"]]: t.TypeOf<NNil<T["fields"]>[K]["type"]>
}

type NestedRecordType<T extends DataSourceMapping> = ShallowRecordType<T> & {
    [K in keyof T["associations"]]: ReturnType<NNil<T["associations"]>[K]["from"]>["NestedRecordType"]
}

export class MappedDataSource<T extends DataSourceMapping = any> {
    fields: { [K in keyof T["fields"]]: MappedField<NNil<T["fields"]>[K]> };
    associations: { [K in keyof T["associations"]]: MappedAssociation<NNil<T["associations"]>[K]> };

    constructor(private mapping: T) {
        this.fields = transform(
            mapping.fields!,
            (result, fieldMapping, name) => {
                result[name] = new MappedField(this, name, fieldMapping);
            }, {}
        ) as any;
        this.associations = transform(
            mapping.associations!,
            (result, associationMapping, name) => {
                result[name] = new MappedAssociation(this, name, associationMapping);
            }, {}
        ) as any;
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

    get ShallowRecordType(): ShallowRecordType<T> {
        throw getTypeAccessorError('ShallowRecordType', 'MappedDataSource');
    }

    get NestedRecordType(): NestedRecordType<T> {
        throw getTypeAccessorError('NestedRecordType', 'MappedDataSource');
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
        return deriveDefaultShallowOutputType(this)
    }
}

export const dataSource = <T extends DataSourceMapping>(mapping: T) =>
    new MappedDataSource<T>(mapping);
