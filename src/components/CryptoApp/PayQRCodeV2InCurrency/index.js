import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import QRCode from 'qrcode-react';
import { withSafeTimeout } from '@hocs/safe-timers';

import { STORE_KEYS } from '../../../stores';

import {
    Main,
    SMLoadingSpinner,
    PortalWrapper,
    PortalInnerWrapper,
    WithdrawInfo,
    ImgBills,
    CircleText,
    CertificateContainer,
    InputCircle,
    PayText,
    CountrySearch,
    CountrySelect,
    CountrySelectItem,
    QRCodeWrapper,
    Promotion,
} from './Components';

import coinImg from './img/coin.png';
import withdrawPreviewImg from './img/withdraw_preview.png';
import certificateImg from './img/USDT_Certificate.png';
import loginIcon from '../asset/img/login.png';
import balanceIcon from '../asset/img/balance.png';
import balanceErrorIcon from '../asset/img/balance_error.png';
import verifyIcon from '../asset/img/verify.png';
import payIcon from '../asset/img/pay.png';
import payErrorIcon from '../asset/img/pay_error.png';

const DEFAULT_PAY_AMOUNT = 0;

const PAY_QR_VIEW_STEPS = {
    VIEW_QR: 'view-qr',
    ENTER_PAY_AMOUNT: 'enter-pay-amount',
    VIEW_QR_AGAIN: 'view-qr-again',
    VERIFY_SUCCESS: 'verify-success',
};

class PayQRCodeViewV2 extends React.Component {
    _zoomTimer = null;
    _pressTimer = null;
    _blinkingTimer = null;
    _repeatPayTimer = null;
    _promotionStartTimeout = null;
    _promotionEndTimeout = null;

    state = {
        error: '',
        currentView: PAY_QR_VIEW_STEPS.VIEW_QR,
        payAmount: this.props.amount,
        usdAmount: this.props.amount,
        isPayAmountShowing: false,
        isCurrencyShowing: false,
        isSpinnerShowing: false,
        isPromotionShowing: false,
        isQRShowing: true,
        isSendingPayAmount: false,
        isPayAmountSent: false,
        isChanged: false,
        isFirstOpen: true,
        loading: false,
        loaded: false,
        showPhoneArrow: false,
        phoneSubmitStatus: 'none',
        phoneNumber: '',
        codeInputAnimation: 'initial',
        unloadPhoneInput: false,
        unloadCodeInput: false,        
        qrCodeValue: this.props.uniqueId || ('https://' + window.location.hostname),
        firstLoad: true,
        keyboardStatus: 0,         // 0: Form closed, 1: Keyboard closed, 2: Keyboard Showing
        isZoom: false,
        isZoomIn: false,
        currencySymbol: '$',
        currencyCode: 'USD',
        currencyPrice: 1,
        searchCurrency: '',
    };

    componentDidMount() {
        this.setState({
            isSendingPayAmount: false,
            isPayAmountSent: false,
            loading: false,
            loaded: false,
            showPhoneArrow: false,
            phoneSubmitStatus: 'none',
            phoneNumber: '',
            codeInputAnimation: 'initial',
            unloadPhoneInput: false,
            unloadCodeInput: false,
            payAmount: Math.ceil(this.props.amount * this.state.currencyPrice),
            usdAmount: this.props.amount,
        });
        // setTimeout(() => this.setState({ isPromotionShowing: true }), 10000);
    }

