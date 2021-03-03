import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styled, { keyframes } from 'styled-components/macro';
import { STORE_KEYS } from '../../stores';

const Wrapper = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border: 3px solid ${props => props.theme.palette.clrRed};
    z-index: 1000000;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Label = styled.div`
    color: ${props => props.theme.palette.clrRed};
    padding: 20px;
    border: 1px solid ${props => props.theme.palette.clrRed};
    border-radius: 7px;
    font-size: 30px;
    font-weight: 600;
`;

class ConnectionLost extends Component {
    componentDidMount() {

    }

    render() {
        const {
            [STORE_KEYS.NETWORKSTORE]: { isPrivateConnected, isPublicConnected },
            [STORE_KEYS.TELEGRAMSTORE]: { isLoggedIn },
            isMobileDevice,
        } = this.props;
        const isConnected = isLoggedIn ? (isPrivateConnected && isPublicConnected) : isPublicConnected;
        const isVisible = !(isMobileDevice || isConnected);

        if (!isConnected) {
            let err = {
                isPrivateConnected,
                isPublicConnected,
                isLoggedIn,
                date: new Date(),
            };
            console.log('connection issue', err);
        }

        return (
            isVisible && <Wrapper>
                <Label>Connection Lost...</Label>
            </Wrapper>
        );
    }
}

export default inject(
    STORE_KEYS.NETWORKSTORE,
    STORE_KEYS.TELEGRAMSTORE,
)(observer(ConnectionLost));
