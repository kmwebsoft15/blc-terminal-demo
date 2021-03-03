import React, { Component } from 'react';
import styled from 'styled-components/macro';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';
import { AutoSizer } from 'react-virtualized';

import BillsInner from '@/components/Modals/BillsModal/BillsInner';
import ActiveStatusCircle from '@/components/ArbitrageHistory/ActiveStatusCircle';
import PriceChartCanvas from '@/components/GraphTool/PriceChartCanvas';
import PortfolioChartCanvas from '@/components/GraphTool/PortfolioChartCanvas';

import { toFixedWithoutRounding, getScreenInfo } from '@/utils';
import { STORE_KEYS } from '@/stores';

const Wrapper = styled.div`
    position: absolute;
    top: ${props => props.top || '0'}px;
    left: 0;
    width: ${props => props.width ? `${props.width}px` : '100%'};
    height: ${props => props.height ? `${props.height}px` : '100%'};
`;

class ColdStorage extends Component {
    componentDidMount() {
        this.props.setSymbol('BTC');
        this.props.listUserBillsRequest();
    }

    render() {
        const {
            symbol,
            isReceivedUserBills,
            listUserBills,
            listUserBillsRequest,
            PortfolioData,
        } = this.props;

        let position = 0;
        let positionOfUsdt = 0;
        let priceOfBTC = 1;
        for (let i = 0; i < PortfolioData.length; i++) {
            if (PortfolioData[i] && PortfolioData[i].Coin === symbol) {
                position = PortfolioData[i].Position;
            }
            // arb exception
            if (PortfolioData[i] && PortfolioData[i].Coin === 'USDT') {
                positionOfUsdt = PortfolioData[i].Position;
            }
            if (PortfolioData[i] && PortfolioData[i].Coin === 'BTC') {
                priceOfBTC = PortfolioData[i].Price || 1;
            }
        }

        if (position < 0.00001) {
            if (this.position !== undefined) {
                position = this.position;
            }
            if (symbol === 'BTC') {
                position = Number(positionOfUsdt) / Number(priceOfBTC);
                this.position = position;
            }
        } else if (this.position !== position) {
            if (this.position !== undefined) {
                listUserBillsRequest();
            }

            this.position = position;
        }

        if (position >= 0.00001 && isReceivedUserBills && listUserBills.length === 0) {
            listUserBillsRequest();
        }

        let centerPos = 9;
        const count = Math.log10(position);
        if (count > 5) {
            centerPos = count + 1;
        }

        // 16 total amount of columns in cold storage table (BillsInner)
        const newPosition = toFixedWithoutRounding(position.toFixed(20), 16 - centerPos);
        const balance = parseFloat(newPosition);
        const newDeno = centerPos - 1;

        return (
            <AutoSizer>
                {({ width, height }) => {

                    let lowerSectionHeight = 263;
                    // Todo: this state shoulb be in store, so app can share it.
                    if (getScreenInfo().isMobileDevice) {
                        lowerSectionHeight = Math.round(height / 3);
                    }
                    return (
                        <Wrapper width={width} height={height}>
                            <BillsInner
                                isFromMarketModal
                                width={width}
                                height={height -lowerSectionHeight}
                                padding={16}
                                isDeposit={false}
                                symbol={symbol}
                                balance={balance}
                                newDeno={newDeno}
                                isReceivedUserBills={isReceivedUserBills}
                                listUserBills={listUserBills}
                            />

                            <Wrapper top={height - lowerSectionHeight} height={lowerSectionHeight}>
                                <PortfolioChartCanvas />
                                <PriceChartCanvas isArbitrageMode isFromColdStorage />
                                <ActiveStatusCircle isGraph />
                            </Wrapper>
                        </Wrapper>
                    )
                }
                }
            </AutoSizer>
        );
    }
}

const withStore = compose(
    inject(
        STORE_KEYS.BILLCHIPSTORE,
        STORE_KEYS.YOURACCOUNTSTORE,
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.BILLCHIPSTORE]: {
                symbol,
                setSymbol,
                isReceivedUserBills,
                listUserBills,
                listUserBillsRequest,
            },
            [STORE_KEYS.YOURACCOUNTSTORE]: {
                PortfolioData,
            },
        }) => ({
            symbol,
            setSymbol,
            isReceivedUserBills,
            listUserBills,
            listUserBillsRequest,
            PortfolioData,
        })
    )
);

export default withStore(ColdStorage);