    componentWillReceiveProps(nextProps) {
        const { fiatPrice } = nextProps;
        const { firstLoad, payAmount, currencyPrice } = this.state;
        const {
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn,
            },
            getUniqueId,
        } = this.props;
        if (nextProps.isPayFormShowing) {
            this.setState({
                firstLoad: false,
                loading: true,
                loaded: true,
                showPhoneArrow: false,
                phoneSubmitStatus: 'clicked',
            });
            this.props.changePayFormShowing(false);
        }
        if (
            this.props.uniqueId !== nextProps.uniqueId
            && nextProps.uniqueId !== null
            && nextProps.uniqueId !== undefined
            && nextProps.uniqueId !== ''
            && (nextProps.isCoinTransfer || (getUniqueId() && nextProps.scannedAmount >= 1))
        ) {
            this.setState({
                qrCodeValue: 'https://' + window.location.hostname + '/cointransfer/' + nextProps.uniqueId,
                isChanged: true,
                firstLoad: false,
                payAmount: Math.ceil(Number(nextProps.scannedAmount) * currencyPrice),
                usdAmount: Number(nextProps.scannedAmount),
            });
            
            if(!nextProps.isCoinTransfer) {
                this.getTransferNotification(nextProps.uniqueId);
                this.startChangingQR();
            }
            return;
        }
        if (this.props.repayAmount !== nextProps.repayAmount && nextProps.repayAmount && Math.round(nextProps.repayAmount) > 0) {
            setTimeout(() => this.payMoney(nextProps.repayAmount), 1000);
        }
        if (fiatPrice !== DEFAULT_PAY_AMOUNT && firstLoad) {
            this.setState({
                payAmount: Math.ceil(fiatPrice * currencyPrice),
                usdAmount: fiatPrice,
                isChanged: true,
                firstLoad: false,
            });
            setTimeout(() => {
                let res = this.updateQRCode(fiatPrice);
                if (res === true) {
                    this.setState({ firstLoad: false });
                    this.props.onBack(false);
                } else if (res === -1) {
                    this.setState({
                        firstLoad: false,
                        loading: true,
                        loaded: true,
                        showPhoneArrow: false,
                        phoneSubmitStatus: 'clicked',
                        keyboardStatus: 2,
                    });
                    if(this.inputRef) this.inputRef.focus();
                    setTimeout(() => {
                        this.props.setPrevAmount(0);
                        this.setState({ error: 'error' });
                    }, 2000);
                    setTimeout(() => {
                        this.setState({
                            error: '',
                            payAmount: Math.ceil(this.props.balance * currencyPrice),
                            usdAmount: this.props.balance,
                        });
                        this.props.onGetAmount(this.props.balance);
                    }, 5000);
                } else {
                    this.setState({ firstLoad: true });
                }
            }, 500);
        } else if(isLoggedIn && !firstLoad && nextProps.uniqueId === '' && nextProps.amount === 0 && nextProps.prevAmount === 0 && nextProps.scannedAmount === 0) {
            this.setState({
                payAmount: Math.ceil(DEFAULT_PAY_AMOUNT * currencyPrice),
                usdAmount: DEFAULT_PAY_AMOUNT,
                qrCodeValue: 'https://' + window.location.hostname,
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { loading, phoneSubmitStatus, keyboardStatus, isCurrencyShowing } = this.state;
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            if(keyboardStatus === 0 || keyboardStatus === 1) {
                if(this.inputRef) this.inputRef.blur();
            } else if(keyboardStatus === 2) {
                if(this.inputRef) this.inputRef.focus();
            }
        }
    }

    componentWillUnmount() {
        this.setState({ keyboardStatus: 0 });
        this.inputRef.blur();
        if (this._blinkingTimer) clearInterval(this._blinkingTimer);
    }

    onInputChange(e) {
        if (this.state.phoneSubmitStatus === 'warning') {
            this.setState({
                loaded: true,
                phoneSubmitStatus: 'clicked',
                keyboardStatus: 2,
            });
            if(this.inputRef) this.inputRef.focus();
        } else if (this.state.loaded) {
            this.setState({
                phoneSubmitStatus: 'clicked',
                keyboardStatus: 2,
            });
            if(this.inputRef) this.inputRef.focus();
        }
        if(e.key === 'Backspace' || e.key === 'Delete') {
            this.setState({ isFirstOpen: false });
        }
    }

    onPromotion = e => {
        e.stopPropagation();
        this.setState({ isPromotionShowing: false });
    }

    onQRCode = (e, type = null) => {
        const {
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn,
            },
            isNewUser,
            isEmpty,
        } = this.props;
        this.onBoxClick(e);
        this.props.zoomQRCode();
        this.setState({
            isZoom: false,
            isZoomIn: false,
            isCurrencyShowing: false,
        });

        if ((isNewUser === true && isEmpty === true) || !isLoggedIn) {
            if (this._promotionStartTimeout) clearTimeout(this._promotionStartTimeout);
            this._promotionStartTimeout = setTimeout(() => this.setState({ isPromotionShowing: true }), 3000);

            if (this._promotionEndTimeout) clearTimeout(this._promotionEndTimeout);
            this._promotionEndTimeout = setTimeout(() => this.setState({ isPromotionShowing: false }), 9000);
        }

        if(this._zoomTimer) clearTimeout(this._zoomTimer);
        // if(this.props.isPublicKeyShowing) {
        //     return;
        // }
        if(this.state.unloadPhoneInput) {
            return;
        }
        this.props.onQRImageClick(!this.state.loaded);
        if (this.state.loaded) {
            this.cancelPromotionTimer();
            this.setState({ isPromotionShowing: false });
            this.onSend(type);
            return;
        }
        this.setState({
            loading: true,
            loaded: true,
            showPhoneArrow: false,
            phoneSubmitStatus: 'clicked',
            keyboardStatus: 2,
            payAmount: 0,
            usdAmount: 0,
            isFirstOpen: true,
        });
        setTimeout(() => {
            if (this.inputRef) {
                this.setState({ keyboardStatus: 2 });
                this.inputRef.focus();
                this.inputRef.setSelectionRange(this.getPayAmountText().length + 1, this.getPayAmountText().length + 1);
            }
        }, 500);
    }

