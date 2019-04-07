const { merge, forEach, find, compact, map, flatten, memoize, get } = require("lodash");
const climber = require("tree-climber");
const qs = require("qs");

function getAPINode(entityInfo) {
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
                    // node.entity.parent = entityInfo;
                    return node;
                });
        } else {
            curLevel.children = [{}];
            curLevel = curLevel.children[0];
        }
    });
    return root;
}

function injectIntoHierarchy(hierarchy, node) {
    const prevChild = find(hierarchy, child => child.name === node.name);
    if (!prevChild) {
        hierarchy.push(node);
        return;
    }
    prevChild.entity = prevChild.entity || node.entity;
    if (node.children) {
        prevChild.children = prevChild.children || [];
        forEach(node.children, nextChild => {
            injectIntoHierarchy(prevChild.children, nextChild);
        });
    }
}

function injectIntoEntity(entity, childEntity) {
    entity.children = entity.children || [];
    const prevChild = entity.children.find(c => c.name === childEntity.name);
    if (prevChild) merge(prevChild, childEntity);
    else entity.children.push(childEntity);
}

function findInHierarchy(root, entityPath) {
    if (!root || !root.children || !entityPath.length) return root;
    const child = root.children.find(child => child.name === entityPath[0]);
    return findInHierarchy(child, entityPath.slice(1));
}

function findAnywhereInHierarchy(root, entityName) {
    if (!root) return null;
    return root.find(c => {
        if (c.name === entityName) return c;
        return findAnywhereInHierarchy(c.children, entityName);
    });
}

const getAllTags = memoize(entityInfo => {
    return compact(flatten(map(compact([entityInfo].concat(entityInfo.signatures)), "comment.tags")));
});

function getAPIName(entityInfo) {
    const nameTag = getAllTags(entityInfo).find(t => t.tag === "name");
    if (nameTag) return nameTag.text.trim();
    return entityInfo.name;
}

function getAPICategory(entityInfo) {
    const tags = compact(flatten(map(compact([entityInfo].concat(entityInfo.signatures)), "comment.tags")));
    const categoryTag = tags.find(t => t.tag === "api-category");
    if (!categoryTag) return null;
    const category = categoryTag.text.trim();
    return category;
}

function getAPIHierarchy(apiData) {
    const categories = {
        PrimaryAPI: [],
        ConfigType: [],
        MapperClass: [],
        CRUDResolvers: [],
    };
    const entities = {};
    apiData.children.forEach(moduleInfo => {
        if (!moduleInfo.children) return;
        moduleInfo.children.forEach(entityInfo => {
            const category = getAPICategory(entityInfo);
            if (!category || !categories[category]) return;
            const node = getAPINode(entityInfo);
            injectIntoHierarchy(categories[category], node);
            entities[getAPIName(entityInfo)] = node;
        });
    });
    climber.climb(apiData, (key, value, path) => {
        if (key === "tag" && value === "memberof") {
            const tag = get(apiData, path.split(".").slice(0, -1));
            console.log("Associating orphaned member:", tag);
            const curEntity = get(apiData, path.split(".").slice(0, -4));
            const parentNode = entities[tag.text.trim()];
            if (!parentNode) {
                console.log("Unable to find parentNode:", tag);
                return;
            }
            parentNode.children = parentNode.children || [];
            injectIntoHierarchy(parentNode.children, {
                entity: curEntity,
                name: getAPIName(curEntity),
            });
            injectIntoEntity(parentNode.entity, curEntity);
        }
    });
    return [
        {
            name: "Primary API",
            toggled: true,
            id: "PrimaryAPI",
            children: categories.PrimaryAPI || [],
            banners: [],
        },
        {
            name: "CRUD Resolvers",
            toggled: true,
            id: "CRUDResolvers",
            children: categories.CRUDResolvers || [],
            banners: [],
        },
        {
            name: "Configuration Types",
            toggled: true,
            id: "ConfigType",
            children: categories.ConfigType || [],
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
            children: categories.MapperClass || [],
            banners: [
                {
                    children:
                        "This page describes a Mapper class which is instantiated by one of the functions exposed in primary APIs. You would usually not want to create instances of this class yourself.",
                },
            ],
        },
        {
            name: "Utils",
            toggled: false,
            id: "Utils",
            children: categories.Utils || [],
        },
    ];
}

function getAPIHref(ref) {
    let [rootEntityName, entityName] = ref.split(":");
    if (!entityName) entityName = rootEntityName;
    return `${ROOT_PATH}/api?${qs.stringify({
        entityName,
        rootEntityName,
    })}`;
}

function getGuideHref(ref) {
    return `${ROOT_PATH}/${ref}`;
}

function getTermHref(ref) {
    return `${ROOT_PATH}/api?term=${ref}`;
}

const SPECIAL_HREF_PATTERN = /href="(api|guide|term):.*"/g;
const API_HREF_PATTERN = /href="api:(.*)"/;
const GUIDE_HREF_PATTERN = /href="guide:(.*)"/;
const TERM_HREF_PATTERN = /href="term:(.*)"/;

function convertLinks(html) {
    const specialLinks = html.match(SPECIAL_HREF_PATTERN);
    if (specialLinks) {
        for (const link of specialLinks) {
            const apiLinkMatch = link.match(API_HREF_PATTERN);
            if (apiLinkMatch) {
                html = html.replace(apiLinkMatch[0], `href="${getAPIHref(apiLinkMatch[1])}"`);
                continue;
            }
            const guideLinkMatch = link.match(GUIDE_HREF_PATTERN);
            if (guideLinkMatch) {
                const slug = guideLinkMatch[1];
                html = html.replace(guideLinkMatch[0], `href="${getGuideHref(slug)}"`);
                continue;
            }
            const termLinkMatch = link.match(TERM_HREF_PATTERN);
            if (termLinkMatch) {
                const term = termLinkMatch[1];
                html = html.replace(termLinkMatch[0], `href="${getTermHref(term)}"`);
                continue;
            }
        }
    }
    const relLinks = html.match(/href="\/.*"/g);
    if (relLinks) {
        for (const link of relLinks) {
            const m = link.match(/href="\/(.*)"/);
            html = html.replace(m[0], `href="${ROOT_PATH}/${m[1]}"`);
        }
    }
    return html;
}

module.exports = {
    getAPINode,
    injectIntoHierarchy,
    findInHierarchy,
    findAnywhereInHierarchy,
    getAllTags,
    getAPIName,
    getAPICategory,
    getAPIHierarchy,
    convertLinks,
    getAPIHref,
    getGuideHref,
    getTermHref,
    SPECIAL_HREF_PATTERN,
    API_HREF_PATTERN,
    GUIDE_HREF_PATTERN,
    TERM_HREF_PATTERN,
};
