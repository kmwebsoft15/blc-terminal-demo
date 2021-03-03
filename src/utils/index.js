/* eslint-disable no-bitwise */
import React from 'react';
import styled from 'styled-components/macro';
import decode from 'jwt-decode';
import moment from 'moment';
import uuidv4 from 'uuid/v4';
import get from 'lodash.get';
import isMobile from 'is-mobile';
import { round } from 'mathjs/number';

import { refreshSecurityToken } from '../lib/sms-auth';

const Text = styled.p`
    margin: 0;
    white-space: initial !important;
`;

export const splitAmtOnDecimal = (amt) => {
    // whole number case; returns empty string as digitsAfterDecimal
    if (amt.toString() === parseFloat(amt).toFixed(0)) {
        return [amt.toString(), ''];
    }

    const [digitsBeforeDecimal, digitsAfterDecimal] = amt.toString().split('.');
    return [digitsBeforeDecimal, digitsAfterDecimal];

};

export const roundToFixedNum = (amt, decimals) => {
    const roundedNum = round(amt, decimals);
    return roundedNum.toFixed(decimals);
};

export const fillUntil = (limit = 0, mapFn) => {
    let i = -1;
    let items = [];
    while (++i < limit) items.push(mapFn(i));
    return items;
};

export const pageIsVisible = (() => {
    let hidden;
    if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
        hidden = 'hidden';
    } else if (typeof document.msHidden !== 'undefined') {
        hidden = 'msHidden';
    } else if (typeof document.webkitHidden !== 'undefined') {
        hidden = 'webkitHidden';
    }

    return () => !document[hidden];
})();

export const invokeAll = (...fns) => (...args) => fns.forEach(fn => fn(...args));

/**
 * Function returning a new array sorted by time ascending or descending
 *
 * @param {String} [path]
 * Dot or bracket-notation object path string.
 *
 * @param {Array} list
 * Array to sort.
 *
 * @param {Boolean} desc
 * flag for sorting list ascending or descending
 *
 * @return {Array}
 * Array sorted by time.
 */

export const sortObjectArray = function (path, list, desc = false) {
    return [].concat(list).sort(function sort(a, b) {
        return desc
            ? (new Date(get(a, path, a)).getTime()) - (new Date(get(b, path, b)).getTime())
            : (new Date(get(b, path, b)).getTime()) - (new Date(get(a, path, a)).getTime());
    });
};

export const renderSvg = (icon) => {
    return (
        '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="img/sprite-basic.svg#' + icon + '"/>'
    );
};

export const getISODate = (date) => {
    return new Date(date).toISOString();
};

export const withValueFromEvent = (fn, { target: { value = '' } }) => fn(typeof value === 'string' ? value.trim() : value.toFixed(4));

export const isUrlContain = text => {
    return new RegExp('([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?').test(text);
};

export const formatCoinString = (string, num) => parseFloat(string).toLocaleString('en-US', {
    minimumFractionDigits: num,
    maximumFractionDigits: num,
});

export const formatString = (string, digits = 4, useGrouping = true) => parseFloat(string).toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping,
});

/**
 * https://stackoverflow.com/a/51411377
 *
 * @param {String} locale
 * @param {String} separatorType - eather 'decimal' or 'group'
 */
export const getSeparator = (locale = 'en-US', separatorType = 'decimal') => {
    if (locale === 'en-US' && separatorType === 'decimal') {
        return '.';
    }
    const numberWithGroupAndDecimalSeparator = 1000.1;
    return Intl.NumberFormat(locale)
        .formatToParts(numberWithGroupAndDecimalSeparator)
        .find(part => part.type === separatorType)
        .value;
};

export const formatStringMinMax = (string, min, max) => trimTrailingZero(parseFloat(string).toLocaleString('en-US', {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
}), string);

export const convertToFloat = (input) => {
    let num = input;
    if (typeof input === 'string') {
        num = input.replace(',', '');
        if (!Number.parseFloat(num)) {
            num = 0;
        }
    }
    return parseFloat(num);
};

export const format7DigitString = (input) => {
    let num = input;
    if (typeof input === 'string') {
        num = input.replace(',', '');
        if (!Number.parseFloat(num)) {
            num = 0;
        }
    }

    const decimals = parseInt(num).toString().length > 4 ? 2 : 5 - parseInt(num).toString().length;
    if (!!decimals) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }), input);
    }

    return trimTrailingZero(parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        input);
};

