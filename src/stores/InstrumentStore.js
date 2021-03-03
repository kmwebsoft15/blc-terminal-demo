/* eslint-disable */
import { observable, action, computed, reaction, autorun } from 'mobx';
import uniq from 'lodash/uniq';

import { CoinsRequest } from '../lib/bct-ws';
import COIN_DATA_MAP from '../mock/coin-data-map';
import ALL_COIN_LIST from '../mock/coin-list';

const defaultBase = 'BTC';
const defaultQuote = 'USDT';

// Append all coins as [COIN_DATA_MAP]
const appendAllCoins = ({ excludeCoin = '', addAllCoins = false, addAllCoinsAsEnabled = false }) => (coinsEnabled) => {
    let allCoins = [];

    for (let i = 0; i < coinsEnabled.length; i++) {
        let coin = coinsEnabled[i][0];
        const symbolId = coinsEnabled[i][1];
        const isEnabled = coinsEnabled[i][2] === 1;
        const price = coinsEnabled[i][3];
        const priceChange24 = coinsEnabled[i][4];
        const marketVolume24 = coinsEnabled[i][5];
        const marketCap = coinsEnabled[i][6];

        if (coin !== excludeCoin && !coin.includes('F:')) {
            if (COIN_DATA_MAP[coin]) {
                allCoins.push({
                    ...COIN_DATA_MAP[coin],
                    price,
                    priceChange24,
                    marketVolume24,
                    marketCap,

                    enabled: isEnabled,
                    symbolId: symbolId,
                });
            } else {
                allCoins.push({
                    name: coin,
                    symbol: coin,
                    enabled: isEnabled,
                    symbolId: symbolId,
                });
            }
        }
    }

    if (addAllCoins) {
        for (let i = 0; i < ALL_COIN_LIST.length; i++) {
            if (ALL_COIN_LIST[i] !== excludeCoin) {
                let isExist = false;
                for (let j = 0; j < coinsEnabled.length; j++) {
                    if (coinsEnabled[j][0] === ALL_COIN_LIST[i]) {
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) {
                    if (COIN_DATA_MAP[ALL_COIN_LIST[i]]) {
                        allCoins.push({
                            ...COIN_DATA_MAP[ALL_COIN_LIST[i]],
                            enabled: addAllCoinsAsEnabled,
                            symbolId: '',
                        });
                    } else {
                        allCoins.push({
                            name: ALL_COIN_LIST[i],
                            symbol: ALL_COIN_LIST[i],
                            enabled: addAllCoinsAsEnabled,
                            symbolId: '',
                        });
                    }
                }
            }
        }
    }

    return allCoins;
};

// Get coin list from api, make list: [{coin, enabled}]
const getBases = () => CoinsRequest({ Coin: '*' })
    .then(appendAllCoins({ excludeCoin: '', addAllCoins: false }));

// const getQuotesForBase = Coin => CoinsRequest({ Coin })
//     .then(appendAllCoins({ excludeCoin: Coin, addAllCoins: true, addAllCoinsAsEnabled: true }));
const getQuotesForBase = Coin => CoinsRequest({ Coin: '*' })
    .then(appendAllCoins({ excludeCoin: Coin, addAllCoins: false }));

const getNextSelectedQuote = (prevQuote, quotes) => {
    const quoteFound = quotes.find(x => x.symbol === prevQuote);
    return quoteFound ? quoteFound.symbol : quotes[0].symbol;
};

class InstrumentStore {
    @observable isLoaded = false;
    @observable Bases = [];
    @observable Quotes = [];
    @observable RouterCoin = '';
    @observable selectedBase = null;
    @observable selectedQuote = null;
    @observable selectedBaseEnabled = false;
    @observable selectedQuoteEnabled = false;
    @observable activePositions = [];

    @observable isConfirmMode = false;

    @observable recentQuotes = ['BTC', 'ETH', 'USDT'];

    constructor () {
        this.baseCoinsReaction = this.baseCoinsReaction.bind(this);
        this.__setDefaultBasesQuotes();
    }

    async __setDefaultBasesQuotes () {
        this.Bases = await getBases();
        this.Quotes = await getQuotesForBase(defaultBase);
        this.setBaseSync(this.RouterCoin ? this.RouterCoin: defaultBase);
        this.setQuote(this.RouterCoin ? defaultBase : defaultQuote);

        this.isLoaded = true;
    }

    @computed({
        equals: ([prevBase, prevQuote], [nextBase, nextQuote]) => {
            if (!(nextBase && nextQuote) && !(prevBase && prevQuote)) return true;
            return nextBase === nextQuote;
        }
    })

    get selectedInstrumentPair () {
        return [this.selectedBase, this.selectedQuote];
    }

    get confirmModeState () {
        return this.isConfirmMode;
    }

    @action.bound
    setBaseSync (base) {
        this.selectedBase = base;

        const selectedBaseMap = this.Bases.find(x => x.symbol === base);
        this.selectedBaseEnabled = !!selectedBaseMap && selectedBaseMap.enabled;
    }

    @action.bound
    setRouterCoin (coin) {
        this.RouterCoin = coin;
    }

    @action.bound
    async setBase (base) {
        this.selectedBase = base;

        const selectedBaseMap = this.Bases.find(x => x.symbol === base);
        this.selectedBaseEnabled = !!selectedBaseMap && selectedBaseMap.enabled;

        // --- We will not allow same coin for BASE AND QUOTE always ---//
        if (this.selectedBase === this.selectedQuote) {
            if (this.selectedBase !== 'BTC') {
                this.setQuote('BTC');
            } else {
                this.setQuote('USDT');
            }
        }
        // this.Quotes = await getQuotesForBase(this.selectedBase);
        // this.setQuote(getNextSelectedQuote(this.selectedQuote, this.Quotes));
    }

    @action.bound
    setQuote (quote) {
        this.selectedQuote = quote;

        const selectedQuoteMap = this.Quotes.find(x => x.symbol === quote);
        this.selectedQuoteEnabled = !!selectedQuoteMap && selectedQuoteMap.enabled;

        // --- We will not allow same coin for BASE AND QUOTE always ---//
        if (this.selectedBase === this.selectedQuote) {
            if (this.selectedBase !== 'BTC') {
                this.setBase('BTC');
            } else {
                this.setBase('USDT');
            }
        }
    }

    @action.bound
    addRecentQuote (quote) {
        this.recentQuotes.push(quote);
        this.recentQuotes = uniq(this.recentQuotes);
    }
    @action.bound
    setActivePostions (positions) {
        this.activePositions = [...positions];
    }

    @action.bound
    async swapBaseQuote () {
        const currentBase = this.selectedBase;
        const currentQuote = this.selectedQuote;

        this.setBaseSync(currentQuote);
        this.Quotes = await getQuotesForBase(currentQuote);

        this.setQuote(getNextSelectedQuote(currentBase, this.Quotes));
    }

    @action.bound setExchFormState (isConfirmMode) {
        this.isConfirmMode = isConfirmMode;
    }

    instrumentsReaction  = (reactionHandler, fireImmediately = false) => {
        return reaction(
            () => this.selectedInstrumentPair,
            ([base, quote]) => {
                if (base && quote) {
                    reactionHandler(base, quote);
                }
            },
            { fireImmediately }
        );
    };

    baseCoinsReaction (reactionHandler, fireImmediately = false) {
        return reaction(
            () => this.Bases,
            (bases) => {
                reactionHandler(bases);
            },
            { fireImmediately }
        );
    }
}

export default () => {
    const store = new InstrumentStore();
    return store;
}
