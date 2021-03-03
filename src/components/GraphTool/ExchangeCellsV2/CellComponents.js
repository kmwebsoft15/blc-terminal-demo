import React, { Fragment } from 'react';
import styled from 'styled-components/macro';

import COIN_DATA_MAP from '../../../mock/coin-data-map';

export const ItemNormal = styled.div.attrs({ className: 'exch-bar-item--normal' })`
    position: relative;
    width: 100%;
    height: calc(100% / ${props => props.isLeftTop ? 8 : 7});
    margin: 0;
    padding-left: 8px;
    padding-right: 13px;
    display: flex;
    background: transparent;
    border: 1px solid #000e4f;
    color: ${props => props.theme.palette.clrtext};
    cursor: ${props => props.disabled ? 'initial' : 'pointer'};
    z-index: ${props => (props.isRealExchange && !props.isProgressing) ? '5' : ''};

    .exch-bar-progress-bar .track {
        background: transparent;
    } 

    ${props => ((props.active || props.isOpen || props.hover) && !props.disabled) ? `
        background: transparent;
        color: ${props.theme.palette.clrHighContrast};

        .exch-bar-progress-bar .track {
            background: transparent;
        }

        .exch-bar-item__title,
        .exch-bar-item__ratio-text,
        .exchange-name {
            color: ${props.theme.palette.clrHighContrast} !important;
        }
    ` : ''};

    .exch-bar-coin-icon {
        opacity: ${props => (props.isPlan || props.active || props.isOpen || props.hover) ? 1 : 0.3};

        .icon-wrapper {
            // filter: ${props => props.active ? 'none !important' : ''};
            filter: ${props => props.isPlan ? 'none !important' : ''};
        }

        &:after {
            display: ${props => props.isPlan ? 'none !important' : 'block'};
        }
    }
    ${props => props.hover ? `   
         {
            background: rgba(255, 255, 255, .25);
            color: ${props.theme.palette.clrHighContrast};
            
            span {
                color: ${props.theme.palette.clrHighContrast};
            }
            
            .exch-bar-coin-icon {
                opacity: 1;
    
                .icon-wrapper {
                    filter: none !important;
                }
    
                &:after {
                    display: none !important;
                }
            }
            
            .exch-bar-item__title {
                color: ${props.theme.palette.clrHighContrast} !important;
            }
            .infoIcon svg {
                fill: ${props.theme.palette.clrHighContrast};
            }
        }
        ` : ''}
     
    ${props => !props.disabled ? `
    
        &:active {
            background: ${props.theme.palette.clrMouseClick};
            color: ${props.theme.palette.clrHighContrast};
            
            .exch-bar-coin-icon {
                .icon-wrapper {
                    filter: none !important;
                }
                &:after {
                    display: none !important;
                }
            }
        }
    ` : ''};
    
    &:last-child {
        border-bottom: 1px solid ${props => props.theme.palette.exchBarItemBorder};
    }
`;

export const ItemTitle = styled.span.attrs({ className: 'exch-bar-item__title' })`
    display: block;
    margin: 0;
    border: none;
    padding: 0;
    width: 100%;
    font-size: 23.29px;
    line-height: 27.95px;
    font-weight: bold;
    color: ${props => props.hover ? props.theme.palette.clrHighContrast : props.theme.palette.clrPurple};

    span {
        margin-left: 8px;
    }
`;

export const ItemExchPair = styled.div.attrs({ className: 'exch-bar-item__pairs' })`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: stretch;
    margin: 0;
    border: none;
    padding: 0;
    width: 100%;
`;

export const ItemExchPairSimple = styled.div.attrs({ className: 'exch-bar-item__pairs-simple' })`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: ${props => (props.isRealExchange && !props.isProgressing) ? '' : (props.isRealExchange ? '5' : '3')};
    height: 100%;
    width: 100%;
    // font-size: 15px;
    line-height: 27.95px;
    // color: ${props => !props.active ? props.theme.palette.exchBarItemLabel : props.theme.palette.exchBarItemTitle};
    // color: ${props => props.hover ? props.theme.palette.clrHighContrast : props.theme.palette.clrBorder};
    color: ${props => props.theme.palette.clrBorder};
    
    ${props => !props.isProgress ? `
        span {
            color: ${props.theme.palette.clrBorder} !important;
        }
    ` : ''};
`;

