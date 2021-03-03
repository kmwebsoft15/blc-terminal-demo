import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { DropMenuWrapper } from './Components';
import DropMenu from './DropMenu';
import { STORE_KEYS } from '@/stores';
import { TableData } from '../MainTable/data';

function TopMenu(props) {
    const { selectedCurrencies, selectedExchanges, selectedTotalCurrency, onCurrencyChange, onExchangeChange, onTotalCurrencyChange, marketExchanges } = props
    const totalCurrencyData = TableData.map(ex => ex.currency)
    const currencyData = ['All currencies', ...totalCurrencyData];
    const exchangeData = ['All exchanges', ...marketExchanges.map(ex => ex.name)];
    return (
        <DropMenuWrapper>
            <DropMenu data={currencyData} selectedItems={selectedCurrencies} onChange={onCurrencyChange} />
            <span className="label">On</span>
            <DropMenu data={exchangeData} selectedItems={selectedExchanges} onChange={onExchangeChange} />

            <DropMenu totalBalenceDropdown data={totalCurrencyData} selectedItems={selectedTotalCurrency} onChange={onTotalCurrencyChange} />
        </DropMenuWrapper>
    );
}

const withStore = compose(
    inject(
        STORE_KEYS.EXCHANGESSTORE,
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.EXCHANGESSTORE]: {
                exchanges,
                marketExchanges,
                setExchangeActive,
            },
        }) => ({
            exchanges,
            marketExchanges,
            setExchangeActive,
        })
    )
);

export default withStore(TopMenu);
