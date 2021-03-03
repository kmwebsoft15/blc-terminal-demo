/* eslint-disable */
import { observable, action, computed, toJS, reaction } from 'mobx';
import {
    PositionRequest,
    PositionReply,
    ResetDemoBalancesRequest,
    coinsForWalletReply,
    coinsForWalletRequest,
    SendOrderTicket
} from '../lib/bct-ws';
import {
    ClientId,
    PORTFOLIO_LABEL_AMOUNT,
    PORTFOLIO_LABEL_COIN,
    PORTFOLIO_LABEL_POSITION,
    PORTFOLIO_LABEL_PRICE,
    ProgramId
} from '../config/constants';
import partial from 'lodash.partial';
import {
    makePositionRequest,
    normalizePortfolioPieChartData,
    normalizeYourAccountPositionData,
    normalizeYourAccountPositionDataWithAllCoins,
    normalizeYourAccountPositionDataWithBaseCoins,
    registerForPositionReplies,
    updatePortfolioPieChartData,
    updatePosition,
    updatePositionError
} from './utils/YourAccountStoreUtils';
import { initRequest, shiftMapStoreFromArray, convertArrToMapWithFilter } from './utils/storeUtils';
import findIndex from 'lodash/findIndex';
import { TicketId } from './utils/OrderEntryUtils';

// Don't allow state modifications outside actions
// TODO: configure({enforceActions: true});
const throttleMs = 200;
const maxRows = 500;

class YourAccountStore {
    @observable isLoaded = false;
    @observable CoinsForWallet = [];
    @observable isCoinsForWalletLoaded = false;
    @observable PortfolioData = [];
    @observable storeCredit = 0;
    @observable PortfolioTotalValue = 0;
    @observable PortfolioTotalValueChange = 0;
    @observable PortfolioUSDTValue = null;
    @observable PortfolioPieChartData = [];
    @observable OrderEventsData = new Map();

    @observable baseCoinIndex = 0;
    @observable baseSelectedCoin = '';
    @observable quoteSelectedCoin = '';
    @observable baseCoinPrice = 0;
    @observable quoteCoinPrice = 0;
    @observable changeInPercent = 0;
    @observable resetWalletTable = false;
    @observable isSendFormOpened = false;

    @observable selectedCoin = '';

    @observable maxCoin = '';
    @observable targetBaseCoin = '';
    @observable targetQuoteCoin = '';
    @observable isAutoTrade = false;
    @observable isResetC1Mode = true;
    @observable isNewUser = null; // new to payapp?

    baseCoins = [];
    coinsInterval = null;
    instrumentStoreRef = null;
    arbMode = false;

    isRecentPositionPassed = true;
    timerHandleForRecentPositionCheck = null;
    MAX_LIMIT_RECENT_CHECK = 30;

    requestPositionTimeout = null;

    constructor (instrumentStore, viewModeStore) {
        // Register to receive CoinsForWallet
        coinsForWalletReply({}).subscribe({
            next: this.updateCoinsForWallet,
            error: e => console.log(e)
        });

        // if (this.coinsInterval) {
        //     clearInterval(this.coinsInterval);
        // }
        // this.coinsInterval = setInterval(() => {
        //     coinsForWalletRequest();
        // }, 15000);

        registerForPositionReplies(
            PositionReply,
            localStorage.getItem('authClientId') || ClientId,
            partial(updatePosition, this.updateYourAccountStoreData),
            updatePositionError
        );

        // Get selected base coin index in wallet table
        instrumentStore.instrumentsReaction(
            async (base, quote) => {
                this.baseSelectedCoin = base;
                this.quoteSelectedCoin = quote;

                this.setSelectedCoinData();

                const isLoggedIn = localStorage.getItem('signedin');
                if (!isLoggedIn) {
                    this.setSelectedCoin(base);
                }
            },
            true
        );
        this.instrumentStoreRef = instrumentStore;

        // Get wallet table items after InstrumentStore's baseCoins are fetched, because baseCoins has price information
        // instrumentStore.baseCoinsReaction(
        //     async (coins) => {
        //         let hash = {};
        //         coins.map(item => {
        //             if (item && item.symbol) {
        //                 hash[item.symbol] = { ...item };
        //             }
        //         });
        //         this.baseCoins = hash;
        //
        //         setTimeout(partial(initRequest, PositionRequest, throttleMs, partial(makePositionRequest, localStorage.getItem('authClientId') || ClientId, ProgramId)), 500);
        //     },
        //     true
        // );

        reaction(
            () => this.CoinsForWallet,
            () => {
                if (this.isCoinsForWalletLoaded) {
                    setTimeout(
                        () => PositionRequest(localStorage.getItem('authClientId') || ClientId),
                        500
                    );
                }
            },
            {
                fireImmediately: true,
            }
        );

        reaction(
            () => ({
                arbMode: viewModeStore.arbMode,
            }),
            (arbObj) => {
                this.arbMode = arbObj.arbMode;
                if (this.arbMode) {
                    this.instrumentStoreRef.setBase('BTC');
                    this.instrumentStoreRef.setQuote('USDT');
                }
            }
        );

        this.selectedCoin = 'BTC';
        this.isRecentPositionPassed = true;
    }

