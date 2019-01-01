import React from "react";
import styled from "styled-components";
import qs from "qs";
import { compact, map, flatten } from "lodash";

import { PageLayout } from "./PageLayout";
import APITree from "./APITree";
import APIBody from "./APIBody";
import LibInfoBanner from "./LibInfoBanner";
import { SectionHeader } from "./Sidebar";

import memoize from "lodash/memoize";
import apiData from "../../../api/api.json";
import { getAPIName, getAPIHierarchy, getAPICategory, findInHierarchy } from "../utils/api";

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
        const { active, hierarchy } = this.state;
        let activeCategory;
        let rootEntity;
        if (active && active.apiCategory) {
            activeCategory = this.state.hierarchy.find(h => h.id === active.apiCategory);
        }
        if (activeCategory && active.rootEntityName) {
            rootEntity = findInHierarchy(activeCategory, active.rootEntityName.split("."));
            if (rootEntity) rootEntity = rootEntity.entity;
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
                <APIBody
                    {...{
                        activeCategory,
                        rootEntity,
                        activeEntityName: active && active.entityName,
                    }}
                />
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

const Container = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;

const Pane = styled.div`
    overflow: auto;
    height: 100%;
    padding: 10px;
`;

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
