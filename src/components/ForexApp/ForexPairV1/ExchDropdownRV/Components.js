import React from 'react';
import styled from 'styled-components/macro';

export const ExchDropdownList = styled.div`
    height: ${props => props.itemCount > 4 ? 440 : props.itemCount * 110}px;

    .exch-dropdown__list__rvtable-wrapper {
        height: ${props => props.itemCount > 4 ? 440 : props.itemCount * 110}px;
    }
`;

export const StyleWrapper = styled.div`
    width: ${props => props.width}px;
    height: ${props => props.height}px;

    .ps__thumb-y {
        opacity: 0 !important;
        z-index: 9999;
        cursor: pointer;
    }

    .ReactVirtualized__Table__rowColumn {
        margin-left: 0;
        text-overflow: inherit;
        overflow: initial !important;
    }

    .ReactVirtualized__Table__row {
        overflow: visible !important;

        .ReactVirtualized__Table__rowColumn {
            &:last-child {
                margin-right: 0;
            }
        }
    }

    .ReactVirtualized__Table__Grid {
        outline: none !important;
        box-shadow: 7px 6px 11px rgba(0, 0, 0, .05);
    }

    .addon {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: stretch;
        padding: 0 15px;
        height: 60px;
        width: 100%;
    }
`;

export const AddonWrapper = styled.div`
    position: absolute;
    top: 0;
    right: 30px;
    // border-bottom: 1px solid ${props => props.theme.palette.coinPairDropDownItemBorder};
    height: 100%;
    display: flex;
    align-items: center;
    pointer-events: none;

    .DemoLabel{
        font-size: 11px;
        position: absolute;
        top: 0;
        padding: 2px;
        left: 0;
        height: 13px;
        z-index: 100;
        font-weight: 700;
        color: white;
        background: red;
    }
`;

export const ItemButtonWrapper = styled.div`
    position: relative;
    border-bottom: 1px solid ${props => props.theme.palette.clrInnerBorder};
    min-height: 110px;
    display: flex;
    align-items: center;

    .phone-number-input svg, .code-input svg{
        min-height: 36px;
    }
    .right-side-exch-deposit-wrapper{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

export const ItemButton = styled.button`
    padding-right: ${props => props.isActive ? '20px !important' : '30px'};
    flex: 1;
`;

export const CoinItemWrapper = styled.div.attrs({ className: 'exch-dropdown__current' })`
    width: 100%;
    height: 100%;
    padding: 0 12px;
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
    transition: all .1s;
    font-size: 13px;
    color: ${props => props.theme.palette.coinPairSelectText2};

    .exch-dropdown__title__wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .exch-dropdown__title {
        font-size: 13px;
        color: ${props => props.theme.palette.coinPairSelectText2};

        span {
            font-size: 40px;
            font-weight: 600;
            color: ${props => props.theme.palette.coinPairSelectHoverText2};
        }

        input {
            background: transparent;
            border: 0;
            text-align: right;
            font-size: 40px;
            font-weight: 600;
            color: ${props => props.theme.palette.coinPairSelectHoverText2};
            width: 200px;
        }
    }

    .estimate_price {
        font-size: 40px;
        font-weight: 600;
        color: ${props => props.theme.palette.coinPairSelectText2};
    }
`;

export const CoinSelection = styled.div`
    display: flex;
    align-items: center;
    flex: ${props => props.isLeft && '1'};
`;

export const ForexInput = styled.input`
    font-size: 40px;
    font-weight: 600;
    color: ${props => props.theme.palette.coinPairSelectHoverText2};
    background: transparent;
    border: 0;
    text-align: ${props => props.isCoinPairInversed ? 'left' : 'right'};
    direction: ltr;
    max-width: 300px;
`;

export const DataLoaderWrapper = styled.div`
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: center;
    background-color: transparent;
    margin-left: 30px;
`;