export const ColumnObj = styled.div`
    flex: 1;
    display: flex;
    overflow: hidden;
    white-space: nowrap;
    align-items: center;
    ${props => props.right ? 'padding-right: 10px;' : ''}
    
    .exch-name-tooltip {
        display: contents !important;
    }
    .c1Symbol {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        color: ${props => props.theme.palette.clrHighContrast};
        font-size: 33px;
        line-height: 40px;
        text-transform: uppercase;
        white-space: nowrap;
        text-align: ${props => props.right ? 'right' : 'left'};
        padding-left: 10px;
        .atSymbol {
            font-size: 28px;
        }
        
        &.inactive {
            width: 20%;
            color: ${props => props.theme.palette.clrDarkPurple};
        }
    }
    .expRight{
        color: ${props => props.theme.palette.clrMouseClick} !important;
    }
    
    .c1Amount {
        flex: 1;
        color: ${props => props.theme.palette.clrHighContrast};
        font-size: 33px;
        line-height: 40px;
        text-align: ${props => props.right ? 'left' : 'right'};
        
        &.inactive {
            color: ${props => props.theme.palette.clrDarkPurple};
        }    
        .orderhistory__wallet-btn {
            ${props => !props.right ? 'float: right;' : ''}
            height: 65px;
            * {
                background: transparent !important;
            }
            .wallet-side-icon {
                // ${props => props.right ? 'left: -8px; right: initial;' : 'right: -8px; left: initial;'}
                right: -5px;
                left: initial;
                fill: transparent !important;
            }
        }
    }
`;

export const ItemExchPairRatioText = styled.span.attrs({ className: 'exch-bar-item__ratio-text' })`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    font-size: 33px;
    font-weight: bold;
    line-height: 1;
    text-align: center;
    padding-left: 10px;
    padding-right: 10px;

    ${props => props.active ? `
        color: ${props.theme.palette.clrHighContrast};

        svg {
            fill: ${props.theme.palette.clrHighContrast};
        }
    ` : ''}
    
    > div {
        flex-shrink: 0;
        color: ${props => props.active ? props.theme.palette.clrHighContrast : ''};
    }
`;

export const ExchangeWrapper = styled.div`
    width: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow: hidden;
    line-height: 24px;
    
    .top-bar__icon {
        transform: rotate(${props => props.isCoinPairInversed ? '180' : '0'}deg);
        fill: ${props => props.isActive ? (props.isCoinPairInversed ? props.theme.palette.coinPairBuyArrow : props.theme.palette.coinPairSellArrow) : props.theme.palette.clrDarkPurple};
    }
    
    .info-arrow-directional {
        height: 100%;
                
        .label-arrow-info {
            position: absolute;
            top: 29%;
            color: ${props => props.theme.palette.clrHighContrast};
            font-size: 18px;
        }

        .wrapper_arrow {
            display: flex;
            justify-content: ${props => props.isCoinPairInversed ? 'flex-end' : 'flex-start'};
            align-items: center;     
            .arrow-icon {
                fill: ${props => props.progress ? props.theme.palette.clrHighContrast : props.isCoinPairInversed ? props.theme.palette.btnPositiveBg : props.theme.palette.btnNegativeBg};    //set arrow icon fill color
                ${props => props.isCoinPairInversed && 'transform: rotate(180deg);'} 
                width: 35px;
            }
            
            .warning-icon {
                position: absolute;
            }
            
            .type-label {
                position: absolute;
                font-size: 9px;
                font-weight: 700;
                ${props => props.isCoinPairInversed ? 'margin-right: 3px;' : 'margin-left: 3px;'}
                color: ${props => props.progress ? props.isCoinPairInversed ? props.theme.palette.btnPositiveBg : props.theme.palette.btnNegativeBg : props.theme.palette.clrHighContrast} !important;
            }
        }
        
        .label-changes-amount {
            position: absolute;
            top: 64%;
            color: ${props => props.theme.palette.clrHighContrast};
            font-size: 12px;             
        }
    }
`;

export const ItemExchPairSide = styled.div.attrs({ className: 'exch-bar-item__pairs__side' })`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 0;
    border: none;
    border-radius: 3px;
    padding: 0;
    width: 65px;
    height: 33px;
    background: ${props => props.theme.palette.exchBarItemBorder};
`;

const IconStyleWrapper = styled.div.attrs({ className: 'exch-bar-coin-icon' })`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 2px;
    border: none;
    padding: 0;
    height: ${props => props.size || '20'}px;
    border-radius: 50% !important;
    
    .icon-wrapper {
        width: ${props => props.size || '20'}px;
        height: ${props => props.size || '20'}px;
        filter: ${props => ((!props.isSearchState && !props.isOpen) && !props.hover) ? 'grayscale(1) brightness(80%) contrast(200%)' : ''};
        background-size: cover !important;
        border-radius: 50% !important;
    }
    
    .no-icon {
        border-radius: 50%;
        font-weight: bold;
        background: ${props => props.theme.tradePalette.primaryBuy};
        color: ${props => props.theme.palette.contrastText};
    }

    &:after {
        display: ${props => ((!props.isSearchState && !props.isOpen) && !props.hover) ? 'block' : 'none'};
        content: '';
        position: absolute;
        width: ${props => props.size || '20'}px;
        height: ${props => props.size || '20'}px;
        border-radius: 50% !important;
        background-color: rgba(0, 0, 250, .2);
    }
`;

