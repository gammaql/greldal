import { forEach, find, compact, map, flatten, memoize } from "lodash";

export function getAPINode(entityInfo) {
    const name = getAPIName(entityInfo);
    const path = name.split(".");
    const root = {};
    let curLevel = root;
    path.forEach((fragment, index) => {
        curLevel.name = fragment;
        if (index === path.length - 1) {
            curLevel.entity = entityInfo;
            curLevel.children =
                entityInfo.children &&
                entityInfo.children.map(childEntityInfo => {
                    const node = getAPINode(childEntityInfo);
                    node.entity.parent = entityInfo;
                    return node;
                });
        } else {
            curLevel.children = [{}];
            curLevel = curLevel.children[0];
        }
    });
    return root;
}

function injectInto(hierarchy, node) {
    const prevChild = find(hierarchy, child => child.name === node.name);
    if (!prevChild) {
        hierarchy.push(node);
        return;
    }
    prevChild.entity = prevChild.entity || node.entity;
    if (node.children) {
        prevChild.children = prevChild.children || [];
        forEach(node.children, nextChild => {
            injectInto(prevChild.children, nextChild);
        });
    }
}

export function findInHierarchy(root, entityPath) {
    if (!root || !root.children || !entityPath.length) return root;
    const child = root.children.find(child => child.name === entityPath[0]);
    return findInHierarchy(child, entityPath.slice(1));
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
            injectInto(categories[category], getAPINode(entityInfo));
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
