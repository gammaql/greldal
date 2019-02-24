import styled from "styled-components";
import Link from "next/link";

import logo from "../assets/logo.png";

export default function LibInfoBanner() {
    return (
        <Link href={`${ROOT_PATH}/`}>
            <div
                style={{
                    paddingBottom: "10px",
                    display: "flex",
                    flexDirection: "row",
                    cursor: "pointer",
                }}
            >
                <img src={logo} style={{ height: "50px" , width: "50px"}} />
                <div
                    style={{
                        fontWeight: "600",
                        fontSize: "2rem",
                        lineHeight: "50px",
                        paddingLeft: "10px",
                        color: "#e535ab",
                    }}
                >
                    GRelDAL
                    <span
                        css={`
                            font-size: 0.8rem;
                            font-weight: 100;
                            color: orange;
                            background: lemonchiffon;
                            padding: 4px;
                            border-radius: 4px;
                            border: 1px solid orange;
                            position: relative;
                            top: -20px;
                        `}
                    >
                        Beta
                    </span>
                </div>
            </div>
        </Link>
    );
}
