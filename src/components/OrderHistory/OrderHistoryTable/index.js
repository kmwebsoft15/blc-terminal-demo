/* eslint-disable react/no-danger */
import React from 'react';
import { AutoSizer } from 'react-virtualized';
import { inject, observer } from 'mobx-react';
import { injectIntl, defineMessages } from 'react-intl';
import { compose, withProps } from 'recompose';
import { Tooltip } from 'react-tippy';
import moment from 'moment';
import { Swipeable } from 'react-swipeable';

import { STORE_KEYS } from '@/stores';
import { STATE_KEYS } from '@/stores/ConvertStore';
import {
    OrdersWrapper,
    InfoHistory,
    InfoTooltip,
    WarningIcon,
    TableBody,
    Row,
    Column,
    WalletSideIcon,
    BTCIcon,
    ArrowIconAnim,
    MaskAnimation
} from './Components';
import WalletGroupButton from '@/components-generic/WalletGroupButton';
import {
    capitalizeFirstLetter, convertToFloat, customDigitFormat, commafy, getScreenInfo, customDigitFormatWithNoTrim, format2DigitStringForDonut
} from '@/utils';
import { BuyArrowIcon, SellArrowIcon } from '@/components-generic/ArrowIcon'
import DataLoader from '@/components-generic/DataLoader';
import CoinIcon from '../../CoinPairSearchV2/ExchDropdownRV/CoinIcon';
import { ScanContainer, ScanIcon } from '../../CryptoApp/Components';
import CoinPairSearchV2 from "components/CoinPairSearchV2";
const Messages = defineMessages({
    item_info: {
        id: 'order_history.item_info',
        defaultMessage: '{status} {type} {side} order<br/>{amount} {l2} @ {price} {l1}<br/>Timestamp: {time}<br/>{more}',
    },
});

class OrderHistoryTable extends React.Component {
    state = {
        isScrollTopVisible: false,
        isHoverTable: false,
        // cache the most recent item in order to compare it inside getDerivedStateFromProps
        lastItem: {},
        defaultCrypto: '',
        defaultFiat: '',
        isCurrencyUpdate: false,
    };
    timeoutId = 0;

    shouldComponentUpdate(nextProps, nextState) {
        if (this.preventUpdateFlag) return false;
        const lastItem = nextProps.OrderHistoryData.length ? nextProps.OrderHistoryData[0] : {};
        const isLastMode = lastItem.advancedMode ? 'Buy' : 'Sell';
        const isCoinPairInversed = nextProps.isCoinPairInversed;
        const isDefaultCrypto = nextProps.isDefaultCrypto;
        const currentTransactionDirection = !isDefaultCrypto ? !isCoinPairInversed : isCoinPairInversed;

        if (isDefaultCrypto !== this.props.isDefaultCrypto) {
            return true;
        }
        if (nextState.isCurrencyUpdate &&
            nextProps.convertState === STATE_KEYS.amtInput) {
            return true;
        }
        if (nextProps.convertState === STATE_KEYS.amtInput) {
            return isLastMode === (!isDefaultCrypto ? 'Sell' : 'Buy');
        }
        return nextProps.convertState !== STATE_KEYS.orderDone && currentTransactionDirection;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const lastItem = nextProps.OrderHistoryData.length ? nextProps.OrderHistoryData[0] : {};
        const defaultFiat = nextProps.defaultFiat;
        const defaultCrypto = nextProps.defaultCrypto;
        const nextState = {
            lastItem,
            defaultFiat,
            defaultCrypto,
            isCurrencyUpdate: false,
        };
        if (defaultFiat !== prevState.defaultFiat || defaultCrypto !== prevState.defaultCrypto) {
            nextState.isCurrencyUpdate = true;
        }
        return nextState;
    }

    componentWillUnmount() {
    }

    swipeHandler = event => {
        if (event.dir === 'Left') {
            const {
                [STORE_KEYS.CONVERTSTORE] : { setCancelOrder, setConvertState },
            } = this.props;
            setCancelOrder(true);
            setConvertState(STATE_KEYS.coinSearch);
        }
    };

