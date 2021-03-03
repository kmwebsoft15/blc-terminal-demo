import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import DataLoader from '@/components-generic/DataLoader';
import { ChartCanvasWrapper } from '../styles';
import LineChart from '@/lib/chartModules/lineChart';
import { STORE_KEYS } from '@/stores';

class PriceChartHistorical extends Component {
    constructor(props) {
        super(props);

        this.chartInitialized = false;
    }

    componentDidMount() {
        this.handleData();
    }

    componentDidUpdate() {
        this.handleData();
    }

    componentWillUnmount() {
        this.destroyChart();
    }

    handleData = () => {
        const {
            [STORE_KEYS.HISTORICALPRICESSTORE]: { historicalData, loading },
            [STORE_KEYS.SETTINGSSTORE]: { defaultFiatSymbol: coinSymbol },
        } = this.props;

        if (loading) {
            this.destroyChart();
            return;
        }

        if (!this.chartInitialized && historicalData.length) {
            this.chart = new LineChart({
                el: this.el,
                data: historicalData,
                config: {
                    liveMode: false,
                    startTime: historicalData[0].x,
                    endTime: historicalData[historicalData.length - 1].x,
                    maxDataLength: historicalData.length,
                    coinSymbol,
                },
            });

            this.chartInitialized = true;
        }
    }

    destroyChart = () => {
        this.chartInitialized = false;
        if (this.chart) {
            this.chart.destroy();
        }
    };

    render() {
        const {
            [STORE_KEYS.HISTORICALPRICESSTORE]: { loading, historicalData },
        } = this.props;

        return (
            <ChartCanvasWrapper>
                <canvas ref={el => (this.el = el)} />
                {loading && <DataLoader width={100} height={100} />}
            </ChartCanvasWrapper>
        );
    }
}

export default inject(STORE_KEYS.YOURACCOUNTSTORE, STORE_KEYS.SETTINGSSTORE, STORE_KEYS.HISTORICALPRICESSTORE)(
    observer(PriceChartHistorical)
);
