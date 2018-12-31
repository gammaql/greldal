import React from "react";
import { Sidebar } from "./Sidebar";

import "normalize.css/normalize.css";
import "highlight.js/styles/github.css";

export class PageLayout extends React.Component {
    render() {
        const { sidebar, children } = this.props;
        return (
            <div>
                <style jsx global>{`
                    body {
                        font-size: 14px;
                        line-height: 22px;
                        background: #fefffc;
                        o: #000;
                        font-family: Helvetica Neue, Helvetica, Arial;
                    }
                    #container h5,
                    #container h6 {
                        font-size: 0.8rem !important;
                        font-weight: 600;
                    }
                    pre > code {
                        border: 1px solid #ddd;
                        border-left: 4px solid #ddd;
                        display: block;
                        background: #f8f8f8;
                        padding: 0.5em;
                    }
                `}</style>
                <style jsx>{`
                    #container {
                        max-width: 700px;
                        margin: 40px 100px 50px 340px;
                    }
                `}</style>
                <Sidebar>{sidebar}</Sidebar>
                <div id="container">{children}</div>
            </div>
        );
    }
}
