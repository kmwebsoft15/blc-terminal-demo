import React from 'react';
import { observable, action } from 'mobx';
import _ from 'lodash';

import { scheduleVisualDOMUpdate } from './utils/storeUtils';
import { mockData } from '../components/SideBar/ExchangePop/mock';
import {
    AddExchangeAccount,
    getMarketExchangesRequest,
    SetOrderbookExchangeRequest
} from '../lib/bct-ws';
import { REST_MARKET } from '../config/constants';

class ExchangesStore {
    @observable exchanges = {};
    @observable marketExchanges = [];
    @observable selectedExchange = {
        name: 'Global', icon: '',
    };
    @observable isEmptyExchange = false;
    @observable exchangeSearchValue = '';
    snackbar = null;

    constructor(instrumentStore, snackbar) {
        this.snackbar = snackbar;
        instrumentStore.instrumentsReaction(
            (base, quote) => {
                const symbol = base + '-' + quote;
                this.fetchMarketExchanges(symbol);
            },
            true
        );
    }

    fetchMarketExchanges(symbol) {
        fetch(`${REST_MARKET}/api/exchanges/${symbol}`)
            .then(response => response.json())
            .then(res => {
                const newData = _.cloneDeep(mockData);
                Object.keys(res).forEach(key => {
                    const marketIdx = newData.findIndex(m => m.name === res[key].name);
                    if (marketIdx > -1) {
                        newData[marketIdx].urls = res[key].urls;
                        newData[marketIdx].status = 'active';
                    }
                });

                newData.sort((a, b) => {
                    if (a.status < b.status) {
                        return -1;
                    }

                    if (a.status > b.status) {
                        return 1;
                    }

                    return 0;
                });

                this.exchanges = {};
                this.marketExchanges = newData;
                if (Object.keys(res).length === 0) {
                    this.isEmptyExchange = true;
                } else {
                    this.isEmptyExchange = false;
                }
            })
            .catch(console.log);
    }

    @action.bound updateExchange(key, value) {
        // --- access to backend --- //
        AddExchangeAccount(key || '', value.apiKey || '', value.apiSecret)
            .then(res => {
                this.snackbar({
                    message: () => <span><b>{res.result}</b></span>
                })
            })
            .catch(err => {
                this.snackbar({
                    message: () => <span><b>{err.result}</b></span>
                })
            });

        // --- save to localstorage ---//
        this.exchanges = {
            ...this.exchanges,
            [key]: value,
        };
    }

    @action.bound setExchangeActive(key, value) {
        if (key === 'Global') {
            if (value) {
                let newExchanges = {};
                for (let i = 0; i < this.marketExchanges.length; i++) {
                    const key = this.marketExchanges[i].name;
                    newExchanges = {
                        ...newExchanges,
                        [key]: {
                            ...this.exchanges[key],
                            active: this.marketExchanges[i].status === 'active',
                        },
                    };
                }

                this.exchanges = {
                    ...newExchanges,
                    Global: {
                        ...this.exchanges.Global,
                        active: true,
                    },
                };
            } else {
                let newExchanges = {};
                for (let i = 0; i < this.marketExchanges.length; i++) {
                    const key = this.marketExchanges[i].name;
                    newExchanges = {
                        ...newExchanges,
                        [key]: {
                            ...this.exchanges[key],
                            active: false,
                        },
                    };
                }

                this.exchanges = {
                    ...newExchanges,
                    Global: {
                        ...this.exchanges.Global,
                        active: false,
                    },
                };
            }
        } else {
            let isGlobalActive = false;

            if (value === false) {
                const keys = Object.keys(this.exchanges);
                let noSelected = true;
                for (let i = 0; i < keys.length; i++) {
                    if (key !== keys[i] && this.exchanges[keys[i]].active) {
                        noSelected = false;
                        break;
                    }
                }
                if (noSelected) {
                    isGlobalActive = false;
                }
            }

            this.exchanges = {
                ...this.exchanges,
                Global: {
                    ...this.exchanges.Global,
                    active: isGlobalActive,
                },
                [key]: {
                    ...this.exchanges[key],
                    active: value,
                },
            };
        }
    }

    @action.bound setExchangeApiSynced(key, value) {
        if (key === 'Global') {
            const keys = Object.keys(this.exchanges);
            let newExchanges = {};
            for (let i = 0; i < keys.length; i++) {
                newExchanges = {
                    ...newExchanges,
                    [keys[i]]: {
                        ...this.exchanges[keys[i]],
                        apiSynced: false,
                    },
                };
            }
            this.exchanges = {
                ...newExchanges,
                Global: {
                    ...this.exchanges.Global,
                    apiSynced: value,
                },
            };
        } else {
            this.exchanges = {
                ...this.exchanges,
                Global: {
                    ...this.exchanges.Global,
                    apiSynced: false,
                },
                [key]: {
                    ...this.exchanges[key],
                    apiSynced: value,
                },
            };
        }
    }

    @action.bound selectExchangeActive(name) {
        const keys = Object.keys(this.exchanges);

        const marketIdx = this.marketExchanges.findIndex(m => m.name === name);
        const isActive = (marketIdx > -1) && (this.marketExchanges[marketIdx].status === 'active');

        let newExchanges = {};
        for (let i = 0; i < keys.length; i++) {
            newExchanges = {
                ...newExchanges,
                [keys[i]]: {
                    ...this.exchanges[keys[i]],
                    active: isActive && (keys[i] === name),
                },
            };
        }

        if (!newExchanges[name]) {
            newExchanges = {
                ...newExchanges,
                [name]: {
                    active: isActive,
                },
            };
        }

        this.exchanges = newExchanges;
    }

    @action.bound setExchange(exchangeName) {
        if (exchangeName === 'Global') {
            this.selectedExchange = {
                name: 'Global',
                icon: '',
            };
        } else if (this.marketExchanges && this.marketExchanges.length > 0) {
            for (let i = 0; i < this.marketExchanges.length; i++) {
                if (this.marketExchanges[i].name.toLowerCase() === exchangeName.toLowerCase()) {
                    this.selectedExchange = this.marketExchanges[i];
                    break;
                }
            }
        }
    }

    @action.bound getActiveExchanges(exchanges) {
        let activeExchange = '';
        let activeExchanges = 0;
        for (let i = 0; i < this.marketExchanges.length; i++) {
            if (exchanges[this.marketExchanges[i].name] && exchanges[this.marketExchanges[i].name].active) {
                activeExchanges++;
                activeExchange = this.marketExchanges[i].name;
            }
        }

        const activeMarketExchanges = this.marketExchanges.filter(m => m.status === 'active');

        return activeExchanges === 0
            ? (activeMarketExchanges.length === 1
                ? activeMarketExchanges[0].name
                : `${activeMarketExchanges.length} Exchanges`)
            : (activeExchanges === 1
                ? activeExchange
                : `${activeExchanges} Exchanges`);
    }

    @action.bound setExchangeSearchValue(value) {
        this.exchangeSearchValue = value;
    }

    @action.bound clearExchanges() {
        this.exchanges = {};
    }
}

export default (instrumentStore, snackbar) => {
    const store = new ExchangesStore(instrumentStore, snackbar);
    return store;
}
