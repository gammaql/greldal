import React from "react";
import styled from "styled-components";
import Collapsible from "react-collapsible";
import { uniqBy, get, find } from "lodash";

import { TypePresenter } from "./TypePresenter";
import { getAPIName } from "../utils/api";
import { SectionHeader } from "./Sidebar";
import { ParamsTable } from "./ParamsTable";

import "../styles/collapsible.css";

export default class APIEntityContainer extends React.Component {
    containerRef = React.createRef();

    componentDidMount() {
        this.bringToView();
    }
    componentDidUpdate() {
        this.bringToView();
    }

    bringToView() {
        if (this.props.activeEntityName && this.props.entity.name === this.props.activeEntityName) {
            this.containerRef.current.scrollIntoView();
        }
    }

    render() {
        const { entity, activeEntityName } = this.props;
        return (
            <div ref={this.containerRef}>
                <EntityHeader>
                    {entity.kindString && <div style={{ float: "right", color: "silver" }}>({entity.kindString})</div>}
                    <h1>{getAPIName(entity)}</h1>
                </EntityHeader>
                {entity.comment &&
                    entity.comment.shortText && (
                        <Section>
                            <SectionHeader>Description</SectionHeader>
                            <p>{entity.comment.shortText}</p>
                        </Section>
                    )}
                {entity.type && (
                    <Section>
                        <SectionHeader>Type</SectionHeader>
                        <TypePresenter type={entity.type} />
                    </Section>
                )}
                {entity.signatures &&
                    entity.signatures.map(sig => (
                        <>
                            {sig.comment &&
                                sig.comment.shortText && (
                                    <section className="api-section">
                                        <SectionHeader>Description</SectionHeader>
                                        <p>{sig.comment.shortText}</p>
                                    </section>
                                )}
                            {sig.parameters &&
                                sig.parameters.length > 0 && (
                                    <Section>
                                        <SectionHeader>Parameters</SectionHeader>
                                        <ParamsTable params={sig.parameters} />
                                    </Section>
                                )}
                            {sig.type && (
                                <Section>
                                    <SectionHeader>Returns</SectionHeader>
                                    {get(find(entity.tags, { tag: "returns" }), "text")}
                                    <TypePresenter type={sig.type} />
                                </Section>
                            )}
                        </>
                    ))}
                {entity.sources && (
                    <Section>
                        <SectionHeader>Sources</SectionHeader>
                        <ul>
                            {uniqBy(entity.sources, s => s.fileName).map(src => {
                                const fileName = src.fileName.replace(/\.d\.ts$/, ".ts");
                                return (
                                    <li>
                                        <a href={`https://github.com/gql-dal/greldal/blob/master/src/${fileName}`}>
                                            {fileName}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </Section>
                )}
                {entity.children && (
                    <Section>
                        <SectionHeader>Members</SectionHeader>
                        <MemberListContainer>
                            {entity.children.map(e => (
                                <Collapsible
                                    trigger={
                                        <div>
                                            {e.kindString && (
                                                <div style={{ float: "right", color: "silver" }}>({e.kindString})</div>
                                            )}
                                            {getAPIName(e)}
                                        </div>
                                    }
                                    open={activeEntityName && e.name === activeEntityName}
                                >
                                    <APIEntityContainer entity={e} activeEntityName={activeEntityName} />
                                </Collapsible>
                            ))}
                        </MemberListContainer>
                    </Section>
                )}
            </div>
        );
    }
}

const Section = styled.section`
    margin: 10px 0;
`;

const EntityHeader = styled.div``;

const MemberListContainer = styled.div`
    padding-left: 5px;
    border-left: 4px solid #ddd;
    padding-right: 0;
    ${EntityHeader} {
        display: none;
    }
`;
