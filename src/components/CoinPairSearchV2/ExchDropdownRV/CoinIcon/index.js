import React from 'react';

import COIN_DATA_MAP from '../../../../mock/coin-data-map';

const CoinIcon = ({
    showTether = false, value, defaultFiat, toggleDropdown, opacity = 1,
}) => {
    if (typeof value === 'string') {
        return (COIN_DATA_MAP[value] && COIN_DATA_MAP[value].file)
            ? (
                <div
                    className="exch-dropdown__icon coin-icon"
                    style={{
                        background: (value === 'USDT' && !showTether)
                            ? `url('img/icons-coin/${defaultFiat.toLowerCase()}.png') no-repeat`
                            : COIN_DATA_MAP[value].file.indexOf('svg') < 0
                                ? `url('img/icons-coin/${COIN_DATA_MAP[value].file}') no-repeat`
                                : `url('img/sprite-coins-view.svg#coin-${value.toLowerCase()}') no-repeat`,
                        opacity,
                    }}
                    onClick={toggleDropdown || null}
                />
            )
            : (
                <div className="exch-dropdown__icon no-icon" onClick={toggleDropdown || null}>
                    {(value && value.length) ? value.charAt(0) : ''}
                </div>
            );
    }

    return (value && value.file)
        ? (
            <div
                className="exch-dropdown__icon coin-icon"
                style={{
                    background: value.file.indexOf('svg') < 0
                        ? `url('img/icons-coin/${value.file}') no-repeat`
                        : `url('img/sprite-coins-view.svg#coin-${value.symbol.toLowerCase()}') no-repeat`,
                    opacity,
                }}
                onClick={toggleDropdown || null}
            />
        )
        : (
            <div className="exch-dropdown__icon no-icon" onClick={toggleDropdown || null}>
                {(value && value.symbol && value.symbol.length) ? value.symbol[0] : ''}
            </div>
        );

};

export default CoinIcon;
