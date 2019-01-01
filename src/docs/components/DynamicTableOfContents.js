import React from "react";
import { times, isEqual, isEmpty } from "lodash";
import { SectionHeader } from "./Sidebar";

export default class DynamicTableOfContents extends React.Component {
    state = { headers: [] };

    render() {
        if (isEmpty(this.state.headers)) {
            return null;
        }
        return (
            <>
                <SectionHeader>Page Outline</SectionHeader>
                {this.state.headers.map(h => (
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
                ))}
            </>
        );
    }

    componentDidMount() {
        this.updateOutline();
    }

    componentDidUpdate() {
        this.updateOutline();
    }

    updateOutline() {
        const selectors = times(6)
            .map(i => `#container h${i + 1}`)
            .join(",");
        const headers = [...document.querySelectorAll(selectors)]
            .map(h => ({
                level: Number(h.tagName.slice(1)) - 1,
                label: h.innerText,
                id: h.getAttribute("id"),
            }))
            .filter(h => h.id);
        if (isEqual(this.state.headers, headers)) return;
        this.setState({
            headers,
        });
    }
}
