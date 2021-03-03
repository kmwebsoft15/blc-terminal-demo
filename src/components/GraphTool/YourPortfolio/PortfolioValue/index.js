import React, { Fragment } from 'react';
import CurrencyDropdownWithSymbol from '@/components-generic/CurrencyDropdown/CurrencyDropdownWithSymbol';
import {
    Wrapper,
    LabelPrice,
    WalletActionWrapper,
    WalletAction
} from './styles';
import { WalletSideIcon } from '@/components/OrderHistory/OrderHistoryTable/Components';
import NewCoinIcon from '@/components/NewCoinIcon';
import WalletGroupButton from '@/components-generic/WalletGroupButton';
import DataLoader from '@/components-generic/DataLoader';
import { darkTheme } from '@/theme/core';
import { commafy, noop } from '@/utils';

const PortfolioValue = (props) => {
    const {
        lastPortfolioValue,
        isDefaultCrypto,
        onClickDeposit,
        isForexMode,
        isLoading,
        forexCurrency,
        setForexCurrency,
        maxHeight,
    } = props;

    const value = lastPortfolioValue > 1 ? lastPortfolioValue.toFixed(2) : lastPortfolioValue.toFixed(6);
    return (
        <Wrapper>
            <WalletGroupButton
                isLeft
                isBuy
                isWhite
                position={isDefaultCrypto}
                width={300}
                groupWidth={340}
                isOverFlow
            >
                <WalletSideIcon isRight/>
                <CurrencyDropdownWithSymbol
                    maxHeight={maxHeight}
                    isColorfulToggle
                    alignLeft
                    alignRight={false}
                    coinSize={50}
                    symbolSize={25}
                    onChange={(val) => {
                        setForexCurrency(val);
                    }}
                    isForexMode
                    forexCurrency={forexCurrency}
                />
                <LabelPrice
                    disableTouch={!isForexMode || isLoading}
                    onClick={() => {
                        if (isForexMode) {
                            onClickDeposit();
                        }
                    }}
                >
                    {commafy(value)}
                </LabelPrice>
                {isLoading && <DataLoader width={40} height={40} />}
            </WalletGroupButton>
        </Wrapper>
    );
};

PortfolioValue.defaultProps = {
    setForexCurrency: noop,
};

export default PortfolioValue;
