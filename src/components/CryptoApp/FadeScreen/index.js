import React from 'react';

import {
    FadeWrapper,
    CircleContainer,
    SMLoadingSpinner,
    InputCircle
} from './Components';

import rejectIcon from '../asset/img/reject.png';
import acceptIcon from '../asset/img/accept.png';
import receiveIcon from '../asset/img/receive.png';

class FadeScreen extends React.Component {
    onClick = () => {
        if(this.props.fadeStatus && (this.props.fadeStatus === 'receiving' || this.props.fadeStatus === 'claiming' || this.props.fadeStatus === 'rejecting')) {
            this.props.onFadeScreenClick();
        }
    }

    render() {
        const {
            fadeStatus
        } = this.props;

        return (
            <FadeWrapper className={fadeStatus} onClick={this.onClick}>
                <CircleContainer>
                    {fadeStatus === 'informing' && (
                        <SMLoadingSpinner>
                            <img src={`${process.env.PUBLIC_URL}/img/gold_certificate.png`} alt="" />
                        </SMLoadingSpinner>
                    )}

                    {fadeStatus === 'receiving' && (
                        <InputCircle borderColor="rgba(0,174,83,0.25)" >
                            <img src={receiveIcon} alt="" />
                        </InputCircle>
                    )}

                    {fadeStatus === 'claiming' && (
                        <InputCircle borderColor="rgba(0,174,83,0.25)" >
                            <img src={acceptIcon} alt="" />
                        </InputCircle>
                    )}

                    {fadeStatus === 'rejecting' && (
                        <InputCircle borderColor="rgba(237,28,36,0.25)" >
                            <img src={rejectIcon} alt="" />
                        </InputCircle>
                    )}
                </CircleContainer>
            </FadeWrapper>
        );
    }
}

export default FadeScreen;