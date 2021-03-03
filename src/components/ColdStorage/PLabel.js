import React, {Component} from 'react';
import PortfolioValue from "components/GraphTool/YourPortfolio/PortfolioValue";
import styled from 'styled-components/macro';
import {inject, observer} from "mobx-react";
import { STATE_KEYS } from '@/stores/ConvertStore';
import { STORE_KEYS } from '../../stores';

export const PortfolioLabels = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 18px;
    font-size: 33px;
    font-weight: 400;
    position: absolute;
    left: -20px;
    bottom: 90px;
    z-index: 10000;
    > svg {
        cursor: pointer;
        margin-left: 12px;
        margin-bottom: 5px;
        &:hover {
            fill: white;
        }
    }
`;

class PLabel extends Component {
    render() {
        const {
            [STORE_KEYS.ORDERHISTORY]: { lastPortfolioValue },
            [STORE_KEYS.SETTINGSSTORE]: { defaultFiatSymbol, isDefaultCrypto, defaultCryptoSymbol },
            [STORE_KEYS.CONVERTSTORE]: { convertState },
            maxHeight,
        } = this.props;

        return (
            <PortfolioLabels>
                <PortfolioValue
                    maxHeight={maxHeight - 90} // 90: PortfolioLabels -> bottom: 90px
                    lastPortfolioValue={lastPortfolioValue}
                    isDefaultCrypto={isDefaultCrypto}
                    defaultCryptoSymbol={defaultCryptoSymbol}
                    defaultFiatSymbol={defaultFiatSymbol}
                    isLoading={convertState === STATE_KEYS.submitOrder || convertState === STATE_KEYS.orderDone}
                />
            </PortfolioLabels>
        );
    }
}

export default inject(
    STORE_KEYS.ORDERHISTORY,
    STORE_KEYS.SETTINGSSTORE,
    STORE_KEYS.CONVERTSTORE,
)(observer(PLabel));
