import "normalize.css/normalize.css";
import "highlight.js/styles/github.css";

import HomeContent, { tableOfContents } from "../../../README.md";
import logo from "../assets/logo.png";

const Nav = props => (
    <>
        {props.children.map(item => {
            const Heading = `h${item.level}`;
            return (
                <>
                    <a href={`#${item.id}`}>
                        <Heading>{item.title}</Heading>
                    </a>
                    <div className="toc-children">{item.children && <Nav>{item.children}</Nav>}</div>
                </>
            );
        })}
    </>
);

export const Sidebar = () => (
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
        <div
            style={{
                paddingBottom: "10px",
                borderBottom: "1px solid #ddd",
                display: "flex",
                flexDirection: "row",
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
        <Nav>{tableOfContents()}</Nav>
    </div>
);

export default () => (
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
                width: 550px;
                margin: 40px 0 50px 340px;
            }
        `}</style>
        <Sidebar />
        <div id="container">
            <HomeContent />
        </div>
    </div>
);
