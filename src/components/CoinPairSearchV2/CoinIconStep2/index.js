import React from 'react';
import COIN_DATA_MAP from '../../../mock/coin-data-map';

const CoinIconStep2 = ({ value, defaultFiat, onClick }) => (COIN_DATA_MAP[value] && COIN_DATA_MAP[value].file)
    ? (
        <div
            className="exch-dropdown__icon coin-icon"
            role="img"
            aria-hidden="true"
            style={{
                background: value === 'USDT'
                    ? `url('img/icons-coin/${defaultFiat.toLowerCase()}.png') no-repeat`
                    : COIN_DATA_MAP[value].file.indexOf('svg') < 0
                        ? `url('img/icons-coin/${COIN_DATA_MAP[value].file}') no-repeat`
                        : `url('img/sprite-coins-view.svg#coin-${value.toLowerCase()}') no-repeat`,
            }}
            onClick={onClick}
        >
        </div>
    )
    : (
        <div
            className="exch-dropdown__icon no-icon"
            onClick={onClick}
        >
            {(value && value.length) ? value.charAt(0) : ''}
        </div>
    );

export default CoinIconStep2;