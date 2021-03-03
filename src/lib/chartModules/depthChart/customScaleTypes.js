import Chart from 'chart.js';

const defaultLinearScale = Chart.scaleService.getScaleDefaults('linear');

const defaultGetPixelForValue = function([start, end], width, value) {
    const range = end - start;
    return this.left + (width / range) * (value - start);
};

const defaultGetValueForPixel = function([start, end], width, pixel) {
    const offset = (pixel - this.left) / width;
    return start + (end - start) * offset;
};

const getRange = type => ({ start, arb, end }, value) => {
    if (value <= start[type][1]) {
        return 'start';
    }

    if (value >= start[type][0]) {
        return 'end';
    }

    return 'arb';
};

const getRangeForValue = getRange('values');
const getRangeForPixel = getRange('pixels');

const LinearScaleWithArbitrage = Chart.scaleService.getScaleConstructor('linear').extend({
    getPixelForValue: function(value) {
        const rightValue = +this.getRightValue(value);

        const { arbRanges } = this.chart.scales.price;
        if (!arbRanges) {
            return defaultGetPixelForValue.call(this, [this.start, this.end], this.width, rightValue);
        }

        const range = getRangeForValue(arbRanges, rightValue);
        const meta = arbRanges[range];

        const [startPx, endPx] = meta.pixels;
        const width = endPx - startPx;

        return startPx + defaultGetPixelForValue.call(this, meta.values, width, rightValue);
    },

    getValueForPixel: function(pixel) {
        const { arbRanges } = this.chart.scales.price;

        if (!arbRanges) {
            return defaultGetValueForPixel.call(this, [this.start, this.end], this.width, pixel);
        }

        const range = getRangeForPixel(arbRanges, pixel);
        const meta = arbRanges[range];

        const [startPx, endPx] = meta.pixels;
        const width = endPx - startPx;

        return defaultGetValueForPixel.call(this, meta.values, width, pixel);
    }
});

Chart.scaleService.registerScaleType('linear-scale-with-arbitrage', LinearScaleWithArbitrage, defaultLinearScale);
