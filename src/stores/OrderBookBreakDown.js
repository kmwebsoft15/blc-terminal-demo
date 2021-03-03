import {
    computed, observable, runInAction, reaction, action
} from 'mobx';

import { updateMapStoreFromArrayForOrderBook } from './utils/storeUtils';
import { ORDER_BOOK_THROTTLE } from '@/config/constants';
import { getOrderBookBreakdowns } from '@/lib/ws/feed';
import { pageIsVisible } from '@/utils';
import { ORDER_BOOK_ROWS_COUNT } from '@/config/constants';
import { STATE_KEYS } from './ConvertStore';
import { getScreenInfo } from "utils";

const maxRequestLevel = 15;

class OrderBookBreakDownStore {
    @observable.shallow AsksForOrderBook = [];
    @observable.shallow BidsForOrderBook = [];
    @observable base = ''; // incoming data feed's base coin
    @observable quote = ''; // incoming data feed's quote coin
    @observable isOrderBookBreakDownStop = false; // FALSE: no data stream, TRUE: data stream exists
    @observable isOrderBookDataLoaded = false;
    @observable totalOrderSize = 0;
    @observable totalOrderAmount = 0;
    @observable maxBidPrice = 0;
    @observable minBidPrice = 0;
    @observable maxAskPrice = 0;
    @observable minAskPrice = 0;
    @observable maxOrderAmount = 0;
    @observable maxOrderSize = 0;
    @observable isRegularMarket = true;
    @observable manualOrderBookHoverItem = {};

    convertState = null;
    symbol = '';
    __subscriptionInited = false;
    AggregatedSummary$ = null;
    orderbookBreakDownArrivedTime = 0;
    requestLevel = 22;
    exchanges = {};
    isMobileDevice = false;

    constructor(instrumentStore, exchangesStore, convertStore, yourAccountStore, marketsStore) {
        this.isMobileDevice = getScreenInfo().isMobileDevice;
        instrumentStore.instrumentsReaction((base, quote) => {
            /**
             * Init OrderBooks ws data
             */
            this.AsksForOrderBook = [];
            this.BidsForOrderBook = [];
            this.isRegularMarket = true;

            try {
                const newPair = marketsStore.markets[`${base}-${quote}`];
                const pair = newPair.split('-');
                if (pair.length === 2) {
                    this.base = pair[0];
                    this.quote = pair[1];
                } else {
                    this.base = base;
                    this.quote = quote;
                }
            } catch (e) {
                this.base = base;
                this.quote = quote;
            }
            if (!this.isMobileDevice) {
                this.createSubscription();
            }
        }, true);

        reaction(
            () => {
                return {
                    exchanges: exchangesStore.exchanges,
                };
            },
            ({ exchanges }) => {
                this.exchanges = exchanges;
                if (!this.isMobileDevice) {
                    this.createSubscription();
                }
            }
        );

        reaction(
            () => {
                return {
                    convertState: convertStore.convertState,
                };
            },
            ({ convertState }) => {
                this.convertState = convertState;
            }
        );

        this.loadFromStorage().then(exches => {
            this.exchanges = exches;
        });

        this.orderbookBreakDownArrivedTime = Math.round(new Date().getTime() / 1000);

        setInterval(() => {
            if (this.__subscriptionInited) {
                const currentUnix = Math.round(new Date().getTime() / 1000);
                const delta = currentUnix - this.orderbookBreakDownArrivedTime;
                if (delta > 5) {
                    this.isOrderBookBreakDownStop = true;
                }
            }
        }, 1000);

        this.convertState = STATE_KEYS.coinSearch;
        this.exchanges = {};
    }

    @action.bound highlightRow = (type, price) => {
        if (!type) {
            this.manualOrderBookHoverItem = undefined;
            return;
        }

        const rows = type === 'buy' ? this.BidsForOrderBook : this.AsksForOrderBook;
        let index = rows.length - 1;
        for (index; index >= 0; index--) {
            if (rows[index].price >= price) {
                break;
            }
        }

        if (index === -1) {
            index = 0;
        }

        this.manualOrderBookHoverItem = {
            type,
            index,
        };
    }

    loadFromStorage = () => {
        return new Promise((resolve, reject) => {
            const exchangesStr = localStorage.getItem('exchanges') || '{}';
            try {
                resolve(JSON.parse(exchangesStr) || {});
            } catch (e) {
                console.log(e);
                resolve(true);
            }
        });
    };

