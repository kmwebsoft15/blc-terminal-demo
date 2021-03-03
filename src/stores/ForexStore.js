import { action, observable, reaction, runInAction } from 'mobx';

import { customDigitFormat } from '@/utils';
import { mockCountries } from '@/mock/countries';
import { viewModeKeys } from './ViewModeStore';

export const INITIAL_PRICES_LENGTH = 91;
export const MAX_PRICES_LENGTH = 500;

class ForexStore {
    @observable forexCurrency='';
    @observable forexCurrencySymbol='';
    @observable forexInput;
    @observable forexUSD;
    @observable forexUSDT;
    @observable countries = [];
    @observable priceData = [];
    rateData = [];
    incomingDataStack = [];
    fiatPrice = 1;
    premiumRate = 0.8;
    rate = 1;
    oldRate = 1;
    defaultCurr = 'F:KRW';
    defaultCurrSymbol = '₩';

    interval = null;
    noiseInterval = null;

    constructor(viewModeStore, settingsStore) {
        if (settingsStore && settingsStore.price) {
            this.fiatPrice = settingsStore.price;
        }

        this.rateData = [];
        this.priceData = [];
        this.incomingDataStack = [];
        this.bufferData = [];
        this.lastChange = 0;

        this.fetchPrice().then(() => {
            // initial amount for KRW
            this.forexCurrency = this.defaultCurr;
            this.forexCurrencySymbol = this.defaultCurrSymbol;
            this.forexInput = 137287;
            this.forexUSD = 118;
            this.forexUSDT = customDigitFormat(this.forexUSD * 0.8);
            this.setForexCurrency(this.defaultCurr);
            this.pushToPriceData(this.forexUSD);
        });

        clearInterval(this.noiseInterval);
        setInterval(this.fetchPrice, 2 * 60 * 60 * 1000);

        reaction(
            () => ({
                viewMode: viewModeStore.viewMode,
            }),
            (viewModeObj) => {
                if(viewModeObj.viewMode === viewModeKeys.forexModeKey) {
                    this.setForexCurrency(this.defaultCurr);
                }
            }
        );

        reaction(
            () => {
                return {
                    price: settingsStore.price,
                };
            },
            ({ price }) => {
                this.fiatPrice = price;
            }
        );
    }

    resetLastChange = pointY => {
        this.lastChange = (Math.random() + 0.2) * 0.0001 * pointY * (Math.random() > 0.5 ? 1 : -1);
    };

    getRandomData = pointY => {
        if (Math.abs(this.lastChange) < 0.000001 * pointY || Math.random() > 0.5) {
            this.resetLastChange(pointY);
        } else {
            this.lastChange += this.lastChange * (Math.random() - 0.5);
        }
        return pointY + this.lastChange;
    };

    pushToPriceData() {
        const price = this.rate;

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
            this.priceData = this.rateData.map(([time, rate]) => [time, rate * this.fiatPrice]);
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
                    if (this.isRateChanged && stackSize > 0) {
                        y = this.rateData[this.rateData.length - 1][1];
                        this.bufferData = {};
                        this.isRateChanged = false;
                        this.resetLastChange(y);
                    } else {
                        y = bufferSize === 1 ? this.bufferData[0] : this.getRandomData(this.bufferData[0]);
                        this.bufferData.shift();
                    }
                } else if (stackSize > 0) {
                    const diff = this.incomingDataStack[stackSize - 1] - currntPointY;
                    if (this.isRateChanged) {
                        y = this.rateData[this.rateData.length - 1][1];
                        this.resetLastChange(y);
                        const diffLast = this.getRandomData(y) - y;
                        y = y + diffLast / 6;
                        this.bufferData = [y + diffLast / 2, y + (5 * diffLast) / 6, y + diffLast];
                        this.resetLastChange(y);
                        this.isRateChanged = false;
                    } else {
                        y = currntPointY + diff / 6;
                        this.bufferData = [currntPointY + diff / 2, currntPointY + (5 * diff) / 6, currntPointY + diff];
                    }
                    this.incomingDataStack = [];
                } else {
                    y = this.getRandomData(currntPointY);
                }

                currntPointY = y;
                this.rateData.push([x, y]);
                if (this.rateData.length > MAX_PRICES_LENGTH) {
                    this.rateData = this.rateData.slice(this.rateData.length - INITIAL_PRICES_LENGTH);
                }
                this.priceData = this.rateData.map(([time, rate]) => [time, rate * this.fiatPrice]);

                this.forexUSD = y;
            });
        }, 2000);
    }

    @action.bound setForexInput(amtInput, isDefaultMode) {
        if (isDefaultMode) {
            this.forexInput = Number(amtInput);
        } else {
            this.forexInput = Number(amtInput / this.rate / this.premiumRate);
        }
        this.refreshAmount();
    }

    refreshAmount() {
        this.setForexUSD(this.forexInput * this.rate);
        this.setForexUSDT(this.forexInput * this.rate * this.premiumRate);
    }

    @action.bound setForexUSD(amtUsd) {
        this.forexUSD = amtUsd;
        this.pushToPriceData(this.forexUSD);
    }

    @action.bound setForexUSDT(amtUsdt) {
        this.forexUSDT = amtUsdt;
    }

    @action.bound setForexCurrencySymbol(symbol) {
        this.forexCurrencySymbol = symbol;
    }

    @action.bound setForexCurrency(currency) {
        this.forexCurrency = currency;
        const curr = (currency || '').replace('F:', '');

        if (this.countries && this.countries.length > 0) {
            const country = this.countries.find(country => country.currencyCode === curr);
            if (country) {
                this.oldRate = this.rate;
                this.rate = 1 / country.price;
                if (this.oldRate !== this.rate) {
                    this.rateData = this.rateData.map(([time, rate]) => [time, this.rate / this.oldRate * rate]);
                    this.isRateChanged = true;
                } else {
                    this.isRateChanged = false;
                }
            } else {
                this.rate = 0;
            }
            // exception
            if (curr === 'BMD') {
                this.rate = 1;
            }
        } else {
            this.rate = 1;
        }

        this.refreshAmount();
    }

    fetchPrice = async () => {
        if (process.env.NODE_ENV === 'production') {
            const url = '/price';

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    this.countries = data;
                })
                .catch(console.log);
        } else {
            this.countries = mockCountries;
        }
    };
}

export default (viewModeStore, settingsStore) => new ForexStore(viewModeStore, settingsStore);