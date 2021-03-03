import { observable, reaction, runInAction } from 'mobx';

export const INITIAL_PRICES_LENGTH = 91;
export const MAX_PRICES_LENGTH = 500;

class PriceChartStore {
    @observable priceData = [];
    @observable price = 0;
    @observable isFetchingPrice = false;
    @observable rates = {};

    interval = null;
    noiseInterval = null;

    base = null;
    quote = null;
    fiatPrice = 1;
    rateData = [];
    fiatMode = true;
    incomingDataStack = [];
    bufferData = [];
    constructor(instrumentStore, settingsStore, marketsStore) {
        if (settingsStore && settingsStore.price) {
            this.fiatPrice = settingsStore.price;
        }

        instrumentStore.instrumentsReaction(async (base, quote) => {
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

            this.fiatMode = quote === 'USDT';
            this.price = 0;
            this.rateData = [];
            this.priceData = [];
            this.incomingDataStack = [];
            this.bufferData = [];

            clearInterval(this.noiseInterval);
            clearInterval(this.interval);
            this.fetchPrice(this.base, this.quote);
            this.setPriceFetchInterval();
        }, true);

        reaction(
            () => ({
                price: settingsStore.price,
            }),
            settings => {
                this.fiatPrice = settings.price;

                if (this.fiatMode) {
                    this.priceData = this.rateData.map(([time, rate]) => [time, rate * this.fiatPrice]);
                }
            }
        );
        if (this.base && this.quote) this.fetchPrice(this.base, this.quote);
    }

    priceChartReaction = (reactionHandler, fireImmediately = false) => {
        return reaction(
            () => this.rates,
            async rates => {
                reactionHandler(this.base, this.quote, rates);
            },
            { fireImmediately }
        );
    };

    setPriceFetchInterval() {
        if (this.base && this.quote) {
            if (this.interval) {
                clearInterval(this.interval);
            }

            this.interval = setInterval(() => {
                this.fetchPrice(this.base, this.quote);
            }, 60000);
        }
    }

    getRandomData = pointY => {
        let y = 0;
        if (Math.random() > 0.03) {
            y = pointY + Math.random() * 0.00005 * pointY * Math.pow(-1, Math.round(Math.random() * 10));
        } else {
            y = pointY + Math.pow(Math.random(), 4) * 0.00035 * pointY * Math.pow(-1, Math.round(Math.random() * 10));
        }

        return y;
    };

    pushToPriceData(price) {
        const size = this.rateData.length;
        let currntPointY = price;
        let time = new Date().getTime();

        if (!size) {
            for (let i = 0; i < INITIAL_PRICES_LENGTH; i++) {
                const y = this.getRandomData(currntPointY);

                this.rateData.push([time - i * 2000, y]);
                currntPointY = y;
            }
            this.rateData.reverse();

            if (this.fiatMode) {
                this.priceData = this.rateData.map(([time, rate]) => [time, rate * this.fiatPrice]);
            } else {
                this.priceData = this.rateData;
            }
            this.serveNoiseData(price);
        } else {
            this.incomingDataStack.push(price);
        }
    }

    serveNoiseData(currntPointY) {
        if (this.noiseInterval) {
            clearInterval(this.noiseInterval);
        }

        this.noiseInterval = setInterval(() => {
            runInAction(() => {
                const stackSize = this.incomingDataStack.length;
                const bufferSize = this.bufferData.length;
                const x = new Date().getTime();

                let y;
                if (bufferSize > 0) {
                    y = bufferSize === 1 ? this.bufferData[0] : this.getRandomData(this.bufferData[0]);
                    this.bufferData.shift();
                } else if (stackSize > 0) {
                    const diff = this.incomingDataStack[stackSize - 1] - currntPointY;
                    y = currntPointY + diff / 6;
                    this.bufferData = [currntPointY + diff / 2, currntPointY + (5 * diff) / 6, currntPointY + diff];
                    this.incomingDataStack = [];
                } else {
                    y = this.getRandomData(currntPointY);
                }

                currntPointY = y;
                this.rateData.push([x, y]);
                if (this.rateData.length > MAX_PRICES_LENGTH) {
                    this.rateData = this.rateData.slice(this.rateData.length - INITIAL_PRICES_LENGTH);
                }

                if (this.fiatMode) {
                    this.priceData = this.rateData.map(([time, rate]) => [time, rate * this.fiatPrice]);
                } else {
                    this.priceData = this.rateData;
                }

                this.price = y;
            });
        }, 2000);
    }

    async fetchPrice(base, quote) {
        base = (base || '').replace('F:', '');
        quote = (quote || '').replace('F:', '');
        const url = `https://rest.qa.bct.trade/api/best-conversion-rate/${base}-${quote}`;

        this.isFetchingPrice = true;

        fetch(url)
            .then(response => response.json())
            .then(Data => {
                this.rates = Data;
                this.isFetchingPrice = false;

                try {
                    const rate = Number(Data.data.rate) || 0;
                    const coinPair = this.base + '-' + this.quote;

                    if (rate > 0 && Data.data.amounts[coinPair]) {
                        this.price = rate;
                        this.pushToPriceData(rate);
                    }
                } catch (err) {
                    this.price = 0;
                }
            })
            .catch(e => {
                this.isFetchingPrice = false;
                console.log(e);
            });
    }
}

export default (instrumentStore, settingsStore, marketsStore) =>
    new PriceChartStore(instrumentStore, settingsStore, marketsStore);
