import React from 'react';
import { SwipArrowIcon } from '@/components-generic/ArrowIcon'

function CoinSwapToggle(props) {
    const {
        isShortSell,
        isSwapMode,
        isSwapped,
        toggleSwap,
    } = props;

    return (isShortSell || isSwapMode) ? (
        <button className={'exch-head__switch' + (isSwapped ? ' switched' : '')} onClick={toggleSwap}>
            <SwipArrowIcon />
        </button>
    ) : (
        <button className={'exch-head__switch shortsell' + (isSwapped ? ' switched' : '')}>
            <SwipArrowIcon />
        </button>
    );
}

export default CoinSwapToggle;
