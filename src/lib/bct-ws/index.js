import socketCluster from 'socketcluster-client';
import { BehaviorSubject } from 'rxjs';
import throttle from 'lodash.throttle';
import uuidv4 from 'uuid/v4';

import { createOrderTicketMessage } from './messages';
import { WS } from '../../config/constants';
import { isTokenExpired, refreshToken } from '../../utils';

const publisher = (throttleMs, publisher) => throttle(publisher, throttleMs, { trailing: false });

let clientMarket;
let clientLive;
let clientTrade;

export const recentTradesObservable = new BehaviorSubject({});
export const aggregatedSummaryBooksObservable = new BehaviorSubject({});
export const OrderBooksResponseObservable = new BehaviorSubject({});
export const orderHistoryObservable = new BehaviorSubject({});
export const positionObservableForAuth = new BehaviorSubject({});
export const coinsForWalletObservable = new BehaviorSubject({});
export const orderEventsObservable = new BehaviorSubject({});
export const orderConfirmationObservable = new BehaviorSubject({});
export const exchPlanObservable = new BehaviorSubject({});
export const portfolioDataObservable = new BehaviorSubject({});
export const claimedTransferNotificationObservable = new BehaviorSubject({});
export const privateNetworkObservable = new BehaviorSubject({});
export const publicNetworkObservable = new BehaviorSubject({});

/**
 *  Public Websocket creation
 */
export const getClientLive = () => {
    return new Promise((resolve, reject) => {
        if (clientLive) {
            return resolve(clientLive);
        }

        const socket = socketCluster.create({
            port: WS.PUBLIC.PORT,
            hostname: WS.PUBLIC.HOST,
            autoReconnect: true
        });
        socket.on('connect', () => {
            publicNetworkObservable.next({ publicSocket: true });
            clientLive = socket;
            resolve(clientLive);
        });
        socket.on('disconnect', () => {
            publicNetworkObservable.next({ publicSocket: false });
        });
        socket.on('connectAbort', () => {
            publicNetworkObservable.next({ publicSocket: false });
        });
        socket.on('error', () => {
            // console.log('[public socket connectError]');
        });
    });
};

/**
 *  Private Websocket creation
 */
export const getClientTrade = () => {
    return new Promise((resolve, reject) => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            return resolve(null);
            // return reject(new Error('unauth'));
        }
        if (clientTrade) {
            return resolve(clientTrade);
        }

        const socket = socketCluster.create({
            port: WS.PRIVATE.PORT,
            hostname: WS.PRIVATE.HOST,
            query: {
                token: authToken,
            },
            autoReconnect: true,
        });
        socket.on('connect', () => {
            privateNetworkObservable.next({ privateSocket: true });
            clientTrade = socket;
            resolve(clientTrade);
        });
        socket.on('disconnect', () => {
            privateNetworkObservable.next({ privateSocket: false });
        });
        socket.on('connectAbort', () => {
            privateNetworkObservable.next({ privateSocket: false });
        });
        socket.on('error', err => {
            if (err && err.code === 4008) { // Server rejected handshake from client
                clientTrade = null;
                refreshToken().then(() => {
                    window.location.reload();
                });
            }
        });
    });
};

/**
 *  MarketDataRequest
 */
export const MarketDataRequest = ({
    Symbols,
    ProgramId,
    throttleMs = 100,
}) => {
    if (!Array.isArray(Symbols)) {
        throw new Error(`Symbols needs to be non empty array [${Symbols}]`);
    }

    // getClientMarket()
    //     .then(cli => {
    //         cli.emit('MarketDataRequest', {
    //             symbols: Symbols,
    //             levels: 5000,
    //             throttleMs,
    //             // min,
    //             // max,
    //             // exchange,
    //         });

    //         // On reconnect
    //         cli.on('connect', () => {
    //             cli.emit('MarketDataRequest', {
    //                 symbols: Symbols,
    //                 levels: 5000,
    //                 throttleMs,
    //             });
    //         });
    //     })
    //     .catch(e => console.log(e.message || 'ClientMarket connection lost'));
};

/**
 *  MarketDataRequest for OrderBook table.
 */
