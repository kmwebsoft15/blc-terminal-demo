import {
    observable, action, computed, reaction
} from 'mobx';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import { ClientId, OrderHistoryStoreLabels } from '../config/constants';
import { OrderHistoryReply, OrderHistoryRequest } from '../lib/bct-ws';
import {
    formatOrderHistoryDataForDisplay
} from './utils/OrderHistoryUtils';
import { customDigitFormat } from '../utils';

const throttleMs = 200;

class OrderHistory {
    @observable OrderHistoryData = [];
    @observable PortfolioGraphData = [];
    @observable lastPortfolioValue = 0;
    @observable TargetTicketId = '';
    @observable downTimerCount = 0;
    @observable maxDownTimerCount = 0;

    orderHistoryReply$ = null;
    __subscriptionInited = false;
    PortfolioGraphData$ = []

    fiatPrice = 1;
    isDefaultCrypto = true;
    defaultCryptoPrice = 0;
    countries = [];
    activePostions = [];

    constructor(instrumentStore, settingsStore) {
        this.fiatPrice = settingsStore.price;
        this.defaultCryptoPrice = settingsStore.defaultCryptoPrice;
        if (localStorage.getItem('authToken')) {
            this.requestOrderHistory();
        }

        reaction(
            () => ({
                Bases: instrumentStore.Bases,
                activePositions: instrumentStore.activePositions
            }),
            ({Bases, activePositions}) => {
                const cryptoArray = [];
                for (let i = 0; i < Bases.length; i++) {
                    cryptoArray.push(Bases[i].symbol);
                }

                // Remove USDT and BTC from crypto array
                let index = cryptoArray.findIndex(a => a === 'USDT');
                if (index > -1) {
                    cryptoArray.splice(index, 1);
                }
                index = cryptoArray.findIndex(a => a === 'BTC');
                if (index > -1) {
                    cryptoArray.splice(index, 1);
                }

                // Append USDT and BTC to the start of crypto array
                cryptoArray.splice(0, 0, 'USDT', 'BTC');

                if (!isEqual(cryptoArray, this.cryptoArray) && cryptoArray.length > 0) {
                    this.Bases = cryptoArray;
                }
                this.activePostions = [...activePositions];
            }
        );

        reaction(
            () => ({
                price: settingsStore.price,
                defaultCryptoPrice: settingsStore.defaultCryptoPrice,
                countries: settingsStore.countries,
            }),
            (settings) => {
                this.fiatPrice = settings.price;
                this.defaultCryptoPrice = settings.defaultCryptoPrice;
                this.PortfolioGraphData = this.getFiatPortfolioData(this.PortfolioGraphData$);
                this.countries = settings.countries;
                // this.updateOrderHistoryByFiat();
            }
        );
    }

    handleIncomingOrderHistory(orderHistoryData = {}) {
        const {
            body: {
                messages: [
                    {
                        Tickets = [],
                    } = {}
                ] = [],
            } = {},
        } = orderHistoryData;

        this.OrderHistoryData = formatOrderHistoryDataForDisplay(this.Bases, Tickets, this.countries);
        this.PortfolioGraphData$ = this.OrderHistoryData
            .slice()
            .reverse()
            .filter(item => !this.isDefaultCrypto ? item.sourceTotal && !Number.isNaN(item.sourceTotal) : item.sourceFilled && !Number.isNaN(item.sourceFilled))
            .map((item) => ({ x: moment(item.timeUnFormatted).valueOf(), y: this.isDefaultCrypto ? item.sourceFilled : item.sourceTotal }));

        // filter noisy from portfolio graph
        let noisyArr = [];
        let lastItem = -1;
        for (let i = 0; i < this.PortfolioGraphData$.length; i++) {
            if (lastItem > this.PortfolioGraphData$[i].y) {
                noisyArr.push(i);
                continue;
            }
            lastItem = this.PortfolioGraphData$[i].y;
        }
        for (let i = noisyArr.length - 1; i >= 0; i--) {
            this.PortfolioGraphData$.splice(noisyArr[i],1);
        }

        this.PortfolioGraphData = this.getFiatPortfolioData(this.PortfolioGraphData$);
    }

    getFiatPortfolioValue = (portfolioValue) => {
        if (!this.isDefaultCrypto) {
            return portfolioValue * this.fiatPrice;
        }
        return portfolioValue;
    };

    getFiatPortfolioData = (usdPortfolioData) => {
        const fiatPortfolioData = usdPortfolioData.filter(item => item.y && !Number.isNaN(item.y) && item.y !== 0).map(
            ({ x, y }) => {
                const fiatPortfolioValue = this.getFiatPortfolioValue(y);

                return {
                    x,
                    y: fiatPortfolioValue,
                };
            }
        );
        if (fiatPortfolioData.length) {
            this.lastPortfolioValue = fiatPortfolioData[fiatPortfolioData.length - 1].y;
        } else if (this.activePostions[0]) {
            this.lastPortfolioValue = this.activePostions[0].Position;
        }

        return fiatPortfolioData;
    };

    @action.bound
    setTargetTradeHistoryTicket(targetTicketId) {
        this.TargetTicketId = targetTicketId;
    }

    requestOrderHistory() {
        if (!this.__subscriptionInited) {
            this.orderHistoryReply$ = OrderHistoryReply({ throttleMs });
            this.orderHistoryReply$.subscribe({ next: this.handleIncomingOrderHistory.bind(this) });
            this.__subscriptionInited = true;
        }
        OrderHistoryRequest(localStorage.getItem('authClientId') || ClientId);
    }

    // updateOrderHistoryByFiat() {
    //     const conversionRate = this.isDefaultCrypto ? 1 : this.fiatPrice;
    //     this.OrderHistoryData = this.OrderHistoryData.map((source) => {
    //         source.total = customDigitFormat(source.sourceTotal * conversionRate, 9);
    //         return source;
    //     });
    // }

    @action.bound resetOrderHistory() {
        this.OrderHistoryData = [];
        this.lastPortfolioValue = 0;
    }

    @action.bound setDownTimerCount(tm) {
        this.downTimerCount = tm;
    }

    @action.bound setMaxDownTimerCount(tm) {
        this.maxDownTimerCount = tm;
    }
}

export default (instrumentStore, settingsStore) => {
    return new OrderHistory(instrumentStore, settingsStore);
};
