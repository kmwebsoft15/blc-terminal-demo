import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { STORE_KEYS } from '@/stores';
import DataLoader from '@/components-generic/DataLoader';
import DepthChartApi from '@/lib/chartModules/depthChart';

import CustomTooltip from './CustomTooltip/index';
import ChartControls from './ChartControls/index';
import { Wrapper } from './styles';

const MIN_ZOOM = 0;
const MAX_ZOOM = 90;
const ZOOM_STEP = 10;

const getZoomedData = (data, targetLength) => {
    let cumulativeAmount = 0;
    let cumulativeSum = 0;
    const res = [];
    for (let i = 0; i < targetLength; i++) {
        const [price, amount] = data[i];
        cumulativeAmount += amount;
        cumulativeSum += price * amount;
        res.push({ x: price, y: cumulativeAmount, sum: cumulativeSum });
    }

    return res;
};

class DepthChart extends Component {
    state = {
        buys: [],
        sells: [],
        midPrice: 0,
        isArbitrage: false,
        zoom: MIN_ZOOM,
        tooltipModel: undefined
    };

    static getDerivedStateFromProps(props, state) {
        const { bids, asks, midPrice, isDGLoaded } = props;

        if (!isDGLoaded) {
            return null;
        }

        // zoom defines how many percents of array we are going to slice
        // e.g. zoom=30 means that we slice 30% at the beginning of `buys` and at the end of `sells`
        const { zoom } = state;

        const length = Math.min(bids.length, asks.length);
        const targetLength = Math.round(length * (1 - zoom / 100));

        const buys = getZoomedData(bids, targetLength);
        const sells = getZoomedData(asks, targetLength);

        return {
            buys,
            sells,
            midPrice,
            isArbitrage: buys[0].x > sells[0].x
        };
    }

    componentDidMount() {
        this.updateChart();
    }
    componentDidUpdate() {
        this.updateChart();
    }

    onTooltipChange = tooltipModel => {
        const { highlightRow } = this.props;
        const { buys, sells } = this.state;
        this.setState({ tooltipModel });

        if (!tooltipModel) {
            highlightRow();
            return;
        }

        const datasets = [buys, sells];
        const { datasetIndex, index } = tooltipModel;
        const data = datasets[datasetIndex][index];
        const type = datasetIndex ? 'sell' : 'buy';
        highlightRow(type, data.x);
    };

    onClick = targetModel => {
        const { selectAsk, selectBid } = this.props;
        const { buys, sells } = this.state;

        if (!targetModel) {
            return;
        }

        const datasets = [buys, sells];
        const { datasetIndex, index } = targetModel;
        const action = datasetIndex ? selectBid : selectAsk;
        const data = datasets[datasetIndex][index];

        action({
            amount: data.y,
            price: data.x
        });
    };

    onZoom = type => {
        const { zoom } = this.state;
        const nextZoom = type === 'in' ? Math.min(zoom + ZOOM_STEP, MAX_ZOOM) : Math.max(zoom - ZOOM_STEP, MIN_ZOOM);
        this.setState({ zoom: nextZoom });
    };

    updateChart = () => {
        const { theme, base, quote, isDGLoaded } = this.props;
        const { buys, sells, midPrice } = this.state;
        const data = { buys, sells };

        if (isDGLoaded) {
            if (this.chart) {
                this.chart.update(data, midPrice);
                return;
            }

            this.chart = new DepthChartApi({
                el: this.el,
                data,
                config: {
                    theme,
                    midPrice,
                    base,
                    quote,
                    onClick: this.onClick,
                    onTooltipChange: this.onTooltipChange
                }
            });
            return;
        }

        if (this.chart) {
            this.chart.destroy();
            this.chart = undefined;
        }
    };

    render() {
        const { isDGLoaded, base, quote, quoteSymbol } = this.props;
        const { buys, sells, tooltipModel, midPrice, zoom, isArbitrage } = this.state;

        if (!isDGLoaded) {
            return <DataLoader />;
        }

        return (
            <Wrapper>
                <canvas ref={el => (this.el = el)} />
                <CustomTooltip
                    tooltipModel={tooltipModel}
                    datasets={[buys, sells]}
                    base={base}
                    quote={quote}
                />
                <ChartControls
                    midPrice={midPrice}
                    onZoom={this.onZoom}
                    plusDisabled={zoom === MAX_ZOOM}
                    minusDisabled={zoom === MIN_ZOOM}
                    quoteSymbol={quoteSymbol}
                    isArbitrage={isArbitrage}
                />
            </Wrapper>
        );
    }
}

const withStore = compose(
    inject(
        STORE_KEYS.ORDERBOOK,
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.ORDERENTRY,
        STORE_KEYS.ORDERBOOKBREAKDOWN
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.VIEWMODESTORE]: theme,
            [STORE_KEYS.ORDERBOOKBREAKDOWN]: { highlightRow },
            [STORE_KEYS.ORDERBOOK]: { Asks: asks, Bids: bids, midPrice, isDGLoaded, base, quote },
            [STORE_KEYS.ORDERENTRY]: { selectAsk, selectBid },
            [STORE_KEYS.SETTINGSSTORE]: { defaultFiatSymbol: quoteSymbol }
        }) => ({
            theme: theme.theme,
            asks,
            bids,
            midPrice,
            isDGLoaded,
            quoteSymbol,
            base,
            quote,
            selectAsk,
            selectBid,
            highlightRow
        })
    )
);

export default withStore(DepthChart);
