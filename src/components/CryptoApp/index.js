import React, { Component } from 'react';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { Swipeable } from 'react-swipeable';
import { withSafeTimeout, withSafeInterval } from '@hocs/safe-timers';
import { countries as countryList } from "typed-countries";
import { getCountryCallingCode } from 'libphonenumber-js';

import {
    Wrapper,
    BillWrapper,
    BackCurrency,
    Controller,
    PrivateIcon,
    PayQRWrapper,
    QRWrapper,
    CurrencyHead,
    BackCurrencyContainer,
    ScanContainer,
    ScanIcon,
    BackCurrencyDataContainer,
    LoadingWrapper,
    LoadingBill,
} from './Components';
import AppHistory from './AppHistory';
import PayQRCodeV2InCurrency from './PayQRCodeV2InCurrency';
import SMSVerificationForm from './SMSVerificationForm';
import FadeScreen from './FadeScreen';
import { STORE_KEYS } from '../../stores';
import PaymentData from './PaymentData/index';
import Congratulations from './Congratulations';
import Wallet from './Wallet';

import USD_1 from './DollarBills/USDT/USDT_1.jpg';
import USD_10 from './DollarBills/USDT/USDT_10.jpg';
import USD_100 from './DollarBills/USDT/USDT_100.jpg';
import USD_1000 from './DollarBills/USDT/USDT_1000.jpg';
import USD_10000 from './DollarBills/USDT/USDT_10000.jpg';
import LoadingImg from './asset/img/Loading.png';

class CryptoApp extends Component {
    _isMounted = false;
    _timer = null;
    _prevOrie = null;
    _fadeScreenTimer = null;

    state = {
        isLoadingShowing: true,
        isBlurLoaded: false,
        isTransferLoaded: false,
        isHistoryShowing: false,
        isBalanceShowing: false,
        isCongratsShowing: false,
        isSMSVerificationShowing: false,
        isPrivateValicationShowing: false,
        isDollarBillShowing: false,
        isPublicKeyShowing: false,
        isPrivateKeyShowing: false,
        isWalletShowing: false,
        coinAddress: '',
        isScanned: false,
        isBalanceLoaded: !this.props[STORE_KEYS.SMSAUTHSTORE].isLoggedIn,
        isPayFormShowing: false,
        scannedStatus: '',
        isCheckingClaimed: false,
        currencyHeadIndex: false,
        privateKeyURL: '',
        amount: 0,
        logoutAmount: 0,
        prevAmount: 0,
        repayAmount: 0,
        isFirstLoad: true,
        verifyResultMsg: '',
        verifyType: '',
        smsPlaceHolder: '',
        scannedUniqueId: '',
        scannedAmount: 0,
        currentBalance: this.props[STORE_KEYS.YOURACCOUNTSTORE].PortfolioUSDTValue,
        afterClaimed: null,
        billHeight: 0,
        fadeStatus: '',
        countries: null,
        countryCode: '',
        currencyCode: '',
    };

