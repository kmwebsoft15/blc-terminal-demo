import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';
import isEqual from 'lodash/isEqual';

import { STORE_KEYS } from '../../../stores';
import {
    Wrapper, DonutChartWrapper, Donut, SvgComplete
} from './Components';
import { STATE_KEYS } from '../../../stores/ConvertStore';
import DataLoader from '../../../components-generic/DataLoader';
import { getChartColors } from '../ExchangeCellsV2/colors';

am4core.useTheme(am4themesAnimated);

// --- # mock data for temporary. --- //
const categories = [
    'Binance',
    'Bitstrap',
    'Bitfinex',
    'Huobi',
    'Coinbase'
];
const percentages = [30, 15, 9, 6, 40];
let data = [];
for (let i = 0; i < percentages.length; i++) {
    data.push({
        category: categories[i],
        value: percentages[i],
        hidden: false,
    });
}

function hideSmall(hidden, target) {
    let result = false;
    if (target.dataItem.category === 'hidden') {
        result = true;
    } else {
        result = false;
    }
    return result;
}

class DonutChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeIndex: -1,
            hoverIndex: -1,
            hovered: false,
        };

        this.disableTransition = false;
        this.isShown = false;
    }

    componentDidMount() {
        this.buildChart();
    }

    componentDidUpdate() {
        this.buildChart();
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }

    buildChart() {
        const {
            donutChatId,
        } = this.props;

        // const willShow = convertState !== STATE_KEYS.coinSearch && graphSwitchMode;
        const willShow = true;

        if (this.isShown && !willShow && this.chart) {
            this.chart.dispose();
        }

        if (!this.isShown && willShow) {
            const chart = am4core.create(donutChatId, am4charts.PieChart);

            chart.data = data;

            const pieSeries = chart.series.push(new am4charts.PieSeries());
            pieSeries.dataFields.value = 'value';
            pieSeries.dataFields.category = 'category';
            pieSeries.dataFields.hidden = 'hidden';
            pieSeries.labels.template.disabled = true;
            pieSeries.ticks.template.disabled = true;
            // pieSeries.colors.list = colors;
            pieSeries.slices.template.stroke = am4core.color('#fff');
            pieSeries.slices.template.strokeWidth = 2;
            pieSeries.slices.template.strokeOpacity = 1;
            pieSeries.slices.template.cornerRadius = 8;
            // pieSeries.slices.template.tooltipText = "{category}: {value}%";
            pieSeries.slices.template.tooltipText = '';
            pieSeries.slices.template.fillOpacity = 0.3;

            // for opacity of user interaction
            pieSeries.slices.template.events.disableType('hit');
            // let as = pieSeries.slices.template.states.getKey('active');
            // as.properties.shiftRadius = 0;
            // as.properties.fillOpacity = 0.5;
            let hs = pieSeries.slices.template.states.getKey('hover');
            hs.properties.scale = 1;
            hs.properties.shiftRadius = 0.1;
            // hs.properties.fillOpacity = 0.5;

            this.chart = chart;
            this.pieSeries = pieSeries;
        }

        this.isShown = willShow;
    }

    updateChartData(plan) {
        data = [];
        let totalAmount = 0;
        if (plan && plan.length) {
            for (let i = 0; i < plan.length; i++) {
                const amount = plan[i].Amount || 0;
                totalAmount += amount;
            }
            for (let i = 0; i < plan.length; i++) {
                const amount = plan[i].Amount || 0;
                const percentage = plan[i].Percentage || 0;
                let paddingPercentage = 0;
                let paddingAmount = totalAmount * 0.007;
                data.push({
                    category: plan[i].Exchange || '',
                    percentage,
                    value: amount,
                    hidden: false, // percentage < 1,
                });

                if (plan.length > 1) {
                    data.push({
                        category: 'hidden',
                        paddingPercentage,
                        value: paddingAmount,
                        hidden: false, // percentage < 1,
                    });
                }
            }
        }

        if (this.chart && !isEqual(data, this.chart.data)) {
            this.chart.data = data;
            // this.pieSeries.colors.list = colors.slice(0, this.chart.data.length).reverse();
            this.pieSeries.slices.template.states.getKey('hover').properties.shiftRadius = data.length > 1 ? 0.1 : 0;
            this.chartColors = getChartColors(data.length, false).reverse();
            this.pieSeries.colors.list = this.chartColors;
            this.pieSeries.slices.template.adapter.add('hidden', hideSmall);
        }
    }

    render() {
        const { hoverIndex } = this.state;
        const {
            [STORE_KEYS.LOWESTEXCHANGESTORE]: lowestExchangeStore,
            [STORE_KEYS.CONVERTSTORE]: convertStore,
            width,
            height,
            donutChatId,
        } = this.props;
        const {
            Plan,
            hoverExchangeFromDonut,
            hoverExchange,
            isDelayed,
            isDonutModeFinishedForLabel,
        } = lowestExchangeStore;
        const isExecPlanExist = Plan.length === 0;

        this.convertState = convertStore.convertState;
        if (hoverIndex === -1) {
            this.updateChartData(Plan);
        }
        if (this.pieSeries && this.pieSeries.slices) {
            if (hoverExchange) {
                this.pieSeries.slices.each((item, index) => {
                    if (
                        index !== hoverIndex &&
                        index % 2 === 0 &&
                        Plan[index / 2] &&
                        Plan[index / 2].Exchange === hoverExchange
                    ) {
                        item.dispatchImmediately('over');
                    }
                });
            } else if (hoverIndex !== -1 && !hoverExchangeFromDonut) {
                this.pieSeries.slices.each((item, index) => {
                    if (index === hoverIndex) {
                        item.dispatchImmediately('out');
                    }
                });
            }
        }

        return (
            <Wrapper width={width} height={height} isExecPlanExist={isExecPlanExist}>
                <DonutChartWrapper
                    width={width}
                    height={height}
                    disableTransition={this.disableTransition}
                >
                    <Donut id={donutChatId} width={width * 0.9} height={height * 0.9} />

                    {(convertStore.convertState === STATE_KEYS.submitOrder || isDelayed) && (
                        <DataLoader width={120} height={120} />
                    )}

                    {(convertStore.convertState === STATE_KEYS.orderDone ||
                        (convertStore.convertState === STATE_KEYS.coinSearch && isDonutModeFinishedForLabel)) && (
                        <SvgComplete>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.34 29.66">
                                <path d="M34.87,5,30.32.47a1.6,1.6,0,0,0-2.27,0L17.67,10.85h0l-5.84,5.84L7.29,12.15a1.62,1.62,0,0,0-2.28,0L.47,16.69A1.6,1.6,0,0,0,.47,19L10.69,29.19a1.61,1.61,0,0,0,1.14.47A1.63,1.63,0,0,0,13,29.19l4.7-4.71L34.87,7.29a1.62,1.62,0,0,0,0-2.28Z" />
                            </svg>
                        </SvgComplete>
                    )}
                </DonutChartWrapper>
                { isExecPlanExist && <DataLoader width={100} height={100}/> }
            </Wrapper>
        );
    }
}

export default inject(
    STORE_KEYS.LOWESTEXCHANGESTORE,
    STORE_KEYS.INSTRUMENTS,
    STORE_KEYS.CONVERTSTORE,
    STORE_KEYS.VIEWMODESTORE,
)(observer(DonutChart));
