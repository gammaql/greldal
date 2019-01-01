import React from "react";
import styled from "styled-components";
import { Link, TrailingIcon } from "../components/Link";
import LibInfoBanner from "../components/LibInfoBanner";
import DynamicTableOfContents from "../components/DynamicTableOfContents";

export const Sidebar = ({ children }) => (
    <Container>
        <LibInfoBanner />
        <Link href="api" highlighted>
            <TrailingIcon>⯈</TrailingIcon>
            API
        </Link>
        <SectionHeader>Tour of GRelDAL</SectionHeader>
        <Link href="">⚡ Quick Start</Link>
        <Link href="mapping-operations">⚡ Mapping Operations</Link>
        <Link href="mapping-associations">⚡ Mapping Associations</Link>
        <Link href="mapping-data-sources">⚡ Mapping Data Sources</Link>
        <Link href="best-practices">⚡ Best Practices</Link>
        <SectionHeader>Additional Topics</SectionHeader>
        <Link href="type-safety">⚡ Type Safety</Link>
        <Link href="comparision-with-alternatives">⚡ Comparision With Alternatives</Link>
        <DynamicTableOfContents />
        {children}
    </Container>
);

const Container = styled.div`
    background: #fff;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 300px;
    overflow-y: auto;
    overflow-x: auto;
    padding: 10px 30px 30px 30px;
    border-right: 1px solid #bbb;
    box-shadow: 0 0 20px #ccc;

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

export const SectionHeader = styled.h1`
    background: #ddd;
    padding: 5px;
    text-transform: uppercase;
    border-radius: 4px;
    color: gray;
`;
