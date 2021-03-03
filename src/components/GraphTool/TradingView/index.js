import React from 'react';
import { inject, observer } from 'mobx-react';
import styled, { keyframes } from 'styled-components/macro';
import { compose } from 'recompose';
import { withSafeTimeout } from '@hocs/safe-timers';
import { STORE_KEYS } from '@/stores';
import { TV_CONFIG } from '@/config/constants';
// import ChartAPI, { apiDataLoadObservable } from './ChartApi';
import DataFeed, { apiDataLoadObservable } from './Api'
import { customIndicatorsGetter } from './utils';
// import TradingView from '@/lib/chartModules/tradingView/charting_library/charting_library.min'
import DataLoader from '@/components-generic/DataLoader';
import TradingViewPriceLabel from './TradingViewPriceLabel';
import { getDecimalPlaces } from '@/utils';
import PriceChartToolbar from '../PriceChartCanvas/PriceChartToolbar';

const Wrapper = styled.div.attrs({ className: 'wrapper-tradingview' })`
    // display: grid;
    // grid-template-areas:
    //     'tradingview'
    //     'rightlowersection';
    // grid-template-columns: 100%;
    // grid-template-rows: calc(100% - 275px) 263px; // 263+12=275
    // grid-gap: 12px;

    position: relative;
    width: ${props => props.width}px;
    height: 100%;
    display: flex;
    flex-direction: column;
    pointer-events: ${props => props.isCoinListOpen ? 'none' : 'all'};
    z-index: 2;
    .settings-tooltip {
        position: absolute;
        z-index: 10;
        width: 38px;
        height: 38px;
        top: 12px;
        left: 12px;
        
        .settings-icon {
            width: 38px;
            height: 38px;
        }
    }
`;
const TooltipContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const DataLoaderWrapper = styled.div`
    position: absolute;
    width: ${props => props.width}px;
    height: 100%;
`;

const ChartContainer = styled.div`
    position: relative;
    // grid-area: tradingview;
    width: ${props => props.width}px;
    flex: 1;
    border-top-left-radius: ${props => props.theme.palette.borderRadius};
    border: 1px solid ${props => props.theme.palette.clrBorder};
    // border-width: 1px 0 0 1px;
`;

const ApTradingViewChart = styled.div.attrs({ className: 'apTradingViewChart' })`
    position: relative;
    width: ${props => props.width ? `${props.width}px` : '100%'};
    height: 100%;
    // height: calc(100% - 15px);

    iframe {
        height: 100% !important;
    }
`;

class BCTChart extends React.Component {
    symbols = [];

    disableAnimation = true;
    isSubscribed = false;

    state = {
        isLoading: false,
    };

    componentDidMount() {
        const {
            [STORE_KEYS.LOWESTEXCHANGESTORE]: { lowestExchange },
            [STORE_KEYS.EXCHANGESSTORE]: { selectedExchange, exchanges },
            coinPair,
        } = this.props;

        // let exchange = !lowestExchange ? selectedExchange.name : lowestExchange;
        // if (!exchange || exchange === 'Global') exchange = 'ZB';
        const symbols = Object.keys(exchanges).filter(name => exchanges[name].active).map(exchange => `${exchange === 'Global' ? 'CCCAGG': exchange}:${coinPair}`);
        this.symbols = symbols;

        this.createChart(this.symbols, TV_CONFIG);

        if (!this.isSubscribed) {
            apiDataLoadObservable
                .subscribe({
                    next: (apiDataEvent) => {
                        if (this.isSubscribed && apiDataEvent) {
                            if (apiDataEvent.apiLoaded) {
                                this.setState({
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    isLoading: true,
                                });
                            }
                        }
                    },
                });
            this.isSubscribed = true;
        }
    }