export const formatOrderBookDigitString = (input) => {
    let num = input;
    if (typeof input === 'string') {
        num = input.replace(',', '');
        if (!Number.parseFloat(num)) {
            num = 0;
        }
    }

    const decimals = parseInt(num).toString().length > 4 ? 2 : 7 - parseInt(num).toString().length;
    if (!!decimals) {
        return parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    }
    return parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

};

let intervalscnt = 0;
let intervalmax = 5;
export const formatDepthIntervalString = (num) => {
    if (num === 0) {
        if (intervalscnt !== 0) {
            intervalmax = intervalscnt;
            intervalscnt = 0;
        }
        return '';
    }
    intervalscnt++;
    if (intervalscnt >= intervalmax) {
        return '';
    }

    let numBase = parseFloat(num.toExponential().split('e')[0]);
    let numPower = parseInt(num.toExponential().split('e')[1]);

    if (numPower < 0) {
        return num;
    }
    if (numPower < 3) {
        return num;
    }

    let thousandCnt = Math.floor(numPower / 3);
    const precision = (numBase + '').split('.')[1] ? (numBase + '').split('.')[1].length : 0;
    if (thousandCnt === 1) {
        const mainNumber = numBase * Math.pow(10, numPower - 3);
        const decimalDigits = precision - numPower + 3;
        if (decimalDigits < 0) { return mainNumber.toFixed(0) + 'K'; }
        return mainNumber.toFixed(decimalDigits) + 'K';
    }

    const mainNumber = numBase * Math.pow(10, numPower - 6);
    const decimalDigits = precision - numPower + 6;
    if (decimalDigits < 0) { return mainNumber.toFixed(0) + 'MM'; }
    return mainNumber.toFixed(decimalDigits) + 'MM';

};

export const formatTotalDigitString = (input, count) => {
    let num = input;
    if (typeof input === 'string') {
        num = input.replace(',', '');
        if (!Number.parseFloat(num)) {
            num = 0;
        }
    }

    let decimals = count - parseInt(num).toString().length;
    if (decimals < 0) {
        decimals = 0;
    }

    return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }), input);
};

export const format2DigitString = (num) => {
    return parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const formatIntegerString = (num) => {
    return parseInt(num).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export const format2DigitStringForDonut = (num) => {
    if (parseInt(num).toString().length > 1) {
        return parseInt(num).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    if (parseFloat(num) < 0.01) {
        return parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

};

export const formatStringForMKTCAP = (labelValue) => {
    if (!labelValue) { return 0; }

    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

        ? format2DigitString(Math.abs(Number(labelValue)) / 1.0e+9) + 'B'
        // Six Zeroes for Millions
        : Math.abs(Number(labelValue)) >= 1.0e+6

            ? format2DigitString(Math.abs(Number(labelValue)) / 1.0e+6) + 'M'
            // Three Zeroes for Thousands
            : Math.abs(Number(labelValue)) >= 1.0e+3

                ? format2DigitString(Math.abs(Number(labelValue)) / 1.0e+3) + 'K'

                : format2DigitString(Math.abs(Number(labelValue)));
};

export const customDigitFormat = (input, count = 6) => {
    let num = input;
    if (typeof input === 'string') {
        num = input.replace(',', '');
        if (!Number.parseFloat(num)) {
            num = 0;
        }
    }

    const digitLength = parseInt(num).toString().length;

    if (digitLength > 9) {
        return formatTotalDigitString(num / 1000000000, count - 1) + 'B';
    }
    if (digitLength > 6) {
        return formatTotalDigitString(num / 1000000, count - 1) + 'M';
    }
    if (digitLength > 5) {
        return formatTotalDigitString(num / 1000, count - 1) + 'K';
    }

    let decimals = count - digitLength;
    if (decimals < 0) {
        decimals = 0;
    }

    return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }), input);
};

export const customDigitFormatWithNoTrim = (input, count = 6) => {
    let num = input;
    if (typeof input === 'string') {
        num = input.replace(',', '');
        if (!Number.parseFloat(num)) {
            num = 0;
        } else {
            num = parseFloat(num);
        }
    }
    num = parseFloat(num.toFixed(6));

    const digitLength = parseInt(num).toString().length;

    if (digitLength > 9) {
        return formatTotalDigitString(num / 1000000000, count - 1) + 'B';
    }
    if (digitLength > 6) {
        return formatTotalDigitString(num / 1000000, count - 1) + 'M';
    }
    if (digitLength > 5) {
        return formatTotalDigitString(num / 1000, count - 1) + 'K';
    }

    let decimals = count - digitLength;
    if (decimals < 0) {
        decimals = 0;
    }

    return parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};

export const timeDiffShort = time => {
    const before = moment(time * 1000);

    if (before.isValid()) {
        const now = moment();

        // In same day, display HH:mm
        if (now.diff(before, 'days') < 1) {
            return before.format('h:mm A');
        }
        if (now.diff(before, 'weeks') < 1) {
            return before.format('ddd');
        }
        return before.format('MM/DD/YY');

    }

    return '';
};

export const stringToHslColor = (str, s, l) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let h = hash % 360;
    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
};

