import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { withSafeTimeout } from '@hocs/safe-timers';

import { STORE_KEYS } from '../../../stores';

import {
    Wrapper,
    CreditSection,
    CvcWrapper,
    Label,
    IconVisa,
    Text,
    Error
} from './Components';
import { InputField, InputFieldGroup, InputFieldAddon } from './InputField';
import CheckField from './CheckField';
import GradientButton from '../../../components-generic/GradientButtonSquare';
import AddFundsConfirmModal from './AddFundsConfirmModal';
import TermsModal from '../TermsModal';

import imgIconVisa from './icon-visa.svg';
import DataLoader from '../../../components-generic/DataLoader';

const enchanced = compose(
    inject(STORE_KEYS.MODALSTORE, STORE_KEYS.PAYMENTSTORE),
    observer,
    withSafeTimeout,
    withProps(
        ({
            [STORE_KEYS.MODALSTORE]: {
                Modal,
                onClose,
            },
            [STORE_KEYS.PAYMENTSTORE]: {
                sendPaymentRequest,
            },
        }) => ({
            Modal,
            onClose,
            sendPaymentRequest,
        })
    )
);

const addFundsConfirmModal = (Modal, portal, additionalVerticalSpace) => Modal({
    portal,
    additionalVerticalSpace,
    ModalComponentFn: () => <AddFundsConfirmModal/>,
});

class AddFundsModal extends Component {
    state = {
        name: '',
        nameError: null,
        number: '',
        numberError: null,
        expDate: '',
        expDateError: null,
        cvc: '',
        cvcError: null,
        isAgreeTerms: false,
        termsError: null,
        isTermsModalOpen: false,
        isInProgress: false,
    };

    clearHandleConfirmBtnTimeout = null;

    componentWillUnmount() {
        if (this.clearHandleConfirmBtnTimeout) {
            this.clearHandleConfirmBtnTimeout();
        }
    }

    changeValue = field => value => {
        this.setState({
            [field]: value,
        });
    };

    toggleTermsModal = () => {
        this.setState(prevState => ({
            isTermsModalOpen: !prevState.isTermsModalOpen,
        }));
    };

    handleConfirmBtn = () => {
        const {
            Modal,
            portal,
            sendPaymentRequest,
            setSafeTimeout,
        } = this.props;

        // validation
        const {
            name, number, expDate, cvc, isAgreeTerms,
        } = this.state;

        let expDateError = null;
        let numberError = null;
        let nameError = null;
        let cvcError = null;
        let termsError = null;
        const currentDate = new Date();
        const expDateMonthCheck = (currentDate.getMonth() + 1);
        const expDateYearCheck = parseInt(currentDate.getFullYear().toString().substr(2, 2));
        const expDateMonth = expDate.substr(0, 2).length !== 0 ? parseInt(expDate.substr(0, 2)) : 0;
        const expDateYear = expDate.substr(3, 4).length !== 0 ? parseInt(expDate.substr(3, 4)) : 0;

        if (name.trim().length === 0) {
            nameError = '- Name must be filled in';
        }

        if (expDateYear === 0 || expDateMonth === 0 || expDateYear < expDateYearCheck || expDateMonth <= expDateMonthCheck || expDateMonth > 12 || ((expDateYear === expDateYearCheck) && (expDateMonth < expDateMonthCheck))) {
            expDateError = '- Card Expired';
        }

        if (number.trim().length !== 16) {
            numberError = '- Card number invalid';
        }

        if (cvc.trim().length !== 3) {
            cvcError = '- CVV/CVC Invalid length';
        }

        if (!isAgreeTerms) {
            termsError = '- You must accept Terms';
        }

        this.setState({
            nameError,
            expDateError,
            numberError,
            cvcError,
            termsError,
        });

        if (expDateError !== null || numberError !== null || nameError !== null || cvcError !== null) {
            return;
        }

        this.setState({
            isInProgress: true,
        });

        if (this.clearHandleConfirmBtnTimeout) {
            this.clearHandleConfirmBtnTimeout();
        }
        this.clearHandleConfirmBtnTimeout = setSafeTimeout(() => {
            // connect mobx store to connect backend
            sendPaymentRequest('visa', name.trim(), number.trim(), expDate.trim(), cvc.trim());
            addFundsConfirmModal(Modal, portal || 'graph-chart-parent', true);
        }, 2000);
    };

    render() {
        const {
            Modal,
            heading1 = '$1,000 PAYMENT',
            heading2 = 'with Credit Card',
            portal,
        } = this.props;

        const {
            name, number, expDate, cvc, isAgreeTerms, isTermsModalOpen, isInProgress,
        } = this.state;

        return (
            <Wrapper>
                <Label>
                    <span className="heading1">
                        {heading1}
                    </span>
                    <span className="heading2">
                        {heading2}
                    </span>
                </Label>
                <CreditSection>
                    <InputField
                        className="add-funds-name-input-field"
                        label="Name on Card"
                        placeholder="John Wave"
                        value={name}
                        readOnly={false}
                        changeValue={this.changeValue('name')}
                    />

                    <InputFieldGroup>
                        <InputField
                            label="Card Number"
                            placeholder="4242 4242 4242 4242"
                            value={number}
                            readOnly={false}
                            changeValue={this.changeValue('number')}
                        />
                        <InputFieldAddon>
                            <IconVisa src={imgIconVisa}/>
                        </InputFieldAddon>
                    </InputFieldGroup>

                    <CvcWrapper>
                        <InputField
                            className="horizontal-input-fields"
                            label="Exp. Date"
                            placeholder="10/16"
                            value={expDate}
                            readOnly={false}
                            changeValue={this.changeValue('expDate')}
                        />

                        <InputField
                            className="horizontal-input-fields"
                            label="CVV/CVC"
                            placeholder="123"
                            value={cvc}
                            readOnly={false}
                            changeValue={this.changeValue('cvc')}
                        />
                    </CvcWrapper>

                    <Text>
                        <FormattedMessage
                            id="your_account.add_funds_modal.agree_terms1"
                            defaultMessage="I agree with"
                        />&nbsp;
                        <span onClick={this.toggleTermsModal}>
                            <FormattedMessage
                                id="your_account.add_funds_modal.agree_terms2"
                                defaultMessage="Terms"
                            />
                        </span>
                        <CheckField
                            label=" "
                            isChecked={isAgreeTerms}
                            onChange={this.changeValue('isAgreeTerms')}
                        />
                    </Text>

                    {this.state.nameError && <Error>{this.state.nameError}</Error>}
                    {this.state.numberError && <Error>{this.state.numberError}</Error>}
                    {this.state.expDateError && <Error>{this.state.expDateError}</Error>}
                    {this.state.cvcError && <Error>{this.state.cvcError}</Error>}
                    {this.state.termsError && <Error>{this.state.termsError}</Error>}

                    <GradientButton
                        className="primary-solid confirm-button"
                        height={60}
                        disabled={isInProgress}
                        onClick={() => {
                            if (!isInProgress) {
                                this.handleConfirmBtn();
                            }
                        }}
                    >
                        {isInProgress
                            ? (
                                <DataLoader/>
                            )
                            : (
                                <span className="btn-text">
                                    <FormattedMessage
                                        id="your_account.add_funds_modal.label_confirm"
                                        defaultMessage="CONFIRM"
                                    />
                                </span>
                            )
                        }
                    </GradientButton>
                </CreditSection>
                {isTermsModalOpen && <TermsModal show={this.toggleTermsModal}/>}
            </Wrapper>
        );
    }
}

export default enchanced(AddFundsModal);
