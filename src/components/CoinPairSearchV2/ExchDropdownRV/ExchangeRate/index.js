import React, { PureComponent } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { numberWithCommas } from '@/utils';
import DataLoader from '@/components-generic/DataLoader';
import { STORE_KEYS } from '@/stores';

import { DataLoaderWrapper } from './styles';

class ExchangeRate extends PureComponent {
    getRate = () => {
        const {
            price, selectedQuote, selectedBase, getLocalCurrency,
            getDefaultPrice, amount, isCoinPairInversed, accessLevel, isSwapped,
        } = this.props;

        if (getLocalCurrency(selectedBase) === getLocalCurrency(selectedQuote)) {
            return 1;
        }

        const preparedPrice = accessLevel !== 'Level 1' && price > 0 && isSwapped !== null
            ? isSwapped
                ? 1 / price
                : price
            : price;

        return numberWithCommas(getDefaultPrice(preparedPrice * amount));
    };
    render() {
        const { price, selectedQuote, toggleDropdown } = this.props;

        const isLoading = !price || !selectedQuote;

        return (
            <div className="exch-dropdown__title__wrapper" onClick={toggleDropdown}>
                <p className="exch-dropdown__title">
                    <span>{!isLoading && this.getRate()}</span>
                </p>
                {isLoading && (
                    <DataLoaderWrapper>
                        <DataLoader width={50} height={50} />
                    </DataLoaderWrapper>
                )}
            </div>
        );
    }
}

const withStore = compose(
    inject(STORE_KEYS.PRICECHARTSTORE, STORE_KEYS.SETTINGSSTORE),
    observer,
    withProps(
        ({
            [STORE_KEYS.PRICECHARTSTORE]: { price },
            [STORE_KEYS.SETTINGSSTORE]: { getLocalCurrency, getDefaultPrice, accessLevel },
        }) => ({
            price,
            getLocalCurrency,
            getDefaultPrice,
            accessLevel,
        })
    )
);

export default withStore(ExchangeRate);
