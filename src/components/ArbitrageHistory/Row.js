import React, {Component} from 'react';

import WalletGroupButton from '@/components-generic/WalletGroupButton';
import {
    RowWrapper,
    InfoHistory,
    InfoSendSection,
    InfoGetSection,
    InfoArrow,
    ArrowIconAnim,
    WalletSideIcon,
    MaskAnimation,
} from './Components';
import CoinIcon from '../CoinPairSearchV2/ExchDropdownRV/CoinIcon/index';
import {commafy} from "utils";

class Row extends Component {
    render () {
        const {
            isBuy,
            isWhite,
            leftValue,
            rightValue,
            animatable,
            userDefaultFiat,
            height,
        } = this.props;

        return (
            <RowWrapper isBuy={isBuy} isWhite={isWhite} animatable={animatable} height={height}>
                <InfoHistory>
                    <InfoSendSection>
                        <WalletGroupButton
                            isLeft
                            isBuy={isBuy}
                            isWhite={isWhite}
                            animatable={animatable}
                            isHistory
                        >
                            <CoinIcon value="BTC" defaultFiat="BTC" />
                            <span>
                                {leftValue > 1 ? commafy(leftValue.toPrecision(8)) : leftValue.toFixed(7)}
                            </span>
                            <WalletSideIcon />
                        </WalletGroupButton>
                    </InfoSendSection>

                    <InfoArrow isBuy={isBuy}>
                        <ArrowIconAnim
                            isBuy={isBuy}
                            isWhite={isWhite}
                            animatable={animatable === 4}
                        />
                    </InfoArrow>

                    <InfoGetSection>
                        <WalletGroupButton
                            isBuy={isBuy}
                            isWhite={isWhite}
                            animatable={animatable}
                            isHistory
                        >
                            <span>
                                {commafy(rightValue.toPrecision(8))}
                            </span>
                            <CoinIcon value="USDT" defaultFiat={userDefaultFiat ? userDefaultFiat: "USD"} />
                            <WalletSideIcon />
                        </WalletGroupButton>
                    </InfoGetSection>
                </InfoHistory>
                <MaskAnimation
                    isBuy={isBuy}
                    animatable={animatable === 1 && !isWhite}
                />
            </RowWrapper>
        );
    }
}

export default Row;
