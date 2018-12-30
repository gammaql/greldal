import APIEntityContainer from "./APIEntityContainer";

export default function APIBody(props) {
    if (!props.activeCategory || !props.rootEntity) {
        return (
            <div className="empty-msg">
                <style jsx>{`
                    .empty-msg {
                        color: silver;
                        font-weight: 900;
                        font-size: 3rem;
                        padding: 20px;
                        padding-top: 100px;
                        text-align: center;
                    }
                `}</style>
                Select an entity from sidebar
            </div>
        );
    }
    return <APIEntityContainer entity={props.rootEntity} activeEntityName={props.activeEntityName} />;
}
