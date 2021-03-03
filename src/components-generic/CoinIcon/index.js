import React from 'react';
import styled from 'styled-components/macro';

import COIN_DATA_MAP from '../../mock/coin-data-map';

const IconStyleWrapper = styled.div.attrs({ className: 'exch-dropdown__icon' })`
    width: ${props => props.size || '20'}px;
    height: ${props => props.size || '20'}px;
    padding: 0;
    margin: ${props => props.hasMarginRight ? '0 12px 0 0' : '0'};
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover !important;
    border: none;
    
    .no-icon {
        background: ${props => props.theme.tradePalette.primaryBuy};
        border-radius: 50%;
        font-weight: bold;
        color: ${props => props.theme.palette.contrastText};
    }
`;

const IconFiat = styled.img`
    width: ${props => props.width}px;
    height: ${props => props.height}px;
`;

export const CoinIcon = ({
    value, size, hasMarginRight, isFiat,
}) => {
    if (isFiat) {
        return (
            <IconFiat src={`/img/icons-coin/${(value || '').toLowerCase()}.png`} className="flag" alt="" width={size}/>
        );
    }

    if (typeof value === 'string') {
        return (COIN_DATA_MAP[value] && COIN_DATA_MAP[value].file)
            ? (
                <IconStyleWrapper
                    hasMarginRight={hasMarginRight}
                    size={size}
                    style={{
                        background: COIN_DATA_MAP[value].file.indexOf('svg') < 0 ? `url('img/icons-coin/${COIN_DATA_MAP[value].file}') no-repeat`
                            : `url('img/sprite-coins-view.svg#coin-${value.toLowerCase()}') no-repeat`,
                    }}
                />
            )
            : (
                <IconStyleWrapper className="no-icon" size={size}>
                    {(value && value.length) ? value.charAt(0) : ''}
                </IconStyleWrapper>
            );
    }

    return (value && value.file)
        ? (
            <IconStyleWrapper
                hasMarginRight={hasMarginRight}
                size={size}
                style={{
                    background: value.file.indexOf('svg') < 0 ? `url('img/icons-coin/${value.file}') no-repeat`
                        : `url('img/sprite-coins-view.svg#coin-${value.symbol.toLowerCase()}') no-repeat`,
                }}
            />
        )
        : (
            <IconStyleWrapper className="no-icon" size={size}>
                {(value && value.symbol && value.symbol.length) ? value.symbol[0] : ''}
            </IconStyleWrapper>
        );

};

const BTCFontIconWrapper = styled.span`
    font-family: BTC, sans-serif;
`;
export const BTCFontIcon = () => (
    <BTCFontIconWrapper className="CurrencySymbol">BTC</BTCFontIconWrapper>
);
