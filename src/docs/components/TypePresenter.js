import React from "react";
import qs from "qs";
import JSONTree from "react-json-tree";
import { findAnywhereInHierarchy } from "../utils/api";
import { HierarchyContext } from "./HierarchyContext";
import { Link } from "./Link";

// https://github.com/reduxjs/redux-devtools/blob/75322b15ee7ba03fddf10ac3399881e302848874/src/react/themes/default.js
const theme = {
    scheme: "default",
    author: "chris kempson (http://chriskempson.com)",
    base00: "#181818",
    base01: "#282828",
    base02: "#383838",
    base03: "#585858",
    base04: "#b8b8b8",
    base05: "#d8d8d8",
    base06: "#e8e8e8",
    base07: "#f8f8f8",
    base08: "#ab4642",
    base09: "#dc9656",
    base0A: "#f7ca88",
    base0B: "#a1b56c",
    base0C: "#86c1b9",
    base0D: "#7cafc2",
    base0E: "#ba8baf",
    base0F: "#a16946",
};

export const TypePresenter = ({ type }) => (
    <HierarchyContext.Consumer>
        {hierarchy => {
            let primary;
            if (type.type === "reference") {
                primary = type.name;
                if (primary) {
                    const primaryEntity = findAnywhereInHierarchy(hierarchy, primary);
                    if (primaryEntity) {
                        primary = (
                            <a
                                href={
                                    `${ROOT_PATH}/api?` +
                                    qs.stringify({
                                        apiCategory: "ConfigType",
                                        rootEntityName: primary,
                                        entityName: primary,
                                    })
                                }
                            >
                                {primary}
                            </a>
                        );
                    } else {
                        primary = <a href={`https://github.com/gammaql/greldal/search?q=${primary}`}>{primary}</a>;
                    }
                }
            }
            const tree = <JSONTree data={type} theme={theme} />;
            return (
                <>
                    {primary}
                    {primary && (
                        <div
                            css={`
                                color: #ddd;
                            `}
                        >
                            ---
                        </div>
                    )}
                    <a title="The parsed representation of type. This structure can provide more information about type parameters">
                        Details
                    </a>
                    {tree}
                </>
            );
        }}
    </HierarchyContext.Consumer>
);
