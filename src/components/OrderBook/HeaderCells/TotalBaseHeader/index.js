import React, { memo } from 'react';

import NewCoinIcon from '@/components/NewCoinIcon';
import { darkTheme } from '@/theme/core';
import AmountCell from '@/components/OrderBook/Cells/AmountCell';

import HeaderCell from '../HeaderCell';

const TotalBaseHeader = memo(({ amount, intLength, fractionDigits, coin, cellWidth }) => {
    return (
        <HeaderCell tooltipText={coin} cellWidth={cellWidth}>
            <NewCoinIcon value={coin} filter={darkTheme.palette.orderBookIconFilter} size="sm" />
            <AmountCell type="header" intLength={intLength} fractionDigits={fractionDigits}>
                {amount}
            </AmountCell>
        </HeaderCell>
    );
});

export default TotalBaseHeader;