    componentDidMount() {
        this.getCountrySelectData();
        this._isMounted = true;

        const {
            isCoinTransfer,
            trId,
            firstLoad,
            getUniqueId,
            removeUniqueId,
            [STORE_KEYS.VIEWMODESTORE]: { isLoaded },
            [STORE_KEYS.YOURACCOUNTSTORE] : { PortfolioUSDTValue },
            [STORE_KEYS.SMSAUTHSTORE]: { isLoggedIn },
        } = this.props;

        if(PortfolioUSDTValue !== undefined && PortfolioUSDTValue !== null) {
            this.setState({ isBalanceLoaded: true });
        }

        if (isCoinTransfer) {
            this.setState({
                isCheckingClaimed: true,
                scannedUniqueId: trId,
                isTransferLoaded: true,
            });
            removeUniqueId();
            this.getTransferDetail(trId);
        } else {
            document.title = 'Blockchain Terminal';
            const uniqueId = getUniqueId();
            if(isLoggedIn && uniqueId) {
                this.getTransferDetail(uniqueId);
            } else {
                this.setState({
                    isTransferLoaded: true,
                })
            }
        }
        document.getElementsByTagName('body')[0].style = `height: ${document.documentElement.clientHeight}px !important`;
        this._prevOrie = window.orientation;
        if(Math.round(this.state.billHeight) === 0) {
            this.setState({ billHeight: document.documentElement.clientHeight - 60 });
        }

        window.addEventListener('resize', (e) => {
            if (Number(window.orientation) !== Number(this._prevOrie)) {
                this._prevOrie = window.orientation;
                document.getElementsByTagName('body')[0].style = `height: ${document.documentElement.clientHeight}px !important`;
                this.setState({ billHeight: document.documentElement.clientHeight - 60 });
            }
        });

        if(isLoaded) {
            this.setState({ isLoadingShowing: false });
        } else if(!firstLoad) {
            this.handleLoad();
        } else {
            window.addEventListener('load', this.handleLoad.bind(this));
        }

        Axios.get('https://json.geoiplookup.io/').then(res => {
            this.setState({
                countryCode: res.data['country_code'],
                currencyCode: res.data['currency_code'],
            });

            const item = this.state.countries.find(country => country.iso === res.data['country_code']);
            if(item) {
                this.setState({
                    countries: [item].concat(this.state.countries.filter(country => country.iso !== item.iso)),
                });
            }
        }).catch(err => {
        });

        if(isLoggedIn) {
            this.setCoinAddress();
            this.props.requestTransferHistory();
        }
    }

    componentWillReceiveProps(nextProps) {
        if ((this.props.PortfolioUSDTValue !== undefined && this.props.PortfolioUSDTValue !== null)
            || (nextProps.PortfolioUSDTValue !== undefined && nextProps.PortfolioUSDTValue !== null)) {
            this.setState({ isBalanceLoaded: true });
        }
        if (nextProps.trId !== this.props.trId) {
            this.setState({
                isCheckingClaimed: true,
                scannedUniqueId: undefined,
            });
            this.getTransferDetail(nextProps.trId);
        }
    }

    componentDidUpdate() {
        const {
            [STORE_KEYS.SMSAUTHSTORE]: { isLoggedIn },
            [STORE_KEYS.YOURACCOUNTSTORE]: { PortfolioUSDTValue },
        } = this.props;
        const { isFirstLoad, isScanned, scannedUniqueId } = this.state;

        if (isLoggedIn && !isScanned && isFirstLoad) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                isFirstLoad: false,
                scannedUniqueId: scannedUniqueId === undefined ? scannedUniqueId : '',
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(this._timer);
        document.getElementsByTagName('body')[0].removeAttribute('style');
        if (this.clearToggleHistoryTimeout) {
            this.clearToggleHistoryTimeout();
        }
        if (this.clearGetTransferDetailTimeout) {
            this.clearGetTransferDetailTimeout();
        }
        if (this.clearSwipeHandlerTimeout) {
            this.clearSwipeHandlerTimeout();
        }
    }

    setCoinAddress = () => {
        this.props.createDepositAddress('BTC')
            .then(address => {
                this.setState({
                    coinAddress: address,
                });
            });
    }

    toggleHistory = (isReset = false) => {
        const {
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn,
            },
        } = this.props;
        const {
            isHistoryShowing,
            isCheckingClaimed,
            scannedUniqueId,
        } = this.state;

        if (isReset && !isCheckingClaimed && scannedUniqueId !== undefined && scannedUniqueId !== '') {
            this.setState({
                scannedUniqueId: '',
                amount: 0,
                prevAmount: 0,
                scannedAmount: 0,
            });
        }

        if (isHistoryShowing) {
            setTimeout(() => {
                const obj = document.getElementsByClassName('crypto-app-back-currency-container')[0];
                if (obj) obj.setAttribute('style', 'display: block;');
            }, 500);
        }

