import L from "next/link";
import styled from "styled-components";
import slugify from "slugify";

export const Link = ({ href = slugify(children || ""), className, style, children, highlighted, ...props }) =>
    children && (
        <L {...props} href={`${ROOT_PATH}/${href}`}>
            <Anchor {...{ className, style, highlighted }}>{children}</Anchor>
        </L>
    );

export const Anchor = styled.a`
    cursor: pointer;
    ${props =>
        props.highlighted &&
        `background: black;
        padding: 5px;
        text-transform: uppercase;
        border-radius: 4px;
        color: white !important;`};
`;

export const TrailingIcon = styled.div`
    margin-right: 5px;
    float: right;
`;

export const NextPageLink = ({ children, href = slugify(children), ...props }) => (
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
