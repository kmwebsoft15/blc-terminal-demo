import { computed, observable, runInAction, reaction } from 'mobx';
import { pageIsVisible, getScreenInfo } from '../utils';
import { getOrderBookDataFeed } from '../lib/ws/feed';
import { STATE_KEYS } from './ConvertStore';

const throttleMs = 2000;
const levels = 150;

class OrderBookStore {
    @observable.shallow Asks = [];
    @observable.shallow Bids = [];
    @observable midPrice = 0;
    @observable pricesByExchangeCCA = new Map();
    @observable isPricesByExchangeCCASorted = 0; // 0: default, 1: no exchanges, 2: several exchanges
    @observable base = ''; // incoming data feed's base coin
    @observable quote = ''; // incoming data feed's quote coin
    @observable isCoinPairInversed = false;
    @observable isOrderBookStop = false; // FALSE: no data stream, TRUE: data stream exists
    @observable isFetchingBestRates = false;
    @observable isDGLoaded = false;
    @observable isSymbolUpdated = false;
    @observable symbol = '';

    orderbookArrivedTime = Date.now();
    exchange = 'Global';
    convertState = STATE_KEYS.coinSearch;
    exchanges = {};
    marketsStore;
    isDepthChartMode = false;
    isMobileDevice = false;

    constructor(instrumentStore, viewModeStore, exchangesStore, convertStore, marketsStore, settingsStore) {
        this.isMobileDevice = getScreenInfo().isMobileDevice;
        this.exchanges = this.loadFromStorage();
        this.marketsStore = marketsStore;

        instrumentStore.instrumentsReaction((base, quote) => {
            this.resetStore(base, quote);
        }, true);

        reaction(
            () => ({ depthChartMode: viewModeStore.depthChartMode }),
            ({ depthChartMode }) => {
                this.isDepthChartMode = depthChartMode;
                if (depthChartMode) {
                    if (this.base && this.quote && !this.isMobileDevice) {
                        this.subscribe();
                    }
                } else {
                    this.unsubscribe();
                }
            },
            { fireImmediately: true }
        );

        reaction(
            () => ({ exchanges: exchangesStore.exchanges }),
            ({ exchanges }) => {
                if (!this.isMobileDevice) {
                    this.exchanges = exchanges;
                    this.subscribe();
                }
            }
        );

        reaction(
            () => ({ convertState: convertStore.convertState }),
            ({ convertState }) => {
                this.convertState = convertState;
            }
        );

        setInterval(() => {
            if (this.subscribe) {
                const delta = Date.now() - this.orderbookArrivedTime;
                if (delta > throttleMs * 2) {
                    this.isOrderBookStop = true;
                }
            }
        }, throttleMs);
    }

    loadFromStorage = () => {
        const exchangesStr = localStorage.getItem('exchanges') || '{}';
        try {
            return JSON.parse(exchangesStr) || {};
        } catch (e) {
            console.log(e);
            return true;
        }
    };

    resetStore = (base, quote) => {
        runInAction(() => {
            this.Asks = [];
            this.Bids = [];
            this.isDGLoaded = false;
            this.isCoinPairInversed = false;

            try {
                const newPair = this.marketsStore.markets[`${base}-${quote}`];
                const pair = newPair.split('-');
                if (pair.length === 2) {
                    this.base = pair[0];
                    this.quote = pair[1];
                    this.isCoinPairInversed = base === this.quote && quote === this.base;
                } else {
                    this.base = base;
                    this.quote = quote;
                }
            } catch (e) {
                this.base = base;
                this.quote = quote;
            }

            this.pricesByExchangeCCA.clear();
            this.isPricesByExchangeCCASorted = 0;

            base = (base || '').replace('F:', '');
            quote = (quote || '').replace('F:', '');
            const symbol = base + '-' + quote;

            this.fetchBestRates(symbol);
            const isSymbolUpdated = this.symbol !== symbol;
            if (isSymbolUpdated) {
                this.isSymbolUpdated = isSymbolUpdated;
                this.symbol = symbol;
            }

            if (this.isDepthChartMode && !this.isMobileDevice) {
                this.subscribe();
            }
        });
    };

