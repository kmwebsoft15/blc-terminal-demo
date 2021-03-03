import React, { memo } from 'react';

import { formatString } from '@/utils';
import { BuyArrowIcon, SellArrowIcon } from '@/components-generic/ArrowIcon';
import { ORDER_BOOK_ROWS_COUNT } from '@/config/constants';

import { CellTooltipItem } from './styles';

const TooltipContent = memo(({ isBuy, price, exchange, index, total, bestPrice, priceFractionDigits }) => {
    const sellExchanges = exchange.split(',');
    const exchanges = isBuy ? sellExchanges.reverse() : sellExchanges;
    const bestPriceValue = index === ORDER_BOOK_ROWS_COUNT - 1 ? bestPrice : total;
    const diff = Math.abs(bestPriceValue - price);
    const diffPerExchange = exchanges.length > 1 ? diff / (exchanges.length - 1) : diff;
    const direction = isBuy ? 1 : -1;

    const result = exchanges.map((exchName, idx) => {
        const isOwnPriceIdx = !idx;
        const alpha = 1 - idx / (1.5 * (exchanges.length || 1));
        const exchangePrice = price + direction * diffPerExchange * idx;
        return (
            <CellTooltipItem key={exchName} isBuy={isBuy} isOwnPriceIdx={isOwnPriceIdx}>
                <span className={`exchange-list-item ${isOwnPriceIdx && 'own-price'}`} style={{ opacity: alpha }}>
                    {exchName}
                </span>
                {!idx && (isBuy ? <BuyArrowIcon className="alt-arrow" /> : <SellArrowIcon className="alt-arrow" />)}
                <span className={`right-value ${isOwnPriceIdx && 'own-price'}`} style={{ opacity: alpha }}>
                    {formatString(exchangePrice, priceFractionDigits, true)}
                </span>
            </CellTooltipItem>
        );
    });

    return <ul className="advanced-tooltip text-left">{isBuy ? result.reverse() : result}</ul>;
});

export default TooltipContent;