export const ItemExchPairSideIcon = ({
    value, size, isSearchState, defaultFiat, type, ...props
}) => {
    if (typeof value === 'string') {
        if (type === 'ExchangeIcon') {
            return (
                <IconStyleWrapper
                    size={size}
                    isSearchState={isSearchState}
                    {...props}
                >
                    <div
                        className="icon-wrapper"
                        style={{ background: `url('img/exchange/${value}.png') no-repeat` }}
                    />
                </IconStyleWrapper>
            );
        }
        return (COIN_DATA_MAP[value] && COIN_DATA_MAP[value].file)
            ? (
                <IconStyleWrapper
                    size={size}
                    isSearchState={isSearchState}
                    {...props}
                >
                    <div
                        className="icon-wrapper"
                        style={{
                            background: value === 'USDT'
                                ? `url('img/icons-coin/${defaultFiat.toLowerCase()}.png') no-repeat` :
                                COIN_DATA_MAP[value].file.indexOf('svg') < 0
                                    ? `url('img/icons-coin/${COIN_DATA_MAP[value].file}') no-repeat`
                                    : `url('img/sprite-coins-view.svg#coin-${value.toLowerCase()}') no-repeat`,
                        }}
                    />
                </IconStyleWrapper>
            )
            : (
                <IconStyleWrapper className="no-icon" isSearchState={isSearchState} size={size} {...props}>
                    {(value && value.length) ? value.charAt(0) : ''}
                </IconStyleWrapper>
            );
    }
    return (value && value.file)
        ? (
            <IconStyleWrapper
                size={size}
                isSearchState={isSearchState}
                {...props}
            >
                <div
                    className="icon-wrapper"
                    style={{
                        background: value.file.indexOf('svg') < 0 ? `url('img/icons-coin/${value.file}') no-repeat`
                            : `url('img/sprite-coins-view.svg#coin-${value.symbol.toLowerCase()}') no-repeat`,
                    }}
                />
            </IconStyleWrapper>
        )
        : (
            <IconStyleWrapper className="no-icon" isSearchState={isSearchState} size={size} {...props}>
                {(value && value.symbol && value.symbol.length) ? value.symbol[0] : ''}
            </IconStyleWrapper>
        );

};

const RatioStyleWrapper = styled.div.attrs({ className: 'exch-bar-ratio-icon' })`
    flex-grow: 1;
    flex-shrink: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0 8px;
    width: 100%;
    
    svg.arrow {
        margin: 1px 0;
        width: 100%;
        height: 18px;
        fill: ${props => props.theme.palette.exchBarItemLabel};
    }
    
    span.ratio {
        width: 100%;
        font-size: 12px;
        font-weight: bold;
        line-height: 1em;
        text-align: center;
        
        span {
            font-size: 11px;
            font-weight: 300;
        }
    }
`;

export const ItemExchPairRatio = ({ active, value, coin }) => {
    return (
        <RatioStyleWrapper active={active}>
            <svg
                className="arrow"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52.86 20.79"
            >
                <polygon
                    className="cls-1"
                    points="1.7 13.1 42.89 13.1 42.89 16.61 50.01 10.44 42.89 4.18 42.89 7.88 1.87 7.88 0.17 5.98 40.99 5.98 40.99 0 52.86 10.44 40.99 20.79 40.99 15 0 15 1.7 13.1"
                />
            </svg>
            <span className="ratio">@{value} <span>{coin}</span></span>
        </RatioStyleWrapper>
    );
};

export const ItemExchPairArrow = () => (
    <svg
        className="arrow"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 52.86 20.79"
    >
        <polygon
            points="1.7 13.1 42.89 13.1 42.89 16.61 50.01 10.44 42.89 4.18 42.89 7.88 1.87 7.88 0.17 5.98 40.99 5.98 40.99 0 52.86 10.44 40.99 20.79 40.99 15 0 15 1.7 13.1"
        />
    </svg>
);

