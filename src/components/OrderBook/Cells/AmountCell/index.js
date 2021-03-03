import React, { memo, Fragment } from 'react';

import { formatString, getSplittedNumber } from '@/utils';
import { darkTheme } from '@/theme/core';
import { BuyArrowIcon, SellArrowIcon } from '@/components-generic/ArrowIcon';
import NewCoinIcon from '@/components/NewCoinIcon';

import { Container, Wrapper } from './styles';
import { ZerosWrapper } from '../PriceCell/styles';

const COIN_COLORS = {
    buy: darkTheme.palette.orderBookBuyIconFilter,
    sell: darkTheme.palette.orderBookSellIconFilter
};

const AmountCell = memo(({ children, type, cellWidth, intLength, fractionDigits, coin, isHovered, showArrow }) => {
    const stringifiedNumber = formatString(children, fractionDigits, true);
    const result = getSplittedNumber(stringifiedNumber, intLength + fractionDigits);

    const isBuy = type === 'buy';

    let ArrowComponent;
    if (isHovered) {
        ArrowComponent = isBuy ? BuyArrowIcon : SellArrowIcon;
    }

    return (
        <Wrapper cellWidth={cellWidth} isHovered={isHovered}>
            {isHovered && (
                <Fragment>
                    {showArrow && <ArrowComponent className="arrow-icon" width="16px" />}
                    <NewCoinIcon filter={COIN_COLORS[type]} size="sm" value={coin} />
                </Fragment>
            )}
            <Container type={type}>
                {!!result.leadingExtraZeroes && (
                    <ZerosWrapper position="leading">{result.leadingExtraZeroes}</ZerosWrapper>
                )}
                {!!result.integerPart && result.integerPart}
                {result.showDecimalSeparator && result.decimalSeparator}
                {!!result.fractionalPart && result.fractionalPart}
                {!!result.trailingZeros && <ZerosWrapper position="trailing">{result.trailingZeros}</ZerosWrapper>}
            </Container>
        </Wrapper>
    );
});

export default AmountCell;
