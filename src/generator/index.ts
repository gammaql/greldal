import _debug from "debug";
import * as fs from "fs-extra";
import { camelCase, find, get, isEqual, keys, transform, uniq, values, trimEnd } from "lodash";

import { assertType } from "../assertions";
import { assertConnectorConfigured, globalConnector } from "../connector";
import { deriveMappedDataSourceName, deriveMappedFieldName, deriveStoredDataSourceName } from "../conventional-naming";
import { MemoizeGetter } from "../utils";
import { adapters } from "./adapters";
import { Adapter, DataSourceInfo, TableLike, TableSchema } from "./adapters/Adapter";
import {
    DataSourceMemberGenConfig,
    GenConfig,
    GenConfigRT,
    Interceptable,
    matchesSelectionFilter,
    ModuleSpec,
} from "./GenConfig";
import { IndentationTracker } from "./indentation-tracker";

const debug = _debug("greldal:generator");

type StoredKToDSMapping = { [storedName: string]: DataSourceMemberGenConfig | undefined };

export class Generator {
    constructor(private config: GenConfig, private adapter: Adapter) {}

    @MemoizeGetter
    get configuredDataSources(): StoredKToDSMapping {
        return transform(
            (this.config.dataSources && this.config.dataSources.members) || [],
            (result: StoredKToDSMapping, d) => {
                result[deriveStoredDataSourceName(d.name)] = d;
            },
            {},
        );
    }

    async getFilteredTableList(): Promise<TableLike[]> {
        let tables = await this.adapter.getTables();
        const { dataSources } = this.config;
        if (dataSources) tables = tables.filter(({ name }) => matchesSelectionFilter(name, dataSources));
        return tables;
    }

    async populateFields(dataSource: DataSourceInfo, schema: TableSchema) {
        const dataSourceGenConfig = this.configuredDataSources[dataSource.table.name];
        let { columns } = schema;
        if (dataSourceGenConfig && dataSourceGenConfig.fields) {
            columns = schema.columns.filter(({ name }) => matchesSelectionFilter(name, dataSourceGenConfig.fields!));
        }
        for (const column of columns) {
            const members =
                (dataSourceGenConfig && dataSourceGenConfig.fields && dataSourceGenConfig.fields.members) || {};
            let mappedFieldName: string | undefined = find(keys(members) as string[], mappedFieldName => {
                const member = members[mappedFieldName];
                return !!member.sourceColumn && member.sourceColumn === column.name;
            });
            if (!mappedFieldName) {
                let derivedMappedFieldName = deriveMappedFieldName(column.name);
                if (members[derivedMappedFieldName] && members[derivedMappedFieldName].sourceColumn !== column.name) {
                    continue;
                }
                mappedFieldName = derivedMappedFieldName;
            }
            dataSource.fields[mappedFieldName] = {
                ...members[mappedFieldName],
                column,
            };
        }
    }

    async populateAssociations(
        dataSource: DataSourceInfo,
        schema: TableSchema,
        dataSources: { [storedName: string]: DataSourceInfo },
    ) {
        let { foreignKeys } = schema;
        const dataSourceGenConfig = this.configuredDataSources[dataSource.table.name];
        if (dataSourceGenConfig && dataSourceGenConfig.associations) {
            foreignKeys = foreignKeys.filter(({ associatorColumns: { inSource } }) =>
                matchesSelectionFilter(inSource, dataSourceGenConfig.associations!),
            );
        }
        for (const foreignKey of foreignKeys) {
            const members =
                (dataSourceGenConfig && dataSourceGenConfig.associations && dataSourceGenConfig.associations.members) ||
                {};
            let mappedName: string | undefined = find(keys(members) as string[], mappedName => {
                const member = members[mappedName];
                return (
                    !!member.associatorColumns &&
                    member.associatorColumns.inSource === foreignKey.associatorColumns.inSource &&
                    member.associatorColumns.inRelated === foreignKey.associatorColumns.inRelated &&
                    member.associatedTableName === foreignKey.associatedTable.name
                );
            });
            if (!mappedName) {
                let mappedNameCandidate = [
                    foreignKey.associatorColumns.inRelated,
                    foreignKey.associatorColumns.inSource,
                ].find(n => n.toLowerCase() !== "id");
                if (!mappedNameCandidate) continue;
                const match = mappedNameCandidate.match(/^(.*)id$/i);
                const derivedMappedName = camelCase(match ? match[1] : mappedNameCandidate);
                const member = members[derivedMappedName];
                if (
                    member &&
                    ((member.associatedTableName && member.associatedTableName !== foreignKey.associatedTable.name) ||
                        (member.associatorColumns && !isEqual(member.associatorColumns, foreignKey.associatorColumns)))
                )
                    continue;
                mappedName = derivedMappedName;
            }
            const targetDataSourceName =
                get(members, [mappedName, "targetDataSourceName"]) ||
                get(dataSources[foreignKey.associatedTable.name], ["name", "mapped"]);
            dataSource.associations[mappedName] = {
                ...members[mappedName],
                foreignKey,
                targetDataSourceName,
            };
        }
    }

