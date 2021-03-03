import React, { memo } from 'react';

import { SwipArrowIcon } from '@/components-generic/ArrowIcon';
import AmountCell from '@/components/OrderBook/Cells/AmountCell';
import HeaderCell from '../HeaderCell';

import { SwipArrowIconStyled, CoinNameWrapper } from './styles';

const TotalQuoteHeader = memo(({ coin, coinSymbol, amount, intLength, fractionDigits, cellWidth }) => {
    return (
        <HeaderCell tooltipText={coin} cellWidth={cellWidth}>
            <SwipArrowIconStyled width="20px" />
            <CoinNameWrapper>{coinSymbol || '$'}</CoinNameWrapper>
            <AmountCell type="header" intLength={intLength} fractionDigits={fractionDigits}>
                {amount}
            </AmountCell>
        </HeaderCell>
    );
});

export default TotalQuoteHeader;
