import React from 'react';
import styled from 'styled-components/macro';
import COIN_DATA_MAP from '../../../mock/coin-data-map';

const StyleWrapper = styled.div`
    grid-area: icon;
    width: ${props => props.width ? props.width : '34'}px;
    height: ${props => props.width ? props.width : '34'}px;
    border-radius: 50%;
    cursor: pointer;
        
    .exch-dropdown__icon {
        width: ${props => props.width ? props.width : '34'}px;
        height: ${props => props.width ? props.width : '34'}px;
        border-radius: 50%;
    }
    
    .coin-icon {
        flex-shrink: 0;
        background-size: cover !important;
    }
    
    .no-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        font-weight: bold;
        background: ${props => props.theme.tradePalette.primaryBuy};
        color: ${props => props.theme.palette.contrastText};
    }
`;

const CoinIcon = ({ value, width, ...props }) => {
    if (typeof value === 'string') {
        return (COIN_DATA_MAP[value] && COIN_DATA_MAP[value].file)
            ? (
                <StyleWrapper width={width} {...props}>
                    <div
                        className="exch-dropdown__icon coin-icon"
                        style={{
                            background: COIN_DATA_MAP[value].file.indexOf('svg') < 0 ? `url('img/icons-coin/${COIN_DATA_MAP[value].file}') no-repeat`
                                : `url('img/sprite-coins-view.svg#coin-${value.toLowerCase()}') no-repeat`,
                        }}
                    >
                    </div>
                </StyleWrapper>
            )
            : (
                <StyleWrapper width={width} {...props}>
                    <div className="exch-dropdown__icon no-icon">
                        {(value && value.length) ? value.charAt(0) : ''}
                    </div>
                </StyleWrapper>
            );
    }

    return (value && value.file)
        ? (
            <StyleWrapper width={width} {...props}>
                <div
                    className="exch-dropdown__icon coin-icon"
                    style={{
                        background: value.file.indexOf('svg') < 0 ? `url('img/icons-coin/${value.file}') no-repeat`
                            : `url('img/sprite-coins-view.svg#coin-${value.symbol.toLowerCase()}') no-repeat`,
                    }}
                >
                </div>
            </StyleWrapper>
        )
        : (
            <StyleWrapper width={width} {...props}>
                <div className="exch-dropdown__icon no-icon">
                    {(value && value.symbol && value.symbol.length) ? value.symbol[0] : ''}
                </div>
            </StyleWrapper>
        );
};

export default CoinIcon;