    onBack = (e) => {
        const {
            loading,
            keyboardStatus,
            phoneSubmitStatus,
            isCurrencyShowing
        } = this.state;
        this.cancelPromotionTimer();
        if(e) e.stopPropagation();
        if (!loading || phoneSubmitStatus === 'submitting' || phoneSubmitStatus === 'submitted') return;
        if (isCurrencyShowing) {
            this.setState({
                isCurrencyShowing: false,
                keyboardStatus: 2,
                isPromotionShowing: false,
            });
            if(this.inputRef) this.inputRef.focus();
            return;
        }
        if (keyboardStatus === 2) {
            this.setState({ keyboardStatus: 1, isPromotionShowing: false });
            if(this.inputRef) this.inputRef.blur();
            return;
        }
        this.hidePhoneInput();
        this.props.onBack(false);
        this.setState({
            isSpinnerShowing: false,
            isPromotionShowing: false,
            phoneSubmitStatus: 'none',
            keyboardStatus: 0,
        });
        if(this.inputRef) this.inputRef.blur();

        const usdAmount = (phoneSubmitStatus === 'warning' ? 0 : this.props.prevAmount);
        const amount = Math.ceil(usdAmount * this.state.currencyPrice);
        setTimeout(() => {
            this.setState({
                payAmount: amount,
                usdAmount: usdAmount,
            });
        }, 2000);
        this.props.onGetAmount(usdAmount);
    }

    onSend = async (type = null) => {
        const {
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn,
            },
            PortfolioUSDTValue,
        } = this.props;

        const amount = (this.state.isFirstOpen ? Math.floor(1 / this.state.currencyPrice) : Math.round(this.state.usdAmount));
        if(amount < 1) {
            this.setState({ keyboardStatus: 1 });
            setTimeout(() => this.onBack(), 200);
            return;
        }

