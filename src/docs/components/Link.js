import L from "next/link";
import styled from "styled-components";
import slugify from "slugify";
import { toLower } from "lodash";
import {
    getGuideHref,
    getTermHref,
    getAPIHref,
    API_HREF_PATTERN,
    GUIDE_HREF_PATTERN,
    TERM_HREF_PATTERN,
} from "../utils/api";

export const Link = ({ href, className, style, children, highlighted, ...props }) => {
    if (!children) return null;
    href = href || toLower(slugify(children));
    let match;
    if ((match = href.match(API_HREF_PATTERN))) {
        href = getAPIHref(match[1]);
        children = match[1];
    } else if ((match = href.match(GUIDE_HREF_PATTERN))) {
        href = getGuideHref(match[1]);
        children = match[1];
    } else if ((match = href.match(TERM_HREF_PATTERN))) {
        href = getTermHref(match[1]);
        children = match[1];
    } else href = `${ROOT_PATH}/${href}`;
    return (
        <L {...props} href={href}>
            <Anchor {...{ className, style, highlighted }}>{children}</Anchor>
        </L>
    );
};

export const Anchor = styled.a`
    cursor: pointer;
    ${props =>
        props.highlighted &&
        `background: black;
        padding: 5px;
        text-transform: uppercase;
        border-radius: 4px;
        margin: 1.6rem 0;
        color: white !important;`};
`;

export const TrailingIcon = styled.div`
    margin-right: 5px;
    float: right;
`;

export const NextPageLink = ({ children, href = toLower(slugify(children)), ...props }) => (
    <Link highlighted {...props} href={href} style={{ display: "inline-block", cursor: "pointer" }}>
        <TrailingIcon
            css={`
                margin-left: 10px;
                padding-left: 5px;
                border-left: 1px solid white;
            `}
        >
            ⯈
        </TrailingIcon>
        <div
            css={`
                float: left;
                background: gray;
                margin: -5px;
                padding: 5px 10px;
                border-radius: 4px 0 0 4px;
                margin-right: 5px;
            `}
        >
            Next
        </div>{" "}
        <strong>{children}</strong>
    </Link>
);
