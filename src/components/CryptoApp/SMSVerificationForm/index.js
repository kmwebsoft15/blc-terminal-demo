import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import {
    AsYouType,
    formatIncompletePhoneNumber,
    parsePhoneNumberFromString,
    getCountryCallingCode,
    getExampleNumber,
} from 'libphonenumber-js';
import { compose, withProps } from 'recompose';
import { withSafeTimeout } from '@hocs/safe-timers';
import ReactCountryFlag from 'react-country-flag';
import examples from 'libphonenumber-js/examples.mobile.json'

import { STORE_KEYS } from '../../../stores';

import {
    Main,
    CountrySelect,
    CountrySelectItem,
    LoadingSpinner,
    SMLoadingSpinner,
    InputCircle
} from './Components';
import verifyIcon from '../asset/img/verify.svg';
import rejectIcon from '../asset/img/reject.png';
import acceptIcon from '../asset/img/accept.png';
import receiveIcon from '../asset/img/receive.png';
import receiveErrorIcon from '../asset/img/receive_error.png';
import arrowIcon from '../asset/img/pay.png';

const PAY_QR_VIEW_STEPS = {
    VIEW_QR: 'view-qr',
    ENTER_PAY_AMOUNT: 'enter-pay-amount',
    VIEW_QR_AGAIN: 'view-qr-again',
    VERIFY_SUCCESS: 'verify-success',
};

class SMSVerificationForm extends React.Component {
    state = {
        error: false,
        currentView: PAY_QR_VIEW_STEPS.VIEW_QR,
        loading: false,
        loaded: false,
        showPhoneArrow: false,
        phoneSubmitStatus: 'none',
        codeSubmitStatus: 'none',
        phoneNumber: '',
        smsCode: '',
        codeInputAnimation: 'initial',
        unloadPhoneInput: false,
        unloadCodeInput: false,
        placeholderText: null,
        scanned: this.props.scanned,
        isScanShowing: this.props.scanned === 'scanned',
        isSMSShowing: this.props.scanned !== 'scanned',
        isCountrySelectShowing: false,
        countryCode: '',
        claimStatus: (this.props.scannedStatus !== 'pending' ? 'error' : ''),
        isBlured: -1,
        isPhoneNumberSendAvailable: false,
        egNumber: '',
        selectionStart: 0,
    };
    phoneInputRef = null;
    codeInputRef = null;
    _errorTimer = null;

    componentDidMount() {
        this.setState({
            countryCode: this.props.countryCode,
            phoneNumber: this.getExampleNumber(this.props.countryCode),
            egNumber: this.getExampleNumber(this.props.countryCode),
            loading: false,
            loaded: false,
            showPhoneArrow: false,
            phoneSubmitStatus: 'none',
            codeInputAnimation: 'initial',
            unloadPhoneInput: false,
            unloadCodeInput: false,
            isPhoneNumberSendAvailable: false,
        });
        let phoneInput = document.getElementById('phoneInput');
        if(phoneInput) {
            phoneInput.focus();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            isBlured,
            scanned,
            loading,
            phoneSubmitStatus,
            codeSubmitStatus,
            selectionStart,
            isCountrySelectShowing,
        } = this.state;

        const { isLoggedIn } = this.props;
        // if (this.codeInputRef) this.codeInputRef.focus();
        // if (this.phoneInputRef) this.phoneInputRef.focus();

        if (phoneSubmitStatus !== 'submitted' && this.phoneInputRef) {
            this.phoneInputRef.setSelectionRange(selectionStart, selectionStart);
        }
        if (isCountrySelectShowing) {
            if (this.phoneInputRef) this.phoneInputRef.blur();
        }

        if (!isLoggedIn && phoneSubmitStatus !== 'submitted' && scanned === 'success') {
            if (this.phoneInputRef) this.phoneInputRef.focus();
            return;
        }

        if(phoneSubmitStatus === 'submitting') {
            if (this.phoneInputRef) this.phoneInputRef.blur();
            if (this.codeInputRef) this.codeInputRef.focus();
            return;
        }

        if (isBlured > 0) {
            if (this.phoneInputRef) this.phoneInputRef.blur();
            if (this.codeInputRef) this.codeInputRef.blur();
            return;
        }

        if (phoneSubmitStatus === 'submitted' && codeSubmitStatus !== 'submitted' && codeSubmitStatus !== 'submitting') {
            if (this.codeInputRef) this.codeInputRef.focus();
            if (this.phoneInputRef) this.phoneInputRef.blur();
        }
        
        if(phoneSubmitStatus === 'submitted' && codeSubmitStatus === 'submitting') {
            if (this.codeInputRef) this.codeInputRef.blur();
        }
        // else if (phoneSubmitStatus === 'submitted' && codeSubmitStatus === 'submitting') {
        //     if (this.phoneInputRef) this.phoneInputRef.blur();
        //     if (this.codeInputRef) this.codeInputRef.blur();
        // } else if (loading && phoneSubmitStatus !== 'submitted') {
        //     if (this.phoneInputRef) this.phoneInputRef.blur();
        // }
    }