export const ItemValue = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    min-height: min-content;
    margin: 0 0 7px;
    font-size: 12px;
    font-weight: 400;
    color: ${props => props.theme.palette.exchBarItemLabel};

    span {
        font-size: 11px;
        font-weight: 300;
    }
    
    span.spacer {
        margin: 0 3px;
        font-size: 12px;
        font-weight: 400;
    }
`;

const ItemValueCoinPriceWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-left: ${props => props.align === 'right' ? 'auto' : '4px'};
    font-size: 12px;
    font-weight: 400;
    color: ${props => props.theme.palette.exchBarItemLabel};
`;

export const ItemValueCoinPrice = ({ value, coin, align }) => {
    return (
        <ItemValueCoinPriceWrapper align={align}>
            {value}<ItemExchPairSideIcon value={coin} size={12}/>
        </ItemValueCoinPriceWrapper>
    );
};

const ItemProgressBarStyleWrapper = styled.div.attrs({ className: 'exch-bar-progress-bar' })`
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    width: 100%;
    margin: 0;
    border: none;
    padding: 0;
    
    .track {
        position: relative;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: ${props => props.theme.palette.exchBarItemBg};
        border-radius: 0;
        overflow: hidden;
        display: flex;
        justify-content: ${props => props.isInversed ?  'flex-end' : 'flex-start'};
    }
    
    .progress {
        margin: 0;
        padding: 0;
        top: 0;
        left: 0;
        bottom: 0;
        width: 0;
        // background: linear-gradient(to left, rgba(0, 0, 0, .5), rgba(0, 0, 0, 0));
        transition: .5s linear;
    }
    
    .thumb {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        margin-left: -12px;
        border: 1px solid ${props => props.theme.palette.exchBarItemBorder};
        background: ${props => props.theme.palette.exchBarItemBg};
        border-radius: 6px;
        width: 24px;
        height: 100%;
        transition: .5s linear;
    }
`;

export const ItemProgressBar =
({
    hover,
    color,
    progress,
    isCoinPairInversed,
}) => {
    let color1 = 'red';
    let color2 = '';

    if (Array.isArray(color) && color.length) {
        color1 = color[0];
        color2 = color[1] || null;
    } else {
        color1 = color;
    }

    return (
        <ItemProgressBarStyleWrapper isInversed={isCoinPairInversed} hover={hover} color={color1}>
            <div className="track">
                <div
                    className="progress"
                    style={(color1 && color2)
                        ? {
                            width: `calc(${progress}%)`,
                            backgroundColor: color1,
                            background: `linear-gradient(to left, ${color1}, ${color2})`,
                        }
                        : {
                            width: `calc(${progress}%)`,
                            backgroundColor: color1,
                            opacity: 0.7,
                        }
                    }
                />
            </div>
            {/* <div className="thumb" style={{
                left: `${progress}%`,
                background: color,
            }}/> */}
        </ItemProgressBarStyleWrapper>
    );
};

const LargeIcon = styled.svg`
    width: 100px;
    fill: ${props => props.theme.palette.clrPurple};
    
    @media (max-width: 1700px) {
        width: 70px;
    }
    
    @media (max-width: 1600px) {
        width: 60px;
    }
    
    @media (max-width: 1024px) {
        width: 54px;
    }
`;

export const ArrowIcon = props => (
    <Fragment>
        <LargeIcon
            className="top-bar__icon"
            viewBox="0 0 180 30"
            role="img"
            aria-hidden="true"
            {...props}
        >
            <polygon points="180,15 161,0 161,10 0,10 0,20 161,20 161,30 " />
        </LargeIcon>
    </Fragment>
);

const LargeIcon1 = styled.svg`
    width: 25px;
    fill: ${props => props.theme.palette.clrBorder};
`;

export const ArrowIcon1 = props => (
    <Fragment>
        <LargeIcon1
            className="top-bar__icon"
            viewBox="0 0 3.175 1.5875"
            role="img"
            aria-hidden="true"
            {...props}
        >
            <g transform="translate(0 -295.41)">
                <path d="m0.072164 296.49h2.1819v0.43298c0 0.0193 0.0071 0.0364 0.021441 0.0506 0.014335 0.0143 0.03112 0.0215 0.050722 0.0215 0.020951 0 0.038226-6e-3 0.051825-0.0202l0.72164-0.72176c0.013477-0.0135 0.020216-0.0308 0.020216-0.0519 0-0.0209-0.00674-0.0382-0.020338-0.0518l-0.71919-0.71931c-0.018133-0.0149-0.036144-0.0226-0.054276-0.0226-0.021074 0-0.038349 6e-3 -0.051703 0.0202-0.013476 0.0135-0.020338 0.0308-0.020338 0.052v0.43298h-2.1819c-0.019603 0-0.03651 7e-3 -0.050722 0.0213s-0.021441 0.03116-0.021441 0.05088v0.43285c0 0.0195 0.0072306 0.0364 0.021441 0.0509 0.014212 0.0141 0.03112 0.0213 0.050722 0.0213"/>
            </g>
        </LargeIcon1>
    </Fragment>
);

