import { compact, map, flatten, memoize } from "lodash";

export function getAPINode(entityInfo) {
    return {
        name: getAPIName(entityInfo),
        entity: entityInfo,
        children:
            entityInfo.children &&
            entityInfo.children.map(childEntityInfo => {
                const node = getAPINode(childEntityInfo);
                node.entity.parent = entityInfo;
                return node;
            }),
    };
}

export const getAllTags = memoize(entityInfo => {
    return compact(flatten(map(compact([entityInfo].concat(entityInfo.signatures)), "comment.tags")));
});

export function getAPIName(entityInfo) {
    const nameTag = getAllTags(entityInfo).find(t => t.tag === "name");
    if (nameTag) return nameTag.text.trim();
    return entityInfo.name;
}

export function getAPICategory(entityInfo) {
    const tags = compact(flatten(map(compact([entityInfo].concat(entityInfo.signatures)), "comment.tags")));
    const categoryTag = tags.find(t => t.tag === "api-category");
    if (!categoryTag) return null;
    const category = categoryTag.text.trim();
    return category;
}

export function getAPIHierarchy(apiData) {
    const categories = {
        PrimaryAPI: [],
        ConfigType: [],
        MapperClass: [],
    };
    apiData.children.forEach(moduleInfo => {
        if (!moduleInfo.children) return;
        moduleInfo.children.forEach(entityInfo => {
            const category = getAPICategory(entityInfo);
            if (!category || !categories[category]) return;
            categories[category].push(getAPINode(entityInfo));
        });
    });
    return [
        {
            name: "Primary API",
            toggled: true,
            id: "PrimaryAPI",
            children: categories.PrimaryAPI,
            banners: [],
        },
        {
            name: "Configuration Types",
            toggled: true,
            id: "ConfigType",
            children: categories.ConfigType,
            banners: [
                {
                    children:
                        "This page describes the type of a configuration type. Some of the functions exposed in the primary APIs would accept arguments of this type.",
                },
            ],
        },
        {
            name: "Mapper Classes",
            toggled: true,
            id: "MapperClass",
            children: categories.MapperClass,
            banners: [
                {
                    children:
                        "This page describes a Mapper class which is instantiated by one of the functions exposed in primary APIs. You would usually not want to create instances of this class yourself.",
                },
            ],
        },
    ];
}
