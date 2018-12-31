import React from "react";
import { times } from "lodash";

export default class DynamicTableOfContents extends React.Component {
    state = { headers: [] };

    render() {
        return (
            <>
                {this.state.headers.map(
                    h =>
                        h.id && (
                            <a href={`#${h.id}`}>
                                <div
                                    style={{
                                        paddingLeft: h.level * 10 + "px",
                                        display: "flex",
                                        flexDirection: "row",
                                    }}
                                >
                                    <div style={{ marginRight: "5px" }}>►</div>
                                    <div>{h.label}</div>
                                </div>
                            </a>
                        ),
                )}
            </>
        );
    }

    componentDidMount() {
        const selectors = times(6)
            .map(i => `#container h${i + 1}`)
            .join(",");
        this.setState({
            headers: [...document.querySelectorAll(selectors)].map(h => ({
                level: Number(h.tagName.slice(1)),
                label: h.innerText,
                id: h.getAttribute("id"),
            })),
        });
    }
}
