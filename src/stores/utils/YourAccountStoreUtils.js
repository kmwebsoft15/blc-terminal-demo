/* eslint-disable */
import partial from 'lodash.partial';
import uniq from 'lodash.uniq';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import {
    PORTFOLIO_LABEL_AMOUNT,
    PORTFOLIO_LABEL_COIN,
    PORTFOLIO_LABEL_POSITION,
    PORTFOLIO_LABEL_PRICE,
    PORTFOLIO_LABEL_CHANGE,
    PORTFOLIO_LABEL_NAME,
    PORTFOLIO_LABEL_MKTCAP,
    PORTFOLIO_LABEL_TOTALVOLUME24H,
    PORTFOLIO_LABEL_ISWALLETENABLED
} from '../../config/constants';
import { genRandFloat } from '../../mock/dataGeneratingUtils';
import coindata from '../../mock/coin-data-map';// TODO: MOCK DATA -- WILL REMOVE
import ALL_COINS from '../../mock/coin-list';

export const normalizeYourAccountPositionData = (Positions, response) => {
    return Positions.map((position) => {
        const {
            USD: cryptoCompareCoinValue, CHANGE: cryptoCompareChangeValue, MKTCAP: cryptoCompareMarketcap, TOTALVOLUME24H: cryptoCompareVolume,
        } = response[position[PORTFOLIO_LABEL_COIN]] || {};
        const coinValue = !!cryptoCompareCoinValue ? cryptoCompareCoinValue : 0;
        position[PORTFOLIO_LABEL_AMOUNT] = position[PORTFOLIO_LABEL_POSITION] * coinValue;
        position[PORTFOLIO_LABEL_PRICE] = coinValue;
        position[PORTFOLIO_LABEL_CHANGE] = cryptoCompareChangeValue || 0;
        position[PORTFOLIO_LABEL_MKTCAP] = cryptoCompareMarketcap;
        position[PORTFOLIO_LABEL_TOTALVOLUME24H] = cryptoCompareVolume;
        const symbol = position[PORTFOLIO_LABEL_COIN];
        position[PORTFOLIO_LABEL_NAME] = (symbol in coindata && 'name' in coindata[symbol]) ? coindata[symbol].name : '';
        return position;
    });
};

export const normalizeYourAccountPositionDataWithBaseCoins = (Positions, baseCoinsHash) => {
    return Positions.map(position => {
        const {
            price: cryptoCompareCoinValue, priceChange24: cryptoCompareChangeValue, marketCap: cryptoCompareMarketcap, marketVolume24: cryptoCompareVolume,
        } = baseCoinsHash[position[PORTFOLIO_LABEL_COIN]] || {};
        const coinValue = !!cryptoCompareCoinValue ? cryptoCompareCoinValue : 0;
        position[PORTFOLIO_LABEL_AMOUNT] = position[PORTFOLIO_LABEL_POSITION] * coinValue;
        position[PORTFOLIO_LABEL_PRICE] = coinValue;
        position[PORTFOLIO_LABEL_CHANGE] = cryptoCompareChangeValue || 0;
        position[PORTFOLIO_LABEL_MKTCAP] = cryptoCompareMarketcap;
        position[PORTFOLIO_LABEL_TOTALVOLUME24H] = cryptoCompareVolume;
        const symbol = position[PORTFOLIO_LABEL_COIN];
        position[PORTFOLIO_LABEL_NAME] = (symbol in coindata && 'name' in coindata[symbol]) ? coindata[symbol].name : '';
        return position;
    });
};