export const OrderBookDataRequest = ({
    Symbols,
    ProgramId,
    throttleMs = 50,
}) => {
    if (!Array.isArray(Symbols)) {
        throw new Error(`Symbols needs to be non empty array [${Symbols}]`);
    }
    // getClientMarket()
    //     .then(cli => {

    //         cli.emit('MarketBreakdown', {
    //             symbols: Symbols,
    //             throttle: throttleMs,
    //             levels: 10,
    //             // exchanges: [2],
    //         });

    //         // On reconnect
    //         cli.on('connect', () => {
    //             cli.emit('MarketBreakdown', {
    //                 symbols: Symbols,
    //                 throttle: throttleMs,
    //                 levels: 10,
    //                 // exchanges: [2],
    //             });
    //         });
    //     })
    //     .catch(e => console.log(e.message || 'BCTSessionForOrderBook connection lost'));
};

/**
 *  RecentTrades data flow
 */
export const RecentTrades = ({
    Symbols,
    throttleMs = 250,
}) => {
    // getClientMarket()
    //     .then(cli => {
    //         const publishOnSubscription = publisher(throttleMs, data => {
    //             data = {
    //                 body: {
    //                     messages: [data],
    //                 },
    //             };
    //             recentTradesObservable.next(data);
    //         });
    //
    //         cli.on('recentTrades', publishOnSubscription);
    //     })
    //     .catch(e => console.log(e.message || 'getClientMarket connection lost'));

    return recentTradesObservable;
};

export const RecentTradesUpdate = ({
    Symbols,
    throttleMs = 250,
}) => {
};

/**
 *  SetExchange Request/Response to get filtered OrderBook data.
 */
