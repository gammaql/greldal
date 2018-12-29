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
    );
}
