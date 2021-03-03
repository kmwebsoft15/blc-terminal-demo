import React from "react";
import { observable, reaction, action, computed } from 'mobx';
import {
    BalanceRequest, SendOrderTicket, HistoryRequest, ExecPlanRequest, OrderStopExecutionPlan, GetExecPlans, PositionRequest
} from '../lib/bct-ws';
import uuidv4 from "uuid/v4";
import {getScreenInfo} from "utils";

export const arbStateKeys = {
    ARB_NONE: 'none',
    ARB_LOAD: 'loading',
    ARB_PLAN: 'plan',
    ARB_EXEC: 'execute',
    ARB_RUN: 'run',
    ARB_SETT: 'settle',
    ARB_DONE: 'done',
};
const throttleMs = 100;

class ArbitrageStore {
    @observable arbStateObj = {
        arbState: 'settle',
    }
    @action setArbState(newArbState) {
        this.arbStateObj.arbState = newArbState
    }

    @computed get arbState() {
        return this.arbStateObj.arbState;
    };

    @observable transactionDir = false;
    @observable symbol = 'BTC-USDT';
    @observable size = 0;
    @observable hStep1 = 0;
    @observable hStep2 = 0;
    @observable hStep3 = 0;
    @observable hStep4 = 0;

    reconnectDelay = 5000;
    authClientId = '';
    arbMode = false;
    payMode = false;

    limitLower = 0.0001;
    increaseRate = 1.0001;
    balanceOfBTC = 0;
    balanceOfUSDT = 0;
    isFirstLoad = true;

    ExecPlans$ = null;
    __subscriptionInited = false;
    averagePrice = 0;
    totalPrice = 0;

    hdRestoreArb = null;
    hdReconnectArb = null;
    isMobileDevice = false;
    snackbar = null;

    constructor(networkStore, viewModeStore, snackbar) {
        window['ARB'] = this; //DEBUG

        this.payMode = viewModeStore.isPayApp;
        this.snackbar = snackbar;

        reaction(
            () => ({
                isPrivateConnected: networkStore.isPrivateConnected,
            }),
            (networkObj) => {
                clearTimeout(this.hdReconnectArb);
                this.hdReconnectArb = setTimeout(() => {
                    if (networkObj.isPrivateConnected) {
                        this.authClientId = localStorage.getItem('authClientId') || '';
                        this.start();
                    }
                }, this.reconnectDelay);
            }
        );

        reaction(
            () => ({
                arbMode: viewModeStore.arbMode,
            }),
            (arbObj) => {
                this.arbMode = arbObj.arbMode;
                if (this.arbMode) {
                    this.authClientId = localStorage.getItem('authClientId') || '';
                    HistoryRequest(this.authClientId);
                    this.start();
                }
            }
        );

        this.ExecPlans$ = GetExecPlans({
            throttleMs,
        });
        if (!this.__subscriptionInited) {
            this.ExecPlans$.subscribe({ next: this.handleIncomingExecPlanFrames.bind(this) });

            this.__subscriptionInited = true;
        }

        this.setArbState(arbStateKeys.ARB_SETT);
        this.authClientId = localStorage.getItem('authClientId') || '';
        this.isMobileDevice = getScreenInfo().isMobileDevice;
    }

    restoreArb() {
        clearTimeout(this.hdRestoreArb);
        this.hdRestoreArb = setTimeout(this.start, 15000);
    }

    start = () => {
        if (!this.arbMode) return;
        if (this.isFirstLoad) {
            this.initialPlanMode();
            PositionRequest(this.authClientId);
            HistoryRequest(this.authClientId);
        }

        BalanceRequest(this.authClientId).then(data => {
            this.processTransaction(data);
        }).catch(e => {
            console.log('[BalanceRequest Failed]', e);
            this.restoreArb();
        });
    };

