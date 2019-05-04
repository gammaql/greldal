import React from "react";
import { Treebeard } from "react-treebeard";
import treeStyle from "react-treebeard/dist/themes/default";
import treeDecorators from "react-treebeard/dist/components/Decorators";

treeStyle.tree.base.backgroundColor = "transparent";

export default function APITree({ hierarchy, handleToggle, handleClick }) {
    return (
        <Treebeard
            style={treeStyle}
            data={hierarchy}
            onToggle={handleToggle}
            decorators={{
                ...treeDecorators,
                Header: props => (
                    <div
                        style={{
                            ...props.style,
                            display: "inline-block",
                            cursor: "pointer",
                        }}
                        onClick={handleClick(props.node.name, props.node.entity)}
                    >
                        {props.node.name}
                    </div>
                ),
            }}
        />
    );
}
