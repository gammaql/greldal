import React from "react";
import qs from "qs";
import SplitPane from "react-split-pane";

import APITree from "./APITree";
import APIBody from "./APIBody";
import LibInfoBanner from "./LibInfoBanner";

import memoize from "lodash/memoize";
import apiData from "../../../api/api.json";

import "../styles/splitter.css";

function getAPINode(entityInfo) {
    return {
        name: entityInfo.name,
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

function getAPICategory(entityInfo) {
    const { tags } = entityInfo.comment || {};
    if (!tags) return null;
    const categoryTag = tags.find(t => t.tag === "apicategory");
    if (!categoryTag) return null;
    const category = categoryTag.text.trim();
    return category;
}

function getAPIHierarchy() {
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
            id: "PriamryAPI",
            children: categories.PrimaryAPI,
        },
        {
            name: "Configuration Types",
            toggled: true,
            id: "ConfigType",
            children: categories.ConfigType,
        },
        {
            name: "Mapper Classes",
            toggled: true,
            id: "MapperClass",
            children: categories.MapperClass,
        },
    ];
}

export default class APIContainer extends React.Component {
    state = {
        hierarchy: getAPIHierarchy(),
        active: null,
    };
    componentDidMount() {
        const search = location.search.slice(1);
        if (!search) return;
        this.setState({
            active: qs.parse(search),
        });
    }
    render() {
        const { active } = this.state;
        let activeCategory;
        let rootEntity;
        if (active && active.apiCategory) {
            activeCategory = this.state.hierarchy.find(h => h.id === active.apiCategory);
        }
        if (activeCategory && active.rootEntityName) {
            rootEntity = activeCategory.children && activeCategory.children.find(c => c.name === active.rootEntityName);
            if (rootEntity) rootEntity = rootEntity.entity;
        }
        return (
            <>
                <style jsx global>{`
                    body {
                        font-size: 14px;
                        line-height: 22px;
                        background: #fefffc;
                        font-family: Helvetica Neue, Helvetica, Arial;
                    }
                `}</style>
                <style jsx>{`
                    .api-container {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                    }
                    .api-sidebar,
                    .api-body {
                        overflow: auto;
                        height: 100%;
                        padding: 10px;
                    }
                `}</style>
                <div className="api-container">
                    <SplitPane defaultSize="20%" style={{ alignItems: "stretch" }}>
                        <div className="api-sidebar">
                            <LibInfoBanner />
                            <APITree
                                hierarchy={this.state.hierarchy}
                                handleToggle={this.handleToggle}
                                handleClick={this.handleClick}
                            />
                        </div>
                        <div className="api-body">
                            <APIBody
                                {...{
                                    activeCategory,
                                    rootEntity,
                                    activeEntityName: active && active.entityName,
                                }}
                            />
                        </div>
                    </SplitPane>
                </div>
            </>
        );
    }
    handleClick = memoize((name, entity) => event => {
        if (!entity) return;
        let rootEntity = entity;
        while (rootEntity.parent) {
            rootEntity = rootEntity.parent;
        }
        const active = {
            apiCategory: getAPICategory(rootEntity),
            rootEntityName: rootEntity.name,
            entityName: entity.name,
        };
        this.setState({ active });
        history.pushState(
            null,
            `GRelDAL Documentation | ${rootEntity.name} | ${entity.name}`,
            `?${qs.stringify(active)}`,
        );
        event.stopPropagation();
        event.preventDefault();
    });
    handleToggle = (node, toggled) => {
        node.toggled = toggled;
        this.setState({ hierarchy: this.state.hierarchy });
    };
}