export const normalizeYourAccountPositionDataWithAllCoins = (Positions, allCoins) => {
    let finalPositions = [];
    let newPositions = [...Positions];
    let newAllCoins = [...allCoins];

    const isLoggedIn = localStorage.getItem('authToken');
    const isShortSell = localStorage.getItem('isShortSell') === 'true';

    for (let i = 0; i < newPositions.length; i++) {
        let position = { ...newPositions[i] };

        // if (!isShortSell && position[PORTFOLIO_LABEL_COIN] === 'BCT') {
        //     continue;
        // }

        const index = findIndex(newAllCoins, { coin: position[PORTFOLIO_LABEL_COIN] });

        const {
            price: cryptoCompareCoinValue, priceChange24: cryptoCompareChangeValue, marketCap: cryptoCompareMarketcap, marketVolume24: cryptoCompareVolume, fullName: coinFullName, isEnabled: isWalletEnabled,
        } = newAllCoins[index] || {};
        const coinValue = !!cryptoCompareCoinValue ? cryptoCompareCoinValue : 0;
        position[PORTFOLIO_LABEL_AMOUNT] = position[PORTFOLIO_LABEL_POSITION] * coinValue;
        position[PORTFOLIO_LABEL_PRICE] = coinValue;
        position[PORTFOLIO_LABEL_CHANGE] = cryptoCompareChangeValue || 0;
        position[PORTFOLIO_LABEL_MKTCAP] = cryptoCompareMarketcap;
        position[PORTFOLIO_LABEL_TOTALVOLUME24H] = cryptoCompareVolume;
        position[PORTFOLIO_LABEL_ISWALLETENABLED] = isWalletEnabled;
        const symbol = position[PORTFOLIO_LABEL_COIN];
        position[PORTFOLIO_LABEL_NAME] = coinFullName || ''; //(symbol in coindata && 'name' in coindata[symbol]) ? coindata[symbol].name : '';

        finalPositions.push(position);
        newAllCoins.splice(index, 1);
    }

    for (let i = 0; i < newAllCoins.length; i++) {
        let position = newAllCoins[i];

        // if (!isShortSell && position[PORTFOLIO_LABEL_COIN] === 'BCT') {
        //     continue;
        // }

        const {
            price: cryptoCompareCoinValue, priceChange24: cryptoCompareChangeValue, marketCap: cryptoCompareMarketcap, marketVolume24: cryptoCompareVolume, fullName: coinFullName, isEnabled: isWalletEnabled,
        } = position || {};
        const coinValue = !!cryptoCompareCoinValue ? cryptoCompareCoinValue : 0;
        position[PORTFOLIO_LABEL_AMOUNT] = position[PORTFOLIO_LABEL_POSITION] * coinValue;
        position[PORTFOLIO_LABEL_PRICE] = coinValue;
        position[PORTFOLIO_LABEL_CHANGE] = cryptoCompareChangeValue || 0;
        position[PORTFOLIO_LABEL_MKTCAP] = cryptoCompareMarketcap;
        position[PORTFOLIO_LABEL_TOTALVOLUME24H] = cryptoCompareVolume;
        position[PORTFOLIO_LABEL_ISWALLETENABLED] = isWalletEnabled;
        const symbol = position[PORTFOLIO_LABEL_COIN];
        position[PORTFOLIO_LABEL_NAME] = coinFullName || '';//(symbol in coindata && 'name' in coindata[symbol]) ? coindata[symbol].name : '';

        if (!isLoggedIn) {
            position[PORTFOLIO_LABEL_POSITION] = 1; // it is for unauthorized user's every 1 balance.
            if (symbol !== 'BCT') {
                finalPositions.push(position);
            }
        } else {
            position[PORTFOLIO_LABEL_POSITION] = 0; // it is for authorized user's balance.
            finalPositions.push(position);
        }
    }
    if (finalPositions.length > 0) {
        const index = finalPositions.findIndex(x => (x && x.Coin && x.Coin === 'USDT'));
        const usdtItem = finalPositions[index];
        finalPositions.splice(index, 1);
        finalPositions.unshift(usdtItem);
    }
    return finalPositions;
};

export const registerForPositionReplies = (PositionReply, ClientId, next, error) => {
    return PositionReply({ ClientId }).subscribe({
        next,
        error,
    });
};

export const updatePositionError = (e) => console.log(e);

export const normalizePortfolioPieChartData = (totalAccountBalance, [symbol, portfolioData]) => {
    return [
        symbol,
        Number(totalAccountBalance) !== 0 ? Number(portfolioData.amount) / Number(totalAccountBalance) : 0,
        Number(portfolioData.amount),
        portfolioData.position
    ];
};

