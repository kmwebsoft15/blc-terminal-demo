import Chart from 'chart.js';
import max from 'lodash.max';
import min from 'lodash.min';

import { formatCoinString, commafy } from '@/utils';
import { SHIFT_CHART_QUALIFIER, MAX_DECIMALS_COUNT } from './constants';

const defaultLinearScale = Chart.scaleService.getScaleDefaults('linear');

function determineDataLimits() {
    const { data } = this.chart.data.datasets[0];
    const { min: minTime, max: maxTime } = this.chart.scales.time;

    if (this.drawingTo && this.chart.options.drawingTo) {
        // skip during animation
        return;
    }

    this.drawingTo = this.chart.options.drawingTo;

    const visibleData = [];
    let firstVisibleIndex;
    // get all visible points on the chart
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.x >= minTime && item.x <= maxTime) {
            visibleData.push(item.y);
            if (!firstVisibleIndex) {
                firstVisibleIndex = i;
            }
        }
    }

    // add the closest invisible point from the left
    if (firstVisibleIndex && data[firstVisibleIndex - 1]) {
        visibleData.unshift(data[firstVisibleIndex - 1].y);
    }

    // add the currently drawing point
    if (this.chart.options.drawingTo) {
        visibleData.push(this.chart.options.drawingTo);
    }

    // in case we zoom-in too close and there are no visible points on the chart
    // just take the closest invisible ponits from the left and from the right
    if (!visibleData.length && data.length) {
        let closestLeft;
        let closestRight;
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (!closestLeft || minTime - item.x > 0 && item.x > closestLeft.x) {
                closestLeft = item;
            }
            if (!closestRight || item.x - maxTime > 0 && item.x < closestLeft.x) {
                closestRight = item;
            }
        }
        visibleData.push(closestLeft.y);
        visibleData.push(closestRight.y);
    }

    const maxVisiblePrice = max(visibleData) || 0;
    const minVisiblePrice = min(visibleData) || 0;

    const priceDifference = parseFloat((maxVisiblePrice - minVisiblePrice).toFixed(MAX_DECIMALS_COUNT));

    let tickStep;
    if (priceDifference === 0 || priceDifference > 0.5) {
        tickStep = Math.pow(10, Math.round(priceDifference).toString().length - 1);
    } else {
        const leadingZerosRegex = priceDifference.toFixed(10).match(/^[0, .]+/);
        const leadingZeros = leadingZerosRegex && leadingZerosRegex[0];
        const leadingZerosCount = leadingZeros.replace('.', '').length;
        tickStep = Math.pow(10, -leadingZerosCount);
    }

    let maxPrice = maxVisiblePrice - (maxVisiblePrice % tickStep) + tickStep;
    let minPrice = minVisiblePrice - (minVisiblePrice % tickStep);

    const scaleDistance = maxPrice - minPrice;

    if (scaleDistance > 0) {
        if (minVisiblePrice - minPrice < scaleDistance * SHIFT_CHART_QUALIFIER) {
            minPrice -= tickStep;
        }

        if (maxPrice - maxVisiblePrice < scaleDistance * SHIFT_CHART_QUALIFIER) {
            maxPrice += tickStep;
        }
    }

    // fix overflow problem, e.g. 11063.800000000001, instead of 11063.8
    this.max = parseFloat(maxPrice.toFixed(MAX_DECIMALS_COUNT));
    this.min = parseFloat(minPrice.toFixed(MAX_DECIMALS_COUNT));
}

function convertTicksToLabels() {
    this.ticksAsNumbers = this.ticks.slice();
    this.zeroLineIndex = this.ticks.indexOf(0);

    this.chart.options.maxTickDecimalPoints = this.ticksAsNumbers.reduce((res, tick) => {
        // format the number and remove trailing zeros
        const tickAsString = formatCoinString(tick, MAX_DECIMALS_COUNT).replace(/\.?0+$/, '');

        if (tickAsString.indexOf('.') === -1) {
            return res;
        }

        const decimalPart = tickAsString.split('.')[1];
        return decimalPart.length > res ? decimalPart.length : res;
    }, 2);

    this.ticks = this.ticksAsNumbers.map(tick => commafy(tick.toPrecision(7)));
}

let prevIndex = -1;
function getPixelForTick(index) {
    const innerHeight = this.height - (this.paddingTop + this.paddingBottom);
    const result = this.top + index * (innerHeight / (this._ticks.length - 1));

    // this isn't a best solution, but it's not possible to solve the task
    // without changing Chart.js source code.
    // this function gets executed 2 times for every tick:
    // - first time to get a gridline coordinates
    //   https://github.com/chartjs/Chart.js/blob/master/src/core/core.scale.js#L907
    // - second time to get a tick coordinates
    //   https://github.com/chartjs/Chart.js/blob/master/src/core/core.scale.js#L944
    // and the task is to return different coordinates for tick and gridline
    const isTickCalculation = prevIndex === index;
    prevIndex = index;

    if (!isTickCalculation) {
        return result;
    }

    if (index === 0) {
        return result + 7;
    }

    if (index === this._ticks.length - 1) {
        return result - 7;
    }

    return result;
}

const customMinMaxScale = Chart.scaleService.getScaleConstructor('linear').extend({
    determineDataLimits,
    convertTicksToLabels,
    getPixelForTick,
});

Chart.scaleService.registerScaleType('custom-min-max-scale', customMinMaxScale, defaultLinearScale);
