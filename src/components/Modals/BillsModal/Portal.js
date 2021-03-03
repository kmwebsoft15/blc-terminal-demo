import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '../../../stores';
import { convertToFloat, customDigitFormat, toFixedWithoutRounding } from '../../../utils';
import { valueNormalized } from '../../../stores/utils/OrderEntryUtils';
import {
    ChangeDeposit,
    Close,
    Icon,
    PortalInnerWrapper,
    PortalWrapper,
    WithdrawInfo,
    ContentWrapper
} from './Components';
import BillsInner from './BillsInner';

import imgX from '../../../components-generic/Modal/x.svg';

class Portal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            withdrawAddress: '',
            amount: convertToFloat(props.balance),
            isDeposit: false,
            isOpen: props.isOpen,
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (state.isOpen !== props.isOpen) {
            if (props.isOpen && !state.isDeposit) {
                return {
                    isOpen: props.isOpen,
                    isDeposit: true,
                };
            }
            return {
                isOpen: props.isOpen,
            };
        }
        return null;
    }

    changeDepositMode = () => {
        this.setState(prevState => ({
            isDeposit: !prevState.isDeposit,
        }));
    };

    closePopup = () => {
        const { withdrawAddress, setWithdrawAddress, onClosePopup } = this.props;
        if (withdrawAddress !== this.state.withdrawAddress) {
            setWithdrawAddress(this.state.withdrawAddress);
        }
        onClosePopup();
    };

    handleChange = field => value => {
        this.setState({
            [field]: value,
        });
    };

    handleAmountChange = value => {
        const valueParsed = Number.parseFloat(value);
        const { amount } = this.state;
        const { balance } = this.props;

        if (valueParsed > balance) {
            return;
        }

        let oldValue = String(amount);
        let newValue = valueNormalized(oldValue, value);

        if (this.props.setWithdrawAmount) {
            this.props.setWithdrawAmount(newValue || 0);
        }

        this.setState({
            amount: newValue || 0,
        });
    };

    render() {
        const {
            withdrawAddress,
            amount,
            isDeposit,
        } = this.state;

        const {
            width,
            height,
            padding,
            isOpen,
            coinDepositAddress,
            position,
            symbol,
            isReceivedUserBills,
            listUserBills,
            currentFiatPrice,
            orderForm,
            totalPrice,
            isCoinPairInversed,
            isDefaultCrypto,
        } = this.props;

        // Set center position to render decimal point in cold storage table (BillsInner)
        let centerPos = 9;
        const count = Math.log10(position);
        if (count > 5) {
            centerPos = count + 1;
        }

        // 16 total amount of columns in cold storage table (BillsInner)
        const newPosition = toFixedWithoutRounding(position.toFixed(20), 16 - centerPos);
        const balance = parseFloat(newPosition);
        const newDeno = centerPos - 1;

        const selected = symbol ? {
            symbol,
            publicAddress: coinDepositAddress,
            serial: '',
            deno: centerPos - 1,
            level: 0,
        } : null;

        const filled = orderForm.amount * (isCoinPairInversed ? currentFiatPrice : 1);
        const total = totalPrice * (!isCoinPairInversed ? currentFiatPrice : 1);
        const estFilled = !isCoinPairInversed ? filled : total;
        const estTotal = !isCoinPairInversed ? total : filled;

        return (
            <ContentWrapper ref={ref => this.props.getInnerRef(ref)}>
                <PortalWrapper
                    width={width}
                    height={height}
                    margin={padding}
                >
                    <PortalInnerWrapper className={isDeposit ? '' : 'flip'}>
                        <WithdrawInfo className="deposit-info">
                            <BillsInner
                                width={width}
                                height={height}
                                padding={padding}
                                selected={selected}
                                isDeposit={true}
                                symbol={symbol}
                                balance={balance}
                                withdrawAddress={withdrawAddress}
                                handleChange={this.handleChange}
                                amount={amount}
                                handleAmountChange={this.handleAmountChange}
                                estFilled={estFilled}
                                estTotal={estTotal}
                                isDefaultCrypto={isDefaultCrypto}
                            />
                        </WithdrawInfo>

                        <WithdrawInfo className="withdraw-info">
                            <BillsInner
                                width={width}
                                height={height}
                                padding={padding}
                                isDeposit={false}
                                symbol={symbol}
                                balance={balance}
                                newDeno={newDeno}
                                isReceivedUserBills={isReceivedUserBills}
                                listUserBills={listUserBills}
                            />
                        </WithdrawInfo>
                    </PortalInnerWrapper>

                    <ChangeDeposit
                        isDeposit={isDeposit}
                        onClick={this.changeDepositMode}
                    />

                    {isOpen && (
                        <Close onClick={this.closePopup}>
                            <Icon src={imgX} />
                        </Close>
                    )}
                </PortalWrapper>
            </ContentWrapper>
        );
    }
}

const withStore = compose(
    inject(
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.BILLSMODALSTORE,
        STORE_KEYS.ORDERENTRY,
        STORE_KEYS.LOWESTEXCHANGESTORE,
        STORE_KEYS.ORDERBOOK,
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.SETTINGSSTORE]: {
                withdrawAddress,
                setWithdrawAddress,
                price: currentFiatPrice,
            },
            [STORE_KEYS.BILLSMODALSTORE]: {
                onClosePopup,
            },
            [STORE_KEYS.ORDERENTRY]: {
                CoinsPairSearchMarketOrderBuyForm: orderForm,
            },
            [STORE_KEYS.LOWESTEXCHANGESTORE]: {
                totalPrice,
            },
            [STORE_KEYS.ORDERBOOK]: {
                isCoinPairInversed,
            },
        }) => ({
            withdrawAddress,
            setWithdrawAddress,
            currentFiatPrice,
            onClosePopup,
            orderForm,
            totalPrice,
            isCoinPairInversed,
        })
    )
);

export default withStore(Portal);
