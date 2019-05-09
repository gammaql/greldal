import React from "react";
import styled from "styled-components";
import Media from "react-media";
import { Sidebar, SidebarContainer, FixedSidebarContainer } from "./Sidebar";

import "../styles/page.css";
import "normalize.css/normalize.css";
import "highlight.js/styles/github.css";

export class PageLayout extends React.Component {
    state = {
        show: false,
        showDrawer: false,
    };

    containerRef = React.createRef();

    toggleDrawer = () => {
        this.setState({
            showDrawer: !this.state.showDrawer,
        });
    }

    componentDidMount() {
        this.setState({
            show: true,
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.children !== prevProps.children) {
            const {current} = this.containerRef;
            if (!current) return;
            current.scrollTop = 0;
        }
    }

    render() {
        if (!this.state.show) return this.renderWideLayout();

        const { sidebar, children } = this.props;
        return (
            <Media query="(max-width: 1000px)">
                {matches => {
                    if (matches) {
                        return this.renderCompactLayout();
                    } else {
                        return this.renderWideLayout();
                    }
                }}
            </Media>
        );
    }

    renderCompactLayout() {
        const { children, sidebar } = this.props;
        return (
            <CompactLayoutContainer ref={this.containerRef}>
                <AppHeader>
                    <AppHeader.Action>
                        <AppHeader.Action.Control
                            onClick={this.toggleDrawer}
                        >
                            ☰
                        </AppHeader.Action.Control>
                    </AppHeader.Action>
                    <AppHeader.Title>
                        GRelDAL
                    </AppHeader.Title>
                </AppHeader>
                <MobileContentContainer id="container">
                    {this.state.showDrawer ? (
                        <SidebarContainer onClick={this.toggleDrawer}>
                            <Sidebar>{sidebar}</Sidebar>
                        </SidebarContainer>
                    ) : (
                        children
                    )}
                </MobileContentContainer>
            </CompactLayoutContainer>
        );
    }

    renderWideLayout() {
        const { children, sidebar } = this.props;
        const { show } = this.state;
        return (
            <div style={{ display: show ? "block" : "none" }} ref={this.containerRef}>
                <FixedSidebarContainer>
                    <Sidebar>{sidebar}</Sidebar>
                </FixedSidebarContainer>
                <DesktopContentContainer id="container">{children}</DesktopContentContainer>
            </div>
        );
    }
}

const CompactLayoutContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
`

const AppHeader = styled.div`
    background: #53942b;
    line-height: 1rem;
    border-bottom: 2px solid #8a8a8a;
    display: flex;
    flex-direction: row;
    position: sticky;
    top: 0;
`;

AppHeader.Action = styled.div`
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 3rem;
    padding: 0.4rem;
`;

AppHeader.Action.Control = styled.button`
    padding: 0.6rem;
    line-height: 1rem;
    display: block;
    border: 1px solid #5d8c3e;
    box-shadow: none;
    background: #94d668;
    font-size: 1.6rem;
    color: #60ac32;
    font-weight: bold;
`;

AppHeader.Title = styled.div`
    flex-grow: 1;
    flex-shrink: 1;
    text-align: center;
    font-size: 1.6rem;
    line-height: 3rem;
    color: #bfe896;
    font-weight: bold;
    line-height: 50px;
`;

const ContentContainer = styled.div`
    pre:not(.CodeMirror-line) {
        padding: 0 !important;
    }
    h1 {
        margin: 2.8rem 0;
    }
    h2,
    h3,
    h4,
    h5,
    h6 {
        margin: 1.8rem 0;
    }
    p,
    ol,
    ul {
        margin: 1.8rem 0;
    }
    pre:not(.CodeMirror-line) > code {
        border-left: 4px solid #ddd;
        display: block;
        margin: 0;
        padding: 5px;
    }
    pre:not(.CodeMirror-line) {
        max-width: calc(100% - 40px);
        overflow-x: auto;
        border: 1px solid #ddd;
        background: #f8f8f8;
    }
    a,
    a:visited,
    a:hover,
    a:active {
        color: #0261cd;
        font-weight: bold;
        text-decoration: none;
    }
`;

const DesktopContentContainer = styled(ContentContainer)`
    max-width: 700px;
    margin: 40px 100px 50px 400px;
`;

const MobileContentContainer = styled(ContentContainer)`
    width: calc(100% - 40px);
    padding: 20px;
    overflow-x: hidden;
`;
