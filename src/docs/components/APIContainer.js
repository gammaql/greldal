import React from "react";
import qs from "qs";
import { compact, map, flatten } from "lodash";
import SplitPane from "react-split-pane";

import APITree from "./APITree";
import APIBody from "./APIBody";
import LibInfoBanner from "./LibInfoBanner";

import memoize from "lodash/memoize";
import apiData from "../../../api/api.json";
import { getAPIName, getAPIHierarchy, getAPICategory } from "../utils/api";

import "../styles/splitter.css";

export default class APIContainer extends React.Component {
    state = {
        hierarchy: getAPIHierarchy(apiData),
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
            rootEntity =
                activeCategory.children && activeCategory.children.find(c => getAPIName(c) === active.rootEntityName);
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
                    .notification-banner {
                        background: lemonchiffon;
                        border: 1px solid #ffe7bb;
                        padding: 5px;
                        color: orange;
                        border-radius: 5px;
                        text-align: center;
                    }
                    .notification-banner + .notification-banner {
                        margin-top: 10px;
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
                            <div className="notification-banner">
                                API Documentation site is currently work in progress.
                            </div>
                            {activeCategory &&
                                activeCategory.banners.map(b => (
                                    <div className="notification-banner">{b.children}</div>
                                ))}
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
            rootEntityName: getAPIName(rootEntity),
            entityName: getAPIName(entity),
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
