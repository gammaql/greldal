import React from "react";
import Link from "next/link";
import logo from "../assets/logo.png";

export const Sidebar = ({ children }) => (
    <div id="sidebar">
        <style jsx global>{`
            #sidebar {
                background: #fff;
                position: fixed;
                top: 0;
                left: 0;
                bottom: 0;
                width: 250px;
                overflow-y: auto;
                overflow-x: auto;
                padding: 10px 30px 30px 30px;
                border-right: 1px solid #bbb;
                box-shadow: 0 0 20px #ccc;
            }
            #sidebar a,
            #sidebar a:visited {
                display: block;
                color: #000;
                font-weight: 700;
                margin-top: 5px;
                text-decoration: none;
            }
            .toc-children {
                margin: 10px 0 0;
                border-left: 3px solid #ddd;
                padding-left: 10px;
            }
            #sidebar h1,
            #sidebar h2,
            #sidebar h3,
            #sidebar h4,
            #sidebar h5,
            #sidebar h6 {
                font-size: 0.75rem !important;
                font-weight: 600;
            }
        `}</style>
        <Link href="/">
            <div
                style={{
                    paddingBottom: "10px",
                    display: "flex",
                    flexDirection: "row",
                    cursor: "pointer",
                }}
            >
                <img src={logo} style={{ height: "50px" }} />
                <div
                    style={{
                        fontWeight: "600",
                        fontSize: "2rem",
                        lineHeight: "50px",
                        paddingLeft: "10px",
                    }}
                >
                    GRelDAL
                </div>
            </div>
        </Link>
        <hr />
        <Link href={`${ROOT_PATH}/`}>
            <a>⚡ Quick Start</a>
        </Link>
        <Link href={`${ROOT_PATH}/associations`}>
            <a>⚡ Associations</a>
        </Link>
        <Link href={`${ROOT_PATH}/mapping-customizations`}>
            <a>⚡ Customizing Mapping of Tables</a>
        </Link>
        <hr />
        <Link href={`${ROOT_PATH}/api`}>
            <a>API</a>
        </Link>
        <hr />
        {children}
    </div>
);
