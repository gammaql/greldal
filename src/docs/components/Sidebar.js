import React from "react";
import styled from "styled-components";
import { Link, TrailingIcon } from "../components/Link";
import LibInfoBanner from "../components/LibInfoBanner";
import DynamicTableOfContents from "../components/DynamicTableOfContents";

export const Sidebar = ({ children }) => (
    <>
        <LibInfoBanner />
        <Link href="api" highlighted>
            <TrailingIcon>⯈</TrailingIcon>
            API
        </Link>
        <Link href="#quick-start"><Bolt/>Quick Start</Link>
        <Link href="faqs"><Bolt/>Frequently Asked Questions</Link>
        <Link href="guides">
            <SectionHeader>Guides</SectionHeader>
        </Link>
        <Link href="mapping-data-sources"><Bolt/>Mapping Data Sources</Link>
        <Link href="mapping-operations"><Bolt/>Mapping Operations</Link>
        <Link href="mapping-associations"><Bolt/>Mapping Associations</Link>
        <Link href="best-practices"><Bolt/>Best Practices</Link>
        <SectionHeader>Additional Topics</SectionHeader>
        <Link href="type-safety"><Bolt/>Type Safety</Link>
        <Link href="comparision-with-alternatives"><Bolt/>Comparision With Alternatives</Link>
        <DynamicTableOfContents />
        {children}
    </>
);

export const SidebarContainer = styled.div`
    background: #fff;
    padding: 10px 30px 30px 30px;
a,
    a:visited {
        display: block;
        color: #000;
        font-weight: 700;
        margin-top: 5px;
        text-decoration: none;
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-size: 0.75rem !important;
        font-weight: 600;
    }
`;

export const FixedSidebarContainer = styled(SidebarContainer)`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 300px;
    overflow-y: auto;
    overflow-x: auto;

    border-right: 1px solid #bbb;
    box-shadow: 0 0 20px #ccc;
`;

export const SectionHeader = styled.h1`
    background: #ddd;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 4px;
    color: gray;
    font-size: 0.75rem;
    margin: 1.6rem 0;
`;

export const Bolt = styled((props) => <span {...props}>⚡</span>)`
    margin-right: 5px;
`