import logo from "../assets/logo.png";

export const LibHeader = () => (
    <div className="container">
        <style jsx>{`
            img {
                height: 100px;
                width: 100px;
            }
            .header-text {
                padding-top: 20px;
                padding-left: 10px;
            }
            .primary-header {
                line-height: 25px;
                margin: 0;
                color: #e535ab;
                font-size: 2.5rem;
                margin-left: 5px;
            }
            .secondary-header {
                color: #ddd;
                font-size: 1.8rem;
            }
            .secondary-header strong {
                color: #acacac;
            }
            .container {
                display: flex;
                flex-direction: row;
                border-bottom: 1px solid #ddd;
                padding-bottom: 2rem;
            }
        `}</style>
        <img src={logo} />{" "}
        <div className="header-text">
            <h1 className="primary-header">GRelDAL</h1>{" "}
            <h2 className="secondary-header">
                (<strong>G</strong>raphQL ⇋ <strong>Rel</strong>ational DB) <strong>D</strong>ata <strong>A</strong>ccess{" "}
                <strong>L</strong>ayer
            </h2>
        </div>
    </div>
);