    componentWillReceiveProps(nextProps) {
        const { codeSubmitStatus, scanned } = this.state;
        const { verify } = this.props;
        if ((this.props.PortfolioUSDTValue !== undefined && this.props.PortfolioUSDTValue !== null)
            || (nextProps.PortfolioUSDTValue !== undefined && nextProps.PortfolioUSDTValue !== null)) {
            if(codeSubmitStatus === 'submitting' && scanned !== 'success') {
                verify();
            }
        }
    }

    onBlur = (e) => {
        if (this.state.isBlured === -1) {
            this.setState({ isBlured: 0 });
            // e.target.blur();
        }
    }

    onClose(e) {
        if (this.state.isBlured === 0) {
            this.setState({ isBlured: 1 });
            return;
        }
        if(this.state.isSMSShowing) {
            this.setState({ isBlured: -1 });
            if(this.state.scanned === 'failed') {
                this.props.onBack(false);
            } else {
                this.onResetReceivePayment();
            }
        }
    }

    onCountrySelect(e) {
        e.stopPropagation();
        if (!this.state.isCountrySelectShowing) {
            document.getElementById('phoneInput').blur();
        }
        this.setState(prevState => ({
            isCountrySelectShowing: !prevState.isCountrySelectShowing
        }));
    }

    onClickCountry(e, iso) {
        if(e) e.stopPropagation();
        this.setState({
            countryCode: iso,
            phoneNumber: this.getFormattedPhoneNumber(this.state.phoneNumber, iso),
            egNumber: this.getExampleNumber(iso),
        });
        this.onCountrySelect(e);
    }

    onQRCode() {
        if (this.state.unloadPhoneInput) {
            return;
        }
        this.setState({
            loading: true,
            isCountrySelectShowing: false,
        });
        setTimeout(() => {
            this.setState({ loaded: true });
            this.onSend();
            // document.getElementById('phoneInput').focus();
        }, 600);
    }

    onInputChange() {
        if (this.state.loaded) {
            this.setState({ showPhoneArrow: true, phoneSubmitStatus: 'none' });
        }
    }

    onBoxClick = (e) => {
        e.stopPropagation();
    }

    onClickPhoneNumber = e => {
        e.stopPropagation();
        const { phoneSubmitStatus, countryCode } = this.state;
        this.setState({
            selectionStart: e.target.selectionStart,
            isBlured: -1,
            loaded: false,
            smsCode: '',
            isPhoneNumberSendAvailable: false,
        });

        if (phoneSubmitStatus === 'submitted') {
            this.setState({
                phoneSubmitStatus: 'none',
                phoneNumber: this.getExampleNumber(countryCode),
                unloadPhoneInput: false,
                loading: false,
                loaded: false,
                showPhoneArrow: false,
                codeInputAnimation: 'initial',
                unloadCodeInput: false,
            })
        }
    }

