import { observable } from 'mobx';

class CoinPriceStore {
    @observable price = 0;
    @observable maxAmount = 0;
    @observable arbitrageAmount = 0;
    // "ok": 1,
    // "data": {
    //     "rate": 3621.4158,
    //     "amounts": {
    //         "BTC-USDT": {
    //             "fromCoin": "BTC",
    //             "toCoin": "USDT",
    //             "maxAmount": 28.525185,
    //             "arbitrageAmount": 2.7540162
    //         },
    //         "USDT-BTC": {
    //             "fromCoin": "USDT",
    //             "toCoin": "BTC",
    //             "maxAmount": 102558.71,
    //             "arbitrageAmount": 92578.98
    //         }
    //     }
    // }

    constructor(priceChartStore) {
        priceChartStore.priceChartReaction(
            (base, quote, rates) => {
                this.price = 0;
                this.updatePrice(base, quote, rates);
            },
            true
        );
    }

    updatePrice(base, quote, rates) {
        base = (base || '').replace('F:', '');
        quote = (quote || '').replace('F:', '');

        try {
            this.price = Number(rates.data.rate) || 0;
        } catch(err) {
            this.price = 0;
        }

        try {
            this.maxAmount = rates.data.amounts[base + '-' + quote].maxAmount || 0;
        } catch(err) {
            this.maxAmount = 0;
        }

        try {
            this.arbitrageAmount = rates.data.amounts[base + '-' + quote].arbitrageAmount || 0;
        } catch(err) {
            this.arbitrageAmount = 0;
        }
    }
}

export default (priceChartStore) => new CoinPriceStore(priceChartStore);