    render() {
        const {
            OrderHistoryData,
            tab,
            convertState,
            orderForm,
            totalPrice,
            timerAfter,
            isCoinPairInversed,
            currentProgress,
            isDefaultCrypto,
            defaultCrypto,
            defaultFiat,
            defaultFiatSymbol,
            currentFiatPrice,
            Plan,
            portfolioData,
        } = this.props;

        if (this.isOrderStarted) {
            this.preventUpdateFlag = true;
            setTimeout(() => {
                this.preventUpdateFlag = false;
            }, 10000);
        }
        const {
            isMobileLandscape,
            isMobileDevice,
        } = getScreenInfo();

        const { formatMessage } = this.props.intl;
        let data = OrderHistoryData.slice();
        let isEstimateDataSet = false;
        const is2Transaction = timerAfter === 'After 2 transactions';
        const isLiveTrading = convertState !== STATE_KEYS.coinSearch;
        const statusArray = data.map(val => {
            return val.advancedMode ? 'Buy' : 'Sell';
        });

        let initVal = 0;
        if (!isDefaultCrypto) {
            initVal = (isCoinPairInversed && is2Transaction) ? 1 : 0;
        } else {
            initVal = (!isCoinPairInversed && is2Transaction) ? 1 : 0;
        }
        const currentTransactionDirection = !isDefaultCrypto ? !isCoinPairInversed : isCoinPairInversed;

        if (data.length > 0 && isLiveTrading) {
            const filled = orderForm.amount * (isCoinPairInversed ? currentFiatPrice : 1);
            const total = totalPrice * (!isCoinPairInversed ? currentFiatPrice : 1);
            const lastEstimatedMode = !isCoinPairInversed ? 'Sell' : 'Buy';
            const estL1 = !isDefaultCrypto ? defaultFiat : (!isCoinPairInversed ? orderForm.quoteSymbol : orderForm.baseSymbol);
            const estL2 = !isCoinPairInversed ? orderForm.baseSymbol : orderForm.quoteSymbol;
            const estFilled = !isCoinPairInversed ? filled : total;
            const estTotal = !isCoinPairInversed ? total : filled;
            data.unshift({
                L1: estL1,
                L2: estL2,
                isFailed: false,
                filled: estFilled,
                price: customDigitFormat(orderForm.Price),
                total: estTotal,
                timeUnFormatted: new Date().toISOString(),
                type: 'Market',
                userCurrencySymbol: defaultFiatSymbol,
                userDefaultFiat: defaultFiat,
            });
            statusArray.unshift(lastEstimatedMode);

            if (lastEstimatedMode === (!isDefaultCrypto ? 'Buy' : 'Sell') && is2Transaction) {
                const nextEstFilled = !isDefaultCrypto ? estFilled : convertToFloat(estFilled) * 1.00001;
                const nextEstTotal = !isDefaultCrypto ? convertToFloat(estTotal) * 1.00001 : estTotal;
                data.unshift({
                    L1: estL1,
                    L2: estL2,
                    isFailed: false,
                    filled: nextEstFilled,
                    price: ' ',
                    total: nextEstTotal,
                    timeUnFormatted: new Date((new Date()).getTime() + (1000 * 60)).toISOString(),
                    type: 'Market',
                    userCurrencySymbol: defaultFiatSymbol,
                    userDefaultFiat: defaultFiat,
                });
                statusArray.unshift(lastEstimatedMode === 'Sell' ? 'Buy' : 'Sell');
            }
            isEstimateDataSet = true;
        }

        let animatable = false;
        if (currentTransactionDirection && (currentProgress > 0) && convertState === STATE_KEYS.submitOrder) {
            animatable = true;
        }

        const isOrderStarted = !currentTransactionDirection && this.convertState !== STATE_KEYS.amtInput && convertState === STATE_KEYS.amtInput;
        setTimeout(() => {
            this.convertState = convertState;
            this.isOrderStarted = isOrderStarted;
        }, 0);

        const settingsStore = this.props[STORE_KEYS.SETTINGSSTORE];
        const preferenceSettings = ['isRealTrading', 'accessLevel', 'language', 'defaultFiat', 'defaultCrypto'];
        const privacySettings = ['isGoogle2FA'];
        const affiliateSettings = ['defaultURL', 'referredBy', 'affiliateLink'];
        const advancedSettings = ['autoFlip', 'c1', 'c2', 'swap', 'isAutoConvert', 'isShortSell', 'portfolioIncludesBct', 'privateVpn', 'timer', 'timerAfter'];
        let more = '<div class="title">--------Preference--------</div>';
        preferenceSettings.forEach(key => {
            more += `${key} : ${settingsStore[key]}<br/>`;
        });
        more += '<div class="title">--------Privacy--------</div>';
        privacySettings.forEach(key => {
            more += `${key} : ${settingsStore[key]}<br/>`;
        });
        more += '<div class="title">--------Affiliate--------</div>';
        affiliateSettings.forEach(key => {
            more += `${key} : ${settingsStore[key]}<br/>`;
        });
        more += '<div class="title">--------Advanced--------</div>';
        advancedSettings.forEach(key => {
            more += `${key} : ${settingsStore[key]}<br/>`;
        });
        const networkStore = this.props[STORE_KEYS.NETWORKSTORE];
        const availableNetwork = ['allowedDelay', 'isMarketConnected', 'isPBSubscribed', 'isPVSubscribed',
            'isPrivateConnected', 'isPublicConnected', 'pBHandler', 'pVHandler'];

        more += '<div class="title">--------Pie chart slices--------</div>';
        for (let i = 0; i < Plan.length; i++) {
            const p = Plan.get(i);
            more += `${p.Exchange} : ${customDigitFormatWithNoTrim(p.Amount)} ( ${format2DigitStringForDonut(p.Percentage)}% )<br/>`;
        }
        let coinsInMyWallet = [];
        for (let i = 0; i < portfolioData.length; i++) {
            if ((portfolioData[i] && (Number.parseFloat(portfolioData[i].Position) > 0.0001)) || (portfolioData[i].Coin === 'USDT')) { // low limit is 0.0001
                coinsInMyWallet.push(portfolioData[i]);
            }
        }

        more += '<div class="title">--------My Wallet--------</div>';
        for (let i = 0; i < coinsInMyWallet.length; i++) {
            const coin = coinsInMyWallet[i];
            const balance = coin.Position !== 1 ? ((coin.Position && coin.Position >= 0.00001) ? customDigitFormat(coin.Position) : '0.00') : '1.00';
            more += `${coin.Coin} : ${balance}<br/>`;
        }

        more += '<div class="title">--------Network Status--------</div>';
        Object.keys(networkStore).forEach(key => {
            if (availableNetwork.includes(key)) {
                more += `${key} : ${networkStore[key]}<br/>`;
            }
        });

        return (
            <AutoSizer>
                {({ width, height }) => (
                    <OrdersWrapper width={width} height={height} isMobileLandscape={isMobileLandscape}>
                        <Swipeable onSwiped={eventData => this.swipeHandler(eventData)}>
                            <CoinPairSearchV2 isSimple={true} isRemote/>
                            <TableBody>
                                {data.map(({
                                    filled, price, L1, L2, timeUnFormatted, isFailed, type, total, userCurrencySymbol, userDefaultFiat,
                                }, key) => {
                                    if (tab === 'open' || !filled) {
                                        return;
                                    }

                                    const fFilled = Number.parseFloat(filled);
                                    const strFilled = fFilled > 1 ? fFilled.toPrecision(7) : fFilled.toFixed(6);

                                    let mode = statusArray[key];
                                    let isBuy = mode === 'Buy';
                                    const prices = price.split(' ');
                                    let time = `${moment(timeUnFormatted).format('MM/DD/YYYY HH:mm')} - 100%`;

                                    let isProgress = false;
                                    if (this.isCoinPairInversed === isCoinPairInversed) {
                                        isProgress = (key === initVal) && (convertState === STATE_KEYS.submitOrder || convertState === STATE_KEYS.orderDone);
                                    }
                                    const actualProgress = isProgress ? Math.min(key === initVal && currentProgress, 100) : 0;

                                    if (this.isCoinPairInversed !== isCoinPairInversed) {
                                        setTimeout(() => {
                                            this.isCoinPairInversed = isCoinPairInversed;
                                        }, 0);
                                    }

                                    let symbol = userCurrencySymbol;
                                    let isArrowBuy = '';
                                    if (isDefaultCrypto) {
                                        total = convertToFloat(total);
                                        isArrowBuy = isBuy;
                                        isBuy = !isBuy;
                                    } else {
                                        total = convertToFloat(total);
                                        symbol = userCurrencySymbol;
                                        L1 = defaultFiat;
                                        isArrowBuy = isBuy;
                                    }

                                    const infoSend = isLiveTrading && ((isDefaultCrypto && key === 0) || (!isDefaultCrypto && key === 1));
                                    const infoGet = isLiveTrading && ((!isDefaultCrypto && key === 0) || (isDefaultCrypto && key === 1));


                                    const isBought = !isBuy && !(key === data.length - 1);
                                    const isSold = isBuy && !isFailed;

                                    const currentDate = moment(timeUnFormatted);

                                    if (isBought && !!data[key + 1]) {
                                        const soldDate = moment(data[key + 1].timeUnFormatted);
                                        const tradingTime = moment.duration(currentDate.diff(soldDate)).asSeconds();
                                        time += `<br/>Duration: ${tradingTime.toFixed(2)}s`
                                    } else if (isSold && !!data[key - 1]) {
                                        const boughtDate = moment(data[key - 1].timeUnFormatted);
                                        const tradingTime = moment.duration(boughtDate.diff(currentDate)).asSeconds();
                                        time += `<br/>Duration: ${tradingTime.toFixed(2)}s`
                                    }

                                    time += `<br/>Total Tradings: ${OrderHistoryData.slice().length}<br/>`

                                    return (
                                        <Row
                                            isBuy={isBuy}
                                            isArrowBuy={isArrowBuy}
                                            isTrading={isProgress}
                                            progress={actualProgress}
                                            length={data.length}
                                            key={timeUnFormatted}
                                            index={key}
                                            last={key === data.length - 1}
                                            isDefaultCrypto={isDefaultCrypto}
                                            isFailed={isFailed}
                                            animatable={animatable}
                                            isOrderStarted={isOrderStarted}
                                            isNumberFilled={!isOrderStarted && this.isOrderStarted}
                                        >
                                            <Column isHighlight={true} isColumn index={key} isMobileLandscape={isMobileLandscape}>
                                                <InfoHistory
                                                    progress={isProgress}
                                                    isBuy={isDefaultCrypto ? isBuy : !isBuy}
                                                    isArrowBuy={isArrowBuy}
                                                    isEstimateDataSet={isEstimateDataSet}
                                                    isCoinPairInversed={isCoinPairInversed}
                                                    isActiveLine={key === initVal}
                                                    index={key}
                                                    isMobileLandscape={isMobileLandscape}
                                                >
                                                    <div className="info-send-section">
                                                        {isEstimateDataSet && Number(filled) === 0 && key < 2 ? (
                                                            <DataLoader />
                                                        ) : (filled && (
                                                            <WalletGroupButton
                                                                inProgress={infoSend}
                                                                isLeft
                                                                isBuy={!isArrowBuy}
                                                                progress={animatable}
                                                                isWhite={key > 1 || !isLiveTrading}
                                                                position={isDefaultCrypto}
                                                            >
                                                                <CoinIcon value="BTC" defaultFiat={defaultFiat} />
                                                                <span className="infoIcon">
                                                                    <BTCIcon/>
                                                                </span>
                                                                <span>
                                                                    {strFilled}
                                                                </span>
                                                                <WalletSideIcon />
                                                            </WalletGroupButton>
                                                        ))}
                                                    </div>
                                                    <Tooltip
                                                        className="history-row-tooltip"
                                                        arrow={true}
                                                        animation="shift"
                                                        position="left"
                                                        distance={350}
                                                        theme="bct"
                                                        interactive={true}
                                                        hideDelay={2000}
                                                        html={
                                                            <InfoTooltip isArrowBuy={isArrowBuy}>
                                                                <div className="info-arrow-directional">
                                                                    <div className="info-title">
                                                                        <div className="info-direction">
                                                                            <div className="label-arrow-info">
                                                                                {L2}
                                                                            </div>
                                                                            <div className="wrapper_arrow">
                                                                                {isArrowBuy ? <BuyArrowIcon withText /> : <SellArrowIcon withText />}
                                                                                {isFailed && !isProgress && (
                                                                                    <WarningIcon className="warning-icon" />
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className="label-arrow-text"
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: formatMessage(Messages.item_info, {
                                                                                status: isFailed ? 'Failed' : 'Completed',
                                                                                type: capitalizeFirstLetter(type),
                                                                                side: mode,
                                                                                amount: filled,
                                                                                l2: L2,
                                                                                price: customDigitFormat(prices[0]),
                                                                                l1: L1,
                                                                                time,
                                                                                more,
                                                                            }),
                                                                        }}
                                                                    />
                                                                </div>
                                                            </InfoTooltip>
                                                        }
                                                    >
                                                        <div className="info-arrow-directional">
                                                            <div className="wrapper_arrow">
                                                                <ArrowIconAnim isBuy={isBuy} isAnimate={key < 2 && isLiveTrading && animatable}/>
                                                                {isFailed && !isProgress && (
                                                                    <WarningIcon className="warning-icon" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Tooltip>
                                                    <div className="info-get-section">
                                                        {!isCoinPairInversed && isEstimateDataSet && Number(total) === 0 && key < 2 ? (
                                                            <DataLoader />
                                                        ) : (
                                                            <WalletGroupButton
                                                                inProgress={infoGet}
                                                                isBuy={!isArrowBuy}
                                                                progress={animatable}
                                                                isWhite={key > 1 || !isLiveTrading}
                                                                position={isDefaultCrypto}
                                                            >
                                                                { total !== 0 ? (
                                                                    <span>{commafy(total.toPrecision(7))}</span>
                                                                ) : (key < 2 && isLiveTrading) && (
                                                                    <DataLoader />
                                                                )}
                                                                <CoinIcon value="USDT" defaultFiat={userDefaultFiat} />
                                                                <WalletSideIcon isRight />
                                                            </WalletGroupButton>
                                                        )}
                                                    </div>
                                                </InfoHistory>
                                                <MaskAnimation
                                                    index={key}
                                                    isBuy={isDefaultCrypto ? isBuy : !isBuy}
                                                    isOrderStarted={isOrderStarted}
                                                    isNumberFilled={!isOrderStarted && this.isOrderStarted}
                                                />
                                            </Column>
                                        </Row>
                                    );
                                })}
                            </TableBody>
                            {isMobileDevice && (
                                <ScanContainer>
                                    <ScanIcon className="on"/>
                                    <ScanIcon className="off"/>
                                    <ScanIcon className="off"/>
                                </ScanContainer>
                            )}
                        </Swipeable>
                    </OrdersWrapper>
                )}
            </AutoSizer>
        );
    }
}

export default compose(
    inject(
        STORE_KEYS.CONVERTSTORE,
        STORE_KEYS.ORDERHISTORY,
        STORE_KEYS.ORDERENTRY,
        STORE_KEYS.LOWESTEXCHANGESTORE,
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.ORDERBOOK,
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.NETWORKSTORE,
        STORE_KEYS.PRICECHARTSTORE,
        STORE_KEYS.YOURACCOUNTSTORE
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.CONVERTSTORE]: { convertState, currentProgress },
            [STORE_KEYS.ORDERHISTORY]: { OrderHistoryData },
            [STORE_KEYS.ORDERENTRY]: { CoinsPairSearchMarketOrderBuyForm: orderForm },
            [STORE_KEYS.LOWESTEXCHANGESTORE]: { totalPrice, PlanForExchangesBar: Plan },
            [STORE_KEYS.SETTINGSSTORE]: {
                timerAfter,
                isDefaultCrypto,
                defaultCrypto,
                defaultFiat,
                defaultFiatSymbol,
                price: currentFiatPrice,
            },
            [STORE_KEYS.ORDERBOOK]: { isCoinPairInversed },
            [STORE_KEYS.YOURACCOUNTSTORE]: { portfolioData },
        }) => ({
            convertState,
            currentProgress,
            OrderHistoryData,
            orderForm,
            totalPrice,
            timerAfter,
            isCoinPairInversed,
            isDefaultCrypto,
            defaultCrypto,
            defaultFiat,
            defaultFiatSymbol,
            currentFiatPrice,
            Plan,
            portfolioData,
        })
    )
)(injectIntl(OrderHistoryTable));