    processTransaction = async(position) => {
        this.balanceOfBTC = 0;
        this.balanceOfUSDT = 0;
        let amountUsdOfBTC = 0;
        let amountUsdOfUSDT = 0;

        for (let i = 0; i < position.length; i++) {
            if (position[i] && position[i].Coin === 'BTC') {
                this.balanceOfBTC = Number(position[i].Position);
                amountUsdOfBTC = Number(position[i].AmountUsd);
            }
            if (position[i] && position[i].Coin === 'USDT') {
                this.balanceOfUSDT = Number(position[i].Position);
                amountUsdOfUSDT = Number(position[i].AmountUsd);
            }
        }
        if (amountUsdOfBTC === 0 && amountUsdOfUSDT === 0) {
            this.showConvertState("You don't have got any BTC or USDT.");
            // this.restoreArb();
        } else {
            if (amountUsdOfBTC >= amountUsdOfUSDT) {
                this.transactionDir = false;
                this.symbol = 'BTC-USDT';
                this.size = this.balanceOfBTC;
            } else {
                this.transactionDir = true;
                this.symbol = 'USDT-BTC';
                this.size = this.balanceOfUSDT;
            }

            if(!this.transactionDir) {
                //this.arbState = arbStateKeys.ARB_SETT;
                this.setArbState(arbStateKeys.ARB_SETT);

                HistoryRequest(this.authClientId).then(data => {
                    this.processPlanMode();
                });
            } else {
                SendOrderTicket(this.authClientId, 'market', 0, 'simple', 'Aggregated', 'Sell', this.size, this.symbol, '')
                    .then(data => {
                        if (this.isFirstLoad) {
                            this.restoreArb();
                        } else {
                            this.showTransaction();
                        }
                    })
                    .catch(e => {
                        this.restoreArb();
                    });
            }
        }
    };

    resetEstimation = () => {
        this.hStep1 = this.size;
        this.hStep2 = this.totalPrice;
        this.hStep3 = this.totalPrice;
        this.hStep4 = this.size * this.increaseRate;
    };

    processPlanMode = async() => {
        this.stopExecPlan();
        const uuid = uuidv4();
        localStorage.setItem('ExecPlanId', uuid);
        ExecPlanRequest({
            ExecPlanId: uuid,
            Symbol: 'BTC-USDT',
            Side: 'Sell',
            Size: this.size,
        })
            .then(data => {
                this.processHistoryMode();
            })
            .catch(e => {
                this.restoreArb();
            });
    };

    processHistoryMode = async() => {
        this.resetEstimation();

        this.isFirstLoad = false;

        SendOrderTicket(this.authClientId, 'market', 0, 'simple', 'Aggregated', 'Sell', this.size, this.symbol, '')
            .then(data => {
                this.restoreArb();
            })
            .catch(e => {
                this.restoreArb();
            });
    };

    showTransaction = async() => {
        this.setArbState(arbStateKeys.ARB_LOAD);
        await this.waitFor(12000);

        this.setArbState(arbStateKeys.ARB_PLAN);
        await this.waitFor(25000);

        this.setArbState(arbStateKeys.ARB_EXEC);
        await this.waitFor(8000);

        this.setArbState(arbStateKeys.ARB_RUN);
        await this.waitFor(5000);

        this.start();
    };

    waitFor = (delay) => {
        return new Promise(resolve => {
            setTimeout(() => { resolve(); }, delay);
        });
    };

    stopExecPlan = () => {
        let oldExecPlanId = localStorage.getItem('ExecPlanId');
        if (oldExecPlanId) {
            OrderStopExecutionPlan({
                ExecPlanId: oldExecPlanId,
            });
        }
    };

    handleIncomingExecPlanFrames(data) {
        if (this.symbol === 'BTC-USDT') {
            let details = data.Details;
            this.averagePrice = details ? Number(details.ConversionCoef) : 0;
            this.totalPrice = details ? Number(details.Total) : 0;
            this.resetEstimation();
        }
    };

    initialPlanMode = async() => {
        this.stopExecPlan();
        const uuid = uuidv4();
        localStorage.setItem('ExecPlanId', uuid);
        ExecPlanRequest({
            ExecPlanId: uuid,
            Symbol: 'BTC-USDT',
            Side: 'Sell',
            Size: 1,
        });
    };

    @action.bound showConvertState(msg) {
        console.log('$$$$$', msg);
        this.snackbar({
            message: () => (
                <React.Fragment>
                    <span><b>{msg}</b></span>
                </React.Fragment>
            ),
        });
    }
}

export default (networkStore, viewModeStore, snackbar) => new ArbitrageStore(networkStore, viewModeStore, snackbar);