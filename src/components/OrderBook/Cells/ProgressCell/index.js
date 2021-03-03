import React, { memo } from 'react';

import { Wrapper } from './styles';

const ProgressCell = memo(({
    maxPrice, minPrice, price, isBuy,
}) => {
    const progressPercents = isBuy
        ? 1 - (price - minPrice) / (maxPrice - minPrice)
        : (price - minPrice) / (maxPrice - minPrice);
    return <Wrapper width={progressPercents * 100} isBuy={isBuy} />;
});

export default ProgressCell;
