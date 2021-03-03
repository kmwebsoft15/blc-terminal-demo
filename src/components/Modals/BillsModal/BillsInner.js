import React from 'react';

import { toFixedWithoutRounding } from '../../../utils';
import BillChip from './BillChip';
import BillDetail from './BillDetail';
import {
    OuterWrapper,
    BillLine,
    BillsInnerWrapper,
    BillsWrapper,
    BalanceCol,
    BillDetailWrapper,
    InputAddon,
    InputFieldWrapper
} from './Components';
import BalanceInCurrency from './BalanceInCurrency';
import InputField from './InputField';
import SliderInput from './SliderInput';
import DataLoader from '@/components-generic/DataLoader';

class BillsInner extends React.Component {
    state = {
        selected: this.props.isDeposit ? this.props.selected : null,
        symbol: this.props.symbol,
    };

    static getDerivedStateFromProps(props, state) {
        if (props.isDeposit) {
            if (state.selected !== props.selected) {
                return {
                    selected: props.selected,
                };
            }
        } else if (state.symbol !== props.symbol) {
            return {
                symbol: props.symbol,
                selected: null,
            };
        }
        return null;
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (
            this.state.selected &&
            this.billDetailRef &&
            this.billDetailRef.contains &&
            !this.billDetailRef.contains(event.target)
        ) {
            this.closeDetail();
        }
    };

    getInnerRef = ref => this.billDetailRef = ref;

    closeDetail = () => {
        if (!this.props.isDeposit) {
            this.setState({
                selected: null,
            });
        }
    };

    handleInputClick = (e) => {
        e.stopPropagation();
    };

    handleChipClick = (level, symbol, deno, publicAddress, serial, disabled) => () => {
        this.setState({
            selected: {
                level,
                symbol,
                deno,
                publicAddress,
                serial,
                disabled,
            },
        });
    }