    @computed.struct
    get portfolioData () {
        return toJS(this.PortfolioData);
    }

    @computed.struct
    get portfolioPieChartData () {
        return toJS(this.PortfolioPieChartData);
    }

    @action.bound
    requestCoinsForWallet () {
        coinsForWalletRequest();
    }

    @action.bound
    updateCoinsForWallet (eventData) {
        const { event, data = [] } = eventData;

        let coinsHash = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i].length >= 7) {
                coinsHash.push({
                    coin: data[i][0],
                    symbolId: data[i][1],
                    isEnabled: data[i][2] === 1,
                    price: data[i][3],
                    priceChange24: data[i][4],
                    marketVolume24: data[i][5],
                    marketCap: data[i][6],
                    AmountUsd: 0,
                    Coin: data[i][0],
                    Position: 0,
                    fullName: data[i][9],
                });
            }
        }

        if (event === 'CoinsForWallet') {
            this.CoinsForWallet = coinsHash;
            this.isCoinsForWalletLoaded = true;
            if (!localStorage.getItem('signedin')) {
                this.updateYourAccountStoreData([]);
            }
        }
    };

    @action.bound
    updateYourAccountStoreData (Positions, response, event) {
        if (this.isSendFormOpened) return;
        const YourAccountPositions = normalizeYourAccountPositionDataWithAllCoins(Positions, this.CoinsForWallet);

        if (YourAccountPositions.length > 0) {
            this.PortfolioData = YourAccountPositions;
            this.OrderEventsData.clear();
            this.instrumentStoreRef.setActivePostions(Positions);
            convertArrToMapWithFilter(this.OrderEventsData, YourAccountPositions);

            /**
             *  Get Store Credit(BCT balance)
             */
            const bctIndex = findIndex(this.PortfolioData, { Coin: 'BCT' });
            if (bctIndex !== -1) {
                this.storeCredit = (this.PortfolioData[bctIndex] && this.PortfolioData[bctIndex].Amount) || 0;
            } else {
                this.storeCredit = 0;
            }

            const isLoggedIn = localStorage.getItem('signedin');
            if (!isLoggedIn) {
                this.isNewUser = true;
                this.PortfolioUSDTValue = null;
            } else {
                const usdtIndex = findIndex(this.PortfolioData, { Coin: 'ETH' });
                if (usdtIndex !== -1) {
                    this.PortfolioUSDTValue = Math.floor(Number(this.PortfolioData[usdtIndex][PORTFOLIO_LABEL_POSITION]));
                    this.isNewUser = this.PortfolioUSDTValue === 0;
                } else {
                    this.PortfolioUSDTValue = 0;
                    this.isNewUser = true;
                }
            }

            /**
             * Specific Elements
             */
            let maxBalance = 0;
            let maxCoin = '';
            const totalAccountBalance = YourAccountPositions.reduce((acc, position) => {
                if (position && (Number(maxBalance) < Number(position[PORTFOLIO_LABEL_AMOUNT]))) {
                    maxBalance = Number(position[PORTFOLIO_LABEL_AMOUNT]);
                    maxCoin = position[PORTFOLIO_LABEL_COIN];
                }
                return acc + (position ? Number(position[PORTFOLIO_LABEL_AMOUNT]) : 0);
            }, 0);
            this.maxCoin = maxCoin;
            // if (this.instrumentStoreRef && this.isResetC1Mode && this.instrumentStoreRef.isLoaded &&
            //     !this.arbMode && maxCoin !== '' && (maxCoin || '').toLowerCase() !== 'halal')
            // {
            //     this.instrumentStoreRef.setBase(maxCoin);
            //     this.isResetC1Mode = false;
            // }
            // if (maxCoin !== '') { // (PositionData is exist from private socket)
            //     this.isRecentPositionPassed = true;
            // }

            this.PortfolioTotalValueChange = this.PortfolioTotalValue === 0 ? 0 : totalAccountBalance - this.PortfolioTotalValue;
            this.PortfolioTotalValue = Math.floor(totalAccountBalance);

            this.setSelectedCoinData();
        }

        if (!this.isLoaded)
            this.isLoaded = true;
    }

    @action.bound setSelectedCoinData = () => {
        let basePortfolioData;
        let quotePortfolioData;

        if (!this.baseSelectedCoin || !this.quoteSelectedCoin) return;

        try {
            for (let i = 0; i < this.PortfolioData.length; i++) {
                if (this.PortfolioData[i] && this.PortfolioData[i].Coin === this.baseSelectedCoin) {
                    basePortfolioData = this.PortfolioData[i];
                    this.baseCoinPrice = this.PortfolioData[i].Price;
                }
                if (this.PortfolioData[i] && this.PortfolioData[i].Coin === this.quoteSelectedCoin) {
                    quotePortfolioData = this.PortfolioData[i];
                    this.quoteCoinPrice = this.PortfolioData[i].Price;
                }
                if (basePortfolioData && quotePortfolioData) break;
            }

            if (basePortfolioData && quotePortfolioData) {
                this.baseCoinPrice = basePortfolioData.Price;
                this.quoteCoinPrice = quotePortfolioData.Price;

                const baseCoinCurrentPrice = Number.parseFloat(basePortfolioData.Price);
                const baseCoinPrevPrice = Number.parseFloat(basePortfolioData.Price) - Number.parseFloat(basePortfolioData.Change);
                const quoteCoinCurrentPrice = Number.parseFloat(quotePortfolioData.Price);
                const quoteCoinPrevPrice = Number.parseFloat(quotePortfolioData.Price) - Number.parseFloat(quotePortfolioData.Change);

                const prevRate = quoteCoinPrevPrice > 0 ? baseCoinPrevPrice / quoteCoinPrevPrice : 0;
                const currentRate = quoteCoinCurrentPrice > 0 ? baseCoinCurrentPrice / quoteCoinCurrentPrice : 0;

                this.changeInPercent = prevRate > 0 ? (currentRate / prevRate - 1) * 100 : 0;
            }
        } catch (err) {
            console.log(err);
        }
    };

    @action.bound
    resetWalletTableState () {
        this.resetWalletTable = !this.resetWalletTable;
    }

    @action.bound resetDemoBalances () {
        ResetDemoBalancesRequest();
    }

    @action.bound setSelectedCoin (coin) {
        this.selectedCoin = coin;
    }

    @action.bound setSendFormState (mode) {
        this.isSendFormOpened = mode;
    }

    /**
     *  Auto Trade
     */
    @action.bound setAutoTrade(mode) {
        this.isAutoTrade = mode;
    }

    @action.bound setTargetBaseCoin(coin) {
        this.targetBaseCoin = coin;
    }

    @action.bound setTargetQuoteCoin(coin) {
        this.targetQuoteCoin = coin;
    }

    /**
     *  Enable Setting non-zero coin
     */
    @action.bound setResetC1Mode(mode) {
        this.isResetC1Mode = mode;
    }

    requestPosition () {
        // setTimeout(partial(initRequest, PositionRequest, throttleMs, partial(makePositionRequest, localStorage.getItem('authClientId') || ClientId, ProgramId)), 500);

        setTimeout(
            PositionRequest(localStorage.getItem('authClientId') || ClientId),
            500
        );
    }

    requestPositionWithReply () {
        registerForPositionReplies(
            PositionReply,
            localStorage.getItem('authClientId') || ClientId,
            partial(updatePosition, this.updateYourAccountStoreData),
            updatePositionError
        );

        this.baseCoinIndex = 0;

        setTimeout(
            PositionRequest(localStorage.getItem('authClientId') || ClientId),
            500
        );
    }

    @action.bound getRecentPosition() {
        this.isRecentPositionPassed = false;
        clearInterval(this.timerHandleForRecentPositionCheck);

        return new Promise((resolve, reject) => {
            let limitCnt = 0;
            this.timerHandleForRecentPositionCheck = setInterval(() => {
                if (this.isRecentPositionPassed) {
                    clearInterval(this.timerHandleForRecentPositionCheck);
                    resolve(this.portfolioData);
                }
                limitCnt ++;
                if (limitCnt >= this.MAX_LIMIT_RECENT_CHECK) {
                    clearInterval(this.timerHandleForRecentPositionCheck);
                    reject(null);
                }
            }, 1000);
        });
    }

    @action.bound getPriceOf(coin) {
        for (let i = 0; i < this.PortfolioData.length; i++) {
            if (this.PortfolioData[i] && this.PortfolioData[i].Coin === coin) {
                return this.PortfolioData[i].Price;
            }
        }
        return 0;
    }
}

export default (instrumentStore, viewModeStore) => {
    return new YourAccountStore(instrumentStore, viewModeStore);
};