export const ExCellTable = styled.div.attrs({ className: 'exch-cell-table' })`
    height: 100%;
    ${props => props.isDonutMode ? `
        position: absolute !important;
        top: 0;
        left: 0;
        width: 100%;
        background: ${props => props.theme.palette.clrChartBackground};
    ` : ''};
    
    transform:scale(0.52);
    transform-origin:0 0;
    width: 192.3%;
    height: 192.3%;
`;

export const TotalExchange = styled.div.attrs({ className: 'exch-total-wrapper' })`
    width: 100%;
    height: 12.5%;
    position: absolute;
    bottom: 0;
    padding: 0 12px;
    border: 1px solid ${props => props.theme.palette.clrBorder};
    border-top: 3px solid ${props => props.theme.palette.clrBorder};
    font-weight: 600;
`;

export const ExCellContainer = styled.div`
    position: relative;
    height: 100%;
    border: 1px solid ${props => props.theme.palette.clrBorder};
    border-radius: ${props => props.theme.palette.borderRadius};
    
    .ps__rail-y {
        background-color: transparent !important;
        // border-left: 1px solid ${props => props.theme.palette.walletScrollBorder};
        border-top: 1px solid ${props => props.theme.palette.clrBorder};
        opacity: 0 !important;
        
        .ps__thumb-y {
            z-index: 9999;
            cursor: pointer;
            
            &:before {
                background-color: ${props => props.theme.palette.walletScrollThumbBack};
            }
        }
    }
    
    .scroll__scrollup {
        right: 21px !important;
        z-index: 100;
    }
    
    .exchange_cells {
        padding-right: ${props => props.hasPadding ? '15px' : 0};
        height: 100%;
        // border-top: 1px solid ${props => props.theme.palette.clrBorder};
    }
`;

export const TopSwitchWrapper = styled.div`
    border-bottom: 1px solid ${props => props.theme.palette.clrBorder};
    height: 54px;
    overflow: hidden;
`;

export const StyleWrapper = styled.div`
    width: ${props => props.width}px;
    height: ${props => props.height * (props.isLeftTop ? 1 : 0.875)}px;
`;
export const ExchangeInfoWrapper = styled.div.attrs({ className: 'exchange-info-wrapper' })`
    font-size: 33px;
    height: 100%;
    width: 100px;
    padding-left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: 1px solid ${props => props.theme.palette.clrInnerBorder};
    // padding-left: 10px;
    ${IconStyleWrapper} {
        // padding-right: 10px;
    }
    ${props => props.active && `color: ${props.theme.palette.clrHighContrast};`}
    .exchange-name {
        width: 117px;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        // padding-right: 10px;
        ${props => props.active && `color: ${props.theme.palette.clrHighContrast};`}
    }
    .display-flex {
        position: relative;
        width: 70px;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        .CircularProgressbar-text {
            font-weight: 700;
        }
        .CircularProgressbar-path {
            transform-origin: center;
            ${props => props.rotateDegree && `transform: rotate(${props.rotateDegree}deg);`}
        }

        .percentage-badge {
            position: absolute;
            top: 7px;
            right: 7px;
            color: white;
            font-size: 10px;
            font-weight: bold;
        }
    }

    .CircularProgressbar-text {
        transform: translateY(3px);
    }

    .percentage {
        display: flex;
        position: absolute;
        color: ${props => props.theme.palette.clrHighContrast};
        font-size: 33px;
        font-weight: 500;
        line-height: 40px;
        text-shadow:
         -1px -1px 0 ${props => props.theme.palette.clrBorder},  
          1px -1px 0 ${props => props.theme.palette.clrBorder},
          -1px 1px 0 ${props => props.theme.palette.clrBorder},
           1px 1px 0 ${props => props.theme.palette.clrBorder};
        .percent-symbol{
            font-size: 17px;
            margin-top: -7px;
            width: 0;
        }
    }
`;

export const TooltipContent = styled.div`
   display: flex;
   
   .tooltip-icon {
       border: 1px solid #454c73;
       border-radius: 50%;
       width: 20px;
       height: 20px;
       background: url(img/exchange/${props => props.value}.png) no-repeat;
       background-position: center;
       background-size: cover;
       margin-right: 3px;
   }
`;