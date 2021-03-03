import React from 'react';
import { Tooltip } from 'react-tippy';
import { inject, observer } from 'mobx-react';
import partial from 'lodash.partial';
import { compose } from 'recompose';
import { withSafeTimeout, withSafeInterval } from '@hocs/safe-timers';
import debounce from 'lodash/debounce';

import StyleWrapper from './style';
import { STORE_KEYS } from '@/stores';
import { STATE_KEYS } from '@/stores/ConvertStore';
import { autoConvertOptions } from '@/stores/SettingsStore';
import { appStoreModeKeys, viewModeKeys } from '@/stores/ViewModeStore';
import { valueNormalized } from '@/stores/utils/OrderEntryUtils';
import { donutChartModeStateKeys } from '@/stores/LowestExchangeStore';
import {
    withValueFromEvent,
    customDigitFormat,
    getScreenInfo
} from '@/utils';
import CoinIconStep2 from './CoinIconStep2';
import ExchDropdown from './ExchDropdownRV';
import SliderInput from './SliderInput/index';
import OrderGradientButton from '@/components-generic/GradientButtonSquare';
import GradientButtonTimer from '@/components-generic/GradientButtonTimer';
import ButtonLoader from '@/components-generic/ButtonLoader';
import DataLoader from '@/components-generic/DataLoader';
import SwitchCustom from '@/components-generic/SwitchCustom';

import {
    Addon,
    AddonLabel,
    LoaderWrapper,
    WalletButtonCentered,
    SearchIcon,
    CoinWrapper
} from './Components';
import CoinSwap from './CoinSwap';
import CoinNameStep2 from './CoinNameStep2';
import { orderFormToggleKeys } from '@/stores/MarketMaker';
import WalletGroupButton from '@/components-generic/WalletGroupButton';
import { BTCFontIcon, WalletSideIcon } from '@/components/OrderHistory/OrderHistoryTable/Components';
import CoinSwapToggle from './CoinSwapToggle';
import { ArbButton } from '@/components/WalletHeader/DesktopHeader/AppStoreControls/Components';

const MIN_USD_AMOUNT = 20;

class CoinPairSearchV2 extends React.Component {
    state = {
        amount: '',
        isSwapped: null,
        isAmtInputFocused: false,
        isAmtChangedAfterFocus: false,
        isOpenLeftList: false,
        isOpenRightList: false,
        inputAmount: 1,
        isCoinPairInversed: false,
    };

    wrapperRef = React.createRef();
    amtInputRef = React.createRef();
    doneTradingTick = null;

