import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { STORE_KEYS } from '../../../stores';
import { PortfolioLabels } from './Components';
import PortfolioValue from '../YourPortfolio/PortfolioValue';

class WalletNewPopup extends Component {
    toggleBillPopup = () => {
        const {
            isDefaultCrypto,
            defaultFiat,
            defaultCryptoSymbol,
            showBillChips,
        } = this.props;
        const coin = isDefaultCrypto ? defaultCryptoSymbol : (defaultFiat === 'USD' ? 'USDT' : defaultFiat);
        showBillChips(coin);
    };

    render() {
        const {
            lastPortfolioValue,
            isDefaultCrypto,
            defaultCryptoSymbol,
            defaultFiatSymbol,
            setForexCurrency,
            forexCurrency,
        } = this.props;

        return (
            <PortfolioLabels>
                <PortfolioValue
                    lastPortfolioValue={lastPortfolioValue}
                    isDefaultCrypto={isDefaultCrypto}
                    defaultCryptoSymbol={defaultCryptoSymbol}
                    defaultFiatSymbol={defaultFiatSymbol}
                    onClickDeposit={this.toggleBillPopup}
                    onClickWithdraw={this.toggleBillPopup}
                    isForexMode
                    setForexCurrency={setForexCurrency}
                    forexCurrency={forexCurrency.replace('F:', '')}
                />
            </PortfolioLabels>
        );
    }
}

export default compose(
    inject(
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.BILLSMODALSTORE,
        STORE_KEYS.ORDERHISTORY,
        STORE_KEYS.FOREXSTORE,
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.SETTINGSSTORE]: {
                isDefaultCrypto,
                defaultFiat,
                defaultCryptoSymbol,
                defaultFiatSymbol,
            },
            [STORE_KEYS.ORDERHISTORY]: { lastPortfolioValue },
            [STORE_KEYS.BILLSMODALSTORE]: { showBillChips },
            [STORE_KEYS.FOREXSTORE]: { setForexCurrency, forexCurrency },
         }) => ({
            lastPortfolioValue,
            isDefaultCrypto,
            defaultFiat,
            defaultCryptoSymbol,
            defaultFiatSymbol,
            showBillChips,
            setForexCurrency,
            forexCurrency,
        })
    )
)(WalletNewPopup);