export const getItemColor = (str) => {
    let s = 40;
    let l = 50;
    let textColor = l > 70 ? '#555' : '#fff';
    let hexColor = stringToHslColor(str, s, l);

    return {
        hexColor,
        textColor,
    };
};

export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
};

export const capitalizeFirstLetter = (input) => {
    const string = input.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getDecimalPlaces = input => {
    let num = input;
    if (typeof input === 'string') {
        num = input.replace(',', '');
        if (!Number.parseFloat(num)) {
            num = 1;
        }
    }

    if (num < 0.001) {
        return Math.pow(10, 7);
    }
    if (num < 0.01) {
        return Math.pow(10, 6);
    }
    if (num < 0.1) {
        return Math.pow(10, 5);
    }
    if (num < 1) {
        return Math.pow(10, 4);
    }
    if (num < 10) {
        return Math.pow(10, 3);
    }
    if (num < 100) {
        return Math.pow(10, 2);
    }
    if (num < 1000) {
        return Math.pow(10, 1);
    }
    if (num < 10000) {
        return 1;
    }
};

export const numberWithCommas = input => {
    let num = input;
    if (typeof input === 'string') {
        num = input.replace(',', '');
        if (!Number.parseFloat(num)) {
            num = 0;
        }
    }

    if (num < 0.001) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 8,
            maximumFractionDigits: 8,
        }), input);
    }
    if (num < 0.01) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 7,
            maximumFractionDigits: 7,
        }), input);
    }
    if (num < 0.1) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 6,
            maximumFractionDigits: 6,
        }), input);
    }
    if (num < 1) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 5,
            maximumFractionDigits: 5,
        }), input);
    }
    if (num < 10) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
        }), input);
    }
    if (num < 100) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
        }), input);
    }
    if (num < 1000) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }), input);
    }
    if (num < 10000) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }), input);
    }
    if (num < 100000) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }), input);
    }

    const digitLength = parseInt(num).toString().length;
    let decimals = 7 - digitLength;
    if (decimals < 0) {
        decimals = 0;
    }

    return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }), input);
};

export const unifyDigitString = input => {
    let num = input;
    if (typeof input === 'string') {
        num = input.replace(',', '');
        if (!Number.parseFloat(num)) {
            num = 0;
        }
    }

    if (num < 0.001) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 8,
            maximumFractionDigits: 8,
        }), input);
    }
    if (num < 0.01) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 7,
            maximumFractionDigits: 7,
        }), input);
    }
    if (num < 0.1) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 6,
            maximumFractionDigits: 6,
        }), input);
    }
    if (num < 1) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 5,
            maximumFractionDigits: 5,
        }), input);
    }
    if (num < 10) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
        }), input);
    }
    if (num < 100) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
        }), input);
    }
    if (num < 1000) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }), input);
    }
    if (num < 10000) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }), input);
    }
    if (num < 100000) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }), input);
    }

    return customDigitFormat(num, 7);
};

