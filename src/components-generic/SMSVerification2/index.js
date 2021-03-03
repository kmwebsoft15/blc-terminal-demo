import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import Cookies from 'universal-cookie';
import { formatPhoneNumber, formatPhoneNumberIntl } from 'react-phone-number-input';
import { withSafeTimeout } from '@hocs/safe-timers';
import { compose } from 'recompose';
import {
    Wrapper,
    InputWrapper,
    Input,
    InputAddon,
    // SendIcon,
    SpinnerIcon,
    PhoneIcon,
    SendIcon2
} from './Components';
import { STORE_KEYS } from '../../stores';

const SMS_AUTH_VIEW_STEPS = {
    ENTER_PHONE_NUMBER: 'enter-phone-number',
    ENTER_CODE: 'enter-code',
    VERIFY_SUCCESS: 'verify-success',
};

class SMSVerification extends Component {
    state = {
        currentView: SMS_AUTH_VIEW_STEPS.ENTER_PHONE_NUMBER,
        phoneNumber: '',
        code: '',
        isSendingPhoneNumber: false,
        isPhoneNumberSent: false,
        isSendingCode: false,
        isCodeSent: false,
    };
    codeInput = React.createRef();
    clearConfirmAuthCodeHandleTimeout = null;
    clearConfirmAuthCodeInnerHandleTimeout = null;

    componentDidMount() {
        const cookies = new Cookies();
        let phoneNum = this.getInternationPhoneNumberFormat(cookies.get('phoneNumber') || '');
        this.setState({ phoneNumber: phoneNum });
    }

    componentWillUnmount() {
        if (this.clearConfirmAuthCodeHandleTimeout) {
            this.clearConfirmAuthCodeHandleTimeout();
        }
        if (this.clearConfirmAuthCodeInnerHandleTimeout) {
            this.clearConfirmAuthCodeInnerHandleTimeout();
        }
    }

    getInternationPhoneNumberFormat = value => {
        let intFormatValue = '';
        if (value.includes('+')) {
            intFormatValue = formatPhoneNumberIntl(value);
        } else {
            intFormatValue = formatPhoneNumberIntl('+' + value);
        }

        if (intFormatValue.length === 0) {
            intFormatValue = value;
        }
        return intFormatValue;
    }

    handleChangePhoneNumber = e => {
        e.stopPropagation();
        let phoneNum = this.getInternationPhoneNumberFormat(e.target.value);
        this.setState({
            phoneNumber: phoneNum,
            code: '',
            isPhoneNumberSent: false,
        });
    };

    handleChangeCode = e => {
        e.stopPropagation();
        this.setState({
            code: e.target.value,
        }, () => {
            const { code: securityCode } = this.state;
            if (securityCode.length < 4) return;
            const { confirmAuthCode } = this.props[STORE_KEYS.SMSAUTHSTORE];

            this.setState({
                isSendingCode: true,
            });

            confirmAuthCode(securityCode)
                .then(() => {
                    if (this.clearConfirmAuthCodeHandleTimeout) {
                        this.clearConfirmAuthCodeHandleTimeout();
                    }
                    this.clearConfirmAuthCodeHandleTimeout = this.props.setSafeTimeout(() => {
                        this.setState({
                            isCodeSent: true,
                            isSendingCode: false,
                            currentView: SMS_AUTH_VIEW_STEPS.VERIFY_SUCCESS,
                        });

                        if (this.clearConfirmAuthCodeInnerHandleTimeout) {
                            this.clearConfirmAuthCodeInnerHandleTimeout();
                        }
                        this.clearConfirmAuthCodeInnerHandleTimeout = this.props.setSafeTimeout(() => {
                            const {
                                [STORE_KEYS.YOURACCOUNTSTORE]: yourAccountStore,
                                [STORE_KEYS.LOWESTEXCHANGESTORE]: lowestExchangeStore,
                                [STORE_KEYS.TELEGRAMSTORE]: telegramStore,
                                [STORE_KEYS.ORDERHISTORY]: orderHistoryStore,
                                onClose,
                            } = this.props;
                            const mockUser = {
                                id: '1020',
                                username: '',
                                first_name: 'SMS',
                                last_name: 'User',
                            };

                            telegramStore.initByTelegramLogin();
                            orderHistoryStore.requestOrderHistory();
                            yourAccountStore.requestPositionWithReply();
                            lowestExchangeStore.requestOrderEvents();
                            telegramStore.loginFinishWith(mockUser);

                            if (onClose) {
                                onClose();
                            }
                        }, 500);
                    }, 500);
                })
                .catch(err => {
                    this.setState({
                        isSendingCode: false,
                    });
                });
        });
    };

