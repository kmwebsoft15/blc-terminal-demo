import Chart from 'chart.js';

import { formatTotalDigitString } from '@/utils';

import './customScaleTypes';

const ARB_WIDTH = 150;

function convertHex(hex, opacity) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r},${g},${b},${opacity})`;
}

export default class DepthChart {
    constructor(props) {
        this.el = props.el;
        this.config = props.config;

        const { palette } = props.config.theme;
        this.colors = {
            buysBorder: palette.orderBookTableCellTextBuyBright,
            buysBackground: convertHex(palette.orderBookTableCellTextBuyBright, 0.3),
            buysBorderInactive: convertHex(palette.orderBookTableCellTextBuyBright, 0.3),
            buysBackgroundInactive: convertHex(palette.orderBookTableCellTextBuyBright, 0.1),
            buysArb: convertHex(palette.orderBookTableCellTextBuyBright, 0.08),
            sellsBorder: palette.orderBookTableCellTextSellBright,
            sellsBackground: convertHex(palette.orderBookTableCellTextSellBright, 0.3),
            sellsBorderInactive: convertHex(palette.orderBookTableCellTextSellBright, 0.3),
            sellsBackgroundInactive: convertHex(palette.orderBookTableCellTextSellBright, 0.1),
            sellsArb: convertHex(palette.orderBookTableCellTextSellBright, 0.2)
        };

        this.chart = new Chart(this.el, this.getConfig(props.data));
    }

    getPriceScaleEdges = ({ buys, sells }) => {
        const { midPrice } = this.config;

        const buyGap = midPrice - buys[buys.length - 1].x;
        const sellGap = sells[sells.length - 1].x - midPrice;
        const smallerGap = Math.min(buyGap, sellGap);

        return {
            max: midPrice + smallerGap,
            min: midPrice - smallerGap
        };
    };

    getAmountScaleEdges = ({ buys, sells }) => {
        const maxAmount = Math.max(sells[sells.length - 1].y, buys[buys.length - 1].y);

        // move the bottom line upper to see the line in ARB
        return {
            min: 0 - maxAmount * 0.1
        };
    };

    getTooltipMeta = x => {
        const { width, height } = this.chart;
        const datasetIndex = x > width / 2 ? 1 : 0;
        const { data } = this.chart.getDatasetMeta(datasetIndex);

        let leftPointIndex;
        let rightPointIndex;
        let i = datasetIndex ? 0 : data.length - 1;

        if (datasetIndex) {
            for (i; i < data.length; i++) {
                if (data[i]._model.x > x) {
                    rightPointIndex = i;
                    break;
                }
            }
            if (i) {
                leftPointIndex = i - 1;
            }
        } else {
            for (i; i >= 0; i--) {
                if (data[i]._model.x > x) {
                    rightPointIndex = i;
                    break;
                }
            }

            if (i < data.length - 1) {
                leftPointIndex = i + 1;
            }
        }

        let meta;
        let index;
        if (typeof leftPointIndex === 'undefined') {
            meta = data[rightPointIndex]._model;
            index = rightPointIndex;
        } else if (typeof rightPointIndex === 'undefined') {
            meta = data[leftPointIndex]._model;
            index = leftPointIndex;
        } else {
            const leftPoint = data[leftPointIndex]._model;
            const rightPoint = data[rightPointIndex]._model;

            if (x - leftPoint.x > rightPoint.x - x) {
                meta = data[rightPointIndex]._model;
                index = rightPointIndex;
            } else {
                meta = data[leftPointIndex]._model;
                index = leftPointIndex;
            }
        }

        let tooltipXPosition = 'middle';
        if (meta.x < 100) {
            tooltipXPosition = 'right';
        } else if (meta.x > width - 100) {
            tooltipXPosition = 'left';
        }

        return { meta, index, datasetIndex, x, tooltipXPosition };
    };

    getConfig = ({ buys, sells }) => {
        const { buysBorder, buysBackground, sellsBorder, sellsBackground } = this.colors;
        const { quote, base } = this.config;
        const { min, max } = this.getPriceScaleEdges({ buys, sells });
        const { min: amountMin } = this.getAmountScaleEdges({ buys, sells });

        return {
            type: 'line',
            data: {
                datasets: [
                    {
                        borderColor: buysBorder,
                        backgroundColor: buysBackground,
                        fill: 'start',
                        type: 'line',
                        lineTension: 0,
                        borderWidth: 2,
                        steppedLine: 'middle',
                        data: buys
                    },
                    {
                        borderColor: sellsBorder,
                        backgroundColor: sellsBackground,
                        fill: 'start',
                        type: 'line',
                        lineTension: 0,
                        borderWidth: 2,
                        steppedLine: 'middle',
                        data: sells
                    }
                ]
            },
            options: {
                cursor: {},
                tooltipMeta: undefined,
                maintainAspectRatio: false,
                elements: {
                    line: {
                        tension: 0
                    },
                    point: {
                        radius: 0,
                        hitRadius: 7,
                        hoverRadius: 0
                    }
                },
                scales: {
                    xAxes: [
                        {
                            id: 'price',
                            type: 'linear-scale-with-arbitrage',
                            bounds: 'ticks',
                            ticks: {
                                autoSkip: true,
                                autoSkipPadding: 100,
                                maxRotation: 0,
                                padding: -14,
                                min,
                                max,
                                lineHeight: 1,
                                fontColor: '#999',
                                callback: (value, index, values) => {
                                    if (!index || index === values.length - 1) {
                                        return '';
                                    }
                                    return `${formatTotalDigitString(value, 6)} ${quote}`;
                                }
                            },
                            gridLines: {
                                drawOnChartArea: false,
                                color: '#666',
                                drawBorder: false,
                                tickMarkLength: -4
                            },
                            afterFit: chart => {
                                chart.paddingLeft = 0;
                                chart.paddingRight = 0;

                                const [buys, sells] = chart.chart.config.data.datasets;

                                if (!buys || !buys.data.length || !sells || !sells.data.length) {
                                    chart.arbRanges = undefined;
                                    return;
                                }

                                const startArb = sells.data[0].x;
                                const endArb = buys.data[0].x;
                                const isArbitrage = endArb > startArb;

                                if (!isArbitrage) {
                                    chart.arbRanges = undefined;
                                    return;
                                }

                                const { start, end, width } = chart;
                                const sideRangesWidth = (width - ARB_WIDTH) / 2;

                                //   |____________|__ARB__|____________|
                                // start     startArb  endArb        end

                                chart.arbRanges = {
                                    start: {
                                        values: [start, startArb],
                                        pixels: [0, sideRangesWidth]
                                    },
                                    arb: {
                                        values: [startArb, endArb],
                                        pixels: [sideRangesWidth, sideRangesWidth + ARB_WIDTH]
                                    },
                                    end: {
                                        values: [endArb, end],
                                        pixels: [sideRangesWidth + ARB_WIDTH, width]
                                    }
                                };
                            }
                        }
                    ],
                    yAxes: [
                        {
                            id: 'amount',
                            type: 'linear',
                            position: 'right',
                            ticks: {
                                autoSkip: true,
                                mirror: true,
                                padding: -5,
                                fontColor: '#999',
                                min: amountMin,
                                callback: (value, index, values) => {
                                    // skip the first and zero ticks
                                    if (index === values.length - 1 || value === 0) {
                                        return '';
                                    }

                                    // skip odd ticks
                                    if (index % 2 === 1) {
                                        return '';
                                    }
                                    return `${formatTotalDigitString(value, 6)} ${base}`;
                                }
                            },
                            gridLines: {
                                drawBorder: false,
                                drawOnChartArea: false,
                                display: false,
                                tickMarkLength: 0
                            },
                            afterFit: chart => {
                                chart.margins.bottom = 0;
                                chart.paddingBottom = 0;
                            }
                        }
                    ]
                },
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: false
                }
            },
            plugins: [
                {
                    beforeEvent: (chart, e) => {
                        switch (e.type) {
                            case 'mouseout':
                                clearTimeout(this.updateTooltipTimer);
                                chart.options.tooltipMeta = undefined;
                                this.config.onTooltipChange();
                                this.applyOpacity(chart);
                                chart.update({ duration: 0 });
                                return;
                            case 'mousemove':
                                if (e.x < e.chart.chartArea.left || e.x > e.chart.chartArea.right) {
                                    return;
                                }

                                clearTimeout(this.updateTooltipTimer);
                                const tooltipMeta = this.getTooltipMeta(e.x);
                                let update = false;
                                if (
                                    !chart.options.tooltipMeta ||
                                    chart.options.tooltipMeta.meta.x !== tooltipMeta.meta.x
                                ) {
                                    this.config.onTooltipChange(tooltipMeta);
                                    update = true;
                                }
                                chart.options.tooltipMeta = tooltipMeta;

                                if (update) {
                                    this.applyOpacity(chart);
                                    chart.update({ duration: 0 });
                                }
                                return;
                            case 'click':
                                this.config.onClick(this.getTooltipMeta(e.x));
                                return;
                            default:
                                return;
                        }
                    },
                    afterDraw: chart => {
                        // draw mid price
                        this.drawArb(chart);

                        // draw tooltip meta
                        this.drawTooltipMeta(chart);
                    }
                }
            ]
        };
    };

    update = ({ buys, sells }, midPrice) => {
        this.config.midPrice = midPrice;

        const { data, options } = this.chart.config;
        const {
            datasets: [currentBuys, currentSells]
        } = data;

        // trying to be smart to get rid of useless updates
        // check data length and first/last price
        if (
            currentBuys.data.length === buys.length &&
            currentBuys.data[0].x === buys[0].x &&
            currentBuys.data[currentBuys.data.length - 1].x === buys[buys.length - 1].x &&
            currentSells.data.length === sells.length &&
            currentSells.data[0].x === sells[0].x &&
            currentSells.data[currentSells.data.length - 1].x === sells[sells.length - 1].x
        ) {
            return;
        }

        const { min, max } = this.getPriceScaleEdges({ buys, sells });
        const { min: amountMin } = this.getAmountScaleEdges({ buys, sells });

        currentBuys.data = buys;
        currentSells.data = sells;
        options.scales.xAxes[0].ticks.min = min;
        options.scales.xAxes[0].ticks.max = max;
        options.scales.yAxes[0].ticks.min = amountMin;

        this.chart.update({ duration: 200 });

        if (options.tooltipMeta) {
            this.updateTooltipTimer = setTimeout(() => {
                if (!this.chart.options.tooltipMeta) {
                    return;
                }
                this.chart.options.tooltipMeta = this.getTooltipMeta(this.chart.options.tooltipMeta.x);
                this.config.onTooltipChange(this.chart.options.tooltipMeta);
                this.chart.update({ duration: 0 });
            }, 200);
        }
    };

    destroy = () => {
        clearTimeout(this.updateTooltipTimer);

        if (this.chart) {
            this.chart.destroy();
            this.chart = undefined;
        }
    };

    applyOpacity = chart => {
        const {
            buysBorder,
            buysBackground,
            buysBorderInactive,
            buysBackgroundInactive,
            sellsBorder,
            sellsBackground,
            sellsBorderInactive,
            sellsBackgroundInactive
        } = this.colors;
        const {
            data: {
                datasets: [currentBuys, currentSells]
            }
        } = chart.config;
        const { tooltipMeta } = chart.options;

        if (!tooltipMeta) {
            currentBuys.borderColor = buysBorder;
            currentBuys.backgroundColor = buysBackground;
            currentSells.borderColor = sellsBorder;
            currentSells.backgroundColor = sellsBackground;
            return;
        }

        const { datasetIndex } = tooltipMeta;

        currentBuys.borderColor = datasetIndex ? buysBorderInactive : buysBorder;
        currentBuys.backgroundColor = datasetIndex ? buysBackgroundInactive : buysBackground;
        currentSells.borderColor = datasetIndex ? sellsBorder : sellsBorderInactive;
        currentSells.backgroundColor = datasetIndex ? sellsBackground : sellsBackgroundInactive;
    };

    drawTooltipMeta = chart => {
        const { tooltipMeta } = chart.options;

        if (!tooltipMeta) {
            return;
        }

        const { palette } = this.config.theme;

        const { meta, datasetIndex } = tooltipMeta;

        const { ctx } = chart;
        // save canvas state
        ctx.save();

        const { bottom } = chart.chartArea;

        const color = datasetIndex ? palette.orderBookTableCellTextSellBright : palette.orderBookTableCellTextBuyBright;

        ctx.beginPath();
        ctx.arc(meta.x, meta.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.fill();

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        ctx.setLineDash([5, 3]);
        ctx.moveTo(meta.x, meta.y);
        ctx.lineTo(meta.x, bottom);
        ctx.stroke();

        ctx.restore();
    };

    drawArb = chart => {
        const { ctx } = chart;
        const { top, bottom, right, left } = chart.chartArea;
        const { buysBorder, sellsArb, sellsBorder, buysArb } = this.colors;

        const buysMeta = chart.getDatasetMeta(0);
        const sellsMeta = chart.getDatasetMeta(1);

        const bestBuyMeta = buysMeta.data[0]._model.x;
        const bestSellMeta = sellsMeta.data[0]._model.x;

        ctx.save();

        const lineTopY = (top - bottom) * 0.5 + bottom;
        const midX = (right - left) / 2 + left;

        if (bestBuyMeta > bestSellMeta) {
            // arbitrage, 2 lines
            this.drawLine(bestBuyMeta, 0, bestBuyMeta, bottom, buysBorder);
            this.drawLine(bestSellMeta, 0, bestSellMeta, bottom, sellsBorder);

            const gradient = ctx.createLinearGradient(bestSellMeta, 0, bestBuyMeta, 0);
            gradient.addColorStop(0, sellsArb);
            gradient.addColorStop(1, buysArb);
            ctx.fillStyle = gradient;
            ctx.fillRect(bestSellMeta, 0, bestBuyMeta - bestSellMeta, bottom);
        } else {
            this.drawLine(midX, lineTopY, midX, bottom);
        }

        ctx.restore();
    };

    drawLine = (x1, y1, x2, y2, color = '#999') => {
        const {
            chart: { ctx }
        } = this.chart;

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        ctx.setLineDash([5, 3]);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    };
}
