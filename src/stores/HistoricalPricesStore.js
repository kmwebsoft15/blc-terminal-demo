import { observable, action, reaction } from 'mobx';

import { HISTORICAL_DATA_URL } from '../config/constants';

export const FILTERS = {
    '1H': {
        key: '1H',
        apiInterval: '1m',
        ms: 60 * 60 * 1000,
    },
    '1D': {
        key: '1D',
        apiInterval: '5m',
        ms: 24 * 60 * 60 * 1000,
    },
    '1W': {
        key: '1W',
        apiInterval: '1h',
        ms: 7 * 24 * 60 * 60 * 1000,
    },
    '1M': {
        key: '1M',
        apiInterval: '1h',
        ms: 30 * 24 * 60 * 60 * 1000,
    },
    '1Y': {
        key: '1Y',
        apiInterval: '1d',
        ms: 12 * 30 * 24 * 60 * 60 * 1000,
    },
};

class HistoricalPricesStore {
    @observable loading = true;
    @observable historicalData = [];
    @observable selectedFilterKey = '';

    constructor(settingsStore, orderBookStore) {
        this.symbol = undefined;

        // cryptocompare doesn't have prices for every fiat currency,
        // so for now let's use only USDT
        // reaction(
        //     () => ({
        //         defaultFiat: settingsStore.defaultFiat,
        //     }),
        //     ({ defaultFiat }) => {
        //         this.symbol = this.symbol.split('-')[0] + '-' + defaultFiat;
        //         this.fetchHistoricalPrices();
        //     }
        // );

        reaction(
            () => ({
                base: orderBookStore.base,
                quote: orderBookStore.quote,
            }),
            ({ base, quote }) => {
                this.symbol = base + '-' + quote;
                this.fetchHistoricalPrices();
            }
        );
    }

    @action.bound onChangeFilter(key) {
        this.selectedFilterKey = key;

        this.fetchHistoricalPrices();
    }

    async fetchHistoricalPrices() {
        if (!this.selectedFilterKey || !this.symbol) {
            return;
        }

        this.loading = true;

        const periodData = FILTERS[this.selectedFilterKey];

        const tsEnd = Date.now();
        const tsBeg = tsEnd - periodData.ms;
        const url = HISTORICAL_DATA_URL.replace('@tsBeg', tsBeg)
            .replace('@tsEnd', tsEnd)
            .replace('@interval', periodData.apiInterval)
            .replace('@exchangeId', '')
            .replace('@marketId', this.symbol);

        const rawResponse = await fetch(url);
        const response = await rawResponse.json();

        // cut-off everything that we didn't ask for
        const indexOfFirstItem = response.findIndex(item => item.time > tsBeg);
        const data = response.slice(indexOfFirstItem);

        this.historicalData = data.map(item => ({
            x: item.time,
            y: item.cls,
        }));

        this.loading = false;
    }
}

export default (settingsStore, orderBookStore) => new HistoricalPricesStore(settingsStore, orderBookStore);