    onSend = async (e) => {
        if (e) e.stopPropagation();
        const { requestAuthCode } = this.props[STORE_KEYS.SMSAUTHSTORE];
        const { phoneNumber } = this.state;
        let phoneNumberTrimed;

        if (this.state.loaded && parsePhoneNumberFromString(phoneNumber)) {
            this.setState({
                phoneSubmitStatus: 'submitting',
            });
            document.getElementById('phoneInput').blur();
            document.getElementById('codeInput').focus();

            phoneNumberTrimed = parsePhoneNumberFromString(phoneNumber).format('INTERNATIONAL');
            phoneNumberTrimed = phoneNumberTrimed.split(' ').join('');

            requestAuthCode(phoneNumberTrimed).then(() => {
                setTimeout(() => {
                    this.setState({
                        phoneSubmitStatus: 'submitted',
                        unloadPhoneInput: true,
                        showPhoneArrow: false,
                        codeInputAnimation: 'final',
                        isBlured: -1,
                    });
                    // document.getElementById('codeInput').focus();
                }, 2500);
            }).catch(err => {
                this.setState({
                    error: true,
                    loading: false,
                });
                setTimeout(() => {
                    this.setState({
                        error: false,
                        phoneSubmitStatus: 'submitted',
                        unloadPhoneInput: true,
                        showPhoneArrow: false,
                        codeInputAnimation: 'final',
                        isBlured: -1,
                    });
                }, 3000);
            });
        }
    }

    onClaimTransfer() {
        const { verify, claimTransfer, setFadeStatus } = this.props;

        this.setState({
            isSMSShowing: false,
            isScanShowing: true,
            claimStatus: 'progress',
            loading: false,
            scanned: 'scanned',
        });

        claimTransfer().then((res) => {
            // verify(true);
            if(res.Status === 'success') {
                this.setState({
                    claimStatus: 'claiming',
                });
                setTimeout(() => {
                    this.setState({
                        claimStatus: 'claimed',
                    });
                }, 2000);
                setTimeout(() => setFadeStatus('receiving'), 3000);
            } else {
                console.log('Cannot claim Transfer');
                this.setState({
                    claimStatus: 'error',
                });
                if(this._errorTimer) clearTimeout(this._errorTimer);
                this._errorTimer = setTimeout(() => this.onResetReceivePayment(), 5000);
            }
        }).catch(err => {
            // verify(true);
            console.log('Cannot claim Transfer', err);
            this.setState({
                claimStatus: 'error',
            });
            if(this._errorTimer) clearTimeout(this._errorTimer);
            this._errorTimer = setTimeout(() => this.onResetReceivePayment(), 5000);
        });
    }

    onSendCode() {
        const { confirmAuthCode } = this.props[STORE_KEYS.SMSAUTHSTORE];
        const { smsCode, scanned } = this.state;
        this.setState({ codeSubmitStatus: 'submitting' });
        document.getElementById('codeInput').blur();

        confirmAuthCode(smsCode)
            .then(() => {
                const {
                    setCoinAddress,
                    [STORE_KEYS.YOURACCOUNTSTORE]: yourAccountStore,
                } = this.props;

                setCoinAddress();

                setTimeout(() => yourAccountStore.requestPositionWithReply(), 500);

                setTimeout(() => {
                    if (scanned === 'success') {
                        this.onClaimTransfer();
                    }
                }, 100);
            })
            .catch(err => {
                this.setState({ error: true });
                setTimeout(() => {
                    this.setState({
                        smsCode: '',
                        error: false,
                        codeSubmitStatus: 'error',
                    });
                    // document.getElementById('codeInput').focus();
                }, 3000);
            });
    }

    onReceive() {
        this.props.verify(true);
    }

    onSuccessScan() {
        this.setState({
            scanned: 'success',
            isSMSShowing: true,
            isScanShowing: false,
        });
    }

