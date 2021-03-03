import React from 'react';
import { observable, action } from 'mobx';
import {
    InitTransferRequest,
    TransferNotification,
    TransferInfoDetailedRequest,
    TransferInfoRequest,
    ClaimTransfer,
    TransferHistoryRequest,
    CancelTransferRequest,
    RejectUserTransferRequest
} from '../lib/bct-ws';

class SendCoinStore {
    @observable uniqueAddress = '';
    @observable historyCurrency = 'eth';
    @observable transferHistory = [];
    @observable isFetchingTransferHistory = false;
    @observable isEmpty = null;

    constructor(snackBar) {
        this.snackBar = snackBar;
    }

    @action.bound initTransferRequest(coin, amount, currency) {
        this.uniqueAddress = '';
        return new Promise((resolve, reject) => {
            InitTransferRequest(coin, amount, currency).then(res => {
                console.log('unique address: ' + res.TrId);
                this.uniqueAddress = res.TrId || '';
                resolve(res.TrId || '');
            });
        });
    }

    @action.bound transferNotification() {
        return new Promise((resolve, reject) => {
            TransferNotification().then(res => {
                console.log(res);
                resolve(res);
            });
        });
    }

    @action.bound requestDetailsPrivate(uniqueId) {
        return new Promise((resolve, reject) => {
            TransferInfoDetailedRequest(uniqueId).then(res => {
                resolve({
                    Coin: res.Coin || '',
                    Amount: res.Amount || '',
                    DefaultCurrency: res.DefaultCurrency || '',
                    FullName: res.FullName || '',
                    Status: res.Status || '',
                    IsOwner: res.IsOwner,
                });
            });
        });
    }

    @action.bound requestDetailsPublic(uniqueId) {
        return new Promise((resolve, reject) => {
            TransferInfoRequest(uniqueId).then(res => {
                resolve({
                    Coin: res.Coin || '',
                    Amount: res.Amount || '',
                    DefaultCurrency: res.DefaultCurrency || '',
                    FullName: res.FullName || '',
                    Status: res.Status || '',
                });
            });
        });
    }

    @action.bound claimTransfer(uniqueId) {
        return new Promise((resolve, reject) => {
            if (uniqueId !== '') {
                ClaimTransfer(uniqueId)
                    .then(res => {
                        this.requestTransferHistory('eth');
                        resolve(res);
                    });
            } else {
                reject(new Error('uniqueId is empty'));
            }
        });
    }

    @action.bound requestTransferHistory() {
        this.isFetchingTransferHistory = true;

        const payload = {
            CurrencyId: 'ETH',
        };

        return TransferHistoryRequest(payload)
            .then(res => {
                this.isFetchingTransferHistory = false;
                if(res.Status === 'success') {
                    try {
                        res.UserTransfers.sort(function compare(a, b) {
                            let dateA = new Date(a.CreatedAt).getTime();
                            let dateB = new Date(b.CreatedAt).getTime();
                            return dateB - dateA;
                        });
                        this.transferHistory = res.UserTransfers.filter(item => item.Status !== 'expired' && item.Coin === this.historyCurrency);
                        this.isEmpty = this.transferHistory.length === 0;
                        return Promise.resolve(this.transferHistory);
                    } catch (e) {
                        return Promise.resolve([]);
                    }
                }
            })
            .catch(e => {
                this.isFetchingTransferHistory = false;
                this.transferHistory = [];

                return Promise.reject(e);
            });
    }

    @action.bound showCoinSendState(msg) {
        this.snackBar({
            message: () => (
                <React.Fragment>
                    <span><b>{msg}</b></span>
                </React.Fragment>
            ),
        });
    }

    @action.bound requestCancelTransferRequest(uniqueId) {
        return CancelTransferRequest(uniqueId)
            .then(res => {
                if (res && res.Success) {
                    this.showCoinSendState('Successfully canceled payment');
                    this.requestTransferHistory();
                } else {
                    this.showCoinSendState('Payment cancellation is failed');
                }
                this.requestTransferHistory();
                return {
                    success: res && res.Success,
                };
            });
    }

    @action.bound requestRejectUserTransferRequest(uniqueId) {
        console.log('reject start');
        return RejectUserTransferRequest(uniqueId)
            .then(res => {
                console.log('reject result: ', res);
                if (res && res.Status === 'success') {
                    this.showCoinSendState('Successfully canceled payment');
                    this.requestTransferHistory();
                } else {
                    this.showCoinSendState('Payment cancellation is failed');
                }
                this.requestTransferHistory();
                return {
                    success: res && res.Status === 'success',
                };
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export default (snackBar) => {
    const store = new SendCoinStore(snackBar);
    return store;
};