    componentDidUpdate() {
        try {
            const {
                [STORE_KEYS.YOURACCOUNTSTORE]: {
                    baseCoinPrice, quoteCoinPrice,
                },
                [STORE_KEYS.LOWESTEXCHANGESTORE]: { lowestExchange },
                [STORE_KEYS.EXCHANGESSTORE]: { selectedExchange, exchanges },
                coinPair,
            } = this.props;

            const symbols = Object.keys(exchanges).filter(name => exchanges[name].active).map(exchange => `${exchange === 'Global' ? 'CCCAGG': exchange}:${coinPair}`);

            // if (this.tv && this.tv._ready && this.tv._options) {

            //     const currentDecimalPlaces = this.tv._options.overrides['mainSeriesProperties.minTick'];
            //     const incomingDecimalPlaces = (baseCoinPrice > 0 && quoteCoinPrice > 0) ? getDecimalPlaces(baseCoinPrice / quoteCoinPrice).toString() : currentDecimalPlaces;

            //     if (currentDecimalPlaces !== incomingDecimalPlaces) {
            //         let tvConfig = TV_CONFIG;
            //         // tvConfig.overrides['mainSeriesProperties.minTick'] = incomingDecimalPlaces;
            //         // // this.tv.applyOverrides(tvConfig); // this function sometimes doesn't work.
            //         this.tv.remove();
            //         this.createChart(symbols, tvConfig);
            //         this.symbols = symbols;
            //     }
            // }

            if (this.symbols.length !== symbols.length) {
                if (!this.tv) {
                    this.createChart(symbols, TV_CONFIG);
                } else {
                    this.tv.chart().removeAllStudies();
                    symbols.map((symbol, idx)  => {
                        if (idx !== 0) {
                            this.tv.chart().createStudy('Overlay', true, false, [symbol], null, {
                                style: 2,
                                'lineStyle.color': `#${Math.floor(Math.random()*16777215).toString(16)}`,
                                width: 2
                            });
                        }
                    })
                }
                this.symbols = symbols;
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    componentWillUnmount() {
        if (this.tv && !this.tv.remove) {
            console.error(new Error('Method undefined this.tv.removed'));
            return;
        }

        try {
            this.tv.remove();
        } catch (err) {
            console.log(err.message);
        }
        this.isSubscribed = false;
    }

    onFullScreen = () => {
        this.props[STORE_KEYS.VIEWMODESTORE].toggleFullmode();
    };

    createChart = (symbols, overrides) => {
        try {
            const chartOptions = {
                symbol: symbols[0],
                interval: '1',
                container_id: 'tv_chart_container',
                datafeed: DataFeed,
                library_path: 'trading_view/',
                charts_storage_url: 'https://saveload.tradingview.com',
                charts_storage_api_version: '1.1',
                client_id: 'tradingview.com',
                user_id: 'public_user_id',
                fullscreen: false,
                autosize: true,
                debug: true,
                custom_indicators_getter: customIndicatorsGetter,
                ...overrides
            }

            this.tv = new TradingView.widget(chartOptions);
            
            this.tv.onChartReady(() => {
                symbols.map((symbol, idx) => {
                    if (idx !== 0) {
                        this.tv.chart().createStudy('Overlay', true, false, [symbol], null, {
                            style: 2,
                            'lineStyle.color': `#${Math.floor(Math.random()*16777215).toString(16)}`,
                            width: 2
                        });
                    }
                })
            })
        } catch (err) {
            console.log(err);
        }
    };

    render() {
        const {
            width, height,
            [STORE_KEYS.TRADINGVIEWSTORE]: tradingViewStore,
            [STORE_KEYS.LOWESTEXCHANGESTORE]: { lowestExchange },
            [STORE_KEYS.EXCHANGESSTORE]: { selectedExchange, exchanges },
        } = this.props;
        const {
            isLoading,
        } = this.state;
        const exchange = (!lowestExchange) ? selectedExchange.name : lowestExchange;

        const {
            isCoinListOpen,
        } = tradingViewStore;

        this.disableAnimation = false;

        return (
            <Wrapper
                disableAnimation={this.disableAnimation}
                isCoinListOpen={isCoinListOpen}
                width={width}
            >
                <ChartContainer width={width}>
                    <ApTradingViewChart
                        id="tv_chart_container"
                        width={width - 2}
                        height={height - 2}
                    />

                    <TradingViewPriceLabel isToggleBtn exchange={exchange}/>
                </ChartContainer>

                {isLoading && (
                    <DataLoaderWrapper width={width}>
                        <DataLoader width={100} height={100}/>
                    </DataLoaderWrapper>
                )}
            </Wrapper>
        );
    }
}

export default compose(
    withSafeTimeout,
    inject(
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.TRADINGVIEWSTORE,
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.LOWESTEXCHANGESTORE,
        STORE_KEYS.EXCHANGESSTORE,
    ),
    observer
)(BCTChart);