    onResetReceivePayment() {
        if(this.props.scannedStatus === 'pending') {
            if(this._errorTimer) clearTimeout(this._errorTimer);
            this.setState({
                claimStatus: '',
                scanned: 'scanned',
                isSMSShowing: false,
                isScanShowing: true,
            });
        }
    }

    onScanAccept() {
        const { isLoggedIn } = this.props;
        if (isLoggedIn) {
            this.setState({
                codeSubmitStatus: 'submitted',
                unloadCodeInput: true,
                scanned: 'loading',
            });

            this.onClaimTransfer();
        } else {
            this.onSuccessScan();
        }
    }

    onScanReject() {
        const { isLoggedIn, setFadeStatus, cancelTransfer } = this.props;
        // if (isLoggedIn) {
        //     this.setState({
        //         claimStatus: 'rejecting',
        //     });
        //     cancelTransfer().then(res => {
        //         if(res) {
        //             this.setState({
        //                 claimStatus: 'rejected',
        //             });
        //             setTimeout(() => setFadeStatus('rejecting'), 1000);
        //         } else {
        //             this.onResetReceivePayment();
        //         }
        //     }).catch(err => {
        //         console.log(err);
        //     });
        // } else {
        cancelTransfer();
        this.setState({
            claimStatus: 'rejected',
        });
        setTimeout(() => setFadeStatus('rejecting'), 1000);
        // }
    }

    resendPhoneNumber(e) {
        if (e) e.stopPropagation();
        const { requestAuthCode } = this.props[STORE_KEYS.SMSAUTHSTORE];
        const { phoneNumber } = this.state;
        let phoneNumberTrimed;

        if (parsePhoneNumberFromString(phoneNumber)) {
            this.setState({
                phoneSubmitStatus: 'submitting',
            });
            document.getElementById('phoneInput').blur();
            document.getElementById('codeInput').focus();

            phoneNumberTrimed = parsePhoneNumberFromString(phoneNumber).format('INTERNATIONAL');
            phoneNumberTrimed = phoneNumberTrimed.split(' ').join('');

            requestAuthCode(phoneNumberTrimed).then(() => {
                setTimeout(() => {
                    this.setState({
                        phoneSubmitStatus: 'submitted',
                        unloadPhoneInput: true,
                        showPhoneArrow: false,
                        codeInputAnimation: 'final',
                        isBlured: -1,
                    });
                    // document.getElementById('codeInput').focus();
                }, 2500);
            }).catch(err => {
                this.setState({
                    error: true,
                    loading: false,
                });
                setTimeout(() => {
                    this.setState({
                        error: false,
                        phoneSubmitStatus: 'submitted',
                        unloadPhoneInput: true,
                        showPhoneArrow: false,
                        codeInputAnimation: 'final',
                        isBlured: -1,
                    });
                }, 3000);
            });
        }
    }

    getExampleNumber(countryCode) {
        let number = getExampleNumber(countryCode, examples).formatInternational();
        number = number.replace(/\d/g, "_");
        let numbers = number.split(' ');
        numbers[0] = `+${getCountryCallingCode(countryCode)}`;
        numbers[1] = `(${numbers[1]})`;
        number = '';

        for (let i = 0; i < numbers.length; i++) {
            number = number + (i > 2 ? '-' : ' ') + numbers[i];
        }
        this.setState({ selectionStart: numbers[0].length + 2 });

        return number;
    }

    getSMSTypeIcon() {
        return verifyIcon;
    }

    handleClickQR = e => {
        e.stopPropagation();
        this.setState({ currentView: PAY_QR_VIEW_STEPS.ENTER_PAY_AMOUNT });
    };