    render() {
        const { selected } = this.state;
        const {
            width,
            height,
            padding,
            isDeposit,
            symbol,
            balance,
            newDeno,
            isReceivedUserBills,
            listUserBills,
            withdrawAddress,
            handleChange,
            amount,
            handleAmountChange,
            isFromMarketModal = false,
            estFilled,
            estTotal,
            isDefaultCrypto,
        } = this.props;

        const h = 850;
        const scale = (height || 55) / (h || 852);
        const w = Math.floor(width / scale);
        let bills = [];
        let chipHeight;

        if (!isDeposit) {
            const row = 16;
            const col = 9;
            let chip = {};

            chipHeight = Math.floor((h - 32 - 10 * (col - 1)) / col);
            const newHeight = chipHeight * col + 10 * (col - 1);
            const lineWidth = Math.floor((w - 150) / 16);

            const balanceStr = balance.toString().split('.');
            let backPos = newDeno;
            if (balanceStr.length > 1 && balanceStr[1].length) {
                backPos += balanceStr[1].length;
            } else if (balanceStr.length > 0 && balanceStr[0].length) {
                backPos += balanceStr[0].length;
            }

            for (let i = 0; i < row; i++) {
                chip.level = i;
                chip.symbol = symbol;
                chip.deno = newDeno - i;
                const nominal = (chip.deno > -4)
                    ? Math.pow(10, chip.deno)
                    : (1 / Math.pow(10, -(chip.deno)));

                let curColBalance = Math.floor((balance / nominal) % 10);
                if (typeof curColBalance === 'undefined' || Number.isNaN(curColBalance)) {
                    curColBalance = 0;
                }

                let startPos = 0;
                for (let k = 0; k < listUserBills.length; k++) {
                    if (listUserBills[k].Nominal === nominal) {
                        startPos = k;
                        break;
                    }
                }

                let singleBill = [];
                for (let j = 0; j < col; j++) {
                    const disabled = j >= curColBalance;

                    if (!disabled) {
                        if (listUserBills.length > (startPos + j) && listUserBills[startPos + j].Nominal === nominal) {
                            chip.publicAddress = listUserBills[startPos + j].Address;
                            chip.serial = listUserBills[startPos + j].Serial;
                        }
                    }

                    chip.disabled = disabled || !chip.publicAddress;

                    singleBill.push(
                        <BillChip
                            key={`balance-col-${i}-row-${j}`}
                            level={i}
                            symbol={symbol}
                            deno={chip.deno}
                            publicAddress={chip.publicAddress}
                            serial={chip.serial}
                            disabled={chip.disabled}
                            onClick={this.handleChipClick(chip.level, symbol, chip.deno, chip.publicAddress, chip.serial, chip.disabled)}
                        />
                    );
                }

                singleBill.push(
                    <BalanceCol
                        key={`balance-line-${i}`}
                        active={newDeno === i}
                        isShowComma={(newDeno > i) && (balance >= Math.pow(10, chip.deno)) && ((chip.deno) % 3 === 0)}
                        isTransparent={balance < Math.pow(10, chip.deno) || (i > backPos)}
                        height={chipHeight}
                        isFromMarketModal={isFromMarketModal}
                        onClick={this.handleChipClick(chip.level, symbol, chip.deno, chip.publicAddress, chip.serial, chip.disabled)}
                    >
                        {curColBalance}
                    </BalanceCol>
                );

                bills.push(
                    <BillLine
                        key={`balance-col-${i}`}
                        width={lineWidth}
                        height={newHeight}
                    >
                        {singleBill}
                    </BillLine>
                );
            }
        }

        let depositChipWidth = width - 60;
        let depositChipHeight = Math.floor(depositChipWidth * 1800 / 3192);
        if (depositChipHeight > height - 100) {
            depositChipHeight = height - 100;
            depositChipWidth = Math.floor(depositChipHeight * 3192 / 1800);
        }
        const addonWidth = Math.max(Math.floor(depositChipWidth * 749 / 3192), 100);

        return (
            <OuterWrapper>
                {!isDeposit && (
                    <BillsInnerWrapper
                        width={w}
                        height={h}
                        realHeight={height}
                    >
                        {!isFromMarketModal && (
                            <div className="bill-description">{`MY ${symbol} IN COLD STORAGE`}</div>
                        )}

                        <BillsWrapper
                            padding={padding}
                            chipHeight={chipHeight}
                            isFromMarketModal={isFromMarketModal}
                        >
                            {bills}
                            <BalanceInCurrency balance={balance} chipHeight={chipHeight} />
                        </BillsWrapper>

                        {!isReceivedUserBills && (
                            <DataLoader width={200} height={200} dark />
                        )}
                    </BillsInnerWrapper>
                )}

                {selected && (
                    <BillDetailWrapper
                        isDeposit={isDeposit}
                        onClick={this.closeDetail}
                    >
                        <BillDetail
                            isOpened
                            wrapperHeight={852}
                            hoverable={false}
                            width={depositChipWidth}
                            height={depositChipHeight}
                            level={selected.level}
                            symbol={selected.symbol}
                            deno={selected.deno}
                            disabled={!isDeposit && selected.disabled}
                            getInnerRef={this.getInnerRef}
                            isDeposit={isDeposit}
                            publicAddress={selected.publicAddress}
                            serial={selected.serial}
                            depositBalance={balance}
                            estFilled={estFilled}
                            estTotal={estTotal}
                            isDefaultCrypto={isDefaultCrypto}
                        />

                        {isDeposit && (
                            <InputFieldWrapper
                                width={depositChipWidth}
                                height={50 + padding}
                                onClick={this.handleInputClick}
                            >
                                <InputField
                                    id="withdraw_address"
                                    label={`Withdraw ${symbol}`}
                                    placeholder={`Enter ${symbol} Wallet Address`}
                                    size={20}
                                    value={withdrawAddress}
                                    readOnly={false}
                                    changeValue={handleChange('withdrawAddress')}
                                    addonWidth={addonWidth}
                                    addon={
                                        <InputAddon
                                            key="2"
                                            width={addonWidth}
                                            id="withdraw-addon"
                                        >
                                            Withdraw
                                        </InputAddon>
                                    }
                                    slider={
                                        <SliderInput
                                            value={amount}
                                            max={balance}
                                            addonWidth={addonWidth}
                                            onChange={handleAmountChange}
                                        />
                                    }
                                />
                            </InputFieldWrapper>
                        )}
                    </BillDetailWrapper>
                )}
            </OuterWrapper>
        );
    }
}

export default BillsInner;
