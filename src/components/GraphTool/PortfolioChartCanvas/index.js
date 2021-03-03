import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';

import LineChart from '@/lib/chartModules/lineChart';
import { STORE_KEYS } from '@/stores';
// import { STATE_KEYS } from '@/stores/ConvertStore';
// import PortfolioValue from '@/components/GraphTool/YourPortfolio/PortfolioValue';
// import { PieChartIcon } from '@/components/OrderHistory/OrderHistoryTable/Components';
// import TimeFilters from '../TimeFilters';
import { FILTERS } from '@/stores/HistoricalPricesStore';

import {
    ChartWrapper,
    // PortfolioLabels,
    // ChartInfoWrapper,
    // GraphControlWrapper
} from './styles';

const MAX_PRICES_LENGTH = 600;
const DUMMY_LINE_TIMEOUT = 2000;
const GAP_TO_THE_RIGHT_EDGE = 1.39;

class PortfolioChartCanvas extends Component {
    defaultFiat = undefined;
    defaultCrypto = undefined;
    selectedCoin = undefined;
    chartInitialized = false;
    selectedTimeFilter = undefined;

    drawDummyLineTimer = undefined;
    nextPriceTimer = undefined;
    dummyLineDrawnAt = undefined;
    prevDataLength = 0;
    forceShowPieChart = false;

    state = {
        selectedTimeFilter: undefined,
    };

    componentDidMount() {
        this.handleNewData();
    }

    componentDidUpdate() {
        this.handleNewData();
    }

    componentWillUnmount() {
        this.destroyChart();
    }

    handleFocus = () => {
        if (this.forceShowPieChart) return;
        const { [STORE_KEYS.VIEWMODESTORE]: viewModeStore } = this.props;

        viewModeStore.setGraphSwitchMode(true);
    };

    handleLeave = () => {
        if (this.forceShowPieChart) return;
        const {[STORE_KEYS.VIEWMODESTORE]: viewModeStore} = this.props;

        viewModeStore.setGraphSwitchMode(false);
    };

    onClickPieChartIcon = () => {
        const { [STORE_KEYS.VIEWMODESTORE]: { setGraphSwitchMode } } = this.props;
        setGraphSwitchMode(!this.forceShowPieChart);
        this.forceShowPieChart = !this.forceShowPieChart;
    };

    getTimeEdges = () => {
        const {
            [STORE_KEYS.ORDERHISTORY]: { PortfolioGraphData },
        } = this.props;

        const { selectedTimeFilter } = this.state;

        const now = Date.now();
        let startTime = now;
        let endTime = moment()
            .add(180, 'seconds')
            .valueOf();

        if (selectedTimeFilter) {
            startTime = now - FILTERS[selectedTimeFilter].ms;
            endTime = now;
        } else if (PortfolioGraphData.length) {
            startTime = Math.max(
                PortfolioGraphData[0].x,
                moment()
                    .subtract(14, 'minutes')
                    .valueOf()
            );
            endTime = Math.max(startTime + (now - startTime) * GAP_TO_THE_RIGHT_EDGE, endTime);
        }

        return { startTime, endTime };
    };

    handleNewData = () => {
        const {
            [STORE_KEYS.ORDERHISTORY]: { PortfolioGraphData },
            [STORE_KEYS.SETTINGSSTORE]: { defaultFiatSymbol, isDefaultCrypto },
        } = this.props;

        const { selectedTimeFilter } = this.state;

        if (this.chartInitialized) {
            this.updateChart();
        } else {
            this.chartInitialized = true;
            let data = PortfolioGraphData.slice();

            const { startTime, endTime } = this.getTimeEdges();

            if (selectedTimeFilter) {
                if (data.length) {
                    if (data[0].x > startTime) {
                        data.unshift({ x: startTime, y: data[0].y });
                    }
                    if (data[data.length - 1].x < endTime) {
                        data.push({ x: endTime, y: data[data.length - 1].y });
                    }
                } else {
                    data = [{ x: startTime, y: 0 }, { x: endTime, y: 0 }];
                }
            }

            const coinSymbol = isDefaultCrypto ? 'B' : defaultFiatSymbol;

            this.chart = new LineChart({
                el: this.el,
                data,
                config: {
                    liveMode: !selectedTimeFilter,
                    startTime,
                    endTime,
                    // this is added to make grid lines be aligned with rows in the left block
                    maxTicksLimit: 9,
                    yAxesOffset: true,
                    steppedLine: true,
                    removeRecurringPricesAtTheEnd: true,
                    maxDataLength: MAX_PRICES_LENGTH,
                    coinSymbol,
                    isPortfolio: true,
                },
            });

            if (!selectedTimeFilter) {
                // make the chart dynamic
                this.drawDummyLine();
            }
        }

        this.prevDataLength = PortfolioGraphData.length;
    };