    handleChangePhoneNumber = e => {
        if (this.state.phoneSubmitStatus === 'submitting') return;
        e.stopPropagation();
        let tmpNumber = this.removeUselessInPhone(e.target.value);
        tmpNumber = formatIncompletePhoneNumber(tmpNumber, this.state.countryCode);
        let inputNumber = tmpNumber.split('+').join('');

        let checkedNumber = e.target.value;
        let pattern = `+${getCountryCallingCode(this.state.countryCode)}`;
        if(checkedNumber.split(pattern).length > 2) {
            checkedNumber = checkedNumber.split(pattern);
            for (let i = 0; i < checkedNumber.length; i ++) {
                let tmp = this.removeUselessInPhone(checkedNumber[i]);
                if (parsePhoneNumberFromString(pattern + tmp)) {
                    checkedNumber = pattern + tmp;
                    break;
                }                
            }
            if (Array.isArray(checkedNumber)) {
                checkedNumber = checkedNumber.join(pattern);
            }
            const originNumber = parsePhoneNumberFromString(checkedNumber);
            if (originNumber) {
                if (originNumber.isValid()) {

                    this.setState({
                        showPhoneArrow: true,
                        phoneNumber: this.getFormattedPhoneNumber(checkedNumber),
                        phoneSubmitStatus: 'none',
                        isBlured: -1,
                    });

                    if(originNumber.countryCallingCode === '86' && originNumber.nationalNumber.length !== 11) {
                        this.setState({ isPhoneNumberSendAvailable: false });
                    } else {
                        // this.onQRCode();
                        this.setState({ isPhoneNumberSendAvailable: true });
                    }
                    return;
                }
            }
        }

        this.setState({
            showPhoneArrow: true,
            phoneNumber: this.getFormattedPhoneNumber(inputNumber),
            phoneSubmitStatus: 'none',
            isBlured: -1,
        });

        const phoneNumber = parsePhoneNumberFromString(this.getFormattedPhoneNumber(inputNumber));
        if (phoneNumber && phoneNumber.isValid()) {
            if (phoneNumber.isValid()) {
                if(!(phoneNumber.countryCallingCode === '86' && phoneNumber.nationalNumber.length !== 11)) {
                    // this.onQRCode();
                    this.setState({ isPhoneNumberSendAvailable: true });
                    return;
                }
            }
        }
        this.setState({ isPhoneNumberSendAvailable: false });
    };

    handleChangeSmsCode = e => {
        if (this.state.codeSubmitStatus === 'submitting') return;
        let res = e.target.value;
        e.stopPropagation();

        if (res.length > 4) {
            res = String(res).substr(0, 4);
        }

        this.setState({
            smsCode: res,
            showPhoneArrow: true,
            isBlured: -1,
        });

        if (res.length === 4) {
            this.setState({ codeSubmitStatus: 'submitting' });
            setTimeout(() => this.onSendCode(), 1000);
        } else if (res.length < 4) {
            this.setState({ codeSubmitStatus: 'none' });
        }
    };

    removeUselessInPhone(number) {
        number = number.replace(/_/g, '');
        number = number.replace(/-/g, '');
        number = number.replace(/\(/g, '');
        number = number.replace(/\)/g, '');
        number = number.replace(/\s/g, '');
        return number;
    }

    getFormattedPhoneNumber(inputNumber, iso = null) {
        let { egNumber } = this.state;
        if (iso) egNumber = this.getExampleNumber(iso);
        let globalNumber = new AsYouType().input(inputNumber[0] === '+' ? inputNumber : '+' + inputNumber);
        let splits = globalNumber.split(' ');
        if (splits.length > 2) {
            splits[1] = `(${splits[1]})`;
        }
        const firstFilter = splits.join(' ');
        let secondFilter = firstFilter.split(') ');
        let response = secondFilter[0];
        if (secondFilter.length > 1) {
            response = response + ') ' + secondFilter[1].split(' ').join('-');
        }
        response = response.split(' ');
        response[0] = `+${getCountryCallingCode(iso || this.state.countryCode)}`;
        response = response.join(' ');

        return this.getMixedPhoneNumber(response, egNumber);
    }

