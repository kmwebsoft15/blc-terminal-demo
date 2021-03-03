import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';
import moment from 'moment';

import DataLoader from '@/components-generic/DataLoader';
import LineChart from '@/lib/chartModules/lineChart';
import { ChartCanvasWrapper } from '../styles';
import { STORE_KEYS } from '@/stores';
import { MAX_PRICES_LENGTH } from '@/stores/PriceChartStore';

class PriceChartLive extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            defaultFiat: undefined,
            c1: undefined,
            c2: undefined,
        };

        this.chartInitialized = false;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const {
            selectedCoin,
            quoteSelectedCoin,
            defaultFiat,
            priceData,
        } = nextProps;

        if (
            prevState.defaultFiat !== defaultFiat ||
            prevState.c1 !== selectedCoin ||
            prevState.c2 !== quoteSelectedCoin ||
            !priceData.length
        ) {
            return {
                loading: true,
                defaultFiat,
                c1: selectedCoin,
                c2: quoteSelectedCoin,
            };
        }

        return {
            loading: false,
        };
    }

    componentDidUpdate(prevProps) {
        const {
            priceData,
            isForexMode,
            coinSymbol,
            forexSymbol,
            forexInput,
            isArbitrageMode,
            isFromColdStorage,
        } = this.props;

        const { loading } = this.state;

        if (loading || forexSymbol !== prevProps.forexSymbol) {
            return this.destroyChart();
        }

        if (this.chartInitialized) {
            return this.updateChart();
        }

        const startTime = moment()
            .subtract(120, 'seconds')
            .valueOf();
        const endTime = moment()
            .add(60, 'seconds')
            .valueOf();
        const data = priceData.map(item => ({ x: item[0], y: item[1] }));

        this.chartInitialized = true;

        this.chart = new LineChart({
            el: this.el,
            data,
            config: {
                liveMode: true,
                startTime,
                endTime,
                maxDataLength: MAX_PRICES_LENGTH,
                coinSymbol,
                isForexMode,
                forexSymbol,
                forexInput,
                isArbitrageMode,
                isFromColdStorage,
            },
        });
    }

    componentWillUnmount() {
        this.destroyChart();
    }

    destroyChart = () => {
        this.chartInitialized = false;
        if (this.chart) {
            this.chart.destroy();
        }
    };

    updateChart = () => {
        const {
            getDefaultPrice,
            price,
        } = this.props;

        const nextItem = { x: new Date().getTime(), y: getDefaultPrice(price) };

        this.chart.lineTo(nextItem);
    };

    render() {
        const { isArbitrageMode } = this.props;
        const { loading } = this.state;

        return (
            <ChartCanvasWrapper isArbitrageMode={isArbitrageMode}>
                <canvas ref={el => (this.el = el)} />
                {loading && <DataLoader width={100} height={100} />}
            </ChartCanvasWrapper>
        );
    }
}

export default compose(
    inject(
        STORE_KEYS.PRICECHARTSTORE,
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.FOREXSTORE,
    ),
    observer,
    withProps(
        (
            {
                [STORE_KEYS.PRICECHARTSTORE]: {
                    priceData,
                    isForexMode,
                    price,
                },
                [STORE_KEYS.YOURACCOUNTSTORE]: {
                    selectedCoin,
                    quoteSelectedCoin,
                },
                [STORE_KEYS.SETTINGSSTORE]: {
                    defaultFiat,
                    defaultFiatSymbol: coinSymbol,
                    getDefaultPrice,
                },
                [STORE_KEYS.FOREXSTORE]: {
                    forexCurrency: forexSymbol,
                    forexInput,
                },
            }
        ) => ({
            priceData,
            isForexMode,
            price,
            selectedCoin,
            quoteSelectedCoin,
            defaultFiat,
            coinSymbol,
            getDefaultPrice,
            forexSymbol,
            forexInput,
        })
    )
)(PriceChartLive);
