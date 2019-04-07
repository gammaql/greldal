import styled from 'styled-components';

const NotificationBanner = styled.div`
    background: #e15506;
    padding: 20px;
    color: #ffd0b6;
    border-radius: 5px;
    text-align: left;

    & + & {
        margin-top: 10px;
    }
`;

export default NotificationBanner;