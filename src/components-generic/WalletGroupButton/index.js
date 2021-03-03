import React from 'react';

import {
    WalletGroupButtonWrapper,
    WalletButtonWrapper,
    WalletButton
} from './ChildComponents';
import { getScreenInfo } from '@/utils';

const WalletGroupButton = props => {
    let sellWidth = 0;
    let buyWidth = 0;
    let whiteWidth = 0;
    let isBuyAnimated = false;
    let isSellAnimated = false;
    let isWhiteAnimated = false;
    let whiteDirection = props.isBuy ? 'Right' : 'Left';
    let start = 0;
    if (!props.isWhite) {
        if (props.isBuy && !props.isLeft) {
            buyWidth = 100;
        }

        if (!props.isBuy && props.isLeft) {
            sellWidth = 100;
        }

        if (props.animatable === 3) {
            if (props.isBuy && props.isLeft) {
                buyWidth = 100;
                isBuyAnimated = true;
            }

            if (!props.isBuy && !props.isLeft) {
                sellWidth = 100;
                isSellAnimated = true;
            }
        }

        if (props.animatable === 4) {
            isWhiteAnimated = true;
            whiteWidth = 100;

            if (!props.isBuy && props.isLeft) {
                start = 0;
            }

            if (props.isBuy && !props.isLeft) {
                start = 50;
            }

            if (props.isBuy && props.isLeft) {
                buyWidth = 100;
                start = 80;
            }

            if (!props.isBuy && !props.isLeft) {
                sellWidth = 100;
                start = 30;
            }
        }
    }

    if (props.isWhite) {
        whiteWidth = 100;
    }
    const {
        isMobileLandscape,
    } = getScreenInfo();

    return (
        <WalletGroupButtonWrapper
            width={props.groupWidth}
            className="orderhistory__wallet-btn"
            isMobileLandscape={isMobileLandscape}
        >
            <WalletButtonWrapper
                direction="Left"
                width="100"
                isOverFlow={props.isOverFlow}
                isBuy={props.isBuy}
                isHistory={props.isHistory}
            >
                <WalletButton
                    type="inactive"
                    direction="Left" {...props}
                    isMobileLandscape={isMobileLandscape}
                >
                    {props.children}
                </WalletButton>
            </WalletButtonWrapper>
            <WalletButtonWrapper
                direction="Left"
                width={sellWidth}
                className={isSellAnimated && 'progress'}
                isBuy={props.isBuy}
                isOverFlow={props.isOverFlow}
                isHistory={props.isHistory}
            >
                <WalletButton type="sell" direction="Left" {...props} isMobileLandscape={isMobileLandscape}>
                    {props.children}
                </WalletButton>
            </WalletButtonWrapper>
            <WalletButtonWrapper
                direction="Right"
                width={buyWidth}
                className={isBuyAnimated && 'progress'}
                isBuy={props.isBuy}
                isOverFlow={props.isOverFlow}
                isHistory={props.isHistory}
            >
                <WalletButton type="buy" direction="Right" {...props} isMobileLandscape={isMobileLandscape}>
                    {props.children}
                </WalletButton>
            </WalletButtonWrapper>
            {!props.isShouldOneAnim && (
                <WalletButtonWrapper
                    direction={whiteDirection}
                    width={whiteWidth}
                    isBuy={props.isBuy}
                    className={isWhiteAnimated && 'fill'}
                    start={start}
                    isOverFlow={props.isOverFlow}
                    isHistory={props.isHistory}
                >
                    <WalletButton type="active" direction={whiteDirection} {...props} isMobileLandscape={isMobileLandscape}>
                        {props.children}
                    </WalletButton>
                </WalletButtonWrapper>
            )}
        </WalletGroupButtonWrapper>
    );
};

export default WalletGroupButton;