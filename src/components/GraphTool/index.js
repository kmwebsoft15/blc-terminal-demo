import React, { Component } from 'react';
import styled from 'styled-components/macro';
import { AutoSizer } from 'react-virtualized';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { STORE_KEYS } from '@/stores';
import { viewModeKeys } from '@/stores/ViewModeStore';
import { orderFormToggleKeys } from '@/stores/MarketMaker';
import { STATE_KEYS } from '@/stores/ConvertStore';
import { getScreenInfo } from '@/utils';
import PriceChartCanvas from './PriceChartCanvas';
import ForexChart from './ForexChart';
import DonutChart from './DonutChart';
import TradingView from './TradingView';
import RightLowerSectionGrid from '@/grid/RightLowerSectionGrid';
import PortfolioChartCanvas from './PortfolioChartCanvas';

/**
 *  Container styles
 */
const BGraph = styled.div.attrs({ className: 'bgraph' })`
    border-radius: ${props => props.theme.palette.borderRadius};
    border: none;
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    display: flex;
    flex: 1 1;
    background: transparent;

    position: ${props => (props.fullmode ? 'fixed' : 'relative')};
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: ${props => (props.fullmode ? 100000 : 99999)};
`;

const BGraphSection = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    transition: width 0.25s linear;
`;

const BGraphControls = styled.div`
    position: absolute;
    ${props => props.isBorderHidden && 'border: none !important;'}
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: ${props => props.height}px;
    border-right: 1px solid ${props => props.theme.palette.clrBorder};
    border-bottom: ${props => (!props.isCoinSearch ? '1px solid ' + props.theme.palette.clrBorder : '')};
    border-radius: ${props => props.theme.palette.borderRadius};