    handleChartState = () => {
        const {
            [STORE_KEYS.YOURACCOUNTSTORE]: { selectedCoin },
            [STORE_KEYS.SETTINGSSTORE]: { defaultFiat, defaultCrypto },
            [STORE_KEYS.ORDERHISTORY]: { PortfolioGraphData },
        } = this.props;

        const { selectedTimeFilter } = this.state;

        if (
            // if any coin changed
            this.defaultFiat !== defaultFiat ||
            this.defaultCrypto !== defaultCrypto ||
            this.selectedCoin !== selectedCoin ||
            // if time filter changed
            this.selectedTimeFilter !== selectedTimeFilter ||
            // if new data comes
            (this.prevDataLength && !PortfolioGraphData.length) ||
            (!this.prevDataLength && PortfolioGraphData.length)
        ) {
            // destroy and save the state
            this.destroyChart();
            this.defaultFiat = defaultFiat;
            this.selectedCoin = selectedCoin;
            this.defaultCrypto = defaultCrypto;
            this.selectedTimeFilter = selectedTimeFilter;
            this.prevDataLength = PortfolioGraphData.length;
        }
    };

    destroyChart = () => {
        this.chartInitialized = false;
        clearTimeout(this.drawDummyLineTimer);
        clearTimeout(this.nextPriceTimer);
        if (this.chart) {
            this.chart.destroy();
        }
    };

    updateChart = forcedItem => {
        const { selectedTimeFilter } = this.state;
        if (selectedTimeFilter) {
            return;
        }

        const timeSinceLastDraw = Date.now() - (this.dummyLineDrawnAt || 0);
        let timeoutBeforeNextDraw = Math.max(DUMMY_LINE_TIMEOUT - timeSinceLastDraw, 0);

        let nextItem = forcedItem;
        if (!forcedItem) {
            const {
                [STORE_KEYS.ORDERHISTORY]: { PortfolioGraphData },
            } = this.props;
            if (!PortfolioGraphData.length) {
                return;
            }

            nextItem = PortfolioGraphData[PortfolioGraphData.length - 1];

            clearTimeout(this.drawDummyLineTimer);
            this.drawDummyLineTimer = setTimeout(this.drawDummyLine, DUMMY_LINE_TIMEOUT);
        }

        this.nextPriceTimer = setTimeout(() => {
            this.chart.lineTo(nextItem);
        }, timeoutBeforeNextDraw);
    };

    drawDummyLine = () => {
        const {
            [STORE_KEYS.ORDERHISTORY]: { PortfolioGraphData, lastPortfolioValue },
        } = this.props;

        const lastPrice = PortfolioGraphData.length ? Number(PortfolioGraphData[PortfolioGraphData.length - 1].y) : lastPortfolioValue;
        const dateNow = Date.now();

        this.updateChart({ x: dateNow, y: lastPrice });

        this.dummyLineDrawnAt = dateNow;
        this.drawDummyLineTimer = setTimeout(this.drawDummyLine, DUMMY_LINE_TIMEOUT);
    };

    onChangeTimeFilter = selectedTimeFilter => {
        this.setState({
            selectedTimeFilter,
        });
    };

    toggleBillPopup = () => {
        const {
            [STORE_KEYS.SETTINGSSTORE]: { isDefaultCrypto, defaultFiat, defaultCryptoSymbol },
            [STORE_KEYS.BILLSMODALSTORE]: { showBillChips },
        } = this.props;
        const coin = isDefaultCrypto ? defaultCryptoSymbol : (defaultFiat === 'USD' ? 'USDT' : defaultFiat);
        showBillChips(coin);
    };

    render() {
        const {
            [STORE_KEYS.ORDERHISTORY]: { PortfolioGraphData, lastPortfolioValue },
            [STORE_KEYS.SETTINGSSTORE]: { defaultFiatSymbol, isDefaultCrypto, defaultCryptoSymbol },
            [STORE_KEYS.CONVERTSTORE]: { convertState },
            isLowerSectionOpened,
            isBorderHidden,
            noBorder,
        } = this.props;
        const { selectedTimeFilter } = this.state;
        this.handleChartState();
        const minTime = PortfolioGraphData.length && PortfolioGraphData[0].x;

        return (
            <ChartWrapper isLowerSectionOpened={isLowerSectionOpened} isBorderHidden={isBorderHidden} noBorder={noBorder}>
                <canvas ref={el => (this.el = el)} />
                {/*
                <ChartInfoWrapper>
                    <PortfolioLabels>
                        <PortfolioValue
                            lastPortfolioValue={lastPortfolioValue}
                            isDefaultCrypto={isDefaultCrypto}
                            defaultCryptoSymbol={defaultCryptoSymbol}
                            defaultFiatSymbol={defaultFiatSymbol}
                            onClickDeposit={this.toggleBillPopup}
                            onClickWithdraw={this.toggleBillPopup}
                            isLoading={convertState === STATE_KEYS.submitOrder || convertState === STATE_KEYS.orderDone}
                        />
                    </PortfolioLabels>
                    <GraphControlWrapper>
                        <PieChartIcon onClick={this.onClickPieChartIcon} onMouseEnter={this.handleFocus} onMouseLeave={this.handleLeave}/>
                        <TimeFilters onChange={this.onChangeTimeFilter} selected={selectedTimeFilter} minTime={minTime} />
                    </GraphControlWrapper>
                </ChartInfoWrapper>
                */}
            </ChartWrapper>
        );
    }
}

export default inject(
    STORE_KEYS.YOURACCOUNTSTORE,
    STORE_KEYS.SETTINGSSTORE,
    STORE_KEYS.ORDERHISTORY,
    STORE_KEYS.VIEWMODESTORE,
    STORE_KEYS.BILLSMODALSTORE,
    STORE_KEYS.CONVERTSTORE,
)(observer(PortfolioChartCanvas));
