import APIEntityContainer from "./APIEntityContainer";
import styled from "styled-components";

export const EmptyMsgContainer = styled.div`
    color: silver;
    font-weight: 900;
    font-size: 3rem;
    padding: 20px;
    padding-top: 100px;
    text-align: center;
    line-height: 4rem;
`;

export default function APIBody(props) {
    if (!props.activeCategory || !props.rootEntity) {
        return <EmptyMsgContainer>Select an entity from sidebar</EmptyMsgContainer>;
    }
    return <APIEntityContainer entity={props.rootEntity} activeEntityName={props.activeEntityName} />;
}