`;

const {
    isMobileDevice: IS_MOBILE,
    isMobilePortrait: IS_MOBILE_PORTRAIT,
    isMobileLandscape: IS_MOBILE_LANDSCAPE
} = getScreenInfo();

class GraphTool extends Component {
    componentDidMount() {}

    render() {
        const {
            baseSymbol : base,
            quoteSymbol : quote,
            isFullScreen,
            depthChartMode,
            isDGLoaded,
            tradingViewMode,
            selectedCoin,
            convertState,
            updateExchange,
            isLoggedIn,
            showOrderFormWith,
            graphSwitchMode,
            rightLowerDivision,
            tradeColStatus,
            sidebarStatus,
            isFirstLoad,
            setIsFirstLoad,
            viewMode,
            exchanges,
        } = this.props;
        const baseSymbol = (base || '').replace('F:', '');
        const quoteSymbol = (quote || '').replace('F:', '');
        let isTradingView = false;
        let isPriceChart = convertState === STATE_KEYS.coinSearch;
        const hasExchanges = Object.keys(exchanges).length > 1 && Object.keys(exchanges).filter(name => exchanges[name].active).length > 0;
        if (hasExchanges || tradingViewMode) {
            isTradingView = true;
        } else {
            isTradingView = false;
        }

        let isDonutChart = (!isPriceChart && !isTradingView) || graphSwitchMode;
        const isLowerSectionOpened = depthChartMode;

        let isBestRateTradingView = false;

        if (convertState === STATE_KEYS.coinSearch && isTradingView) {
            isPriceChart = false;
            isBestRateTradingView = true;
        }

        // show depthChart & advanced Orderform by default when page is loaded
        if (isDGLoaded && (convertState === STATE_KEYS.coinSearch) && isFirstLoad) {
            if (!IS_MOBILE_PORTRAIT) {
                showOrderFormWith(orderFormToggleKeys.onToggleKey);
            }
            updateExchange(0, '');
            setIsFirstLoad(false);
        }
        if (IS_MOBILE_LANDSCAPE) {
            showOrderFormWith(orderFormToggleKeys.onToggleKey);
        }
        const isBoderHidden = tradeColStatus === 'closed' || sidebarStatus === 'closed';

        return (
            <AutoSizer>
                {({ width, height }) => {
                    if (isFullScreen) {
                        width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                        height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                    }
                    const chartHeight = convertState === STATE_KEYS.coinSearch ? height - 15 : height;

                    let lowerSectionHeight = 275;
                    if (IS_MOBILE && rightLowerDivision) {
                        lowerSectionHeight = Math.round(height / 3 * rightLowerDivision) + (rightLowerDivision < 3 ? 12 : 0);
                    }
                    const hasMargin = rightLowerDivision === (1 || 2);
                    const isForexMode = viewMode === viewModeKeys.forexModeKey;
                    return (
                        <BGraph width={width} height={height} fullmode={isFullScreen} id="graph-chart-parent">
                            <BGraphSection>
                                <BGraphControls
                                    height={isLowerSectionOpened ? (height - lowerSectionHeight) : height}
                                    isCoinSearch={convertState === STATE_KEYS.coinSearch}
                                    isBorderHidden={isBoderHidden}
                                >
                                    {isPriceChart && !isBestRateTradingView && (
                                        isForexMode ? (
                                            <ForexChart
                                                isLowerSectionOpened={isLowerSectionOpened}
                                                isBorderHidden={isBoderHidden}
                                            />
                                        ) : (
                                            <PriceChartCanvas
                                                isLowerSectionOpened={isLowerSectionOpened}
                                                isBorderHidden={isBoderHidden}
                                            />
                                        )
                                    )}
                                    {isTradingView && (
                                        <TradingView
                                            width={width}
                                            height={isLowerSectionOpened ? chartHeight - lowerSectionHeight : height}
                                            convertState={convertState}
                                            coinPair={baseSymbol ? `${baseSymbol}-${quoteSymbol}` : 'BTC-USDT'}
                                        />
                                    )}

                                    {isDonutChart && (
                                        <DonutChart
                                            width={width}
                                            height={isLowerSectionOpened ? chartHeight - lowerSectionHeight : height}
                                            isLoggedIn={isLoggedIn}
                                            isExchangeCellsV2
                                            donutChatId="donut-chart"
                                        />
                                    )}
                                </BGraphControls>

                                {isLowerSectionOpened && (
                                    <RightLowerSectionGrid
                                        height={lowerSectionHeight - (rightLowerDivision < 3 ? 12 : 0)}
                                        hasMargin={hasMargin}
                                    />
                                )}
                            </BGraphSection>
                        </BGraph>
                    );
                }}
            </AutoSizer>
        );
    }
}

export default compose(
    inject(
        STORE_KEYS.INSTRUMENTS,
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.CONVERTSTORE,
        STORE_KEYS.LOWESTEXCHANGESTORE,
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.TELEGRAMSTORE,
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.MARKETMAKER,
        STORE_KEYS.ORDERHISTORY,
        STORE_KEYS.ORDERBOOK,
        STORE_KEYS.EXCHANGESSTORE,
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.ORDERBOOK]: { isDGLoaded, base: baseSymbol, quote: quoteSymbol },
            [STORE_KEYS.VIEWMODESTORE]: {
                isFullScreen,
                depthChartMode,
                tradingViewMode,
                isFirstLoad,
                setIsFirstLoad,
                graphSwitchMode,
                rightLowerDivision,
                viewMode,
            },
            [STORE_KEYS.CONVERTSTORE]: { convertState },
            [STORE_KEYS.LOWESTEXCHANGESTORE]: { updateExchange, exchangeIndex },
            [STORE_KEYS.TELEGRAMSTORE]: { isLoggedIn },
            [STORE_KEYS.YOURACCOUNTSTORE]: { selectedCoin },
            [STORE_KEYS.MARKETMAKER]: { showOrderFormWith },
            [STORE_KEYS.SETTINGSSTORE]: { tradeColStatus, sidebarStatus },
            [STORE_KEYS.EXCHANGESSTORE]: { exchanges },
        }) => {
            return {
                baseSymbol,
                quoteSymbol,
                isFullScreen,
                depthChartMode,
                isDGLoaded,
                tradingViewMode,
                isFirstLoad,
                setIsFirstLoad,
                graphSwitchMode,
                rightLowerDivision,
                viewMode,
                convertState,
                updateExchange,
                exchangeIndex,
                isLoggedIn,
                selectedCoin,
                showOrderFormWith,
                tradeColStatus,
                sidebarStatus,
                exchanges,
            };
        }
    )
)(GraphTool);
