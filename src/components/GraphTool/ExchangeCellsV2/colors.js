import React from 'react';
import * as am4core from '@amcharts/amcharts4/core';

export const HexColors = [
    '#000e4f',
    '#001463',
    '#001a76',
    '#00208b',
    '#00269d',
    '#002db3',
    '#0032c6',
    '#0038da',
    '#003eee',
    '#0041f6',
    '#0041f6',
    '#0041f6',
    '#0048f7',
    '#005af7',
    '#006cf7',
    '#007ef8',
    '#0191f8',
    '#00a5f9',
    '#00b8fa',
    '#02cbfb',
    '#09dffc',
    '#21f3fd'
];
export const GreenHexColors = [
    '#009E2D',
    '#00B333',
    '#00BD36',
    '#00CF3B',
    '#00D73D',
    '#08DE45',
    '#13E44E',
    '#21E95A',
    '#30ED66',
    '#42F174',
    '#57F583',
    '#6DF794',
    '#86FAA6',
    '#90EE90',
    '#98FB98',
    '#00FA9A',
    '#30ED66',
    '#00CF3B'
];
export const getChartColors = (count, colorMode) => {
    // const spacer = 31.0 / (1 + count);
    const selectedColors = colorMode ? GreenHexColors : HexColors;
    let colors = [];
    for (let i = 0; i < count; i++) {
        // colors.push(am4core.color(HexColors[Math.round((i + 1) * spacer) - 1]));
        colors.push(am4core.color(selectedColors[i >= selectedColors.length ? selectedColors.length - 1 : i]));
    }
    return colors;
};