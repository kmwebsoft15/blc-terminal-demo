import React from 'react';
import styled from 'styled-components/macro';
import COIN_DATA_MAP from '../../mock/coin-data-map';

const tryRequire = (path) => {
    try {
        return require(`${path}`);
    } catch (err) {
        return null;
    }
};

/**
 * @param filter Get filter values from hex `https://codepen.io/sosuke/details/Pjoqqp`
 */
const SvgIcon = styled.img`
    filter: ${props => props.filter || 'invert(100%) sepia(0%) saturate(7484%) hue-rotate(303deg) brightness(105%) contrast(92%)'};
    width: 50px;
    height: 50px;
    ${props => props.size === 'md' && `
        width: 34px;
        height: 34px;
    `}

    ${props => props.size === 'sm' && `
        width: 14px;
        height: 14px;
    `}
`;

const CoinIconUsdt = styled.span`
    ${props => props.size === 'sm' && `
        font-size: 16px;
    `}
    filter: ${props => props.filter};
`;

const NewCoinIcon = ({
    showTether = false, value, defaultFiat, toggleDropdown, opacity = 1, symbol, size, filter, isFiatSymbol,
}) => {

    // Svg coin icon
    if (!!value) {
        const coinName = typeof value === 'string' ? value : value.symbol;
        const src = tryRequire(`./coin-svg/${coinName}${symbol ? '' : '-alt'}.svg`);
        if (value === 'USDT') {
            return <CoinIconUsdt filter={filter}>$</CoinIconUsdt>;
        }
        if (src) {
            return <SvgIcon src={src} alt={coinName} size={size} filter={filter} />;
        }
    }

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

export default NewCoinIcon;