    getMixedPhoneNumber(phone, placeholder) {
        phone = phone.split(`+${getCountryCallingCode(this.state.countryCode)}`)[1];
        if (!phone) {
            this.setState({ selectionStart: getCountryCallingCode(this.state.countryCode).length + 3 });
            return placeholder;
        }
        phone = phone.replace(/\s/g, '');
        phone = phone.replace(/\+/g, '');
        phone = phone.replace(/\(/g, '');
        phone = phone.replace(/\)/g, '');
        phone = phone.replace(/-/g, '');
        phone = phone.split('');
        placeholder = placeholder.split('');
        let phoneIndex = 0, i;
        for (i = 0; i < placeholder.length; i ++) {
            placeholder[i] = placeholder[i] === '_' ? phone[phoneIndex ++] : placeholder[i];
            if (phoneIndex === phone.length)
                break;
        }
        this.setState({ selectionStart: i + 1 });
        return placeholder.join('');
    }

    getPlaceholderText() {
        const { phoneSubmitStatus } = this.state;
        if (phoneSubmitStatus === 'submitting') return '';
        return phoneSubmitStatus === 'submitted' || phoneSubmitStatus === 'resend' ? 'Confirmation code' : 'Mobile Number';
    }

    containerClass() {
        // if (this.showCodeInput()) {
        //     return 'input-bar-containers shadow';
        // }
        return 'input-bar-containers shadow';
    }

    phoneContainerClass() {
        const { loading, unloadPhoneInput } = this.state;

        if (loading) {
            if (unloadPhoneInput) {
                return 'input-bar load unload';
            }
            return 'input-bar load';
        }
        return 'input-bar load';
    }

    phoneSubmitIconUrl() {
        const {
            phoneSubmitStatus,
            unloadCodeInput,
        } = this.state;
        const mainIcon = this.getSMSTypeIcon();

        if (phoneSubmitStatus === 'submitted' && unloadCodeInput) {
            return mainIcon;
        }
        if (phoneSubmitStatus === 'submitting') {
            return 'spinner';
        }
        return mainIcon;
    }

    codeSubmitIconUrl() {
        const { codeSubmitStatus } = this.state;
        const mainIcon = this.getSMSTypeIcon();

        if (codeSubmitStatus === 'submitting') {
            return 'spinner';
        }
        return mainIcon;
    }

    phoneSubmitIconClass() {
        const {
            phoneSubmitStatus,
            unloadPhoneInput,
            showPhoneArrow,
            scanned,
        } = this.state;

        if (scanned !== 'failed') {
            if (showPhoneArrow) {
                return 'qr-code-container arrow';
            }
            return 'qr-code-container money';
        }

        if (phoneSubmitStatus === 'submitted') {
            if (!unloadPhoneInput) {
                return 'qr-code-container none';
            }
            return 'qr-code-container';
        }
        if (phoneSubmitStatus === 'submitting') {
            return 'qr-code-container spinner';
        }
        if (showPhoneArrow) {
            return 'qr-code-container flag';
        }
        return 'qr-code-container flag';
    }

    codeSubmitIconClass() {
        const { codeSubmitStatus, showPhoneArrow } = this.state;

        if (codeSubmitStatus === 'submitted') {
            return 'qr-code-container arrow';
        }
        if (codeSubmitStatus === 'submitting') {
            return 'qr-code-container spinner';
        }
        if (showPhoneArrow) {
            return 'qr-code-container none';
        }
        return 'qr-code-container not-changed';
    }

    showCodeInput() {
        // return true;
        return this.state.phoneSubmitStatus === 'submitted';
    }

    hidePhoneInput() {
        this.setState({ unloadPhoneInput: true });
    }