    constructor(props) {
        super(props);
        this.updateExecPlan = debounce(() => {
            props[STORE_KEYS.LOWESTEXCHANGESTORE].lowestExchange.getExecPlan();
        }, 1000);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const newState = {};
        if (Boolean(prevState.isCoinPairInversed) !== Boolean(nextProps[STORE_KEYS.ORDERBOOK].isCoinPairInversed)) {
            newState.isCoinPairInversed = nextProps[STORE_KEYS.ORDERBOOK].isCoinPairInversed;
            if (prevState.isSwapped !== null) {
                newState.isSwapped = nextProps[STORE_KEYS.ORDERBOOK].isCoinPairInversed;
            }
        }
        if (nextProps[STORE_KEYS.SETTINGSSTORE].accessLevel === 'Level 1') {
            newState.isSwapped = null;
        }
        if (prevState.convertState !== nextProps[STORE_KEYS.CONVERTSTORE].convertState) {
            newState.convertState = nextProps[STORE_KEYS.CONVERTSTORE].convertState;
        }
        return newState;
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResizeWindow);
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            [STORE_KEYS.CONVERTSTORE]: {
                setConvertState, forceStopArbitrageExchange, cancelOrder, forceStartArbitrageExchange, setForceStartArbitrageExchange,
            },
            [STORE_KEYS.LOWESTEXCHANGESTORE]: {
                updateExchange,
                isDonutChartLoading,
                resetDonutChartLoadingState,
            },
            [STORE_KEYS.EXCHANGESSTORE]: { setExchange },
        } = this.props;

        if (!forceStopArbitrageExchange && isDonutChartLoading === donutChartModeStateKeys.doneModeKey) {
            setConvertState(STATE_KEYS.amtInput);
            updateExchange(-1, '');
            setExchange('Global');
            resetDonutChartLoadingState();
        }

        if (forceStartArbitrageExchange) {
            setForceStartArbitrageExchange(false);
            this.onStep1ExchangeBtnClicked();
        }

        if (cancelOrder) {
            this.onCancelTrading();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResizeWindow);
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleChangeAmount = (value) => {
        this.setState({ inputAmount: value});
    };

    handleResizeWindow = () => {
        this.forceUpdate();
    };

    initTradeWith = (base, quote) => {
        const {
            [STORE_KEYS.INSTRUMENTS]: instrumentsStore,
            [STORE_KEYS.ORDERENTRY]: orderEntryStore,
            [STORE_KEYS.YOURACCOUNTSTORE]: yourAccountStore,
            [STORE_KEYS.LOWESTEXCHANGESTORE]: lowestExchange,
            [STORE_KEYS.VIEWMODESTORE]: viewModeStore,
            [STORE_KEYS.SETTINGSSTORE]: settingsStore,
            [STORE_KEYS.CONVERTSTORE]: convertStore,
        } = this.props;
        const { CoinsPairSearchMarketOrderBuyForm: orderForm } = orderEntryStore;
        const {
            setExchFormState, setBase, setQuote,
        } = instrumentsStore;
        const { openDepositView } = viewModeStore;
        const {
            portfolioData, setTargetBaseCoin, setTargetQuoteCoin, isAutoTrade, setAutoTrade,
        } = yourAccountStore;
        const { isAutoConvert } = settingsStore;
        if (convertStore.forceStopArbitrageExchange) return;

        for (let i = 0; i < portfolioData.length; i++) {
            if (portfolioData[i] && (portfolioData[i].Coin === base)) {
                if (portfolioData[i].Position > 0.0001) {
                    orderForm.setAccurateAmount(portfolioData[i].Position);
                    orderForm.setSliderMax(portfolioData[i].Position);
                    orderForm.setAmount(portfolioData[i].Position);
                } else if ((isAutoConvert !== autoConvertOptions.Off) && !isAutoTrade) {
                    setAutoTrade(true);
                    setTargetBaseCoin(base);
                    setTargetQuoteCoin(quote);
                    setQuote(base);
                    setBase(yourAccountStore.maxCoin);
                    this.initTradeWith(yourAccountStore.maxCoin, base);
                    return;
                }
                break;
            }
        }
        openDepositView(null);
        lowestExchange.startExecPlan();
        setExchFormState(true);
    };

    // Step1 exchange button
    onStep1ExchangeBtnClicked = () => {
        const {
            [STORE_KEYS.INSTRUMENTS]: instrumentsStore,
            [STORE_KEYS.VIEWMODESTORE]: viewModeStore,
            [STORE_KEYS.SETTINGSSTORE]: settingsStore,
            [STORE_KEYS.MARKETMAKER]: orderformToggleStore,
            [STORE_KEYS.ORDERHISTORY]: orderHistoryStore,
            [STORE_KEYS.CONVERTSTORE]: convertStore,
            [STORE_KEYS.TELEGRAMSTORE]: telegramStore,
            onLogin,
            disabled,
        } = this.props;

        if (!telegramStore.isLoggedIn) {
            convertStore.showConvertState('Please login');
            settingsStore.setSidebarStatus('open');
            onLogin();
            return;
        }
        viewModeStore.setGraphSwitchMode(false);
        settingsStore.setArbitrageModeWith(true);
        viewModeStore.showDepthChartMode(false);
        orderHistoryStore.requestOrderHistory();
        orderformToggleStore.showOrderFormWith(orderFormToggleKeys.offToggleKey);
        viewModeStore.setViewMode(viewModeKeys.basicModeKey);
        viewModeStore.setTradingViewMode(false);
        // viewModeStore.setUserDropDownOpen(false);
        convertStore.setCancelOrder(false);
        convertStore.setForceStopArbitrageExchange(false);
        this.initTradeWith(instrumentsStore.selectedBase, instrumentsStore.selectedQuote);
        // settingsStore.setSidebarStatus('open');
        settingsStore.setTradeColStatus('open');
        if (!disabled) {
            if (!telegramStore.isLoggedIn) {
                convertStore.showConvertState('Please login');
                settingsStore.setSidebarStatus('open');
                onLogin();
                return;
            }
            viewModeStore.setGraphSwitchMode(false);
            settingsStore.setArbitrageModeWith(true);
            viewModeStore.setAppStoreMode(appStoreModeKeys.hedgeFundModeKey);
            orderHistoryStore.requestOrderHistory();
            orderformToggleStore.showOrderFormWith(orderFormToggleKeys.offToggleKey);
            viewModeStore.setViewMode(viewModeKeys.basicModeKey);
            viewModeStore.setTradingViewMode(false);
            // viewModeStore.setUserDropDownOpen(false);
            convertStore.setCancelOrder(false);
            convertStore.setForceStopArbitrageExchange(false);
            this.initTradeWith(instrumentsStore.selectedBase, instrumentsStore.selectedQuote);
            // settingsStore.setSidebarStatus('open');
            settingsStore.setTradeColStatus('open');
            viewModeStore.showDepthChartMode(false);
        }
        viewModeStore.setAppStoreControlsOpen(false);
    };

    handleDoneBtnClick = (isConvertSuccess) => {
        const {
            [STORE_KEYS.CONVERTSTORE]: convertStore,
            [STORE_KEYS.SETTINGSSTORE]: settingsStore,
            [STORE_KEYS.YOURACCOUNTSTORE]: yourAccountStore,
            [STORE_KEYS.INSTRUMENTS]: instrumentStore,
            [STORE_KEYS.ORDERENTRY]: orderEntryStore,
            [STORE_KEYS.TELEGRAMSTORE]: telegramStore,
            setSafeTimeout,
        } = this.props;
        const { CoinsPairSearchMarketOrderBuyForm: orderForm } = orderEntryStore;
        const { autoFlip, isArbitrageMode, timerAfter } = settingsStore;
        const {
            setBase,
            setQuote,
            selectedBase,
            selectedQuote,
        } = instrumentStore;
        const {
            isAutoTrade, setAutoTrade, targetBaseCoin, targetQuoteCoin, getRecentPosition,
        } = yourAccountStore;
        const { isLoggedIn } = telegramStore;
        if (convertStore.forceStopArbitrageExchange) return;

        if (!isLoggedIn || timerAfter === 'After 1 transaction') {
            convertStore.setConvertState(STATE_KEYS.orderDone);
            this.onOrderDone(isConvertSuccess);
        } else if (isArbitrageMode) {
            getRecentPosition()
                .then((recentPositionData) => {
                    if (convertStore.forceStopArbitrageExchange) {
                        return;
                    }
                    setBase(selectedQuote);
                    setQuote(selectedBase);

                    let resourceAmount = 0;
                    for (let i = 0; i < recentPositionData.length; i++) {
                        if (recentPositionData[i] && (recentPositionData[i].Coin === selectedQuote)) {
                            if (recentPositionData[i].Position > 0.0001) {
                                resourceAmount = recentPositionData[i].Position;
                                orderForm.setAccurateAmount(resourceAmount);
                                orderForm.setSliderMax(resourceAmount);
                                orderForm.setAmount(resourceAmount);
                            }
                            break;
                        }
                    }
                    if (resourceAmount > 0 && !convertStore.forceStopArbitrageExchange) {
                        setSafeTimeout(() => {
                            convertStore.setConvertState(STATE_KEYS.amtInput);
                            this.initTradeWith(selectedQuote, selectedBase);
                        }, 0);
                    } else {
                        convertStore.showConvertState('Transaction failed from backend.');
                        setSafeTimeout(() => {
                            convertStore.setConvertState(STATE_KEYS.orderDone);
                            this.onOrderDone(isConvertSuccess);
                        }, 2000);
                    }
                })
                .catch(err => {
                    convertStore.showConvertState('No portfolio data exists from backend.');
                    setSafeTimeout(() => {
                        convertStore.setConvertState(STATE_KEYS.orderDone);
                        this.onOrderDone(isConvertSuccess);
                    }, 2000);
                });
        } else if (isAutoTrade) {
            setAutoTrade(false);
            setBase(targetBaseCoin);
            setQuote(targetQuoteCoin);
            if (!convertStore.forceStopArbitrageExchange) {
                setSafeTimeout(() => {
                    this.initTradeWith(targetBaseCoin, targetQuoteCoin);
                }, 3000);
            }
        } else {
            setBase(selectedQuote);
            setQuote(selectedBase);
            convertStore.setConvertState(STATE_KEYS.amtInput);
            this.initTradeWith(selectedQuote, selectedBase);
        }
    };

    onOrderDone = (isConvertSuccess) => {
        const {
            [STORE_KEYS.CONVERTSTORE]: {
                setConvertState,
                convertState,
            },
            [STORE_KEYS.LOWESTEXCHANGESTORE]: {
                setDonutModeFinishedForLabel,
                resetExecPlan,
                updateExchange,
            },
            [STORE_KEYS.EXCHANGESSTORE]: { setExchange },
            [STORE_KEYS.YOURACCOUNTSTORE]: yourAccountStore,
            [STORE_KEYS.TELEGRAMSTORE]: telegramStore,
            [STORE_KEYS.SETTINGSSTORE]: settingsStore,
            [STORE_KEYS.VIEWMODESTORE]: viewModeStore,
            [STORE_KEYS.MARKETMAKER]: orderformToggleStore,
            setSafeTimeout,
        } = this.props;
        const { isLoggedIn, setLoginBtnLocation } = telegramStore;
        const { autoFlip, isArbitrageMode } = settingsStore;
        const {
            setResetC1Mode, isAutoTrade, resetWalletTableState, setAutoTrade, targetBaseCoin, targetQuoteCoin,
        } = yourAccountStore;
        const { showDepthChartMode, setTradingViewMode, setViewMode } = viewModeStore;

        setViewMode(viewModeKeys.basicModeKey);
        if (convertState === STATE_KEYS.orderDone) {
            setDonutModeFinishedForLabel(true);
            setConvertState(STATE_KEYS.coinSearch);
            resetExecPlan();
            updateExchange(-1, '');
            setExchange('Global');
            if (!isLoggedIn) {
                setSafeTimeout(() => {
                    setLoginBtnLocation(true);
                }, 2000);
            }
            showDepthChartMode(true);
            setTradingViewMode(false);
            orderformToggleStore.showOrderFormWith(orderFormToggleKeys.offToggleKey);
            if (isConvertSuccess && autoFlip !== 'Disabled' && !isAutoTrade) {
                this.toggleSwap();
            } else {
                setResetC1Mode(true);
            }
            resetWalletTableState();
        }
    };

    onSubmitOrder = () => {
        const {
            [STORE_KEYS.INSTRUMENTS]: instrumentsStore,
            [STORE_KEYS.CONVERTSTORE]: convertStore,
            [STORE_KEYS.ORDERENTRY]: orderEntryStore,
            [STORE_KEYS.YOURACCOUNTSTORE]: yourAccountStore,
            [STORE_KEYS.LOWESTEXCHANGESTORE]: lowestExchangeStore,
            [STORE_KEYS.EXCHANGESSTORE]: { setExchange },
            [STORE_KEYS.ORDERHISTORY]: orderHistoryStore,
            [STORE_KEYS.TELEGRAMSTORE]: telegramStore,
            [STORE_KEYS.SETTINGSSTORE]: settingsStore,
            [STORE_KEYS.ORDERBOOK]: orderBookStore,
            setSafeInterval,
            setSafeTimeout,
        } = this.props;
        const { CoinsPairSearchMarketOrderBuyForm: orderForm } = orderEntryStore;
        const { setExchFormState, selectedBase, selectedQuote } = instrumentsStore;
        const { timerAfter, orderHistory, isDefaultCrypto } = settingsStore;
        const { isLoggedIn } = telegramStore;
        const { isCoinPairInversed } = orderBookStore;
        const currentTransactionDirection = !isDefaultCrypto ? !isCoinPairInversed : isCoinPairInversed;
        const is2TransactionMode = timerAfter === 'After 2 transactions' && !currentTransactionDirection;

        if (convertStore.forceStopArbitrageExchange) {
            return;
        }

        setExchFormState(false);
        lowestExchangeStore.clearExecPlanInterval();

        const c1ItemIndex = yourAccountStore.portfolioData.findIndex(x => (x && x.Coin === selectedBase));
        const c1BeforePosition = yourAccountStore.portfolioData[c1ItemIndex] ? yourAccountStore.portfolioData[c1ItemIndex].Position : 0;
        const c2ItemIndex = yourAccountStore.portfolioData.findIndex(x => (x && x.Coin === selectedQuote));
        const c2BeforePosition = yourAccountStore.portfolioData[c2ItemIndex] ? yourAccountStore.portfolioData[c2ItemIndex].Position : 0;
        const amount = orderForm.Amount;
        const price = orderForm.Price;

        if (convertStore.convertState === STATE_KEYS.amtInput) {
            lowestExchangeStore.updateConfirmed(true);
            convertStore.setConvertState(STATE_KEYS.submitOrder);

            if (isLoggedIn) {
                orderForm.submitOrder();
                let startPoint = new Date().getTime();

                let clearTick = setSafeInterval(() => {
                    if (convertStore.forceStopArbitrageExchange) {
                        if (clearTick) {
                            clearTick();
                        }
                        return;
                    }
                    let endTime = lowestExchangeStore.endPacketTime;
                    let delta = Math.abs((new Date().getTime()) - endTime);
                    let delta2 = Math.abs(new Date().getTime() - startPoint);

                    if ((endTime !== 0 && delta >= 3000) || (endTime === 0 && delta2 >= 30000)) {
                        if (clearTick) {
                            clearTick();
                        }
                        let isConvertSuccess = true;
                        if (endTime === 0 && delta2 >= 30000) {
                            convertStore.showConvertState('Order Execution is failed.');
                            isConvertSuccess = false;
                            let transaction = [selectedBase, selectedQuote, amount, price, c1BeforePosition, c2BeforePosition, 'Failed', c1BeforePosition, c2BeforePosition];
                            orderHistory(transaction);
                        } else if (endTime !== 0 && delta >= 3000) {
                            if (!is2TransactionMode) {
                                convertStore.showConvertState('Order Execution is successful.');
                            }
                            isConvertSuccess = true;
                            let transaction = [selectedBase, selectedQuote, amount, price, c1BeforePosition, c2BeforePosition, 'Success', c1BeforePosition - amount, Number(c2BeforePosition) + Number(amount * price)];
                            orderHistory(transaction);
                        }
                        convertStore.setConvertState(STATE_KEYS.orderDone);
                        yourAccountStore.requestPosition();
                        // lowestExchangeStore.resetExecPlan();
                        orderHistoryStore.requestOrderHistory();
                        lowestExchangeStore.stopExecPlan();
                        lowestExchangeStore.updateExchange(-1, '');
                        setExchange('Global');
                        if (this.doneTradingTick) {
                            this.doneTradingTick();
                        }
                        this.doneTradingTick = setSafeTimeout(() => {
                            if (convertStore.forceStopArbitrageExchange) return;
                            this.handleDoneBtnClick(isConvertSuccess);
                        }, 2000);
                    }
                }, 1000);
            } else {
                /**
                 *  Will not send order request to backend if they didn't log in
                 *  ( Show mock color advancing )
                 */
                lowestExchangeStore.startMockColorAdvance();
                setSafeTimeout(() => {
                    convertStore.setConvertState(STATE_KEYS.orderDone);
                    lowestExchangeStore.stopExecPlan();
                    this.handleDoneBtnClick();
                }, 8000);
            }
        }
    };

    handleClickOutside = (event) => {
        if (this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
            const { [STORE_KEYS.ORDERENTRY]: { CoinsPairSearchMarketOrderBuyForm: orderForm } } = this.props;
            this.setState({
                isAmtInputFocused: false,
            });

            if (this.amtInputRef.current) {
                this.amtInputRef.current.blur();
            }
            if (orderForm.sliderMax < orderForm.amount) {
                orderForm.setAmount(orderForm.sliderMax || 0);
                this.updateExecPlan();
            }
        }
    };

    handleAmtInputFocus = () => {
        this.setState({
            amount: '',
            isAmtInputFocused: true,
            isAmtChangedAfterFocus: false,
        });
    };

    handleAmtInputBlur = () => {
        this.setState({
            isAmtInputFocused: false,
        });
    };

    handleAmountChange = (event) => {
        const { [STORE_KEYS.ORDERENTRY]: { CoinsPairSearchMarketOrderBuyForm: orderForm } } = this.props;
        const value = event.target.value;

        let oldValue = String(this.state.amount);
        let newValue = valueNormalized(oldValue, value);

        orderForm.setAmount(newValue || 0);
        this.updateExecPlan();

        this.setState({
            amount: newValue,
            isAmtChangedAfterFocus: true,
        });
    };

    toggleSwap = () => {
        this.setState(prevState => ({
            isSwapped: prevState.isSwapped === null && this.props[STORE_KEYS.SETTINGSSTORE].accessLevel === 'Level 1'
                ? !prevState.isCoinPairInversed
                : !prevState.isSwapped,
        }));
    };

    toggleLeftList = () => {
        this.setState(prevState => ({
            isOpenLeftList: !prevState.isOpenLeftList,
        }));
    };

    toggleLeftListWith = () => {
        const {
            [STORE_KEYS.CONVERTSTORE]: convertStore,
            [STORE_KEYS.LOWESTEXCHANGESTORE]: lowestExchange,
            [STORE_KEYS.EXCHANGESSTORE]: { setExchange },
        } = this.props;
        if (convertStore.convertState !== STATE_KEYS.submitOrder && convertStore.convertState !== STATE_KEYS.orderDone) {
            convertStore.gotoFirstState();
            this.toggleLeftList();
            lowestExchange.updateExchange(-1, '');
            setExchange('Global');
            lowestExchange.resetDonutChartLoadingState();
        }
    };

    toggleRightList = () => {
        this.setState(prevState => ({
            isOpenRightList: !prevState.isOpenRightList,
        }));
    };

    toggleRightListWith = () => {
        const {
            [STORE_KEYS.CONVERTSTORE]: convertStore,
            [STORE_KEYS.LOWESTEXCHANGESTORE]: lowestExchange,
            [STORE_KEYS.EXCHANGESSTORE]: { setExchange },
        } = this.props;
        if (convertStore.convertState !== STATE_KEYS.submitOrder && convertStore.convertState !== STATE_KEYS.orderDone) {
            convertStore.setConvertState(STATE_KEYS.amtInput);
            this.toggleRightList();
            lowestExchange.updateExchange(-1, '');
            setExchange('Global');
            lowestExchange.resetDonutChartLoadingState();
        }
    };

    onCancelTrading = () => {
        const {
            [STORE_KEYS.YOURACCOUNTSTORE]: { setResetC1Mode },
            [STORE_KEYS.INSTRUMENTS]: { setExchFormState },
            [STORE_KEYS.EXCHANGESSTORE]: { setExchange },
            [STORE_KEYS.CONVERTSTORE]: { setForceStopArbitrageExchange, setConvertState },
            [STORE_KEYS.SETTINGSSTORE]: { setArbitrageModeWith, setIsDefaultCrypto },
            [STORE_KEYS.LOWESTEXCHANGESTORE]: {
                updateExchange,
                stopExecPlan,
                clearExecPlanInterval,
                resetDonutChartLoadingState,
            },
            [STORE_KEYS.VIEWMODESTORE]: {
                setViewMode,
                showDepthChartMode,
                setTradingViewMode,
            },
        } = this.props;

        // TODO: this must be refactored. 16 actions in a row :(
        if (this.doneTradingTick) this.doneTradingTick();
        setTradingViewMode(false);
        updateExchange(-1, '');
        setExchange('Global');
        setForceStopArbitrageExchange(true);
        setExchFormState(false);
        stopExecPlan();
        setViewMode(viewModeKeys.basicModeKey);
        clearExecPlanInterval();
        showDepthChartMode(true);
        setArbitrageModeWith(false);
        setResetC1Mode(true);
        setConvertState(STATE_KEYS.coinSearch);
        resetDonutChartLoadingState();
        setIsDefaultCrypto(false);
    };

    onSubmitOrderByTimer = () => {
        this.onSubmitOrder();
    };

    render() {
        const {
            isSwapped,
            isAmtInputFocused,
            isAmtChangedAfterFocus,
            amount: amountFromState,
            isOpenLeftList,
            isOpenRightList,
            inputAmount,
        } = this.state;

        const {
            [STORE_KEYS.INSTRUMENTS]: instrumentsStore,
            [STORE_KEYS.CONVERTSTORE]: convertStore,
            [STORE_KEYS.ORDERENTRY]: orderEntryStore,
            [STORE_KEYS.YOURACCOUNTSTORE]: yourAccountStore,
            [STORE_KEYS.LOWESTEXCHANGESTORE]: lowestExchangeStore,
            [STORE_KEYS.VIEWMODESTORE]: viewModeStore,
            [STORE_KEYS.SETTINGSSTORE]: settingsStore,
            [STORE_KEYS.TELEGRAMSTORE]: telegramStore,
            [STORE_KEYS.TRADINGVIEWSTORE]: tradingViewStore,
            [STORE_KEYS.MODALSTORE]: modalStore,
            [STORE_KEYS.ORDERBOOK]: orderBookStore,
            [STORE_KEYS.ORDERHISTORY]: orderHistoryStore,
            isSimple,
            isHidden,
            disabled,
            isAppStore,
            appStoreMode,
            isFromSettings,
            isRemote,
        } = this.props;

        const {
            screenWidth,
            isMobileDevice,
            gridHeight,
        } = getScreenInfo(true);

        if (isHidden && !isMobileDevice) {
            return null;
        }

        const { CoinsPairSearchMarketOrderBuyForm: orderForm } = orderEntryStore;
        const { sliderMax } = orderForm;
        const { selectedBase, selectedQuote } = instrumentsStore;
        const {
            totalPrice, isDonutChartLoading, isDelayed, isNoExchanges,
        } = lowestExchangeStore;
        const { showConvertState } = convertStore;
        const {
            setViewMode, showDepthChartMode, setTradingViewMode, setUserDropDownOpen,
        } = viewModeStore;
        const { isLoggedIn, setLoginBtnLocation } = telegramStore;
        const { setDownTimerCount, setMaxDownTimerCount } = orderHistoryStore;

        const {
            isShortSell,
            isArbitrageMode,
            setShortSell,
            setArbitrageMode,
            defaultFiat,
            getLocalPrice,
            defaultFiatSymbol,
            isAutoConvert,
            swap,
            slider,
            timer,
            timerAfter,
            accessLevel,
        } = settingsStore;

        const showSlider = accessLevel !== 'Level 1' && timerAfter === 'After 1 transaction';

        const {
            setCoinListOpen,
        } = tradingViewStore;

        const {
            open: modalOpened,
        } = modalStore;

        const { isFetchingBestRates } = orderBookStore;
        const isCoinPairInversed = this.state.isSwapped || false;

        const isSwapMode = swap === 'Swap';

        let baseList = [...instrumentsStore.Bases];
        let quoteList = [...instrumentsStore.Quotes];
        let coinsInMyWallet = [];
        let isStep1ExchangeBtnDisabled = isAutoConvert === autoConvertOptions.Off;
        let baseCoinUSDPrice = 0;
        let quoteCoinUSDPrice = 0;
        let baseCoinPosition = 0;

        // ----------------------------------
        /**
         *  Remove BCT from C1, C2
         */
        const bctIndexOfBase = baseList.findIndex(x => (x && x.symbol && x.symbol === 'BCT'));
        const bctIndexOfQuote = quoteList.findIndex(x => (x && x.symbol && x.symbol === 'BCT'));
        baseList.splice(bctIndexOfBase, 1);
        quoteList.splice(bctIndexOfQuote, 1);

        // ----------------------------------
        // Get coins in my wallet as MAP array
        // This builds top group of dropdown, removing items in top group from bottom group.
        for (let i = 0; i < yourAccountStore.portfolioData.length; i++) {
            if (yourAccountStore.portfolioData[i] && (Number.parseFloat(yourAccountStore.portfolioData[i].Position) > 0.0001)) { // low limit is 0.0001
                // coin is in wallet, if baseList has it, remove from base list and add here, if not, just add new disabled one to list.
                const symbol = yourAccountStore.portfolioData[i].Coin;

                // Disabled TopGroupItems, 2019-01-11
                let index = baseList.findIndex(x => x.symbol === symbol);
                if (index !== -1) {
                    coinsInMyWallet.push(
                        {
                            ...baseList[index],
                            position: yourAccountStore.portfolioData[i].Position,
                        }
                    );
                    baseList.splice(index, 1);
                }

                if (symbol === instrumentsStore.selectedBase /* && instrumentsStore.selectedBaseEnabled && instrumentsStore.selectedQuoteEnabled */) {
                    isStep1ExchangeBtnDisabled = false;
                }
            }
            if (yourAccountStore.portfolioData[i] && (yourAccountStore.portfolioData[i].Coin === instrumentsStore.selectedBase)) {
                baseCoinUSDPrice = yourAccountStore.portfolioData[i].Price;
                baseCoinPosition = yourAccountStore.portfolioData[i].Position;
            }
            if (yourAccountStore.portfolioData[i] && (yourAccountStore.portfolioData[i].Coin === instrumentsStore.selectedQuote)) {
                quoteCoinUSDPrice = yourAccountStore.portfolioData[i].Price;
            }
        }

        return (
            <StyleWrapper
                ref={this.wrapperRef}
                modalOpened={modalOpened}
                gridHeight={gridHeight}
                isCoinPairInversed={isCoinPairInversed}
                isSimple={isSimple}
                isHidden={isHidden}
                isFromSettings={isFromSettings}
                isRemote={isRemote}
            >
                {!isAppStore && !isFromSettings &&
                    <div
                        className={'coin-pair-form-inner-wrapper' + (convertStore.convertState !== STATE_KEYS.coinSearch ? ' open' : '')}
                    >
                        {/* ----------Step 1----------*/}
                        <div className="exch-head">
                            <div className="exch-head__coin-pair">
                                <div className="exch-head__send">
                                    <ExchDropdown
                                        value={instrumentsStore.selectedBase}
                                        onChange={(val) => {
                                            instrumentsStore.setBase(val);
                                            setViewMode(viewModeKeys.basicModeKey);
                                            setTradingViewMode(false);
                                        }}
                                        onClick={() => {
                                            yourAccountStore.resetWalletTableState();
                                        }}
                                        setSelectedCoin={yourAccountStore.setSelectedCoin}
                                        openDepositView={viewModeStore.openDepositView}
                                        mainItems={baseList}
                                        topGroupEnabled
                                        topGroupLabel="Your Coins"
                                        topGroupItems={coinsInMyWallet}
                                        isArbitrageMode={isArbitrageMode}
                                        isShortSell={isShortSell}
                                        selectedBase={selectedBase}
                                        selectedQuote={selectedQuote}
                                        isLeft={true}
                                        isCoinPairInversed={isCoinPairInversed}
                                        isSwapped={this.state.isSwapped}
                                        setCoinListOpen={setCoinListOpen}
                                        isOpen={isOpenLeftList}
                                        toggleDroplist={this.toggleLeftList}
                                        defaultFiat={defaultFiat}
                                        isLoggedIn={isLoggedIn}
                                        setLoginBtnLocation={setLoginBtnLocation}
                                        isMobile={isMobileDevice || screenWidth < 1024}
                                        notifyMsg={showConvertState}
                                        addon={
                                            <Addon>
                                                <AddonLabel>Store Credit</AddonLabel>
                                                <SwitchCustom checked={isShortSell} onChange={setShortSell} />
                                            </Addon>
                                        }
                                        accessLevel={accessLevel}
                                        amount={inputAmount}
                                        onChangeAmount={this.handleChangeAmount}
                                    />
                                </div>
                                <CoinSwapToggle
                                    isShortSell={isShortSell}
                                    isSwapMode={accessLevel && accessLevel !== 'Level 1'}
                                    isSwapped={isSwapped}
                                    toggleSwap={this.toggleSwap}
                                />
                                <div className="exch-head__get">
                                    <ExchDropdown
                                        value={instrumentsStore.selectedQuote}
                                        onChange={(val) => {
                                            instrumentsStore.setQuote(val);
                                            instrumentsStore.addRecentQuote(val);
                                            setViewMode(viewModeKeys.basicModeKey);
                                            setTradingViewMode(false);
                                        }}
                                        setSelectedCoin={yourAccountStore.setSelectedCoin}
                                        openDepositView={viewModeStore.openDepositView}
                                        mainItems={baseList}
                                        topGroupEnabled={true}
                                        topGroupLabel="Recent"
                                        topGroupItems={coinsInMyWallet}
                                        isArbitrageMode={isArbitrageMode}
                                        isShortSell={isShortSell}
                                        selectedBase={selectedBase}
                                        selectedQuote={selectedQuote}
                                        isLeft={false}
                                        isSwapped={this.state.isSwapped}
                                        isCoinPairInversed={isCoinPairInversed}
                                        setCoinListOpen={setCoinListOpen}
                                        isOpen={isOpenRightList}
                                        toggleDroplist={this.toggleRightList}
                                        defaultFiat={defaultFiat}
                                        isLoggedIn={isLoggedIn}
                                        setLoginBtnLocation={setLoginBtnLocation}
                                        isMobile={isMobileDevice || screenWidth < 1200}
                                        notifyMsg={showConvertState}
                                        addon={
                                            <Addon>
                                                <AddonLabel>Arbitrage</AddonLabel>
                                                <SwitchCustom checked={isArbitrageMode} onChange={setArbitrageMode} />
                                            </Addon>
                                        }
                                        accessLevel={accessLevel}
                                        amount={inputAmount}
                                        onChangeAmount={this.handleChangeAmount}
                                    />
                                </div>
                            </div>
                            {isSimple &&
                            <Tooltip
                                arrow={true}
                                animation="shift"
                                position="bottom"
                                theme="bct"
                                title={isLoggedIn ? '' : 'Please Login'}
                                disabled={isLoggedIn}
                            >
                                <OrderGradientButton
                                    className={'exch-head__btnv2 primary-solid search-btn' + (isDonutChartLoading === donutChartModeStateKeys.loadingModeKey ? ' progress' : '')}
                                    disabled={isStep1ExchangeBtnDisabled || isDonutChartLoading !== donutChartModeStateKeys.defaultModeKey || isNoExchanges || isFetchingBestRates || disabled}
                                    onClick={this.onStep1ExchangeBtnClicked}
                                    height={50}
                                    isSimple={isSimple}
                                    header={true}
                                >
                                    {(isDonutChartLoading === donutChartModeStateKeys.defaultModeKey && !isFetchingBestRates)
                                        ? (
                                            isStep1ExchangeBtnDisabled && baseCoinPosition < 0.0001
                                                ? (
                                                    <WalletButtonCentered>
                                                        0 <span className="unit">{selectedBase}</span>
                                                    </WalletButtonCentered>
                                                )
                                                : (
                                                    <div className="exch-head__btnv2__content">
                                                        <SearchIcon/>
                                                    </div>
                                                )
                                        ) : (
                                            <React.Fragment>
                                                <SearchIcon/>
                                                <DataLoader width={50} height={50} />
                                            </React.Fragment>
                                        )
                                    }
                                </OrderGradientButton>
                            </Tooltip>
                            }
                        </div>
                        {/* ----------End Step 1----------*/}

                        {/* ----------Step 2----------*/}
                        <div
                            className={
                                'exch-form' + ((convertStore.convertState === STATE_KEYS.submitOrder ? ' progress' : '') +
                                    (convertStore.convertState === STATE_KEYS.orderDone ? ' completed' : '') +
                                    (convertStore.convertState === STATE_KEYS.amtInput ? ' amountInput' : ''))
                            }
                        >
                            <div className="exch-form__coin-pair">
                                <div className="exch-form__send">
                                    <CoinWrapper>
                                        <CoinIconStep2 value={instrumentsStore.selectedBase} defaultFiat={defaultFiat} onClick={this.toggleLeftListWith} />
                                        <CoinNameStep2 value={(instrumentsStore.selectedBase || '').replace('F:', '')} defaultFiat={defaultFiat} onClick={this.toggleLeftListWith} />
                                    </CoinWrapper>
                                    <div>
                                        <WalletGroupButton
                                            inProgress={false}
                                            isLeft
                                            isBuy={!isCoinPairInversed}
                                            progress={false}
                                            isWhite={false}
                                            position={false}
                                        >
                                            <WalletSideIcon isRight={isCoinPairInversed}/>
                                            <span>
                                                {isAmtInputFocused ? (isAmtChangedAfterFocus ? amountFromState : '') : customDigitFormat(orderForm.amount, 7)}
                                            </span>
                                            <span className="infoIcon">
                                                {isCoinPairInversed ? <span>{defaultFiatSymbol}</span> : <BTCFontIcon />}
                                            </span>
                                        </WalletGroupButton>
                                        <input
                                            className="exch-form__input"
                                            type="text"
                                            value={isAmtInputFocused ? (isAmtChangedAfterFocus ? amountFromState : '') : customDigitFormat(orderForm.amount, 9)}
                                            ref={this.amtInputRef}
                                            readOnly={convertStore.convertState === STATE_KEYS.submitOrder || convertStore.convertState === STATE_KEYS.orderDone}
                                            onFocus={this.handleAmtInputFocus}
                                            onBlur={this.handleAmtInputBlur}
                                            onChange={this.handleAmountChange}
                                        />
                                    </div>
                                    {!isAmtInputFocused && showSlider && (
                                        <SliderInput
                                            readOnly={convertStore.convertState !== STATE_KEYS.amtInput}
                                            isDisabledColors={convertStore.convertState !== STATE_KEYS.amtInput}
                                            max={sliderMax}
                                            currentValue={baseCoinUSDPrice * orderForm.amount}
                                            value={orderForm.amount}
                                            onChange={(value) => partial(withValueFromEvent, orderForm.setAmount)({ target: { value } })}
                                            lowestExchangeStore={lowestExchangeStore}
                                            defaultFiatSymbol={defaultFiatSymbol}
                                            getLocalPrice={getLocalPrice}
                                        />
                                    )}
                                </div>

                                <CoinSwap isShortSell={isShortSell} isSwapMode={isSwapMode} isCoinPairInversed={isCoinPairInversed} />

                                <div className="exch-form__get">
                                    <div>
                                        <WalletGroupButton
                                            isShouldOneAnim
                                            inProgress={true}
                                            isLeft={isCoinPairInversed}
                                            isBuy={!isCoinPairInversed}
                                            progress={(convertStore.convertState === STATE_KEYS.submitOrder) || (convertStore.convertState === STATE_KEYS.orderDone)}
                                            isWhite={false}
                                            position={false}
                                        >
                                            <WalletSideIcon isRight={!isCoinPairInversed}/>
                                            <span>
                                                {!isDelayed ? customDigitFormat(getLocalPrice(totalPrice, instrumentsStore.selectedQuote), 7) : ''}
                                            </span>
                                            <span className="infoIcon">
                                                {!isCoinPairInversed ? <span>{defaultFiatSymbol}</span> : <BTCFontIcon />}
                                            </span>
                                        </WalletGroupButton>
                                        <input
                                            className="exch-form__input right"
                                            type="text"
                                            placeholder={!isDelayed ? orderForm.estimatedAmountReceived.toString() : ''}
                                            readOnly
                                            value={!isDelayed ? customDigitFormat(getLocalPrice(totalPrice, instrumentsStore.selectedQuote), 9) : ''}
                                            onClick={this.toggleRightListWith}
                                        />
                                    </div>
                                    <CoinWrapper>
                                        <CoinNameStep2 value={(instrumentsStore.selectedQuote || '').replace('F:', '')} defaultFiat={defaultFiat} onClick={this.toggleRightListWith} />
                                        <CoinIconStep2 value={instrumentsStore.selectedQuote} defaultFiat={defaultFiat} onClick={this.toggleRightListWith} />
                                    </CoinWrapper>

                                    {!isDelayed && !isAmtInputFocused && showSlider && (
                                        <SliderInput
                                            readOnly={convertStore.convertState !== STATE_KEYS.amtInput}
                                            isDisabledColors="true"
                                            max={sliderMax}
                                            currentValue={slider === 'Best Execution' ? (quoteCoinUSDPrice * totalPrice) : (quoteCoinUSDPrice * totalPrice * 37.7834)} // * 0.9975 New way is to calculate the real value of C2. Then multiply by 0.9975
                                            value={orderForm.amount}
                                            lowestExchangeStore={lowestExchangeStore}
                                            onChange={(value) => partial(withValueFromEvent, orderForm.setAmount)({ target: { value } })}
                                            defaultFiatSymbol={defaultFiatSymbol}
                                            getLocalPrice={getLocalPrice}
                                        />
                                    )}
                                    {isDelayed && (
                                        <LoaderWrapper isCoinPairInversed={isCoinPairInversed}>
                                            <DataLoader width={40} height={40} />
                                        </LoaderWrapper>
                                    )}
                                </div>
                            </div>

                            <div className="exch-form__btns">
                                {(convertStore.convertState === STATE_KEYS.amtInput) && (
                                    <GradientButtonTimer
                                        onCancelOrder={this.onCancelTrading}
                                        onSubmitOrder={this.onSubmitOrderByTimer}
                                        isArbitrageMode={isArbitrageMode}
                                        disabled={!orderForm.validAmountEntered || baseCoinUSDPrice * orderForm.amount < MIN_USD_AMOUNT}
                                        maxTimer={!isCoinPairInversed ? timer : 4}
                                        setDownTimerCount={setDownTimerCount}
                                        setMaxDownTimerCount={setMaxDownTimerCount}
                                        isSimple={isSimple}
                                        setUserDropDownOpen={setUserDropDownOpen}
                                    />
                                )}
                                {(convertStore.convertState === STATE_KEYS.submitOrder || convertStore.convertState === STATE_KEYS.orderDone) && (
                                    <ButtonLoader
                                        onCancelOrder={this.onCancelTrading}
                                        isSimple={isSimple}
                                    />
                                )}
                            </div>
                        </div>
                        {/* ----------End Step 2----------*/}
                    </div>
                }
                {isAppStore &&
                    <React.Fragment>
                        <ArbButton
                            appStoreMode={appStoreMode}
                            onClick={this.onStep1ExchangeBtnClicked}
                        />
                        {!(isDonutChartLoading === donutChartModeStateKeys.defaultModeKey && !isFetchingBestRates) && (
                            <DataLoader width={50} height={50} />
                        )}
                    </React.Fragment>
                }
                {isFromSettings &&
                    <div className='appstore-btn-wrapper' onClick={this.onStep1ExchangeBtnClicked}>
                        {this.props.children}
                        {!(isDonutChartLoading === donutChartModeStateKeys.defaultModeKey && !isFetchingBestRates) && (
                            <DataLoader width={50} height={50} />
                        )}
                    </div>
                }
            </StyleWrapper>
        );
    }
}

const enhanced = compose(
    withSafeTimeout,
    withSafeInterval,
    inject(
        STORE_KEYS.INSTRUMENTS,
        STORE_KEYS.CONVERTSTORE,
        STORE_KEYS.ORDERENTRY,
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.LOWESTEXCHANGESTORE,
        STORE_KEYS.EXCHANGESSTORE,
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.ORDERHISTORY,
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.TELEGRAMSTORE,
        STORE_KEYS.TRADINGVIEWSTORE,
        STORE_KEYS.MODALSTORE,
        STORE_KEYS.ORDERBOOK,
        STORE_KEYS.MARKETMAKER,
    ),
    observer,
);

export default enhanced(CoinPairSearchV2);