    @computed get highestBidPrice() {
        return this.Bids && this.Bids.length > 0 ? this.Bids[0][0] : 0;
    }

    @computed get lowestAskPrice() {
        return this.Asks && this.Asks.length > 0 ? this.Asks[0][0] : 0;
    }

    async fetchBestRates(symbol) {
        // https://rest.qa.bct.trade/api/exchange-prices/BTC-USDT
        const url = `https://rest.qa.bct.trade/api/exchange-prices/${symbol}`;

        this.isFetchingBestRates = true;

        try {
            const rawResponse = await fetch(url);
            const response = await rawResponse.json();

            runInAction(() => {
                this.isFetchingBestRates = false;

                const { data, ok } = response;

                if (ok !== 1) {
                    this.pricesByExchangeCCA.clear();
                    this.isPricesByExchangeCCASorted = 1;
                    return;
                }

                if (data && data.prices) {
                    for (let i = 0; i < data.prices.length; i++) {
                        this.pricesByExchangeCCA.set(i, [data.prices[i].exchangeName, data.prices[i].price]);
                    }

                    this.isPricesByExchangeCCASorted = data.prices.length > 0 ? 2 : 1;
                }
            });
        } catch (e) {
            this.isFetchingBestRates = false;
            console.log('[fetchBestRates error]', e);
        }
    }

    patchLevels = data => {
        if (!data.length) {
            return data;
        }

        const spread = Math.abs(data[data.length - 1][0] - data[0][0]);
        const step = spread / levels;

        let prevItem;
        return data.slice(1).reduce((res, [price, amount]) => {
            if (!prevItem) {
                prevItem = [price, amount];
                return res;
            }

            const [prevPrice, prevAmount] = prevItem;

            if (Math.abs(price - prevPrice) < step) {
                prevItem = [(price + prevPrice) / 2, amount + prevAmount];
            } else {
                res.push(prevItem);
                prevItem = [price, amount];
            }
            return res;
        }, [data[0]]);
    };

    handleIncomingOrderBooksFrames({ Asks = [], Bids = [], Symbol = '' } = {}) {
        if (!pageIsVisible() || this.convertState !== STATE_KEYS.coinSearch) {
            return;
        }

        runInAction(() => {
            this.orderbookArrivedTime = Date.now();
            this.isOrderBookStop = false;

            const bestBuy = Asks[Asks.length - 1][0];
            const bestSell = Bids[0][0];

            this.Bids = this.patchLevels(Bids);
            this.Asks = this.patchLevels(Asks.reverse());
            this.midPrice = (bestSell + bestBuy) / 2;

            const isDGLoaded = this.Asks.length > 10 && this.Bids.length > 10;
            if (isDGLoaded !== this.isDGLoaded) {
                this.isDGLoaded = isDGLoaded;
            }

            this.symbol = Symbol;
        });
    }

    subscribe = () => {
        let exchanges = [];
        for (let property in this.exchanges) {
            if (this.exchanges[property] && this.exchanges[property].active && property !== 'Global') {
                exchanges.push(property);
            }
        }

        this.unsubscribe();

        this.subscription = getOrderBookDataFeed({
            symbol: `${this.base}-${this.quote}`,
            levels,
            throttleMs,
            min: null,
            max: null,
            exchanges
        }).subscribe(this.handleIncomingOrderBooksFrames.bind(this));
    };

    unsubscribe = () => {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined;
        }
    };
}

export default (instrumentStore, viewModeStore, exchangesStore, convertStore, marketsStore, settingsStore) =>
    new OrderBookStore(instrumentStore, viewModeStore, exchangesStore, convertStore, marketsStore, settingsStore);