    render() {
        const {
            error,
            scanned,
            smsCode,
            countryCode,
            phoneNumber,
            phoneSubmitStatus,
            codeSubmitStatus,
            codeInputAnimation,
            claimStatus,
            isSMSShowing,
            isScanShowing,
            isCountrySelectShowing,
            isPhoneNumberSendAvailable,
        } = this.state;

        const {
            placeholderText,
        } = this.props;

        return (
            <Main onClick={(e) => this.onClose(e)} onBlur={this.onBlur}>
                {isScanShowing && (
                    <div className="input-bar-containers qr-scanner" onClick={(e) => this.onBoxClick(e)}>
                        <div className="input-bar-container qr-scanner">
                            <div
                                className={`input-bar qr-scanner ${claimStatus}`}
                                style={{borderBottom: '1.51px solid white'}}
                                onClick={() => {
                                    if(scanned !== 'loading' && claimStatus === 'error') {
                                        this.onResetReceivePayment();
                                    }
                                }}
                            >
                                {(scanned !== 'accept' && (claimStatus === '' || claimStatus === 'rejected'))  && (
                                    <InputCircle
                                        style={scanned === 'loading' ? { opacity: 0 } : { opacity: 1 }}
                                        className="left"
                                        borderColor="rgba(237,28,36,0.25)"
                                        onClick={(e) => {
                                            if(claimStatus === '') {
                                                this.onScanReject();
                                            }
                                        }}
                                    >
                                        <img src={rejectIcon} alt="" style={{ width: '60%' }} />
                                    </InputCircle>
                                )}

                                <div className={`scanned-balance ${claimStatus}`}>
                                    {claimStatus === 'claiming' && (
                                        `+$${placeholderText.toLocaleString()}`
                                    )}
                                    {(claimStatus === '' || claimStatus === 'progress' || claimStatus === 'rejecting') && (
                                        `$${placeholderText.toLocaleString()}`
                                    )}
                                </div>

                                {(scanned === 'loading' || claimStatus === 'progress' || claimStatus === 'rejecting') && (
                                    <SMLoadingSpinner className={(claimStatus === 'rejecting' ? 'left' : '')}>
                                        <img src={`${process.env.PUBLIC_URL}/img/gold_certificate.png`} alt="" />
                                    </SMLoadingSpinner>
                                )}

                                {scanned !== 'loading' && claimStatus === '' && (
                                    <InputCircle
                                        className="right"
                                        borderColor="rgba(0,174,83,0.25)"
                                        onClick={() => this.onScanAccept()}
                                    >
                                        <img src={acceptIcon} alt="" style={{ width: '60%' }} />
                                    </InputCircle>
                                )}

                                {scanned !== 'loading' && (claimStatus === 'claiming' || claimStatus === 'claimed') && (
                                    <InputCircle
                                        className="right"
                                        borderColor="#00AE5340"
                                    >
                                        <img src={receiveIcon} alt="" style={{ width: '60%' }} />
                                    </InputCircle>
                                )}

                                {scanned !== 'loading' && claimStatus === 'error' && (
                                    <InputCircle
                                        className="mid"
                                        borderColor="rgba(237, 28, 36, 0.5)"
                                        onClick={() => this.onResetReceivePayment()}
                                    >
                                        <img src={receiveErrorIcon} alt="" style={{ width: '60%', paddingBottom: '5px' }} />
                                    </InputCircle>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {isSMSShowing && error && (
                    <div
                        className="input-bar-containers error"
                        onClick={e => this.onBoxClick(e)}
                    >
                        <div className="input-bar-container">
                            <div className="input-bar load error-form">
                                <InputCircle
                                    className="mid"
                                    borderColor="rgba(237, 28, 36, 0.5)"
                                >
                                    <img src={receiveErrorIcon} alt="" style={{ width: '60%', paddingBottom: '5px' }} />
                                </InputCircle>
                            </div>
                        </div>
                    </div>
                )}

                {isSMSShowing && !error && isCountrySelectShowing && this.props.countries && (
                    <CountrySelect>
                        {this.props.countries.map(item => {
                            return (
                                <CountrySelectItem key={item.iso} onClick={e => this.onClickCountry(e, item.iso)}>
                                    <div className="d-flex align-items-center">
                                        <ReactCountryFlag code={item.iso} svg></ReactCountryFlag>
                                        <h1>{item.name}</h1>
                                    </div>

                                    <h1>{`+${item.callCode}`}</h1>
                                </CountrySelectItem>
                            );
                        })}
                    </CountrySelect>
                )}

                {isSMSShowing && !error && (
                    <div className={this.containerClass()}>
                        <div className="input-bar-container">
                            <div className={this.phoneContainerClass()} onClick={(e) => this.onBoxClick(e)}>
                                <input
                                    type="tel"
                                    className={`number-input ${phoneSubmitStatus}`}
                                    id="phoneInput"
                                    onChange={this.handleChangePhoneNumber}
                                    value={phoneNumber}
                                    onClick={e => this.onClickPhoneNumber(e)}
                                    onKeyUp={(e) => {
                                        if (e.key === 'Enter') {
                                            this.resendPhoneNumber(e);
                                        }
                                    }}
                                    onKeyPress={(e) => this.onInputChange(e)}
                                    ref={ref => {
                                        this.phoneInputRef = ref;
                                    }}
                                />
                            </div>
                        </div>
                        <div className="input-bar-container">
                            <div
                                className="input-bar load"
                                onClick={(e) => this.onBoxClick(e)}
                                style={
                                    smsCode === ''
                                        ? {
                                            paddingLeft: '2.5rem',
                                            paddingRight: '2.5rem',
                                        }
                                        : { }}
                            >
                                <input
                                    type="tel"
                                    name="sms-code"
                                    id="codeInput"
                                    className={'number-input sms-code ' + codeSubmitStatus}
                                    style={
                                        smsCode === ''
                                            ? {
                                                textAlign: 'left',
                                            }
                                            : { textAlign: 'center' }}
                                    value={smsCode}
                                    onChange={this.handleChangeSmsCode}
                                    placeholder={this.getPlaceholderText()}
                                    onKeyUp={e => {
                                        if (e.key === 'Enter') {
                                            this.onSendCode(e);
                                        }
                                    }}
                                    maxLength={4}
                                    ref={ref => {
                                        this.codeInputRef = ref;
                                    }}
                                    disabled={(phoneSubmitStatus !== 'submitted' && phoneSubmitStatus !== 'submitting' && phoneSubmitStatus !== 'resend')}
                                />
                            </div>

                            {(this.codeSubmitIconUrl() === 'spinner' || this.phoneSubmitIconUrl() === 'spinner') && (
                                <SMLoadingSpinner>
                                    <img src={`${process.env.PUBLIC_URL}/img/gold_certificate.png`} alt="" />
                                </SMLoadingSpinner>
                            )}
                            {this.codeSubmitIconUrl() !== 'spinner' && (phoneSubmitStatus === 'submitted' || phoneSubmitStatus === 'resend') && (
                                <div className="main-icon" onClick={e => this.resendPhoneNumber(e)}>
                                    <img
                                        src={this.codeSubmitIconUrl()}
                                        alt=""
                                    />
                                </div>
                            )}
                            {this.phoneSubmitIconUrl() !== 'spinner' && phoneSubmitStatus !== 'submitted' && phoneSubmitStatus !== 'resend' && (
                                (isPhoneNumberSendAvailable ? (
                                    <div className="to-sms-icon" onClick={e => this.resendPhoneNumber(e)}>
                                        <img
                                            src={arrowIcon}
                                            alt=""
                                        />
                                    </div>
                                ) : (
                                    <div className="flag" onClick={e => this.onCountrySelect(e)}>
                                        <ReactCountryFlag code={countryCode} svg></ReactCountryFlag>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

            </Main>
        );
    }
}

export default compose(
    withRouter,
    withSafeTimeout,
    inject(
        STORE_KEYS.SENDCOINSTORE,
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.SMSAUTHSTORE
    ),
    observer,
    withProps(
        (
            {
                [STORE_KEYS.YOURACCOUNTSTORE]: {
                    PortfolioUSDTValue,
                },
            }
        ) => ({
            PortfolioUSDTValue,
        })
    )
)(SMSVerificationForm);