export const makePositionRequest = (ClientId, ProgramId, { SubmitPositionRequest }) => {
    SubmitPositionRequest({ ClientId, ProgramId });
};

const splitByNumber = (arr, num = 50) => {
    let offset = 0;
    let limit = num;
    const chunks = [];
    for (let i = 1; i <= Math.ceil(arr.length / num); i++) {
        chunks.push(arr.slice(offset, offset + limit));
        offset = limit * i;
    }

    return chunks;
};

export const updatePosition = (updateYourAccountStoreData, portfolioData) => {
    if (portfolioData === undefined) return;
    const { event, data: { body: { messages } = {} } = {} } = portfolioData;
    if (messages === undefined || messages.length === 0) {
        return;
    }

    let [{ Positions }] = messages;

    // // TODO add all coins list to Positions
    // let missingCoins = [];
    //
    // for (let i = 0; i < ALL_COINS.length; i++) {
    //     if (!find(Positions, { Coin: ALL_COINS[i] })) {
    //         missingCoins.push({
    //             Address: '',
    //             Coin: ALL_COINS[i],
    //             Position: 0,
    //             IsMock: true, // show if it is from backend or frontend; (false: from backend, true: from frontend)
    //         });
    //     }
    // }
    //
    // Positions = Positions.concat(missingCoins);

    // skip fetching prices from cryptocompare, reserving original code =========================================
    if (!!Positions) {
        updateYourAccountStoreData(Positions, null, event);
    }

    //
    // if (!!Positions) {
    //     // skip fetching prices from cryptocompare, reserving original code =========================================
    //     updateYourAccountStoreData(Positions);
    //     return;
    //
    //     const symbolList = uniq(Positions.map(position => position[PORTFOLIO_LABEL_COIN]));
    //     const symbolListChunks = splitByNumber(symbolList);
    //
    //     const promises = symbolListChunks
    //         .map(chunk => {
    //             const url = `https://min-api.cryptocompare.com/data/pricemultifull?&fsyms=${chunk}&tsyms=USD`;
    //             return fetch(url)
    //                 .then(async response => {
    //                     const coins = await response.json();
    //
    //                     let res = {};
    //
    //                     if (coins && coins.RAW) {
    //                         for (let coin in coins.RAW) {
    //                             if (coins.RAW[coin]) {
    //                                 res[coin] = {
    //                                     USD: coins.RAW[coin].USD.PRICE,
    //                                     CHANGE: coins.RAW[coin].USD.CHANGE24HOUR,
    //                                     MKTCAP: coins.RAW[coin].USD.MKTCAP,
    //                                     TOTALVOLUME24H: coins.RAW[coin].USD.TOTALVOLUME24H,
    //                                 };
    //                             }
    //                         }
    //                     }
    //
    //                     return res;
    //                 });
    //         });
    //     Promise.all(promises)
    //         .then(res => {
    //             return res
    //                 .reduce((a, c) => {
    //                     return {
    //                         ...a,
    //                         ...c,
    //                     };
    //                 }, {});
    //         })
    //         .then(partial(updateYourAccountStoreData, Positions))
    //         .catch(err => console.log(`YourAccountStore Error:${err}`));
    //
    //     // console.log(promises);
    //     // const promises = symbolList.slice(0, 60)
    //     // const url = `https://min-api.cryptocompare.com/data/pricemulti?&fsyms=${symbolList}&tsyms=USD`;
    //     // fetch(url)
    //     //     .then(response => response.json()) // TODO: Generate our own real "Amount" on backend
    //     //     .then(partial(updateYourAccountStoreData, Positions))
    //     //     .catch(err => console.log(`YourAccountStore Error:${err}`));
    // }
};

export const updatePortfolioPieChartData = (acc, position) => {
    const positionSymbol = position[PORTFOLIO_LABEL_COIN];
    // acc[positionSymbol] = !!acc[positionSymbol] ? acc[positionSymbol] + positionAmount : positionAmount;
    acc[positionSymbol] = {
        amount: Number(position[PORTFOLIO_LABEL_AMOUNT]),
        position: Number(position[PORTFOLIO_LABEL_POSITION]),
    };
    return acc;
};
