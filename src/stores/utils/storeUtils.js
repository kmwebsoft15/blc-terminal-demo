import distanceInWords from 'date-fns/distance_in_words';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import moment from 'moment';

import { roundToFixedNum } from '@/utils';

export const isDiffArr = (a = [], b = []) => {
    let i = -1;
    let alen = a.length;

    while (++i < alen) {
        if (a[i] !== b[i]) {
            return true;
        }
    }
    return false;
};

export const updateMapStoreFromArrayForOrderBook = (nextData, maxRows = 0, isShift = false, isBuy) => {
    const size = nextData.length;
    const result = [];
    for (let i = 0; i < size; i++) {
        const item = nextData[i];
        let totalPrice = 0;

        if (isBuy) {
            totalPrice = i < size - 1 ? nextData[i + 1][0] || 0 : undefined;
        } else {
            totalPrice = i < size - 1 ? (i <= 0 ? item[0] : nextData[i - 1][0]) || 0 : undefined;
        }
        result.push({
            price: item[0],
            amount: item[1],
            amountQuote: item[0] * item[1],
            exchange: item[2] ? item[2].toUpperCase() : '',
            total: totalPrice,
        });
    }
    if (result[size - 1]) result[size - 1].total = result[size - 1].price;

    const indexToStart = isShift ? Math.max(result.length - maxRows, 0) : 0;
    const count = isShift ? result.length : maxRows;
    return result.slice(indexToStart, count);
};

export const shiftMapStoreFromArray = (mapStore = new Map(), updateArr = [], maxRows = 0) => {
    const updateArrLen = updateArr.length;

    if (updateArrLen >= maxRows) {
        let i = -1;
        while (updateArr[++i] && i < maxRows) {
            mapStore.set(i, updateArr[i]);
        }
    } else {
        let tmp = new Map();
        let carryLimit = maxRows - updateArrLen;
        let i = -1;
        let j = updateArrLen - 1;

        // cache old indices
        while (++i < carryLimit && mapStore.has(i) && ++j < maxRows) {
            tmp.set(j, mapStore.get(i));
        }

        // then prepend incoming updateArr to mapStore
        i = -1;
        while (++i < updateArrLen) {
            mapStore.set(i, updateArr[i]);
        }


        for (let [k, v] of tmp) {
            mapStore.set(k, v);
        }
    }
};

export const convertArrToMapWithFilter = (mapStore, updateArr) => {
    let j = 0;

    for (let i = 0; i < updateArr.length; i++) {
        if (updateArr[i] && updateArr[i].Coin !== 'BCT') {
            mapStore.set(j, updateArr[i]);
            j++;
        }
    }
};

export const initRequest = (RequestInit, throttleMs, makeRequest) => {
    return RequestInit({ throttleMs }).then(makeRequest);
};

export const formatNumForDisplay = (num) => roundToFixedNum(num, 2);

export const calculateFee = (size, price, precision) => formatNumForDisplay(size * price * 0.001, precision);

export const getTimeFormatted = (time) => distanceInWords(
    parse(time),
    new Date(),
    { includeSeconds: true }
);

export const scheduleVisualDOMUpdate = fn => {
    requestAnimationFrame(fn);
};

export const getDateFormatted = (time) => format(new Date(time), 'MM.DD.YYYY');

export const getNewDateFormatted = (time) => {
    return moment(time).format('MMM D');
};