    handleSendPhoneNumber = e => {
        e.stopPropagation();
        const { requestAuthCode } = this.props[STORE_KEYS.SMSAUTHSTORE];
        const { phoneNumber } = this.state;
        let phoneNumberTrimed = phoneNumber.replace(/\s+/g, '');
        phoneNumberTrimed = '+' + phoneNumberTrimed.replace(/\+/g, '');

        this.setState({
            isSendingPhoneNumber: true,
        });

        requestAuthCode(phoneNumberTrimed).then(() => {
            this.setState({
                isPhoneNumberSent: true,
                isSendingPhoneNumber: false,
                currentView: SMS_AUTH_VIEW_STEPS.ENTER_CODE,
            }, () => {
                this.codeInput.current.focus();
            });
        }).catch(err => {
            this.setState({
                isSendingPhoneNumber: false,
            });
        });
    };

    handleGoBack = () => {
        this.setState({
            isPhoneNumberSent: false,
            isSendingPhoneNumber: false,
            currentView: SMS_AUTH_VIEW_STEPS.ENTER_PHONE_NUMBER,
        });
    };

    render() {
        const {
            currentView,
            phoneNumber,
            code,
            isPhoneNumberSent,
            isSendingPhoneNumber,
            isCodeSent,
            isSendingCode,
        } = this.state;

        const { handleBack } = this.props;

        return (
            <Wrapper>
                <InputWrapper className="phone-number-input">
                    <FormattedMessage
                        id="sms_verification.label_enter_mobile_number"
                        defaultMessage="Enter Mobile Phone Number"
                    >
                        {placeholder =>
                            <Input
                                type="tel"
                                placeholder={placeholder}
                                value={phoneNumber}
                                onChange={this.handleChangePhoneNumber}
                                readOnly={isSendingPhoneNumber || isSendingCode || isCodeSent}
                            />
                        }
                    </FormattedMessage>

                    {!isPhoneNumberSent && (
                        <InputAddon onClick={!phoneNumber ? handleBack : (isSendingPhoneNumber ? null : this.handleSendPhoneNumber)}>
                            {!phoneNumber ? (
                                <PhoneIcon/>
                            ) : (
                                isSendingPhoneNumber
                                    ? <SpinnerIcon />
                                    : <SendIcon2 />
                            )}
                        </InputAddon>
                    )}
                </InputWrapper>

                {isPhoneNumberSent &&
                <InputWrapper className={`code-input ${currentView}`}>
                    <FormattedMessage
                        id="sms_verification.label_what_code"
                        defaultMessage="What is the code?"
                    >
                        {placeholder =>
                            <Input
                                type="number"
                                ref={this.codeInput}
                                placeholder={placeholder}
                                value={code}
                                onChange={this.handleChangeCode}
                                readOnly={!isPhoneNumberSent || isSendingPhoneNumber || isSendingCode || isCodeSent}
                            />
                        }
                    </FormattedMessage>

                    {(code && !isCodeSent) ? (
                        isSendingCode &&
                        <InputAddon>
                            <SpinnerIcon />
                        </InputAddon>
                    ) : (
                        <InputAddon onClick={this.handleGoBack}>
                            <svg className="sprite-icon close" role="img" aria-hidden="true">
                                <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="img/sprite-basic.svg#arrow-drop-close" />
                            </svg>
                        </InputAddon>
                    )}
                </InputWrapper>
                }
            </Wrapper>
        );
    }
}

const enhanced = compose(
    withSafeTimeout,
    inject(
        STORE_KEYS.SMSAUTHSTORE,
        STORE_KEYS.TELEGRAMSTORE,
        STORE_KEYS.ORDERHISTORY,
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.LOWESTEXCHANGESTORE
    ),
    observer,
);

export default enhanced(SMSVerification);
