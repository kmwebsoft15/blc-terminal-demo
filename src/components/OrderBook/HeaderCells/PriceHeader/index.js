import React, { memo, Fragment } from 'react';
import { inject } from 'mobx-react';
import { compose } from 'recompose';

import { STORE_KEYS } from '@/stores';
import PriceCell from '@/components/OrderBook/Cells/PriceCell';
import HeaderCell from '../HeaderCell';

import { AtSymbol } from './styles';

const PriceHeader = memo(({ price, intLength, fractionDigits, cellWidth }) => {
    return (
        <HeaderCell tooltipText="Price" cellWidth={cellWidth}>
            {price <= 0 && '-'}
            {price > 0 && (
                <Fragment>
                    <AtSymbol position="leading">@</AtSymbol>
                    <PriceCell type="header" intLength={intLength} fractionDigits={fractionDigits}>
                        {price}
                    </PriceCell>
                </Fragment>
            )}
        </HeaderCell>
    );
});

export default compose(
    inject(stores => ({
        price: stores[STORE_KEYS.PRICECHARTSTORE].price
    }))
)(PriceHeader);
