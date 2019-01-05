import React from "react";
import styled from "styled-components";
import qs from "qs";

import { PageLayout } from "./PageLayout";
import APITree from "./APITree";
import APIBody from "./APIBody";
import { SectionHeader } from "./Sidebar";

import memoize from "lodash/memoize";
import hierarchy from "../../../api/api-hierarchy.json";
import { getAPIName, getAPICategory, findInHierarchy } from "../utils/api";
import { HierarchyContext } from "./HierarchyContext";

export default class APIContainer extends React.Component {
    state = {
        hierarchy,
        active: null,
    };

    componentDidMount() {
        this.syncFromLocation();
        window.addEventListener("popstate", this.syncFromLocation);
    }

    componentWillUnmount() {
        window.removeEventListener("popstate", this.syncFromLocation);
    }

    syncFromLocation = () => {
        const search = location.search.slice(1);
        if (!search) return;
        this.setState({
            active: qs.parse(search),
        });
    };

    render() {
        const { active, hierarchy } = this.state;
        let activeCategory;
        let rootEntity;
        if (active && active.rootEntityName) {
            const entityPath = active.rootEntityName.split(".");
            for (const category of this.state.hierarchy) {
                const node = findInHierarchy(category, entityPath);
                if (node) {
                    activeCategory = category;
                    rootEntity = node.entity;
                    break;
                }
            }
        }
        return (
            <PageLayout
                sidebar={
                    <>
                        {hierarchy.map(h => (
                            <>
                                <SectionHeader>{h.name}</SectionHeader>
                                <APITree
                                    hierarchy={h.children}
                                    handleToggle={this.handleToggle}
                                    handleClick={this.handleClick}
                                />
                            </>
                        ))}
                    </>
                }
            >
                <NotificationBanner>API Documentation site is currently work in progress.</NotificationBanner>
                {activeCategory &&
                    activeCategory.banners.map(b => <NotificationBanner>{b.children}</NotificationBanner>)}
                <HierarchyContext.Provider value={this.state.hierarchy}>
                    <APIBody
                        {...{
                            activeCategory,
                            rootEntity,
                            activeEntityName: active && active.entityName,
                        }}
                    />
                </HierarchyContext.Provider>
            </PageLayout>
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



const NotificationBanner = styled.div`
    background: lemonchiffon;
    border: 1px solid #ffe7bb;
    padding: 5px;
    color: orange;
    border-radius: 5px;
    text-align: center;

    & + & {
        margin-top: 10px;
    }
`;
