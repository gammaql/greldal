import logo from "../assets/logo.png";

export const LibHeader = () => (
    <div style={{ display: "flex", flexDirection: "row" }}>
        <style jsx>{`
            img {
                height: 100px;
                width: 100px;
            }
            h1 {
                line-height: 100px;
                margin: 0;
                color: #e535ab;
                font-size: 2.5rem;
                margin-left: 5px;
            }
        `}</style>
        <img src={logo} /> <h1>GRelDAL</h1>
    </div>
);