        if (isLoggedIn) {
            this.setState(prevState => ({
                isHistoryShowing: !prevState.isHistoryShowing,
            }));
        } else if (!isLoggedIn) {
            this.setState({
                isSMSVerificationShowing: true,
                verifyType: 'history',
            });
        }
    };

    handleBack = (res = false) => {
        this.setState({
            isSMSVerificationShowing: false,
            isScanned: false,
            amount: this.state.prevAmount,
        });
    }

    handleQRBack = (value, logoutAmount = 0) => {
        if (value) {
            this.setState({
                logoutAmount,
                prevAmount: logoutAmount,
                verifyType: value === true ? 'login' : 'pay',
                isSMSVerificationShowing: true,
                currencyHeadIndex: false,
            });
        } else {
            this.setState({
                logoutAmount: 0,
                amount: this.state.prevAmount,
                currencyHeadIndex: false,
            });
        }
    }

    handleQRImageClick = (value) => {
        const {
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn,
            },
        } = this.props;

        this.setState({ currencyHeadIndex: value });

        if(value) {
            this.savePrevAmount();
        }

        if (!isLoggedIn) this.setState({ isBalanceShowing: true });
        else this.setState({ isBalanceShowing: value });
    }

    savePrevAmount = () => {
        this.setState({ prevAmount: this.state.amount });
    }

    handleGetAmount = (value) => {
        this.setState({ amount: Number(value) });
    }

    handleVerification = (isHistory) => {
        const { verifyType, prevAmount } = this.state;

        this.setState({
            isPayFormShowing: prevAmount === 0,
            isHistoryShowing: isHistory || verifyType === 'history',
            isSMSVerificationShowing: false,
            isScanned: false,
            smsPlaceHolder: null,
            scannedAmount: 0,
        });
    }

    handlePrevAmount = (am) => {
        this.setState({ prevAmount: am });
    }

    handleSaveUniqueAddress = (uniqueAddress) => {
        // clearInterval(this._timer);
        this.setState({
            scannedUniqueId: uniqueAddress,
            isCheckingClaimed: true,
        });
        // this._timer = setInterval(() => {
        //     if(this._isMounted) {
        //         this.checkTransferDetailStatus(uniqueAddress);
        //     }
        // }, 7000);
    }

    getCountrySelectData() {
        let countries = [];
        const prior_countries = ['US', 'KR', 'JP', 'DE', 'FR', 'MT', 'CA', 'BY', 'NL', 'VN', 'SG'];
        prior_countries.forEach(code => {
            const item = countryList.find(country => country.iso === code);
            if(item) {
                let phoneNumber;
                try {
                    phoneNumber = getCountryCallingCode(item.iso);
                    countries.push({...item, callCode: phoneNumber});
                } catch(err) {
                }
            }
        });
        countryList.forEach(item => {
            if (prior_countries.indexOf(item.iso) === -1) {
                let phoneNumber;
                try {
                    phoneNumber = getCountryCallingCode(item.iso);
                    countries.push({...item, callCode: phoneNumber});
                } catch(err) {
                }
            }
        });
        this.setState({ countries: countries });
    }

    getPrivateQR = async () => {
        if (this.state.isPublicKeyShowing) {
            let response = await axios.get(
                'https://qr.bct.trade/private_qr?words=02ceb48796223dc3777fe210a2034059b5e39b3743e59d62f75ef07a32f8440caf}',
                { 'Access-Control-Allow-Origin': '*' }
            );
            if (response) {
                return response.data;
            }
        }
        return this.state.privateKeyURL;
    }

    showPublicKey = async () => {
        const { isPublicKeyShowing } = this.state;
        const {
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn,
            },
        } = this.props;

        const prevPublicKeyShowing = isPublicKeyShowing;
        if(isLoggedIn) {
            if(!prevPublicKeyShowing) {
                this.setState({
                    isPublicKeyShowing: !prevPublicKeyShowing,
                    isPrivateKeyShowing: false,
                    prevAmount: this.state.amount,
                });
            } else {
                this.setState({
                    isPublicKeyShowing: !prevPublicKeyShowing,
                    isPrivateKeyShowing: false,
                    amount: this.state.prevAmount,
                });
            }
        }
    }

    checkPrivateKey = async () => {
        const { isPrivateKeyShowing } = this.state;
        if (!isPrivateKeyShowing) {
            this.setState({
                isPrivateKeyShowing: true,
            });
            const privateKey = await this.getPrivateQR();
            this.setState({
                privateKeyURL: privateKey,
            });
        }
    }

    claimTransferRequest = () => {
        const {
            [STORE_KEYS.SENDCOINSTORE]: {
                claimTransfer,
            },
            [STORE_KEYS.YOURACCOUNTSTORE] : {
                requestCoinsForWallet,
            }
        } = this.props;
        const { scannedUniqueId } = this.state;
        return claimTransfer(scannedUniqueId).then(res => {
            this.setState({
                isFirstLoad: false,
                afterClaimed: this.state.amount,
            });
            requestCoinsForWallet();
            return res;
        }).catch(err => {
            return err;
        });
    }

    cancelTransferRequest = () => {
        const {
            [STORE_KEYS.SENDCOINSTORE]: {
                // requestCancelTransferRequest,
                requestRejectUserTransferRequest,
            },
        } = this.props;
        const { scannedUniqueId } = this.state;
        // return requestCancelTransferRequest(scannedUniqueId);
        return requestRejectUserTransferRequest(scannedUniqueId);
    }

    checkTransferDetailStatus = async (uniqueId) => {
        const {
            [STORE_KEYS.SENDCOINSTORE]: {
                requestDetailsPrivate,
            },
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn,
            },
        } = this.props;

        const privResponse = await requestDetailsPrivate(uniqueId);
        if(isLoggedIn && privResponse.IsOwner && privResponse.Status === 'claimed' && this._isMounted) {
            this.setState({ isCheckingClaimed: false });
            clearInterval(this._timer);
            this.toggleHistory();
            this.zoomQRCode(false);
        }
    }

    getTransferDetail = async (uniqueId) => {
        const {
            [STORE_KEYS.SENDCOINSTORE]: {
                requestDetailsPrivate,
                requestDetailsPublic,
            },
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn,
            },
            setSafeTimeout,
            isCoinTransfer,
            getUniqueId,
            removeUniqueId,
        } = this.props;

        let response = null;
        const trId = getUniqueId();
        if(trId && trId === uniqueId) {
            response = await requestDetailsPublic(uniqueId);
            console.log(response);
            // if(response.Status === 'pending') {
            //     this.setState({
            //         scannedUniqueId: uniqueId,
            //         scannedAmount: Number(response.Amount),
            //         amount: Number(response.Amount),
            //         prevAmount: Number(response.Amount),
            //         isSMSVerificationShowing: false,
            //         isScanned: false,
            //         smsPlaceHolder: Number(response.Amount),
            //     });
            // } else {
            //     removeUniqueId();
            // }
            this.setState({ repayAmount: response.Amount });
            setTimeout(() => {
                this.setState({ isTransferLoaded: true });
            }, 2000);
            return;
        }

        if (isLoggedIn) {
            response = await requestDetailsPrivate(uniqueId);
            console.log(response);
            if (response.IsOwner) {
                this.setState({
                    scannedUniqueId: uniqueId,
                    scannedAmount: Number(response.Amount),
                    amount: Number(response.Amount),
                    prevAmount: Number(response.Amount),
                    isSMSVerificationShowing: false,
                    isScanned: false,
                    smsPlaceHolder: Number(response.Amount),
                });
            } else {
                this.setState({
                    scannedUniqueId: uniqueId,
                    scannedAmount: Number(response.Amount),
                    amount: Number(response.Amount),
                    prevAmount: Number(response.Amount),
                    isSMSVerificationShowing: true,
                    isScanned: true,
                    scannedStatus: response.Status,
                    smsPlaceHolder: Number(response.Amount),
                });
                if(response.Status !== 'pending') {
                    setTimeout(() => this.props.history.push('/'), 5000);
                }
            }
        } else {
            response = await requestDetailsPublic(uniqueId);
            console.log(response);
            this.setState({
                scannedUniqueId: uniqueId,
                scannedAmount: Number(response.Amount),
                amount: Number(response.Amount),
                prevAmount: Number(response.Amount),
                isSMSVerificationShowing: true,
                verifyType: 'get',
                isScanned: true,
                scannedStatus: response.Status,
                smsPlaceHolder: Number(response.Amount),
            });
            if(response.Status !== 'pending') {
                setTimeout(() => this.props.history.push('/'), 5000);
            }
        }

        if(isCoinTransfer) {
            let amount = Math.round(response.amount);
            if(amount <= 1) {
                document.title = Math.round(response.Amount) + ' Dollar ' + window.location.hostname;
            } else {
                document.title = Math.round(response.Amount) + ' Dollars ' + window.location.hostname;
            }
        }

        setTimeout(() => {
            this.setState({
                isBlurLoaded: true,
            });
        }, 2000);
    }

    claimTransfer = (uniqueId) => {
        const {
            [STORE_KEYS.SENDCOINSTORE]: {
                claimTransfer,
            },
        } = this.props;

        claimTransfer(uniqueId).then(res => {
        });
    }

    closeCongrats = () => {
        this.setState({
            isCongratsShowing: false,
        });
    }

    swipeHandler = (event) => {
        // const {
        //     [STORE_KEYS.VIEWMODESTORE]: { pageIndexOfSmart, setPageIndexOfSmart, setIsPayApp },
        // } = this.props;
        
        // if (event.dir === 'Left' && pageIndexOfSmart === 0) {
        //     setIsPayApp(true);
        //     setPageIndexOfSmart(1);
        // }
        
        // if (event.dir === 'Right' && pageIndexOfSmart === 1) {
        //     setIsPayApp(false);
        //     setPageIndexOfSmart(0);
        // }
    }

    handlePayFormShowing = (value) => {
        this.setState({ isPayFormShowing: value });
    }

    handleBlurLoad = () => {
        if(!this.props.isCoinTransfer) {
            setTimeout(() => {
                this.setState({
                    isBlurLoaded: true,
                });
            }, 2000);
        }
    }

    handleLoad() {
        const {
            [STORE_KEYS.VIEWMODESTORE]: { setIsLoaded },
        } = this.props;

        setIsLoaded();

        setTimeout(() => {
            this.setState({
                isLoadingShowing: false,
            });
        }, 1000);
    }

    zoomQRCode(zoomIn = false) {
        if (zoomIn) {
            document.getElementsByTagName('body')[0].classList.add('zoom');
        } else {
            document.getElementsByTagName('body')[0].classList.remove('zoom');
        }
    }

    resetToHomePage = () => {
        this.setState({
            scannedUniqueId: '',
            amount: 0,
            prevAmount: 0,
            scannedAmount: 0,
            fadeStatus: '',
        });
        this.props.history.push('/');
    }

    setFadeStatus = (status) => {
        const {
            [STORE_KEYS.YOURACCOUNTSTORE] : {
                requestCoinsForWallet,
            },
            removeUniqueId,
        } = this.props;
        this.setState({ isCheckingClaimed: false, fadeStatus: status });
        this.zoomQRCode(false);

        if(status === 'fade') {
            setTimeout(() => {
                this.resetToHomePage();
            }, 2000);
        } else if (status === 'claiming') {
            requestCoinsForWallet();
            removeUniqueId();
        } else if (status === 'rejecting') {
            removeUniqueId();
        }

        if(this._fadeScreenTimer) clearTimeout(this._fadeScreenTimer);
        this._fadeScreenTimer = setTimeout(() => {
            if(this.state.fadeStatus === 'informing') {
                this.onFadeScreenClick();
            }
        }, 300000);
    }

    onFadeScreenClick = () => {
        this.setFadeStatus('fade');
    }

    getBillStyle = (value) => {
        let amount = Math.round(value);
        if(amount < 10) return 'usd_1';
        if(amount < 100) return 'usd_10';
        if(amount < 1000) return 'usd_100';
        if(amount < 10000) return 'usd_1000';
        return 'usd_10000';
    }

    onClickCurrencyHead = (e) => {
        const {
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn,
            },
        } = this.props;

        if(isLoggedIn) {
            if(e) e.stopPropagation();
            this.setState({ isWalletShowing: true });
        }
    }

    onWalletBack = () => {
        this.setState({ isWalletShowing: false });
    }

    render() {
        const {
            isFirstLoad,
            isLoadingShowing,
            isBlurLoaded,
            isHistoryShowing,
            isCongratsShowing,
            isSMSVerificationShowing,
            isBalanceLoaded,
            isPayFormShowing,
            isWalletShowing,
            verifyResultMsg,
            amount : amountFromState,
            logoutAmount,
            repayAmount,
            isScanned,
            scannedStatus,
            smsPlaceHolder,
            currencyHeadIndex,
            scannedUniqueId,
            scannedAmount,
            afterClaimed,
            verifyType,
            billHeight,
            fadeStatus,
            countries,
            countryCode,
            currencyCode,
            isTransferLoaded,
            coinAddress,
        } = this.state;

        const {
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn,
            },
            [STORE_KEYS.YOURACCOUNTSTORE]: {
                PortfolioUSDTValue,
            },
            isCoinTransfer,
            isForexApp,
            forexUSDT,
            isSidebarMenuOpen,
        } = this.props;

        const amount = isForexApp ? forexUSDT : amountFromState;

        return (
            <Swipeable onSwiped={(eventData) => this.swipeHandler(eventData)} >
                <Wrapper isVisible={isBlurLoaded && !isSidebarMenuOpen} isForexApp={isForexApp}>
                    {isHistoryShowing && (
                        <AppHistory
                            isCoinTransfer={isCoinTransfer}
                            onClose={this.toggleHistory}
                        />
                    )}
                    <BillWrapper isForexApp={isForexApp}>
                        <BackCurrencyContainer>
                            <BackCurrency src={USD_1} alt="1" isVisible={Math.round(amount) < 10} />
                            <BackCurrency src={USD_10} alt="2" isVisible={Math.round(amount) >= 10 && Math.round(amount) < 100} />
                            <BackCurrency src={USD_100} alt="3" isVisible={Math.round(amount) >= 100 && Math.round(amount) < 1000} />
                            <BackCurrency src={USD_1000} alt="4" isVisible={Math.round(amount) >= 1000 && Math.round(amount) < 10000} />
                            <BackCurrency src={USD_10000} alt="5" isVisible={Math.round(amount) >= 10000} />
                            {/* <BackCurrency src={USD_0} alt="0" isVisible={true} /> */}
                            <BackCurrencyDataContainer>
                                <PaymentData
                                    amount={amount}
                                    totalValue={PortfolioUSDTValue}
                                    isScanned={isScanned}
                                    onClose={this.toggleHistory}
                                    billHeight={billHeight}
                                />
                                <CurrencyHead
                                    className={this.getBillStyle(amount)}
                                    onClick={this.onClickCurrencyHead}
                                />
                            </BackCurrencyDataContainer>
                        </BackCurrencyContainer>
                        {isSMSVerificationShowing && fadeStatus === '' && (
                            <PayQRWrapper isForexApp={isForexApp}>
                                <SMSVerificationForm
                                    type={verifyType}
                                    claimTransfer={this.claimTransferRequest}
                                    cancelTransfer={this.cancelTransferRequest}
                                    verify={this.handleVerification}
                                    onBack={this.handleBack}
                                    setFadeStatus={this.setFadeStatus}
                                    setCoinAddress={this.setCoinAddress}
                                    placeholderText={isScanned ? smsPlaceHolder : null}
                                    scanned={isScanned ? 'scanned' : 'failed'}
                                    scannedStatus={scannedStatus}
                                    isLoggedIn={isLoggedIn}
                                    countries={countries}
                                    countryCode={countryCode}
                                />
                            </PayQRWrapper>
                        )}
                        {/* {isPrivateValicationShowing && (
                                <PayQRWrapper>
                                    <PrivateValidation />
                                </PayQRWrapper>
                            )} */}
                        {(!isScanned && !isSMSVerificationShowing && fadeStatus === '' || isForexApp) && (
                            <QRWrapper currencyHeadIndex={currencyHeadIndex} isForexApp={isForexApp} isVisible={!isHistoryShowing}>
                                <PayQRCodeV2InCurrency
                                    onQRImageClick={this.handleQRImageClick}
                                    onGetAmount={this.handleGetAmount}
                                    fiatPrice={(isLoggedIn && !isFirstLoad) ? logoutAmount : 0}
                                    onBack={this.handleQRBack}
                                    onHistory={this.toggleHistory}
                                    onSaveUniqueAddress={this.handleSaveUniqueAddress}
                                    setFadeStatus={this.setFadeStatus}
                                    zoomQRCode={this.zoomQRCode}
                                    resetToHomePage={this.resetToHomePage}
                                    amount={amount}
                                    prevAmount={this.state.prevAmount}
                                    repayAmount={repayAmount}
                                    balance={PortfolioUSDTValue}
                                    uniqueId={scannedUniqueId}
                                    scannedAmount={scannedAmount}
                                    afterClaimed={afterClaimed}
                                    billHeight={billHeight}
                                    setPrevAmount={this.handlePrevAmount}
                                    currencyCode={currencyCode}
                                    isPayFormShowing={isPayFormShowing}
                                    changePayFormShowing={this.handlePayFormShowing}
                                    isCoinTransfer={isCoinTransfer}
                                />
                            </QRWrapper>
                        )}
                    </BillWrapper>

                    {/* {isPublicKeyShowing && (
                        <Controller onClick={this.checkPrivateKey}>
                            <div>
                                <span className="private-shadow"/>
                                <PrivateIcon src={isPrivateKeyShowing ? privateKeyURL : process.env.PUBLIC_URL + '/img/scanner_icon2.png'} />
                            </div>
                        </Controller>
                    )} */}

                    {isCongratsShowing && (
                        <Congratulations
                            onClose={this.closeCongrats}
                            message={verifyResultMsg}
                        />
                    )}

                    {!isForexApp && (
                        <ScanContainer>
                            <ScanIcon className="off" />
                            <ScanIcon className="off" />
                            <ScanIcon className="on" />
                        </ScanContainer>
                    )}
                </Wrapper>

                {isWalletShowing && (
                    <Wallet
                        onBack={this.onWalletBack}
                        billHeight={billHeight}
                        coinAddress={coinAddress}
                    />
                )}

                <LoadingWrapper isVisible={(isLoadingShowing || !isBlurLoaded || !isTransferLoaded || (isLoggedIn && !isBalanceLoaded)) && !isForexApp}>
                    <LoadingBill src={LoadingImg} onLoad={this.handleBlurLoad} alt="" />
                </LoadingWrapper>

                {fadeStatus !== '' && (
                    <FadeScreen
                        fadeStatus={fadeStatus}
                        onFadeScreenClick={this.onFadeScreenClick}
                    />
                )}
            </Swipeable>
        );
    }
}