export const unifyDigitStringLimit = input => {
    let num = input;
    let limit;
    const isMobile = getScreenInfo();
    const { screenWidth, isMobileDevice } = isMobile;
    if (typeof input === 'string') {
        num = input.replace(',', '');
        if (!Number.parseFloat(num)) {
            num = 0;
        }
    }

    if (num < 0.001) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 8,
            maximumFractionDigits: 8,
        }), input);
    }
    if (num < 0.01) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 7,
            maximumFractionDigits: 7,
        }), input);
    }
    if (num < 0.1) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 6,
            maximumFractionDigits: 6,
        }), input);
    }
    if (num < 1) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 5,
            maximumFractionDigits: 5,
        }), input);
    }
    if (num < 10) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
        }), input);
    }
    if (num < 100) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
        }), input);
    }
    if (num < 1000) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }), input);
    }
    if (num < 10000) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }), input);
    }
    if (num < 100000) {
        return trimTrailingZero(parseFloat(num).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }), input);
    }
    if (isMobileDevice || screenWidth < 1248) {
        limit = 6;
    }    else {
        limit = 7;
    }

    return customDigitFormat(num, limit);
};
// If input has trailing zeros, cut them as long as original does not have more decimals
// ex: input: 1.0000, original: 1.0000001, then do not cut
// input: 1.0000, original: 1, then cut .0000
export const trimTrailingZero = (input, original) => {
    // Get original decimal length
    let numOriginal = original;
    if (typeof numOriginal === 'string') {
        numOriginal = numOriginal.replace(',', '');
        numOriginal = Number.parseFloat(numOriginal) || 0;
    }
    const decimalOriginal = numOriginal - Number.parseInt(numOriginal);

    let numInput = input;
    if (typeof numInput === 'string') {
        numInput = numInput.replace(',', '');
        numInput = Number.parseFloat(numInput) || 0;
    }
    const decimalInput = numInput - Number.parseInt(numInput);

    if (decimalOriginal - decimalInput !== 0) {
        return input;
    }

    // Get input decimal position
    let strInput = String(input);
    let decimalPosition = strInput.lastIndexOf('.');

    // If there is no decimal just return
    if (decimalPosition === -1) {
        return input;
    }

    // else cut 0s
    let i = strInput.length - 1;
    while (i >= 0 && strInput[i] === '0' && i > decimalPosition) {
        i--;
    }

    if (strInput[i] === '.') {
        i--;
    }

    return strInput.substr(0, i + 1);
};

export const formatNegativeNumber = numStr => {
    if (numStr.indexOf('-') > -1) {
        return `-$${numStr.substr(1)}`;
    }
    return `+$${numStr}`;
};

export const formatNegativeNumberSecond = numStr => {
    numStr = format2DigitString(numStr);
    if (numStr.indexOf('-') > -1) {
        return `- $${numStr.substr(1)}`;
    }
    return `+ $${numStr}`;
};

export const formatNegativeNumberWithCurrency = (numStr, currency, isDefaultCrypto) => {
    if (numStr.indexOf('-') > -1) {
        return !isDefaultCrypto ? `-${currency + numStr.substr(1)}` : `-${numStr.substr(1)}`;
    }
    return !isDefaultCrypto ? `+${currency + numStr}` : `+${numStr}`;
};

export const highlightSearchDom = (src, search) => {
    if (!src || !search) {
        return src;
    }

    let positions = [];
    try {
        let regex = new RegExp(search, 'gi');
        src.replace(regex, (match, offset) => {
            positions.push(offset);
        });
    } catch (e) {
        return src;
    }

    if (positions.length === 0) {
        return src;
    }

    let results = [];
    let endCursor = 0;

    for (let i = 0; i < positions.length; i++) {
        results.push(<React.Fragment key={i + 't'}>{src.substring(endCursor, positions[i])}</React.Fragment>);
        results.push(<span key={i + 's'}>{src.substring(positions[i], positions[i] + search.length)}</span>);
        endCursor = positions[i] + search.length;
    }

    results.push(src.substring(endCursor));
    return results;
};

export const getNumPadFont = digits => {

    if (digits < 3) {
        return {
            bigSize: 194,
            smallSize: 100,
        };
    }
    if (digits < 5) {
        return {
            bigSize: 160,
            smallSize: 86,
        };
    }
    if (digits < 7) {
        return {
            bigSize: 126,
            smallSize: 65,
        };
    }
    if (digits < 9) {
        return {
            bigSize: 90,
            smallSize: 48,
        };
    }
    if (digits < 11) {
        return {
            bigSize: 72,
            smallSize: 40,
        };
    }
    if (digits < 13) {
        return {
            bigSize: 60,
            smallSize: 32,
        };
    }
    if (digits < 15) {
        return {
            bigSize: 50,
            smallSize: 28,
        };
    }
    if (digits < 17) {
        return {
            bigSize: 40,
            smallSize: 22,
        };
    }
    if (digits < 19) {
        return {
            bigSize: 30,
            smallSize: 18,
        };
    }
    return {
        bigSize: 24,
        smallSize: 16,
    };
};

