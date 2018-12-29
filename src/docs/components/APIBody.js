import APIEntityContainer from "./APIEntityContainer";

export default function APIBody(props) {
    if (!props.activeCategory || !props.rootEntity) {
        return <div>Select an entity from sidebar</div>;
    }
    return <APIEntityContainer entity={props.rootEntity} activeEntityName={props.activeEntityName} />;
}