export default compose(
    withSafeTimeout,
    withSafeInterval,
    withRouter,
    inject(
        STORE_KEYS.SENDCOINSTORE,
        STORE_KEYS.TELEGRAMSTORE,
        STORE_KEYS.MODALSTORE,
        STORE_KEYS.SMSAUTHSTORE,
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.PAYAPPSTORE,
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.FOREXSTORE,
        STORE_KEYS.COINADDRESSSTORE,
    ),
    observer,
    withProps(
        (
            {
                [STORE_KEYS.YOURACCOUNTSTORE]: {
                    PortfolioData,
                    requestPosition,
                    PortfolioUSDTValue,
                },
                [STORE_KEYS.FOREXSTORE]: {
                    forexUSDT,
                },
                [STORE_KEYS.PAYAPPSTORE]: {
                    setUniqueId,
                    getUniqueId,
                    removeUniqueId,
                },
                [STORE_KEYS.SENDCOINSTORE]: {
                    requestTransferHistory,
                },
                [STORE_KEYS.SMSAUTHSTORE]: {
                    isLoggedIn,
                },
                [STORE_KEYS.COINADDRESSSTORE]: {
                    createDepositAddress,
                },
            }
        ) => ({
            isLoggedIn,
            PortfolioData,
            requestPosition,
            PortfolioUSDTValue,
            forexUSDT,
            setUniqueId,
            getUniqueId,
            removeUniqueId,
            requestTransferHistory,
            createDepositAddress,
        })
    )
)(CryptoApp);
