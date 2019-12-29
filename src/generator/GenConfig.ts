import * as t from "io-ts";
import * as Knex from "knex";
import { MaybeMappedRT } from "../utils/util-types";
import { includes } from "lodash";

const ModuleSpecRT = t.intersection([
    t.type({
        module: t.string,
        imported: t.string,
    }),
    t.partial({
        isDefault: t.boolean,
    }),
]);

export type ModuleSpec = t.TypeOf<typeof ModuleSpecRT>;

const InterceptableRT = t.partial({
    interceptThrough: ModuleSpecRT,
    mergeWith: ModuleSpecRT,
});

export type Interceptable = t.TypeOf<typeof InterceptableRT>;

const SelectionFilterRT = t.union([
    t.partial({
        only: t.array(t.string),
    }),
    t.partial({
        except: t.array(t.string),
    }),
]);

export type SelectionFilter = t.TypeOf<typeof SelectionFilterRT>;

export const matchesSelectionFilter = (entry: string, selectionFilter: SelectionFilter) => {
    const sf1 = selectionFilter as { only: string[] };
    if (sf1.only) return includes(sf1.only, entry);
    const sf2 = selectionFilter as { except: string[] };
    if (sf2.except) return !includes(sf2.except, entry);
    return true;
};

const InnerMappingConfigRT = <T extends t.Mixed>(memberType: T) =>
    t.intersection([
        SelectionFilterRT,
        t.partial({
            members: t.record(t.string, t.intersection([InterceptableRT, memberType])),
        }),
    ]);

const DataSourceMemberGenConfigRT = t.intersection([
    InterceptableRT,
    t.type({
        name: MaybeMappedRT(t.string, t.string),
    }),
    t.partial({
        fields: InnerMappingConfigRT(
            t.partial({
                sourceColumn: t.string,
            }),
        ),
        associations: InnerMappingConfigRT(
            t.intersection([
                t.partial({
                    singular: t.boolean,
                    targetDataSourceName: t.string,
                }),
                t.partial({
                    associatedTableName: t.string,
                    associatorColumns: t.type({
                        inSource: t.string,
                        inRelated: t.string,
                    }),
                }),
            ]),
        ),
    }),
]);

export type DataSourceMemberGenConfig = t.TypeOf<typeof DataSourceMemberGenConfigRT>;

const DataSourceMappingGenConfigRT = t.intersection([
    SelectionFilterRT,
    t.partial({
        transform: t.partial({
            dataSourceName: t.Function,
        }),
        members: t.array(DataSourceMemberGenConfigRT),
    }),
]);

export type DataSourceMappingGenConfig = t.TypeOf<typeof DataSourceMappingGenConfigRT>;

export const GenConfigRT = t.partial({
    generatedFilePath: t.string,
    knex: t.any,
    dataSources: DataSourceMappingGenConfigRT,
});

export type GenConfig = t.TypeOf<typeof GenConfigRT> & {
    knex?: Knex;
    dataSources?: {
        transform: {
            dataSourceName: (inferredName: string) => string;
        };
    };
};
