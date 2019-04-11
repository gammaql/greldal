import logo from "../assets/logo.png";
import styled from "styled-components";

export const LibHeader = () => (
    <Container>
        <ImgContainer>
            <img src={logo} style={{ height: "100px", width: "100px" }} />{" "}
        </ImgContainer>
        <HeaderText>
            <PrimaryHeader>GRelDAL</PrimaryHeader>{" "}
            <SecondaryHeader>
                <SecondaryHeader.Section>
                    (<strong>G</strong>raphQL ⇋ <strong>Rel</strong>ational DB)
                </SecondaryHeader.Section>
                <SecondaryHeader.Section>
                    {" "}
                    <strong>D</strong>ata <strong>A</strong>
                    ccess <strong>L</strong>ayer
                </SecondaryHeader.Section>
            </SecondaryHeader>
        </HeaderText>
    </Container>
);

const ImgContainer = styled.div`
    text-align: center;
    @media only screen and (min-width: 1000px) {
        flex-basis: 100px;
        flex-grow: 0;
        flex-shrink: 0;
    }
`;

const HeaderText = styled.div`
    padding-top: 20px;
    @media only screen and (min-width: 1000px) {
        padding-left: 10px;
    }
`;

const PrimaryHeader = styled.h1`
    line-height: 25px;
    color: #8dd35f;
    font-size: 2.5rem;
    margin: 0 5px 0 0 !important;
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

SecondaryHeader.Section = styled.span`
    display: inline;
    @media only screen and (max-width: 1000px) {
        display: block;
        text-align: center;
        line-height: 2.5rem;
    }
`;

const Container = styled.div`
    @media only screen and (max-width: 1000px) {
        flex-direction: column;
        text-align: center;
    }
    @media only screen and (min-width: 1000px) {
        flex-direction: row;
    }
    display: flex;
    border-bottom: 1px solid #ddd;
    padding-bottom: 2rem;
    max-width: max(100%, 1000px);
`;