export const imageExists = (url, callback) => {
    let img = new Image();
    img.addEventListener('load', () => {
        callback(true);
    });
    img.addEventListener('error', () => {
        callback(false);
    });
    img.src = url;
};
// var imageUrl = 'http://www.google.com/images/srpr/nav_logo14.png';
// imageExists(imageUrl, function(exists) {
//     console.log('RESULT: url=' + imageUrl + ', exists=' + exists);
// });

export const getScreenInfo = (withGridDimensions) => {
    // DON'T ADD NEW CODE HERE
    // Create a separate function and use it
    const { width: screenWidth, height: screenHeight } = getScreenDimensions();

    const isMobileDevice = isMobile({ tablet: true });
    const isMobilePortrait = isMobileDevice ? screenWidth < screenHeight : false;
    const isMobileLandscape = isMobileDevice ? screenWidth >= screenHeight : false;
    const isSmallWidth = screenWidth < 850 && !isMobileDevice;

    let gridWidth;
    let gridHeight;
    let leftSidebarWidth;
    let leftSidebarHeight;
    if (withGridDimensions) {
        const GridElement = document.getElementById('grid');
        const LeftSidebarElement = document.getElementById('left-sidebar');
        gridWidth = (GridElement && GridElement.clientWidth) || screenWidth;
        gridHeight = (GridElement && GridElement.clientHeight) || screenHeight;
        leftSidebarWidth = (LeftSidebarElement && LeftSidebarElement.clientWidth) || screenWidth;
        leftSidebarHeight = (LeftSidebarElement && LeftSidebarElement.clientHeight) || screenHeight;
    }

    return {
        screenWidth,
        screenHeight,
        isMobileDevice,
        isMobilePortrait,
        isMobileLandscape,
        isSmallWidth,
        gridWidth,
        gridHeight,
        leftSidebarWidth,
        leftSidebarHeight,
    };
};

window.getScreenInfo = getScreenInfo;

export const isTokenExpired = (token) => {
    try {
        const now = Date.now() / 1000;
        const exp = decode(token).exp || now;
        return now >= exp;
    } catch (e) {
        return true;
    }
};

export const refreshToken = () => {
    return new Promise((resolve, reject) => {
        const authToken = localStorage.getItem('authToken');
        const deviceToken = localStorage.getItem('deviceToken') || '';

        if (authToken && isTokenExpired(authToken) && !isTokenExpired(deviceToken)) {
            refreshSecurityToken(deviceToken)
                .then(data => {
                    const token = data.ok.sessionToken;
                    const payload = decode(token);
                    localStorage.setItem('authClientId', payload.sub || '');
                    localStorage.setItem('authToken', token);
                    resolve(true);
                })
                .catch(err => {
                    resolve(false);
                });
        }
    });
};

export const toFixedWithoutRounding = (num, fixed) => {
    const re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?'); // eslint-disable-line
    return (num || 0).toString().match(re)[0];
};

export const getDenoSymbol = (deno) => {
    if (deno > 8) {
        return {
            unit: Math.pow(10, deno - 9),
            unitSymbol: 'B',
        };
    }

    if (deno > 5) {
        return {
            unit: Math.pow(10, deno - 6),
            unitSymbol: 'M',
        };
    }

    if (deno > 2) {
        return {
            unit: Math.pow(10, deno - 3),
            unitSymbol: 'K',
        };
    }

    if (deno > -1) {
        return {
            unit: Math.pow(10, deno),
            unitSymbol: '',
        };
    }

    if (deno > -4) {
        return {
            unit: Math.pow(10, deno + 3),
            unitSymbol: 'm',
        };
    }

    if (deno > -8) {
        return {
            unit: 1 / Math.pow(10, -(deno + 3)),
            unitSymbol: 'm',
        };
    }

    return {
        unit: Math.pow(10, deno + 6),
        unitSymbol: 'μ',
    };
};

