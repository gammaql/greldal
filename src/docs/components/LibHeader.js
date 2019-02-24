import logo from "../assets/logo.png";
import styled from "styled-components";

export const LibHeader = () => (
    <Container>
        <Img src={logo} />{" "}
        <HeaderText>
            <PrimaryHeader>GRelDAL</PrimaryHeader>{" "}
            <SecondaryHeader>
                (<strong>G</strong>raphQL ⇋ <strong>Rel</strong>ational DB) <strong>D</strong>ata <strong>A</strong>ccess{" "}
                <strong>L</strong>ayer
            </SecondaryHeader>
        </HeaderText>
    </Container>
);

const Img = styled.img`
    height: 100px;
    width: 100px;
    flex-basis: 100px;
    flex-grow: 0;
    flex-shrink: 0;
`;

const HeaderText = styled.div`
    padding-top: 20px;
    padding-left: 10px;
`;

const PrimaryHeader = styled.h1`
    line-height: 25px;
    margin: 0;
    color: #e535ab;
    font-size: 2.5rem;
    margin-left: 5px;
`;

const SecondaryHeader = styled.h2`
    color: #ddd;
    font-size: 1.8rem;
    text-overflow: initial;
    white-space: nowrap;

    strong {
        color: #acacac;
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #ddd;
    padding-bottom: 2rem;
    max-width: 1000px;
`;