    async getDataSourcesToGenerate(): Promise<DataSourceInfo[]> {
        const tables = await this.getFilteredTableList();
        let dataSourceInfoIdx: { [storedName: string]: DataSourceInfo } = {};
        for (const table of tables) {
            const dataSourceGenConfig = this.configuredDataSources[table.name];
            const dataSourceInfo: DataSourceInfo = {
                ...dataSourceGenConfig,
                name: {
                    stored: table.name,
                    mapped:
                        (dataSourceGenConfig &&
                            dataSourceGenConfig.name &&
                            deriveMappedDataSourceName(dataSourceGenConfig.name)) ||
                        deriveMappedDataSourceName(table.name),
                },
                table,
                fields: {},
                associations: {},
            };
            dataSourceInfoIdx[dataSourceInfo.name.stored] = dataSourceInfo;
        }
        for (const [, dataSourceInfo] of Object.entries(dataSourceInfoIdx)) {
            const schema = await this.adapter.getSchemaForTable(dataSourceInfo.table);
            this.populateFields(dataSourceInfo, schema);
            this.populateAssociations(dataSourceInfo, schema, dataSourceInfoIdx);
        }
        return values(dataSourceInfoIdx);
    }

    private applyInterceptor(baseStr: IndentationTracker, topLevelImports: string[], interceptable: Interceptable) {
        if (interceptable.mergeWith) {
            topLevelImports.push(generateImport(interceptable.mergeWith));
            baseStr.addLine(`...${interceptable.mergeWith.imported}`);
        }
        baseStr.wrap();
        if (interceptable.interceptThrough) {
            topLevelImports.push(generateImport(interceptable.interceptThrough));
            baseStr.wrap('interceptable.interceptThrough.imported(', ')');
        }
    }

    async generate() {
        let topLevelImports = ['import { types, mapDataSource, mapFields, mapAssociations } from "greldal";'];
        const body = new IndentationTracker();
        for (const dataSource of await this.getDataSourcesToGenerate()) {
            const fieldsConstName = camelCase(`${dataSource.name.mapped}Fields`);
            const associationsConstName = camelCase(`${dataSource.name.mapped}Associations`);
            const dataSourceConstName = camelCase(dataSource.name.mapped);

            let generatedFields = new IndentationTracker();
            let generatedAssociations = new IndentationTracker();

            for (const [mappedName, field] of Object.entries(dataSource.fields)) {
                const fieldStr = new IndentationTracker();
                fieldStr.addLine(`sourceColumn: "${field.column.name}",`);
                if (field.column.type) {
                    fieldStr.addLine(`type: types.${field.column.type},`);
                }
                if (field.column.isPrimary) {
                    fieldStr.addLine(`isPrimary: true,`);
                }
                this.applyInterceptor(fieldStr, topLevelImports, field);
                generatedFields.addLine(generatedFields.reIndentBlock(`${mappedName}: ${trimEnd(fieldStr.toString())},`));
            }

            for (const [mappedName, association] of Object.entries(dataSource.associations)) {
                const assocStr = new IndentationTracker();
                if (association.targetDataSourceName) {
                    assocStr.addLine(`target: () => ${association.targetDataSourceName},`);
                }
                assocStr.addLine(`singular: ${!!association.singular},`);
                assocStr.addLine(`fetchThrough: [{join: "leftOuterJoin"}],`);
                assocStr.addBlock(`associatorColumns: {`, () => {
                    assocStr.addLine(`inSource: "${association.foreignKey.associatorColumns.inSource}",`);
                    assocStr.addLine(`inRelated: "${association.foreignKey.associatorColumns.inRelated}",`);
                }, '},');
                this.applyInterceptor(assocStr, topLevelImports, association);
                generatedAssociations.addLine(generatedAssociations.reIndentBlock(`${mappedName}: ${trimEnd(assocStr.toString())},`));
            }
            if (!generatedFields.isEmpty()) {
                generatedFields.wrap(`const ${fieldsConstName} = {`, '};');
                body.addLine(body.reIndentBlock(generatedFields.output));
            }
            if (!generatedAssociations.isEmpty()) {
                generatedAssociations.wrap(`const ${associationsConstName} = {`, '};');
                body.addLine(body.reIndentBlock(generatedAssociations.output));
            }
            if (!generatedFields.isEmpty() || !generatedAssociations.isEmpty()) {
                body.addBlock(`const ${dataSourceConstName} = {`, () => {
                    body.addLine(`name: ${JSON.stringify(dataSource.name)},`);
                    if (!generatedFields.isEmpty())
                    body.addLine(`fields: mapFields(${fieldsConstName}),`);
                    if (!generatedAssociations.isEmpty())
                    body.addLine(`associations: mapAssociations(${associationsConstName}),`);
                }, '};');
            }
        }
        return `${uniq(topLevelImports).join("\n")}\n${body.toString()}`;
    }
}

const generateImport = (mod: ModuleSpec) => {
    let {imported} = mod;
    if (!mod.isDefault) imported = `{${imported}}`;
    return `import ${imported} from "${mod.module}";`;
};

export const generate = async (config: GenConfig) => {
    assertType(GenConfigRT, config, "config");
    const connector = config.knex || globalConnector;
    assertConnectorConfigured(connector);
    const client: keyof typeof adapters = connector.client.config.client;
    debug("Identified client: %s", client);
    if (!adapters[client]) throw new Error(`Client ${client} is currently not supported`);
    const adapter = new adapters[client](config);
    const generator = new Generator(config, adapter);
    const generated: string = await generator.generate();
    if (config.generatedFilePath) {
        await fs.writeFile(config.generatedFilePath, generated);
    }
    return generated;
};
