import React from "react";
import { Sidebar } from "./Sidebar";

export const PageLayout = ({ sidebar, children }) => (
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
        `}</style>
        <style jsx>{`
            #container {
                // width: 550px;
                margin: 40px 100px 50px 340px;
            }
        `}</style>
        <Sidebar>{sidebar}</Sidebar>
        <div id="container">{children}</div>
    </div>
);