export const getUpperLowerValue = (balance = 0) => {
    let balanceStr = balance.toString().split('.');

    if (balance < 1) {
        return {
            upper: balanceStr[0] + '',
            lower: balanceStr[1] ? '.' + balanceStr[1].substr(0, 4) : '',
        };
    }

    if (balance < 1000) {
        return {
            upper: balanceStr[0] + '',
            lower: balanceStr[1] ? '.' + balanceStr[1].substr(0, 2) : '',
        };
    }

    if (balance < 1000000) {
        return {
            upper: Math.floor(balance / 1000).toString() + '',
            lower: ',' + Math.floor(balance).toString().substr(Math.floor(balance).toString().length - 3, 3),
        };
    }

    if (balance < 1000000000) {
        return {
            upper: Math.floor(balance / 1000000).toString() + 'M',
            lower: '.' + Math.floor(balance % 1000000).toString().substr(0, 4),
        };
    }

    return {
        upper: Math.floor(balance / 1000000000).toString() + 'B',
        lower: '.' + Math.floor(balance % 1000000000).toString().substr(0, 4),
    };
};

export const commafy = (num) => {
    var str = num.toString().split('.');
    if (str[0].length >= 4) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    return str.join('.');
};

export const commafyDigitFormat = (num, digitLength) => {
    var str;
    var ePlus = num.toString().split('e+')[1];
    var eMinus = num.toString().split('e-')[1];
    var catenateSymbol = '';
    var decimalDigits = 0;
    if (ePlus) {
        decimalDigits = digitLength - 4;
        catenateSymbol = 'e+';
        str = num.toString().split(catenateSymbol);
        str[0] = parseFloat(str[0]).toFixed(decimalDigits);
    } else if (eMinus) {
        decimalDigits = digitLength - 4;
        catenateSymbol = 'e-';
        str = num.toString().split(catenateSymbol);
        str[0] = parseFloat(str[0]).toFixed(decimalDigits);
    } else {
        catenateSymbol = '.';
        num = Number(num).toPrecision(digitLength);
        str = num.toString().split(catenateSymbol);
    }
    if (str[0].length >= 4 && catenateSymbol === '.') {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    return str.join(catenateSymbol);
};

export const noop = () => {};

const getLeadingExtraZeroes = (onlyDigitsIntegerPart, fractionalPart, trailingZeros, maxNumberOfDigits) => {
    const numberOfDigits = onlyDigitsIntegerPart.length + fractionalPart.length + trailingZeros.length;
    const numberOfLeadingExtraZeroes = maxNumberOfDigits - numberOfDigits;
    if (numberOfLeadingExtraZeroes > 0) {
        return Array(numberOfLeadingExtraZeroes).fill('0')
            .map((item, i) => {
                const position = numberOfLeadingExtraZeroes - (i + 1) + onlyDigitsIntegerPart.length;
                if (position % 3 === 0) {
                    return `${item},`;
                }
                return item;
            })
            .join('');
    }
    return '';
}

const decimalSeparator = getSeparator();
export const getSplittedNumber = (priceString, maxNumberOfDigits) => {
    if (!parseFloat(priceString)) {
        // only zeroes
        return {
            integerPart: '',
            fractionalPart: '',
            resultNumber: '',
            trailingZeros: '',
            leadingExtraZeroes: '',
            showDecimalSeparator: false,
            decimalSeparator,
        };
    }

    let resultNumber = priceString;
    let [integerPart = '', fractionalPart = ''] = `${resultNumber}`.split(decimalSeparator);

    const trailingZerosRegex = fractionalPart.match(/0+$/);
    const trailingZeros = trailingZerosRegex ? trailingZerosRegex[0] : '';

    if (trailingZeros) {
        fractionalPart = fractionalPart.slice(0, trailingZerosRegex.index);
    }

    const showDecimalSeparator = !!fractionalPart || !!trailingZeros;
    const onlyDigitsIntegerPart = integerPart.split(',').join('');
    const leadingExtraZeroes = getLeadingExtraZeroes(onlyDigitsIntegerPart, fractionalPart, trailingZeros, maxNumberOfDigits);

    return {
        integerPart,
        fractionalPart,
        resultNumber,
        trailingZeros,
        leadingExtraZeroes,
        showDecimalSeparator,
        decimalSeparator,
    };
};

export const getScreenDimensions = () => {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
    };
}