    handleIncomingAggregatedSummaryBooksFrames({ Asks = [], Bids = [], Symbol = '' } = {}) {
        if (!pageIsVisible() || this.convertState !== STATE_KEYS.coinSearch) return;

        // --- check if data feed is coming continuously --- //
        this.orderbookBreakDownArrivedTime = Math.round(new Date().getTime() / 1000);

        runInAction(() => {
            let totalOrderSize = 0;
            let totalOrderAmount = 0;
            let maxOrderAmount = 0;
            let maxOrderSize = 0;
            let maxAskPrice = Asks.length ? Asks[0][0] : 0;
            let minAskPrice = Asks.length ? Asks[0][0] : 0;
            for (let i = 0; i < Asks.length; i++) {
                const orderSum = Number(Asks[i][1]) * Number(Asks[i][0]);
                totalOrderSize += orderSum;
                totalOrderAmount += Number(Asks[i][1]);
                if (maxAskPrice < Number(Asks[i][0])) {
                    maxAskPrice = Number(Asks[i][0]);
                }
                if (minAskPrice > Number(Asks[i][0])) {
                    minAskPrice = Number(Asks[i][0]);
                }
                if (maxOrderAmount < orderSum) {
                    maxOrderAmount = orderSum;
                }
                if (maxOrderSize < Number(Asks[i][1])) {
                    maxOrderSize = Number(Asks[i][1]);
                }
            }

            let maxBidPrice = Bids.length ? Bids[0][0] : 0;
            let minBidPrice = Bids.length ? Bids[0][0] : 0;
            for (let i = 0; i < Bids.length; i++) {
                const orderSum = Number(Bids[i][1]) * Number(Bids[i][0]);
                if (maxBidPrice < Number(Bids[i][0])) {
                    maxBidPrice = Number(Bids[i][0]);
                }
                if (minBidPrice > Number(Bids[i][0])) {
                    minBidPrice = Number(Bids[i][0]);
                }
                if (maxOrderAmount < orderSum) {
                    maxOrderAmount = orderSum;
                }
                if (maxOrderSize < Number(Bids[i][1])) {
                    maxOrderSize = Number(Bids[i][1]);
                }
            }

            this.isOrderBookBreakDownStop = false;
            this.AsksForOrderBook = updateMapStoreFromArrayForOrderBook(Asks, ORDER_BOOK_ROWS_COUNT, true, false);
            this.BidsForOrderBook = updateMapStoreFromArrayForOrderBook(Bids, ORDER_BOOK_ROWS_COUNT, false, true);

            this.requestLevel = Math.max(ORDER_BOOK_ROWS_COUNT, maxRequestLevel);
            this.totalOrderSize = totalOrderSize;
            this.totalOrderAmount = totalOrderAmount;
            this.maxBidPrice = maxBidPrice;
            this.minBidPrice = minBidPrice;
            this.maxAskPrice = maxAskPrice;
            this.minAskPrice = minAskPrice;
            this.maxOrderAmount = maxOrderAmount;
            this.maxOrderSize = maxOrderSize;

            const isOrderBookDataLoaded = Asks.length > 0 && Bids.length > 0;
            if (this.isOrderBookDataLoaded !== isOrderBookDataLoaded) {
                this.isOrderBookDataLoaded = isOrderBookDataLoaded;
            }
        });
        this.symbol = Symbol;
    }

    @action.bound createSubscription() {
        let exchanges = [];
        for (let property in this.exchanges) {
            if (this.exchanges[property] && this.exchanges[property].active && property !== 'Global') {
                exchanges.push(property);
            }
        }

        this.removeSubscription();

        this.subscribe = getOrderBookBreakdowns({
            symbol: `${this.base}-${this.quote}`,
            levels: this.requestLevel,
            throttleMs: ORDER_BOOK_THROTTLE,
            exchanges,
        }).subscribe(this.handleIncomingAggregatedSummaryBooksFrames.bind(this));

        this.__subscriptionInited = true;
    }

    @action.bound removeSubscription() {
        if (this.subscribe) {
            this.subscribe.unsubscribe();
        }
    }
}

export default (instrumentStore, exchangesStore, convertStore, yourAccountStore, marketsStore) => {
    const store = new OrderBookBreakDownStore(
        instrumentStore,
        exchangesStore,
        convertStore,
        yourAccountStore,
        marketsStore
    );
    return store;
};