        if (!isLoggedIn) {
            this.props.onBack(type !== null, amount);
            return;
        }
        if (this.state.loaded) {
            this.setState({
                phoneSubmitStatus: 'submitting',
                unloadPhoneInput: false,
                showPhoneArrow: false,
                isSpinnerShowing: true,
                keyboardStatus: 1,
                isCurrencyShowing: false,
            });
            if(this.inputRef) this.inputRef.blur();

            setTimeout(() => {
                let res = true;

                if(isLoggedIn) {
                    res = this.updateQRCode();
                }

                if (res !== true) {
                    // In case, of amount > portfolio total value
                    this.setState({
                        isSpinnerShowing: false,
                        unloadPhoneInput: false,
                        loading: true,
                        loaded: false,
                        showPhoneArrow: false,
                        phoneSubmitStatus: 'warning',
                        error: 'error',
                    });
                    const usdAmount = Number(Math.floor(PortfolioUSDTValue));
                    const amount = Math.ceil(usdAmount * this.state.currencyPrice);
                    setTimeout(() => {
                        this.setState({
                            payAmount: amount,
                            usdAmount: usdAmount,
                            isChanged: true,
                            isPayAmountSent: false,
                            showPhoneArrow: true,
                            error: '',
                        });
                    }, 1000);
                    this.props.onGetAmount(usdAmount);
                } else {
                    this.setState({
                        isSpinnerShowing: false,
                        phoneSubmitStatus: 'submitted',
                        codeSubmitStatus: 'submitted',
                        codeInputAnimation: 'done',
                        unloadPhoneInput: false,
                        loaded: false,
                        keyboardStatus: 0,
                    });
                    if(this.inputRef) this.inputRef.blur();

                    setTimeout(() => {
                        this.props.onQRImageClick(false);
                        this.hidePhoneInput();
                        this.setState({ codeInputAnimation: 'final', unloadCodeInput: true });
                    }, 500);
                }
            }, 2400);
        }
    }

    onClickCurrency = (e, currency) => {
        if(e) e.stopPropagation();
        this.setState({
            currencySymbol: currency.symbol,
            currencyCode: currency.currencyCode,
            currencyPrice: currency.price,
            payAmount: (this.state.isFirstOpen ? Math.ceil(currency.price) : Math.ceil(this.state.usdAmount * currency.price)),
            usdAmount: (this.state.isFirstOpen ? 1 : this.state.usdAmount),
            isFirstOpen: false,
        });
        this.onBack(e);
    }

    cancelPromotionTimer() {
        if(this._promotionEndTimeout) clearTimeout(this._promotionEndTimeout);
        if(this._promotionStartTimeout) clearTimeout(this._promotionStartTimeout);
    }

    getPayAmountText() {
        let amount = Math.round(this.state.payAmount);
        if(amount === 0) amount = 1;
        return amount.toLocaleString();
    }

    getLocalNumber() {
        const { balance } = this.props;
        if(Number(balance) < 1000) {
            return Number(balance).toLocaleString();
        }
        return '1K+';
    }

    getBillStyle() {
        const { isZoom } = this.state;
        let suffix = isZoom ? ' zoom' : '';
        let amount = Math.round(this.state.usdAmount);
        if(amount < 10) return 'usd_1' + suffix;
        if(amount < 100) return 'usd_10' + suffix;
        if(amount < 1000) return 'usd_100' + suffix;
        if(amount < 10000) return 'usd_1000' + suffix;
        return 'usd_10000' + suffix;
    }

    getZoomInBillStyle() {
        let suffix = ' zoomIn';
        let amount = Math.round(this.state.usdAmount);
        if(amount < 10) return 'usd_1' + suffix;
        if(amount < 100) return 'usd_10' + suffix;
        if(amount < 1000) return 'usd_100' + suffix;
        if(amount < 10000) return 'usd_1000' + suffix;
        return 'usd_10000' + suffix;
    }

    handleClickQR = e => {
        e.stopPropagation();

        this.setState({
            isPayAmountSent: false,
            isSendingPayAmount: false,
            currentView: PAY_QR_VIEW_STEPS.ENTER_PAY_AMOUNT,
        });
    };

    onBoxClick = e => {
        e.stopPropagation();
    }

    onHistory = e => {
        e.stopPropagation();
        this.setState({ keyboardStatus: 1 });
        this.inputRef.blur();
        this.props.onHistory();
    }

    handlePayAmount = e => {
        e.stopPropagation();

        this.setState({
            isPayAmountSent: false,
            isSendingPayAmount: true,
        });

        setTimeout(() => {
            this.setState({
                isPayAmountSent: true,
                isSendingPayAmount: false,
                currentView: PAY_QR_VIEW_STEPS.VIEW_QR_AGAIN,
            });
        }, 1000);
    };

    handleChangePayAmount = e => {
        e.stopPropagation();
        let value = e.target.value.split(',').join('');

        // if (value.length > 8) return;

        e.target.focus();
        this.setState({
            keyboardStatus: 2,
            isFirstOpen: false,
        });

        if(Number.isNaN(Number(value))) {
            this.setState({
                payAmount: Number(value),
                error: 'error',
            });

            setTimeout(() => {
                this.setState({
                    isChanged: true,
                    payAmount: 0,
                    usdAmount: 0,
                    isPayAmountSent: false,
                    showPhoneArrow: true,
                    error: '',
                });
            }, 500);
        } else {
            const usdAmount = Math.floor(Number(value) / this.state.currencyPrice);
            this.setState({
                isChanged: true,
                payAmount: Number(value),
                usdAmount: usdAmount,
                isPayAmountSent: false,
                showPhoneArrow: true,
            });

            this.props.onGetAmount(usdAmount);
        }
    };

    handleClickTick = (e) => {
        this.setState({
            loading: true,
            loaded: false,
            unloadPhoneInput: true,
            showTickMark: false,
            isSpinnerShowing: false,
        });

        setTimeout(() => {
            this.setState({
                loaded: true,
                loading: false,
            });
        }, 500);
    }

    handleFormClick = (e) => {
        if(e) e.stopPropagation();
        if(this.state.isCurrencyShowing) {
            this.onBack(e);
        } else if(this.state.keyboardStatus === 2) {
            this.setState({ isCurrencyShowing: true, keyboardStatus: 1 });
            if (this.inputRef) this.inputRef.blur();
        } else if(this.state.keyboardStatus === 1) {
            this.setState({ keyboardStatus: 2 });
            if (this.inputRef) this.inputRef.focus();
        }
    }

    handleInputClick = (e) => {
        if(this.state.isCurrencyShowing) {
            this.onBack(e);
        }
        this.setState({ keyboardStatus: 2 });
        if (this.inputRef) this.inputRef.focus();
    }

    handleChangeSearchCurrency = (e) => {
        this.setState({ searchCurrency: e.target.value });
    }

    getCircleText = () => {
        let { payAmount } = this.state;
        let pattern = 'PAY ' + this.state.currencySymbol + this.getPayAmountText() + ' · ';
        let repeatAmount = 7;
        payAmount = Number(payAmount);
        if (payAmount >= 10 && payAmount < 100) {
            repeatAmount = 6;
        } else if (payAmount >= 100 && payAmount < 1000) {
            repeatAmount = 5;
        } else if (payAmount >= 1000 && payAmount < 10000) {
            repeatAmount = 4;
        } else if (payAmount >= 10000 && payAmount < 100000) {
            repeatAmount = 3;
        } else if (payAmount >= 100000) {
            repeatAmount = 3;
        }
        return pattern.repeat(repeatAmount);
    }

    getTransferNotification = (uniqueId) => {
        const {
            transferNotification,
            setFadeStatus,
        } = this.props;

        transferNotification().then(res => {
            if(res && res.Transfer.TrId === uniqueId) {
                if(res.Type === 'informing' && res.Transfer.Status !== 'pending') {
                    return;
                }
                setFadeStatus(res.Type);
                if(res.Type === 'informing') {
                    this.getTransferNotification(uniqueId);
                }
            }
        }).catch(err => {
            console.log(err);
        });
    }

    payMoney = (amount, fiatPrice = 1, redirect = true, isRepeat = true) => {
        const {
            defaultFiat,
            getDefaultPrice,
            getUSDPrice,
            PortfolioData,
            PortfolioUSDTValue,
            initTransferRequest,
            requestPosition,
            setPayAmount,
            setUniqueId,
            getUniqueId,
            removeUniqueId,
            setPayRepeatCount,
            getPayRepeatCount,
            resetToHomePage,
        } = this.props;

        if(isRepeat && getUniqueId()) {
            const repeatCount = getPayRepeatCount();
            if(repeatCount >= 10) {
                if(this._repeatPayTimer) clearTimeout(this._repeatPayTimer);
                if(!this.state.loaded) {
                    this.setState({
                        payAmount: Math.ceil(DEFAULT_PAY_AMOUNT * this.state.currencyPrice),
                        usdAmount: DEFAULT_PAY_AMOUNT,
                        qrCodeValue: 'https://' + window.location.hostname,
                    });
                    resetToHomePage();
                }
                removeUniqueId();
                return false;
            } else {
                setPayRepeatCount(repeatCount + 1);
            }
        } else {
            if(this._repeatPayTimer) clearTimeout(this._repeatPayTimer);
            removeUniqueId();
        }

        if (parseFloat(amount) > 0) {
            let usdAmount = getUSDPrice(Number(amount));
            if (Math.round(fiatPrice) !== 1) usdAmount = getUSDPrice(Number(fiatPrice));
            if (Math.round(PortfolioUSDTValue) === 0 || usdAmount > PortfolioUSDTValue || Math.round(usdAmount) === 0) {
                return -1;
            }
            for (let coin of PortfolioData) {
                if (['ETH'].indexOf(coin.Coin) >= 0) {
                    if (Math.round(coin.Position) > 0) {
                        const btcAmount = usdAmount || 0;
                        const amount = coin.Position > btcAmount ? btcAmount : coin.Position;
                        if (Number(amount) > 0) {
                            initTransferRequest(coin.Coin, Number(amount), defaultFiat)
                                .then(uniqueAddress => {
                                    requestPosition();
                                    if(isRepeat && Math.round(this.state.usdAmount) !== Math.round(amount) && !this.state.loaded) {
                                        this.setState({
                                            payAmount: Math.ceil(amount * this.state.currencyPrice),
                                            usdAmount: amount,
                                        });
                                        this.props.onGetAmount(usdAmount);
                                    }
                                    setPayAmount(getDefaultPrice(Number(amount * coin.Price)), true);
                                    this.resetQRCodeValue(redirect ? uniqueAddress : null);
                                    this.getTransferNotification(uniqueAddress);
                                    this.startChangingQR();
                                    setUniqueId(uniqueAddress);
                                    this._repeatPayTimer = setTimeout(() => this.payMoney(amount, fiatPrice, redirect, true), 300000);
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                            return true;
                        }
                    }
                    break;
                }
            }
        }
        this.resetQRCodeValue();
        return false;
    }

    updateQRCode = (fiatPrice = 1, redirect = true) => {
        const amount = (this.state.isFirstOpen ? Math.floor(1 / this.state.currencyPrice) : this.state.usdAmount);
        return this.payMoney(amount, fiatPrice, redirect, false);
    }

    resetQRCodeValue = (uniqueAd = null) => {
        this.setState({
            isSpinnerShowing: false,
        });

        if (uniqueAd) {
            this.setState({ qrCodeValue: `https://${window.location.hostname}/cointransfer/${uniqueAd}` });
            this.props.onSaveUniqueAddress(uniqueAd);
            setTimeout(() => {
                this.props.zoomQRCode(true);
                this.setState({ isZoom: true });
            }, 6000);
            setTimeout(() => {
                this.props.zoomQRCode(true);
                this.setState({ isZoomIn: true });
            }, 8000);
            if(this._zoomTimer) {
                clearTimeout(this._zoomTimer);
            }
            this._zoomTimer = setTimeout(() => {
                this.props.zoomQRCode(false);
                this.setState({
                    isZoom: false,
                    isZoomIn: false,
                });
            }, 60000);
        }
    }

    getOptionQRCode() {
        const { isQRShowing } = this.state;
        if (isQRShowing) {
            return this.state.qrCodeValue.split('cointransfer').join('transfer');
        }
        return this.state.qrCodeValue;        
    }

    containerClass() {
        if (this.showCodeInput()) {
            return 'input-bar-containers shadow';
        }
        return 'input-bar-containers';
    }

    phoneContainerClass() {
        const {
            error,
            loading,
            isZoom,
            unloadPhoneInput,
            isSpinnerShowing,
            phoneSubmitStatus,
        } = this.state;
        const suffix = (isSpinnerShowing ? ' spinner' : '') +
                        (phoneSubmitStatus === 'warning' ? ' warning' : '') + ' ' + error +
                        (isZoom ? 'zoom' : '');

        if (loading) {
            if (unloadPhoneInput) {
                return 'input-bar load unload' + suffix;
            }
            return 'input-bar load' + suffix;
        }
        return 'input-bar' + suffix;
    }

    phoneSubmitIconUrl() {
        const {
            phoneSubmitStatus,
            unloadCodeInput,
        } = this.state;

        if (phoneSubmitStatus === 'submitted') {
            if (unloadCodeInput) {
                return verifyIcon;
            }
            return 'spinner';
        }
        if (phoneSubmitStatus === 'submitting') {
            return 'spinner';
        }
        return verifyIcon;
    }

    phoneSubmitIconClass() {
        const { phoneSubmitStatus, unloadPhoneInput, showPhoneArrow } = this.state;

        if (phoneSubmitStatus === 'submitted') {
            if (!unloadPhoneInput) {
                return 'qr-code-container';
            }
            return 'qr-code-container';
        }
        if (phoneSubmitStatus === 'submitting') {
            return 'qr-code-container spinner';
        }
        if (showPhoneArrow) {
            return 'qr-code-container arrow';
        }
        return 'qr-code-container';
    }

    codeSubmitIconClass() {
        const { codeSubmitStatus } = this.state;

        if (codeSubmitStatus === 'submitted') {
            return 'qr-code-container none';
        }
        if (codeSubmitStatus === 'submitting') {
            return 'qr-code-container spinner';
        }
        return 'qr-code-container arrow';
    }

    showCodeInput() {
        return this.state.phoneSubmitStatus === 'submitted' && !this.state.unloadCodeInput;
    }

    hidePhoneInput() {
        this.setState({
            unloadPhoneInput: true,
            showPhoneArrow: false,
        });
        setTimeout(() => {
            // this.props.zoomQRCode(this.state.isZoom);
            this.componentDidMount();
        }, 1000);
    }

    startChangingQR() {
        if (this._blinkingTimer) clearInterval(this._blinkingTimer);
        this._blinkingTimer = setInterval(() => {
            this.setState(prevState => ({
                isQRShowing: !prevState.isQRShowing,
            }));
        }, 5000);
    }

    filterCountry(currencies, currencyCode) {
        const { searchCurrency } = this.state;
        let countries = [];
        const item = currencies.find(currency => currency.currencyCode === currencyCode);
        if(item) {
            countries = [item].concat(currencies.filter(currency => currency.currencyCode !== currencyCode));
        } else {
            countries = currencies;
        }

        countries = countries.filter(item => {
            if (searchCurrency && searchCurrency !== '') {
                return String(item.currencyCode).toLowerCase().includes(String(searchCurrency).toLowerCase())
                    || String(item.currency).toLowerCase().includes(String(searchCurrency).toLowerCase());
            }
            return true;
        });
        return countries;
    }

    render() {
        const {
            error,
            isChanged,
            currentView,
            payAmount,
            usdAmount,
            isSendingPayAmount,
            isSpinnerShowing,
            qrCodeValue,
            phoneSubmitStatus,
            showPhoneArrow,
            isCurrencyShowing,
            isPromotionShowing,
            isZoomIn,
            currencySymbol,
            isFirstOpen,
            searchCurrency,
        } = this.state;
        const isClosing = false;
        const {
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn,
            },
            currencies,
            currencyCode,
        } = this.props;
        const circledText = this.getCircleText();
        const circledTextLength = circledText.length;
        const countries = this.filterCountry(currencies, currencyCode);

        return (
            <Main
                isLoggedIn={isLoggedIn}
                certVisible={isLoggedIn}
                symbolLength={currencySymbol.length}
                length={Number(payAmount).toLocaleString().length}
                onClick={e => this.onBack(e)}
            >
                {isCurrencyShowing && (
                    <CountrySelect onClick={this.onBoxClick}>
                        <CountrySearch>
                            <img src="/img/search_icon.png" alt="search" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchCurrency}
                                onChange={(e) => this.handleChangeSearchCurrency(e)}
                            />
                        </CountrySearch>
                        {countries.map(item => {
                            return (
                                <CountrySelectItem key={item.currencyCode} onClick={e => this.onClickCurrency(e, item)}>
                                    <div className="d-flex align-items-center" style={{ width: '100%' }}>
                                        {item.currencyCode.toLowerCase() === 'usd' ? (
                                            <img src="/img/icons-coin/usd1.png" className="flag" alt=""/>
                                        ) : (
                                            <img src={`/img/icons-coin/${item.currencyCode.toLowerCase()}.png`} className="flag" alt=""/>
                                        )}
                                        <div className="currency-item-container">
                                            <h1>{item.currency}</h1>
                                            <h1>{item.price.toFixed(2)}</h1>
                                        </div>
                                    </div>
                                </CountrySelectItem>
                            );
                        })}
                    </CountrySelect>
                )}

                <div className={this.containerClass()}>
                    <div className="input-bar-container">
                        <div
                            className={this.phoneContainerClass()}
                            onClick={this.onBoxClick}
                        >
                            <div className={`number-input-wrapper len-${Number(payAmount).toLocaleString().length}`} onClick={this.handleInputClick}>
                                <div className="number-input-currency" onClick={this.handleFormClick}>
                                    {this.state.currencySymbol ? (
                                        <div>{this.state.currencySymbol}</div>
                                    ) : (
                                        <div>
                                            {this.state.currencyCode.toLowerCase() === 'usd' ? (
                                                <img src="/img/icons-coin/usd1.png" alt=""/>
                                            ) : (
                                                <img src={`/img/icons-coin/${this.state.currencyCode.toLowerCase()}.png`} alt=""/>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {payAmount === 0 ? (
                                    <div className="number-input-hide">
                                        {isFirstOpen ? 1 : 0}
                                    </div>
                                ) : (
                                    <div className="number-input-hide">
                                        {Number(payAmount).toLocaleString()}
                                    </div>
                                )}

                                <div className="number-input-currency hide">
                                    {this.state.currencySymbol ? (
                                        <div>{this.state.currencySymbol}</div>
                                    ) : (
                                        <div>
                                            {this.state.currencyCode.toLowerCase() === 'usd' ? (
                                                <img src="/img/icons-coin/usd1.png" alt=""/>
                                            ) : (
                                                <img src={`/img/icons-coin/${this.state.currencyCode.toLowerCase()}.png`} alt=""/>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <input
                                type="tel"
                                className="number-input"
                                value={(payAmount === 0 ? '' : Number(payAmount).toLocaleString())}
                                onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                        this.onSend(e);
                                    }
                                }}
                                onChange={this.handleChangePayAmount}
                                onKeyDown={(e) => this.onInputChange(e)}
                                readOnly={isSendingPayAmount}
                                ref={ref => {
                                    this.inputRef = ref;
                                }}
                                disabled={phoneSubmitStatus === 'none'}
                                onClick={this.handleInputClick}
                            />

                            {isLoggedIn && (
                                <InputCircle
                                    isBalance={true}
                                    borderColor="rgba(50,105,209,0.5)"
                                    onClick={e => this.onHistory(e)}
                                >
                                    {error === '' && <img src={balanceIcon} alt="" style={{ width: '120%' }} />}
                                    {error === 'error' && <img src={balanceErrorIcon} alt="" style={{ width: '120%' }} />}
                                    <div className={this.getLocalNumber().length > 6 ? 'balance long' : 'balance'}>
                                        <span>{this.getLocalNumber()}</span>
                                    </div>
                                </InputCircle>
                            )}

                            {!isLoggedIn && (
                                <InputCircle
                                    borderColor="rgba(255, 255, 255, 0.5)"
                                    onClick={() => this.props.onBack(true, usdAmount)}
                                >
                                    <img src={loginIcon} alt="" />
                                </InputCircle>
                            )}

                            <CertificateContainer
                                billHeight={this.props.billHeight}
                                billWidth={this.props.billWidth}
                                className={this.getBillStyle()}
                            >
                                <img src={certificateImg} alt="" />
                                <CircleText isLoggedIn={isLoggedIn && !isChanged}>
                                    {
                                        circledText.split('').map((item, index) =>
                                            <span
                                                key={'char-rotation-' + index}
                                                className={'char-' + index}
                                                style={{ transform: `rotate(${360.0 / circledTextLength * index}deg)` }}
                                            >
                                                {item}
                                            </span>)
                                    }
                                </CircleText>
                                <QRCodeWrapper>
                                    {!isZoomIn && <QRCode
                                        value={this.getOptionQRCode()}
                                        bgColor="#FFB400"
                                        fgColor="#000"
                                    />}
                                </QRCodeWrapper>
                            </CertificateContainer>

                            {isZoomIn && <CertificateContainer
                                billHeight={this.props.billHeight}
                                billWidth={this.props.billWidth}
                                className={this.getZoomInBillStyle()}
                            >
                                <QRCodeWrapper>
                                    <QRCode
                                        value={this.getOptionQRCode()}
                                        bgColor="#FFB400"
                                        fgColor="#000"
                                    />
                                </QRCodeWrapper>
                            </CertificateContainer>}

                            {/* {this.props.isPublicKeyShowing && (
                                <PortalWrapper className={isClosing && 'close'}>
                                    <PortalInnerWrapper className={isClosing && 'close'}>
                                        <img src={coinImg} alt="" />

                                        <WithdrawInfo>
                                            <ImgBills
                                                src={withdrawPreviewImg}
                                                alt=""
                                            />
                                        </WithdrawInfo>
                                    </PortalInnerWrapper>
                                </PortalWrapper>
                            )} */}
                            {isSpinnerShowing ? (
                                <SMLoadingSpinner>
                                    <img src={`${process.env.PUBLIC_URL}/img/gold_certificate.png`} alt="" />
                                </SMLoadingSpinner>
                            ) : (
                                <div className={this.phoneSubmitIconClass() + (isChanged ? ' changed' : '')} onClick={e => this.onQRCode(e, 'pay')}>
                                    <PayText>
                                        {error === '' && <img src={payIcon} alt="pay"/>}
                                        {error === 'error' && <img src={payErrorIcon} alt="pay-error"/>}
                                    </PayText>
                                </div>
                            )}
                        </div>
                    </div>

                    {isPromotionShowing && <Promotion style={{ backgroundColor: '#4080FF' }} onClick={e => this.onPromotion(e)}>
                        <div className="prefix">
                            <div className="containerText">
                                <div style={{ fontSize: '36px', paddingRight: '10px' }}>
                                    $5
                                </div>
                            </div>
                        </div>
                        <div className="prefix">
                            <div className="containerText">
                                <div style={{ fontSize: '12px' }}>
                                    Send any amount to your friends and we'll send you both $5 when they try this App!
                                </div>
                            </div>
                        </div>
                    </Promotion>}
                </div>
            </Main>
        );
    }
}

export default compose(
    withSafeTimeout,
    inject(
        STORE_KEYS.SENDCOINSTORE,
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.PAYAPPSTORE,
        STORE_KEYS.SMSAUTHSTORE,
    ),
    observer,
    withProps(
        (
            {
                [STORE_KEYS.SENDCOINSTORE]: {
                    isEmpty,
                    initTransferRequest,
                    uniqueAddress,
                    requestDetailsPublic,
                    requestDetailsPrivate,
                    transferNotification,
                },
                [STORE_KEYS.SETTINGSSTORE]: {
                    defaultFiat,
                    getDefaultPrice,
                    getUSDPrice,
                    currencies,
                },
                [STORE_KEYS.YOURACCOUNTSTORE]: {
                    isNewUser,
                    PortfolioData,
                    requestPosition,
                    PortfolioUSDTValue,
                },
                [STORE_KEYS.PAYAPPSTORE]: {
                    payAmount,
                    switchAppContentView,
                    setPayAmount,
                    loadQRCodeUrl,
                    payViewMode,
                    setUniqueId,
                    getUniqueId,
                    removeUniqueId,
                    setPayRepeatCount,
                    getPayRepeatCount,
                },
            }
        ) => ({
            isEmpty,
            isNewUser,
            initTransferRequest,
            getUSDPrice,
            defaultFiat,
            getDefaultPrice,
            PortfolioData,
            requestPosition,
            PortfolioUSDTValue,
            switchAppContentView,
            loadQRCodeUrl,
            payAmount,
            setPayAmount,
            payViewMode,
            uniqueAddress,
            requestDetailsPublic,
            requestDetailsPrivate,
            transferNotification,
            currencies,
            setUniqueId,
            getUniqueId,
            removeUniqueId,
            setPayRepeatCount,
            getPayRepeatCount,
        })
    )
)(withRouter(PayQRCodeViewV2));