export const SetOrderbookExchangeRequest = (exchange) => {
    const payload = {
        Exchange: exchange,
    };

    return new Promise((resolve, reject) => {
        getClientLive()
            .then(cli => {
                cli.emit('SetExchangeRequest', payload);
                cli.on('SetExchangeResponse', data => {
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientMarket'));
    });
};

/**
 *  Get Exchanges list for Market OrderBook data.
 */
export const getMarketExchangesRequest = (coinPair) => {
    const payload = {
        Market: coinPair,
    };

    return new Promise((resolve, reject) => {
        getClientLive()
            .then(cli => {
                cli.emit('MarketExchangesRequest', payload);
                cli.on('ExchangesForMarket', data => {
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientMarket'));
    });
};

/**
 *  Submit Exchange Order request
 */
export const OrderTicket = ({ throttleMs = 250, orderType }) => {
    return new Promise((resolve, _) => resolve(({
        SubmitOrderTicket: SubmitOrderTicket(orderType),
    })));
};

const SubmitOrderTicket = (OrderType) => {
    return ({
        TicketId, ClientId, ProgramId, Symbol, Size, Price, Side, Route,
    }) => {
        if (!Array.isArray(Symbol)) {
            throw new Error('Symbols needs to be array');
        }

        if (Symbol.length !== 1) {
            throw new Error('Symbols needs to be non empty array of size 1');
        }

        const payload = createOrderTicketMessage({
            TicketId,
            ClientId,
            ProgramId,
            Symbol: Symbol[0],
            Size,
            Price,
            Side,
            Route,
            OrderType,
        });

        getClientTrade()
            .then(cli => {
                cli.emit('OrderTicket', payload);
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    };
};

export const SendOrderTicket = (clientId, orderType, price, programId, route, side, size, symbol, ticketId) => {
    const payload = {
        ClientId: clientId,
        OrderType: orderType,
        Price: price,
        ProgramId: programId,
        Route: route,
        Side: side,
        Size: size,
        Symbol: symbol,
        TicketId: ticketId,
    };

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('OrderTicket', payload);
                cli.on('OrderConfirmation', data => {
                    resolve(data);
                });
            })
            .catch(e => {
                console.log(e.message || 'can not getClientTrade');
                reject(e);
            });
    });
};

/**
 *  Response of submitted order
 */
export const OrderEvents = ({
    throttleMs = 10,
}) => {
    const throttleMsTime = 1;
    getClientTrade()
        .then(cli => {
            const publishOnSubscription = publisher(throttleMsTime, data => {
                orderEventsObservable.next(data);
            });
            const publishOnSubscription2 = publisher(throttleMsTime, data => {
                orderConfirmationObservable.next(data);
            });

            cli.on('OrderEvents', publishOnSubscription);
            cli.on('OrderConfirmation', publishOnSubscription2);
        })
        .catch(e => console.log(e.message || 'can not getClientTrade'));

    return orderEventsObservable;
};

/**
 *  Wallet coins request
 */
export const PositionRequest = (ClientId) => {
    getClientTrade()
        .then(cli => {
            cli.emit('PositionRequest', { ClientId });
        })
        .catch(e => {
            console.log(e.message || 'can not getClientTrade');
            // Send empty wallet if not logged in
            PositionReply({ throttleMs: 0 });
        });
};

export const coinsForWalletRequest = () => {
    getClientLive()
        .then(cli => {
            cli.emit('CoinsForWallet');
        })
        .catch(e => console.log(e.message || 'can not getClientLive'));
};

export const coinsForWalletReply = ({ throttleMs = 0 }) => {
    getClientLive()
        .then(socket => {
            const publishOnSubscription = publisher(throttleMs, data => {
                coinsForWalletObservable.next({
                    event: 'CoinsForWallet',
                    data,
                });
            });

            socket.on('CoinsForWallet', publishOnSubscription);
        })
        .catch(e => {
            console.log(e.message || 'can not getClientLive');
        });

    return coinsForWalletObservable;
};

export const PositionReply = ({ throttleMs = 250 }) => {
    if (!localStorage.getItem('authToken')) {
        positionObservableForAuth.next({
            event: 'PositionResponseNotLoggedIn',
            data: {
                body: {
                    messages: [
                        {
                            Positions: [],
                        }
                    ],
                },
            },
        });
    } else {
        // Real wallet data
        getClientTrade()
            .then(cli => {
                const publishOnSubscription = publisher(throttleMs, data => {
                    let lData = {
                        body: {
                            messages: [{
                                Positions: data,
                            }],
                        },
                    };
                    positionObservableForAuth.next({
                        event: 'PositionResponse',
                        data: lData,
                    });
                });

                cli.on('PositionResponse', publishOnSubscription);
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    }

    return positionObservableForAuth;
};

/**
 *  CoinPairSearch coins request
 */
export const CoinsRequest = ({
    Coin,
}) => {
    // // --- old module --- //
    // return new Promise(resolve => {
    //     getClientLive()
    //         .then(cli => {
    //             cli.emit("CoinsRequest", {ProgramId, Coin});
    //             cli.on(`CoinsResponse-${ProgramId}`, data => {
    //                 resolve(data);
    //             });
    //         });
    // });

    // --- new module --- //
    return new Promise(resolve => {
        getClientLive()
            .then(cli => {
                cli.emit('CoinsRequest2', { Coin });
                cli.on('CoinsResponse2', data => {
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientLive'));
    });
};

/**
 *  Execution Plan
 */
export const OrderExecutionPlanRequest = (payload) => {
    return new Promise((resolve, reject) => {
        getClientLive()
            .then(cli => {
                cli.emit('StartExecPlan', payload);
                resolve(true);
            })
            .catch(e => console.log(e.message || 'can not getClientLive'));
    });
};

export const GetExecPlans = ({ throttleMs = 250 }) => {
    getClientLive()
        .then(cli => {
            const publishOnSubscription = publisher(throttleMs, data => {
                exchPlanObservable.next(data);
            });

            cli.on('ExecPlan', publishOnSubscription);
        })
        .catch(e => console.log(e.message || 'can not getClientLive'));

    return exchPlanObservable;
};

export const OrderStopExecutionPlan = (payload) => {
    return new Promise((resolve, reject) => {
        getClientLive()
            .then(cli => {
                cli.emit('StopExecPlan', payload);
                resolve(true);
            })
            .catch(e => {
                console.log(e.message || 'can not getClientLive');
                reject(e);
            });
    });
};

/**
 *  CoinAddressRequest
 */
export const CoinAddressRequest = (payload) => {
    if (!localStorage.getItem('authToken')) {
        return new Promise((resolve, reject) => {
            getClientLive()
                .then(cli => {
                    cli.emit('CoinAddressRequest', payload);
                    cli.on('CoinAddress', data => {
                        if (payload.Coin.toLowerCase() === data.Coin.toLowerCase()) {
                            resolve(data.Address);
                        }
                    });
                })
                .catch(e => console.log(e.message || 'can not getClientLive'));
        });
    }
    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('CoinAddressRequest', payload);
                cli.on('CoinAddress', data => {
                    if (payload.Coin.toLowerCase() === data.Coin.toLowerCase()) {
                        resolve(data.Address);
                    }
                });
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });

};

/**
 *  WithdrawRequest
 */
export const WithdrawRequest = (payload) => {
    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('WithdrawRequest', payload);
                resolve(true);
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};

/**
 *  ResetDemoBalances
 */
export const ResetDemoBalancesRequest = () => {
    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('ResetDemoBalances', {});
                resolve(true);
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};

/**
 *  TelegramTransferRequest
 */
export const TelegramTransferRequest = (payload) => {
    // {
    //     'Coin': 'btc',
    //     'Amount': '10',
    //     'To': '563959990',
    //     'Details': {
    //         'firstName': 'Igor',
    //         'lastName': 'Kovobski',
    //     }
    // }

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('TelegramTransferRequest', payload);
                resolve(true);
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};

/**
 *  HistoryForCoinRequest
 */
export const HistoryForCoinRequest = (payload) => {
    // {
    //     Coin: "BTC",
    //     Limit: 10,
    //     Skip: 10
    // }

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('HistoryForCoinRequest', payload);
                cli.on('HistoryForCoinResponse', data => {
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};

/**
 *  Portfolio Data Request
 */
export const PortfolioDataRequest = (payload) => {
    getClientTrade()
        .then(cli => {
            cli.emit('PortfolioDataRequest', payload);
        })
        .catch(e => console.log(e.message || 'can not getClientTrade'));
};

export const GetSettingsRequest = (payload) => {
    return getClientTrade()
        .then(client => {
            return new Promise((resolve, reject) => {
                try {
                    client.emit('SettingsRequest', payload);
                    client.off('Settings').on('Settings', data => resolve(data));
                } catch (e) {
                    reject(e);
                }
            });
        })
        .catch(e => {
            console.log(e.message || 'can not getClientTrade');
            return Promise.reject(e);
        });
};

export const UpdateSettingsRequest = (payload) => {
    return getClientTrade()
        .then(client => {
            return new Promise((resolve, reject) => {
                try {
                    client.emit('UpdateSettingsRequest', payload);
                    client.off('SettingsUpdate').on('SettingsUpdate', data => resolve(data));
                } catch (e) {
                    reject(e);
                }
            });
        })
        .catch(e => {
            console.log(e.message || 'can not getClientTrade');
            return Promise.reject(e);
        });
};


/**
 * Register Exchange account of user.
 * @param {string} exchangeName 
 * @param {string} apiKey 
 * @param {string} apiSecret 
 */
export const AddExchangeAccount = (exchangeName, apiKey, apiSecret) => {
    const payload = {
        exchange: exchangeName,
        publicKey: apiKey,
        privateKey: apiSecret,
    };

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('addExchange', payload);
                cli.on('exchangeAdded', res => resolve(res));
                cli.on('invalidExchange ', err => reject(err));
            });
    });
};


/**
 *  PaymentRequest  (buying crypto)
 */
// Request: emit "PaymentRequest"
// {
//     "Payment": {
//         "Amount": 10,
//         "Coin": "BTC",
//         "PaymentAmount": 1000,
//         "PaymentCurrency": "USD",
//         "Card": {
//             "Type": "Visa",
//             "Name": "Foo bar",
//             "Number": "1111 1111 1111 1111",
//             "ExpDate": "10/20",
//             "Cvv": "123"
//         }
//     }
// }
export const PaymentRequest = (Type, Name, Number, ExpDate, Cvv) => {
    const payload = {
        Payment: {
            Amount: 0,
            Coin: '',
            PaymentAmount: 1000,
            PaymentCurrency: 'USD',
            Card: {
                Type,
                Name,
                Number,
                ExpDate,
                Cvv,
            },
        },
    };

    getClientTrade()
        .then(cli => {
            cli.emit('PaymentRequest', payload);
        })
        .catch(e => console.log(e.message || 'can not getClientTrade'));
};


/**
 *  DepositAddressRequest
 */
// Request emit DepositAddressRequest
// {
//     Address: "1Ebfh6GruruXwHD67au8eNpL58NXr1YTkH"
// }

// Response on DepositAddressResponse
// - success case:
// {
//     Username: 'jon_doe_12345',
//     FirstName: 'jon',
//     LastName: 'doe',
//     PhotoUrl: 'https://t.me/i/userpic/320/jon_doe_12345.jpg',
//     Status: 'success',
// }

// - failed case:
// {
//     Msg: 'No user exists with such deposit address'
//     Status: 'failed',
// }

export const DepositAddressRequest = (address) => {
    const payload = {
        Address: address,
    };

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('DepositAddressRequest', payload);
                cli.on('DepositAddressResponse', data => {
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};


/**
 *  TelegramIdRequest
 */
// Request emit TelegramIdRequest
// {
//     Id: 510889450
// }

// Response on TelegramIdResponse
// - success case:
// {
//     Username: 'jon_doe_12345',
//     Status: 'success',
// }

// - failed case:
// {
//     Msg: 'Invalid TelegramID, please check number'
//     Status: 'failed',
// }

export const TelegramIdRequest = (id) => {
    const payload = {
        Id: id,
    };

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('TelegramIdRequest', payload);
                cli.on('TelegramIdResponse', data => {
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};


/**
 * WithdrawalRequest
 */
// - Request emit WithdrawalRequest
// {
//     RequestId: [uuidv4],
//     Coin: 'BTC',
//     Amount: '1',
//     ToAddress: '1GsojN1um3TPQyHXkcwr47uDw62YwAWfuH',
// }

// - Response: on WithdrawalResponse
// {
//     RequestId: [uuidv4],
//     Status,
//     Error,
// }

// Property Error will be empty if some amount of coins is sent successfully.

export const WithdrawalRequest = (coin, amount, address) => {
    const payload = {
        RequestId: uuidv4(),
        Coin: coin,
        Amount: amount,
        Address: address,
    };

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('WithdrawalRequest', payload);
                cli.on('WithdrawalResponse', data => {
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};


/**
 * InitTransferRequest
 */
// ## init transfer
//
// FE sends ws request(Private):
//
// event = 'InitTransferRequest'
// data = {
//     Coin: 'USDT',
//     Amount: 22.2,
//     ExpireIn: '2h' (optional),
// }
// If ExpireIn is not sent then value '2d' will be used by default.
//
// BE sends response:
//
//     Success:
//          event = 'InitTransferResponse'
//          data = {
//              Status: 'success',
//              Error: '',
//          }
//
//     Failure:
//          data = {
//               Status: 'fail',
//               Error: 'Message text',
//          }

export const InitTransferRequest = (coin, amount, currency) => {
    const payload = {
        Coin: coin,
        Amount: amount,
        DefaultCurrency: currency,
        ExpireIn: '5m',
    };

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('InitTransferRequest', payload);
                cli.on('InitTransferResponse', data => {
                    // console.log('[InitTransferResponse]', data);
                    resolve(data);
                });
            })
            .catch(e => {
                console.log(e.message || 'can not getClientTrade');
                reject(e);
            });
    });
};

export const TransferNotification = () => {
    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.on('TransferNotification', data => {
                    resolve(data);
                });
            })
            .catch(e => {
                console.log(e.message || 'can not getClientTrade');
                reject(e);
            });
    });
};

export const TransferInfoDetailedRequest = (uniqueId) => {
    const payload = {
        TrId: uniqueId,
    };

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('TransferInfoDetailedRequest', payload);
                cli.on('TransferInfoDetailedResponse', data => {
                    // console.log('[TransferInfoDetailedResponse]', data);
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};

export const TransferInfoRequest = (uniqueId) => {
    const payload = {
        TrId: uniqueId,
    };

    return new Promise((resolve, reject) => {
        getClientLive()
            .then(cli => {
                cli.emit('TransferInfoRequest', payload);
                cli.on('TransferInfoResponse', data => {
                    // console.log('[TransferInfoResponse]', data);
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};



export const ClaimTransfer = (uniqueId) => {
    const payload = {
        TrId: uniqueId,
    };

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('ClaimTransferRequest', payload);
                cli.on('ClaimTransferResponse', data => {
                    console.log('[ClaimTransferResponse]', data);
                    resolve(data);
                });
            })
            .catch(e => {
                reject(e);
            });
    });
};

export const TransferHistoryRequest = payload => getClientTrade()
    .then(client => {
        return new Promise((resolve, reject) => {
            try {
                client.emit('TransferHistoryRequest', payload);
                client.off('TransferHistoryResponse').on('TransferHistoryResponse', data => {
                    resolve(data);
                });
            } catch (e) {
                reject(e);
            }
        });
    })
    .catch(e => Promise.reject(e));


export const GetClaimedTransferNotification = ({ throttleMs = 10 }) => {
    getClientTrade()
        .then(cli => {
            const publishOnSubscription = publisher(throttleMs, data => {
                claimedTransferNotificationObservable.next(data);
            });

            cli.on('ClaimedTransferNotification', publishOnSubscription);
        })
        .catch(e => console.log(e.message || 'can not getClientLive'));

    return claimedTransferNotificationObservable;
};

// CancelTransferRequest
export const CancelTransferRequest = (uniqueId) => {
    const payload = {
        TrId: uniqueId,
    };

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('CancelTransferRequest', payload);
                cli.on('CancelTransferResponse', data => {
                    // console.log('[CancelTransferResponse]', data);
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};

// RejectUserTransferRequest
export const RejectUserTransferRequest = (uniqueId) => {
    const payload = {
        TrId: uniqueId,
    };

    return new Promise((resolve, reject) => {
        getClientLive()
            .then(cli => {
                cli.emit('RejectTransferRequest', payload);
                cli.on('RejectTransferResponse', data => {
                    resolve(data);
                });
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};

/**
 *  Order History Request/Response
 */
export const OrderHistoryRequest = (ClientId) => {
    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('OrderHistoryRequest', { ClientId });
                resolve(true);
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};

export const OrderHistoryReply = ({ throttleMs = 250 }) => {
    getClientTrade()
        .then(cli => {
            const publishOnSubscription = publisher(throttleMs, data => {
                data = {
                    body: {
                        messages: [{
                            Tickets: data,
                        }],
                    },
                };
                orderHistoryObservable.next(data);
            });

            cli.on('OrderHistoryResponse', publishOnSubscription);
        })
        .catch(e => console.log(e.message || 'can not getClientTrade'));

    return orderHistoryObservable;
};

/**
 *  Bills API integration
 */
export const ListUserBillsRequest = (coin) => {
    const payload = {
        Coin: coin,
    };

    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('ListUserBillsRequest', payload);
                cli.on('ListUserBillsResponse', data => {
                    if (payload.Coin.toLowerCase() === data.Coin.toLowerCase()) {
                        resolve(data);
                    }
                });
            })
            .catch(e => console.log(e.message || 'can not getClientTrade'));
    });
};

export const BalanceRequest = (ClientId) => {
    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('PositionRequest', { ClientId });
                cli.on('PositionResponse', data => {
                    resolve(data);
                });
            })
            .catch(e => {
                reject(e);
            });
    });
};

export const ExecPlanRequest = (payload) => {
    return new Promise((resolve, reject) => {
        getClientLive()
            .then(cli => {
                cli.emit('StartExecPlan', payload);
                cli.on('ExecPlan', data => {
                    resolve(data);
                });
            })
            .catch(e => {
                console.log(e.message || 'can not getClientLive');
                reject(e);
            });
    });
};

export const HistoryRequest = (ClientId) => {
    return new Promise((resolve, reject) => {
        getClientTrade()
            .then(cli => {
                cli.emit('OrderHistoryRequest', { ClientId });
                cli.on('OrderHistoryResponse', data => {
                    resolve(data);
                });
            })
            .catch(e => {
                console.log(e.message || 'can not getClientTrade');
                reject(e);
            });
    });
};

/**
 * Buy Order Request with best price
 * @param {Object} payload
 * @property {string} side "Buy" or "Sell"
 * @property {string} amount
 */
export const OrderRequestBestPrice = (payload)  => {
    payload.market = 'BTC/USDT';
    return new Promise((resolve, reject) => {
        getClientTrade()
        .then(cli => {
            if (payload.side === 'buy') {
                cli.emit('orderRequestBestPriceBuy', payload);
            } else if (payload.side === 'sell') {
                cli.emit('orderRequestBestPriceSell', payload);
            }
            cli.on('orderResponse', res => resolve(res));
            cli.on('invalidOrder', err => reject(err));
        })
        .catch(err => console.log(err.message || 'can not getClientTrade'));
    });
};