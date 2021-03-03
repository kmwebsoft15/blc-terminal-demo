import React, { Fragment } from 'react';
import styled, { keyframes, css } from 'styled-components/macro';

export const OrdersWrapper = styled.div.attrs({ className: 'orders-history-wrapper' })`
    position: relative;
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    background: ${props => props.theme.palette.clrBackground};
    border-radius: ${props => props.theme.palette.borderRadius};
    font-size: 14px;
    line-height: 1.2;
    color: ${props => props.theme.palette.orderHistoryText};
    border: 2px solid ${props => props.theme.palette.clrBorder};
    
    > div {
        height: 100%;
    }
    
    .scroll__scrollup {
        right: 21px;
        bottom: 6px;
    }
    
    .ps__rail-y {
        display: none !important;
        background-color: ${props => props.theme.palette.orderHistoryBackground} !important;
        // border-top: 1px solid ${props => props.theme.palette.orderHistoryInnerBorder};
        border-left: 2px solid ${props => props.theme.palette.orderHistoryBorder};
        opacity: 0 !important;
        
        .ps__thumb-y {
            z-index: 9999;
            cursor: pointer;
            
            &:before {
                background-color: ${props => props.theme.palette.orderHistoryBorder};
            }
        }
    }
    
    @media (max-width: 1700px) {
        transform: scale(0.93);
        transform-origin: 0 0;
        width: ${props => props.width * 1.0752}px;
        height: ${props => props.height * 1.0752}px;
    }
    
    @media (max-width: 450px) {
        transform: scale(0.73);
        transform-origin: 0 0;
        width: ${props => props.width * 1.3698}px;
        height: ${props => props.height * 1.3698}px;
    }
    
    @media (max-width: 350px) {
        transform: scale(0.53);
        transform-origin: 0 0;
        width: ${props => props.width * 1.8867}px;
        height: ${props => props.height * 1.8867}px;
    }
    
    ${({ isMobileLandscape, width, height }) => {
        if (isMobileLandscape) {
            return `
                transform: scale(0.6) !important;
                transform-origin: 0 0 !important;
                width: ${width * 1.666}px !important;
                height: ${height * 1.666}px !important;
            `;
        }
    }};
`;

export const TableHeader = styled.div`
    height: ${props => props.height}px;
    // padding-right: ${props => props.length > 4 ? '15px' : 0};
    display: flex;
    background-color: ${props => props.theme.palette.orderHistoryHeaderBackground};
    border-bottom: 2px solid ${props => props.theme.palette.orderHistoryBorder};
    font-weight: 600;
    color: ${props => props.theme.palette.orderHistoryHeader};
`;

export const Tab = styled.div`
    padding: 8px;
    z-index: 100;
    font-weight: 400;
    color: ${props => props.active ? props.theme.palette.orderHistoryHeaderTabActive : props.theme.palette.orderHistoryHeaderTab};
    cursor: pointer;
    margin-right: ${props => props.marginRight ? 10 :  0}px;
`;

export const ProgressWrapper = styled.div`
    width: 38px;
    height: 38px;
`;

export const TableBody = styled.div`
    height: 100%;
`;

const growAnim = keyframes`
    0% { width: 0; }
    50% { width: 100%; }
    100% { width: 100%; }
`;

const dropAnim = keyframes`
    0% { margin-top: -${props => props.height * 2}px; }
    10% { margin-top: 0; }
    100% { margin-top: 0; }
`;

const slideLeftAnimFirst = keyframes`
    0% { width: 99%; }
    50% { width: 99%; }
    50% { width: 99%; }
    100% { width: 0%; }
`;
const slideLeftAnimSecond = keyframes`
    0% { width: 99%; }
    50% { width: 0%; }
    50% { width: 0%; }
    100% { width: 0%; }
`;

export const Row = styled.div`
    position: relative;
    height: calc(16.67% - 4px);
    margin-bottom: ${props => (props.isBuy && !props.last) && '12px'};
    display: block;
    border: 1px solid ${props => props.theme.palette.clrBorder};
    border-bottom: ${props => (!props.isBuy && !props.last) && '0px'};
    border-top: ${props => (props.isBuy && !props.isFailed) && '0px'};
    border-radius: ${props => `${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius} 0 0`};
    font-size: 12px;
    background: ${props => props.theme.palette.clrChartBackground};
    
    ${props => props.isOrderStarted && props.index === 0 && css`
        animation: ${dropAnim} 10s linear;
        margin-top: 0;
    `}
    
    &:hover {
        ${props => props.index > 1 && `
            background-color: ${props.isArrowBuy ? props.theme.palette.btnPositiveBg : props.theme.palette.btnNegativeBg};
            color: ${props.theme.palette.orderHistoryHoverText};
            .mask-animation {
                background-color: ${props.isArrowBuy ? props.theme.palette.btnPositiveBg : props.theme.palette.btnNegativeBg} !important;
            }
        `}
        
        .wrapper_arrow {
            .type-label {
                color: ${props => props.isArrowBuy ? props.theme.palette.btnPositiveBg : props.theme.palette.btnNegativeBg} !important;
            }
            
            svg, svg * {
                fill: ${props => props.theme.palette.orderHistoryHoverText};
            }
        }

        .status-btn {
            border-color: ${props => props.theme.palette.orderHistoryBtnHoverBorder};
            color: ${props => props.theme.palette.orderHistoryBtnHover};            
        }
        
        .arrow-group{
            visibility: initial;
        }

        .icon-wrapper {
            svg, svg * {
                fill: ${props => props.theme.palette.orderHistoryHoverText} !important;
            }
        }
    }

    .info-arrow {
        position: absolute;
        display: flex;
        top: calc(100% - 13px);
        left: ${props => !props.isDefaultCrypto ? '17px' : ''};
        right: ${props => props.isDefaultCrypto ? '5%' : ''};
        z-index: 100;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin: 0;
        border: none;
        background: transparent;

        .exch-form__switch-arrows {
            width: 25px;
            transition: all .3s;
            transform: rotate(-90deg);
            stroke: ${props => props.theme.palette.coinPairSwitchBtnFill};
            fill: ${props => props.theme.palette.clrHighContrast};
        }
    }
    
    .arrow-group{
        background-size: cover !important;
        background: url(./img/redarrow.png) no-repeat;
        position: absolute;
        top: -23px;
        right: 24px;
        width: 35px;
        height: 50px;
        z-index: 1000;
        visibility: hidden;
        white-space: nowrap;
        display: flex;
        padding-bottom: 10px;
        justify-content: center;
    }
    .arrow-group.buy{
        top: calc(-30px - 100%);
    }
    .arrow-group.sell{
        top: -30px;
    }
    .arrow-group.left{
        left: 18px;        
    }
    .arrow-group span{
        width: 5px;
        height: 100%;
        color: white;
        font-size: 4.8px;
        writing-mode: vertical-lr;
        transform: rotate(180deg);
    }
    ${props => props.index < 2 && props.animatable && `
        &::before {
            content: '';
            position: absolute;
            left: ${props.isArrowBuy ? 'unset' : 0};
            top: 0;
            right: ${props.isArrowBuy ? 0 : 'unset'};
            bottom: 0;
            background: linear-gradient(90deg, ${props.isArrowBuy ? '#0000' : props.theme.palette.btnNegativeBg} ${props.isArrowBuy ? 0 : 100}%, ${props.isArrowBuy ? props.theme.palette.btnPositiveBg : '#0000'} ${props.isArrowBuy ? 0 : 100}%);
        }
    `};
    
    @media (max-width: 1200px) {
        margin-bottom: ${props => (props.isBuy && !props.last) && '12px'};
        height: calc(12.5% - 5px);
    }
            
    @media (max-width: 800px) {
        margin-bottom: ${props => (props.isBuy && !props.last) && '16px'};
        height: calc(12.5% - 6px);
    }
    
    @media (max-width: 450px) {
        margin-bottom: ${props => (props.isBuy && !props.last) && '18px'};
        height: calc(12.5% - 8px);
    }
    
    @media (max-width: 350px) {
        margin-bottom: ${props => (props.isBuy && !props.last) && '22px'};
        height: calc(12.5% - 10px);
    }
`;

export const MaskAnimation = styled.div.attrs({ className: 'mask-animation' })`
    height: 100%;
    background: ${props => props.theme.palette.clrChartBackground};
    position: absolute;
    align-self: ${props => props.isBuy ? 'flex-end' : 'flex-start'};
    ${props => props.isBuy ? 'right: 0' : 'left: 0'};
    ${props => props.isOrderStarted && props.index < 2 ? `
        width: 99%;
    ` : 'width: 0%;'};
    ${props => props.isNumberFilled && props.index < 2 && css`
        animation: ${props.index === 0 ? slideLeftAnimFirst : slideLeftAnimSecond} 10s linear;
    `}
`;

export const Column = styled.div.attrs({ className: 'history-column' })`
    height: 100%;
    width: 100%;
    padding: 0 18px 0 12px;
    padding-right: ${props => props.isHeader ? '23px' : ''};
    flex: 1;
    flex-shrink: 0;
    display: flex;
    flex-direction: ${props => props.isColumn ? 'column' : 'row'};
    // align-items: ${props => props.isHeader ? 'flex-end' : 'center'};
    // border-right: 2px solid ${props => props.theme.palette.orderHistoryInnerBorder};
    overflow: hidden;
    text-overflow: ellipsis;

    * {
        z-index: 1;
    }

    ${props => props.isColumn ? `
        > div {
            display: flex;
            align-items: center;
            white-space: nowrap;
        }
    ` : ''};

    .status-date {
        color: ${props => props.theme.palette.orderHistoryBtnHover};            
    }
    
    span {
        font-size: 28px;
        font-weight: 600px;
        letter-spacing: 1px;
    }
 ${({ isMobileLandscape }) => {
        if (isMobileLandscape) {
            return `
                @media (max-width: 1400px) {
                    span {
                        font-size: 68px;
                    }
                }
                @media (max-width: 900px) {
                    span {
                        font-size: 28px;
                    }
                }
            `;
        }
        return `
            @media (max-width: 1200px) {
                span {
                     font-size: 48px;
                 }
            }
            
            @media (max-width: 800px) {
                span {
                    font-size: 38px;
                }
            }
            
            @media (max-width: 450px) {
                span {
                    font-size: 33px;
                }
            }
            
            @media (max-width: 350px) {
                 span {
                    font-size: 38px;
                }
            }
        `;
    }};

    .icon-wrapper {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        margin: 0;
        border: none;
        padding: 0;
        width: 70px;
        height: 100%;
        
        svg, svg * {
            fill: ${props => props.index !== 0 ? props.theme.palette.userMenuPopupMenuItem : props.theme.palette.userMenuPopupMenuItemHover} !important;
        }
    }
    
    .failed {
        color: ${props => props.theme.palette.clrLightRed};
        font-weight: bold;
    }
    
    ${props => props.isHighlight ? `
        font-weight: 500;
        color: ${props.theme.palette.orderHistoryHoverText};
    ` : ''};
`;

export const ButtonWrapper = styled.div`
    width: 100%;
    height: 32px;
    
    button {
        width: 100%;
        height: 100%;
        border-radius: ${props => props.theme.palette.borderRadius};
        font-size: 14px;
        cursor: pointer;
        outline: none;
    }
    
    .status-btn {
        background-color: transparent;
        border: 2px solid ${props => props.theme.palette.orderHistoryText};
        color: ${props => props.theme.palette.orderHistoryText};
    }
    
    .status-cancel {
        display: none;
        background-color: ${props => props.theme.palette.orderHistoryBtnCancelBackground};
        border: 0;
        color: ${props => props.theme.palette.orderHistoryBtnHover};
    }
    
    ${props => !props.isDone ? `
        &:hover {
            .status-btn {
                display: none;
            }
            
            .status-cancel {
                display: block;
            }
        }
    ` : ''};
`;

const CustomSvg = styled.svg`
    width: 24px;
    height: 18px;
    margin-right: 10px;
    fill: ${props => props.theme.palette.orderHistoryArrow};
`;

export const Arrow = props => (
    <CustomSvg {...props} viewBox="0 0 21.45 16.74">
        <polygon points="7.04 16.74 0 10.5 7.04 4.31 7.04 7.83 15.49 7.83 15.49 9.93 19.75 6.24 15.49 2.5 15.49 4.71 9.31 4.71 9.31 3.58 14.36 3.58 14.36 0 21.45 6.24 14.36 12.43 14.36 8.97 5.9 8.97 5.9 6.81 1.7 10.5 5.9 14.24 5.9 12.09 12.14 12.09 12.14 13.22 7.04 13.22 7.04 16.74"/>
    </CustomSvg>
);

export const InfoTooltip = styled.div`
    max-width: 400px;
    max-height: calc(100vh - 100px) !important;
    overflow: auto;
    .info-arrow-directional {
        height: 100%;
        text-align: center;

        .info-title {
            display: flex;
            justify-content: center;
            align-items: center;
            
            .info-direction {
                margin-left: 5px;
            }
        }

        .label-arrow-text {
            margin: 0 10px;
            text-align: left;
            .title {
                text-align: center;
            }
        }
                
        .label-arrow-info {
            color: ${props => props.isArrowBuy ? '#01B067' : '#09f'};
            font-size: 18px;
        }
        
        .wrapper_arrow {
            .arrow-icon {
                width: 35px;
            }
            .warning-icon {
                position: absolute;
                width: 16px;
                height: 16px;
            }
        }
        .label-arrow-info {
            padding-top: 4px;
        }
    }`;

export const InfoHistory = styled.div.attrs({ className: 'history-info-wrapper' })`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    float: ${props => props.isBuy ? 'left' : 'right'};
    
    .history-row-tooltip {
        position: relative;
    }
    > div {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .RightValue{
        background: linear-gradient(to top, rgba(27, 28, 61, 0.5) 85%, transparent 15%);
        height: 100%;
        justify-content: center;
        display: flex;
        align-items: center;
        padding: 0 10px;
        text-align: center;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }
    .LeftValue{
        height: 100%;
        background: linear-gradient(to bottom, rgba(27, 28, 61, 0.5) 85%, transparent 15%);
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }
    .info-send-section,
    .info-get-section {
        width: 280px;
        height: 100%;
    }

    .info-send-section {
        position: relative;
        justify-content: flex-start;
        color: ${props => (props.isCoinPairInversed && props.isEstimateDataSet && props.isActiveLine) && props.theme.palette.clrMouseClick};
        > span {
            padding-left: 12px;
        }
    }

    .info-get-section {
        position: relative;
        justify-content: flex-end;
        color: ${props => (!props.isCoinPairInversed && props.isEstimateDataSet && props.isActiveLine) && props.theme.palette.clrMouseClick};

        .orderhistory__wallet-btn {
            min-width: 260px;
        }
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
            justify-content: ${props => props.isArrowBuy ? 'flex-end' : 'flex-start'};
            align-items: center;     
            .arrow-icon-group {
                fill: ${props => props.index >= 2 ? props.theme.palette.clrHighContrast : props.isArrowBuy ? props.theme.palette.btnPositiveBg : props.theme.palette.btnNegativeBg};    //set arrow icon fill color
                ${props => props.isArrowBuy && 'transform: rotate(180deg);'} 
            }
            
            .warning-icon {
                position: absolute;
            }
            
            .type-label {
                position: absolute;
                font-size: 9px;
                font-weight: 700;
                ${props => props.isArrowBuy ? 'margin-right: 3px;' : 'margin-left: 3px;'}
                color: ${props => props.progress ? props.isArrowBuy ? props.theme.palette.btnPositiveBg : props.theme.palette.btnNegativeBg : props.theme.palette.clrHighContrast};
            }
        }
        
        .label-changes-amount {
            position: absolute;
            top: 64%;
            color: ${props => props.theme.palette.clrHighContrast};
            font-size: 12px;             
        }
    }
    ${({ isMobileLandscape }) => {
        if (isMobileLandscape) {
            return `
             @media (max-width: 1400px) {
                .info-send-section,
                .info-get-section {
                     width: 620px;
                }
             }
             @media (max-width: 1100px) {
                .info-send-section,
                .info-get-section {
                     width: 520px;
                }
             }
             @media (max-width: 900px) {
                .info-send-section,
                .info-get-section {
                     width: 380px;
                }
             }
             @media (max-width: 700px) {
                .info-send-section,
                .info-get-section {
                     width: 320px;
                }
             }
             @media (max-width: 600px) {
                .info-send-section,
                .info-get-section {
                     width: 280px;
                }
             }
            `;
        }
        return `
        @media (max-width: 1200px) {
             .info-send-section,
             .info-get-section {
                width: 640px;
                }
            }
        @media (max-width: 800px) {
            .info-send-section,
            .info-get-section {
                width: 460px;
            }
        }
        @media (max-width: 450px) {
            .info-send-section,
            .info-get-section {
                width: 340px;
            }
        }
        @media (max-width: 380px) {
            .info-send-section,
            .info-get-section {
                width: 300px;
            }
        }
        @media (max-width: 350px) {
            .info-send-section,
            .info-get-section {
                width: 340px;
            }
        }
        
        `;
    }};

`;

const WarningSvg = styled.svg`
    width: 16px;
    height: 16px;
    fill: ${props => props.theme.palette.clrHighContrast};
`;

export const WarningIcon = props => (
    <WarningSvg {...props} viewBox="0 0 286.054 286.054">
        <path
            d="M143.027,0C64.04,0,0,64.04,0,143.027c0,78.996,64.04,143.027,143.027,143.027
            c78.996,0,143.027-64.022,143.027-143.027C286.054,64.04,222.022,0,143.027,0z M143.027,259.236
            c-64.183,0-116.209-52.026-116.209-116.209S78.844,26.818,143.027,26.818s116.209,52.026,116.209,116.209
            S207.21,259.236,143.027,259.236z M143.036,62.726c-10.244,0-17.995,5.346-17.995,13.981v79.201c0,8.644,7.75,13.972,17.995,13.972
            c9.994,0,17.995-5.551,17.995-13.972V76.707C161.03,68.277,153.03,62.726,143.036,62.726z M143.036,187.723
            c-9.842,0-17.852,8.01-17.852,17.86c0,9.833,8.01,17.843,17.852,17.843s17.843-8.01,17.843-17.843
            C160.878,195.732,152.878,187.723,143.036,187.723z"
        />
    </WarningSvg>
);

const LargeIcon1 = styled.svg`
    width: 50px;
    fill: ${props => props.theme.palette.clrBorder};
`;

export const LongArrow = props => (
    <Fragment>
        <LargeIcon1
            className="top-bar__icon"
            viewBox="0 0 8.8106 6.7733"
            role="img"
            aria-hidden="true"
            {...props}
        >
            <g transform="matrix(1.2645 0 0 1.2645 -2.3188 -365.95)" strokeMiterlimit="10" strokeWidth=".26327">
                <path d="m2.1205 292.68h4.6888v0.93039c0 0.0419 0.015007 0.0782 0.045808 0.10899 0.030802 0.0305 0.067133 0.0461 0.10899 0.0461 0.045019 0 0.082403-0.0145 0.11136-0.0434l1.5506-1.5509c0.028959-0.0287 0.043439-0.0661 0.043439-0.11136 0-0.045-0.014481-0.0821-0.043702-0.1111l-1.5454-1.5459c-0.038963-0.0321-0.077664-0.0484-0.11663-0.0484-0.045282 0-0.082403 0.0145-0.1111 0.0437-0.028959 0.0287-0.043439 0.0661-0.043439 0.11136v0.93038h-4.6888c-0.042123 0-0.078454 0.015-0.10899 0.0458-0.030539 0.0311-0.046072 0.0671-0.046072 0.10926v0.93012c0 0.0421 0.015533 0.0784 0.046072 0.10926 0.030539 0.0303 0.06687 0.0458 0.10899 0.0458z"/>
            </g>
        </LargeIcon1>
    </Fragment>
);

export const SvgTop = styled.svg.attrs({ className: 'wallet-top-icon' })`
    position: absolute;
    left: -2px;
    right: -2px;
    top: -4px;
    width: calc(100% + 4px);
    height: 9px;
    fill: ${props => props.theme.palette.clrBackground};
    stroke: ${props => props.theme.palette.clrInnerBorder};
    stroke-miterlimit: 10;
    stroke-width: 2px;
    margin: 0 !important;
`;

export const WalletTopIcon = () => (
    <SvgTop viewBox="0 0 178.06 11.95" preserveAspectRatio="none">
        <path d="M174.06,1H6A5,5,0,0,0,1,6H1a5,5,0,0,0,5,5H177.06V4A3,3,0,0,0,174.06,1Z" />
        <line x1="169.29" y1="5.97" x2="172.34" y2="5.97" />
        <line x1="6.03" y1="5.97" x2="165.85" y2="5.97" />
    </SvgTop>
);


export const SvgSide = styled.svg.attrs({ className: 'wallet-side-icon' })`
    position: absolute;
    right: -8px;
    top: calc(50% - 15px);
    // width: 23px;
    height: 30px;
    fill: ${props => props.theme.palette.clrBackground};
    stroke: ${props => props.theme.palette.clrInnerBorder};
    stroke-miterlimit: 10;
    stroke-width: 1px;
    margin: 0 !important;
    // ${props => props.isRight ? 'left: -8px; right: initial;' : 'right: -8px; left: initial;'}
    right: -5px;
    left: initial;
    // ${props => props.isRight && 'transform: scaleX(-1);'} 
`;

export const WalletSideIcon = props => (
    <SvgSide viewBox="0 0 22.47 19.27" {...props}>
        <path d="M9.63,1h8.83a3,3,0,0,1,3,3V15.27a3,3,0,0,1-3,3H9.63A8.63,8.63,0,0,1,1,9.63v0A8.63,8.63,0,0,1,9.63,1Z" />
        <circle cx="9.68" cy="9.63" r="3.11" />
    </SvgSide>
);

export const CoinIconWrapper = styled.div`
    // margin-left: 5px;
`;

const BTCFontIconWrapper = styled.span`
    font-family: BTC, sans-serif;
`;
export const BTCFontIcon = () => (
    <BTCFontIconWrapper className="CurrencySymbol">BTC</BTCFontIconWrapper>
);

const FatIcon = styled.svg`
    // width: 25px;
    // position: absolute;
    // fill: ${props => props.over ? props.theme.palette.clrBorder : 'white'};
    flex-shrink: 0;
    width: 35px;
`;

export const ArrowIcon = props => (
    <FatIcon
        className="top-bar__icon"
        viewBox="0 0 4.7625 2.6458"
        role="img"
        aria-hidden="true"
        {...props}
    >
        <g transform="translate(0 -294.35)">
            <g transform="matrix(.0064849 0 0 .0064849 3.9451 294.35)">
                <g transform="matrix(149.4 0 0 154.2 -907.11 -45390)">
                    <g transform="matrix(.0064849 0 0 .0064849 3.9451 294.35)">
                        <polygon points="204 306 -300 306 -300 102 204 102 204 0 458 204 204 408"/>
                    </g>
                </g>
            </g>
        </g>
    </FatIcon>
);
const ArrowIconWrapper = styled.div.attrs({ className: 'arrow-icon-wrapper' })`
    display: flex;
    justify-content: end;
    align-items: center;
    overflow: hidden;
    position: absolute;
`;

const arrowAnim = (isBuy) => keyframes`
    0% { width: 0; }
    ${isBuy ? 60 : 85}% { width: 0; }
    ${isBuy ? 65 : 90}% { width: 100%; }
`;

const ArrowIconGroup = styled.div.attrs({ className: 'arrow-icon-group' })`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 35px;
    height: 35px;
    .arrow-icon-wrapper:last-child {
        position: relative;
        svg {
            fill: ${props => props.theme.palette.clrHighContrast};
        }
        
        ${props => props.isAnimate
            ? css`animation: ${arrowAnim(props.isBuy)} 10s linear;` : 
            'width: 0%;'
        }
    }
`;
export const ArrowIconAnim = props => (
    <ArrowIconGroup {...props}>
        <ArrowIconWrapper {...props}>
            <ArrowIcon/>
        </ArrowIconWrapper>
        <ArrowIconWrapper {...props}>
            <ArrowIcon/>
        </ArrowIconWrapper>
    </ArrowIconGroup>
);
const PieChartSvg = styled.svg`
    width: 35px;
    height: 35px;
    fill: ${props => props.isArrowBuy ? '#01B067' : '#09f'};
    cursor: pointer;
`;

export const PieChartIcon = props => (
    <PieChartSvg {...props} viewBox="0 0 57.924 57.924">
        <g transform="matrix(-1 7.34788e-16 7.34788e-16 1 57.924 -1.06581e-14)">
            <g>
                <path d="M31,26.924h26.924C56.94,12.503,45.421,0.983,31,0V26.924z" />
                <path d="M50.309,48.577c4.343-4.71,7.151-10.858,7.614-17.653H32.656L50.309,48.577z" />
                <path d="M27,30.924V0C11.918,1.028,0,13.58,0,28.924c0,16.016,12.984,29,29,29   c6.99,0,13.396-2.479,18.401-6.599L27,30.924z" />
            </g>
        </g>
    </PieChartSvg>
);


const keyFrameSpin = keyframes`
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
`;

export const CircleSpinner = styled.div` 
    display: block;
    // width: ${props => props.width ? props.width : 50}px;
    // height: ${props => props.height ? props.height : 50}px;
    // margin: -25px 0 0 -25px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: ${props => props.theme.palette.clrHighContrast};
    animation: ${keyFrameSpin} 1s linear infinite;
    
    position: absolute;
    // left: calc(50% - ${props => props.width ? props.width / 2 : 25}px);
    // top: calc(50% - ${props => props.height ? props.height / 2 : 25}px);
    z-index: 99999;
    ${props => props.isLeft ? 'left: -20px' : 'right: -18px'};
`;

export const ArrowConnectionIcon = props => (
    <div
        className="info-arrow"
        {...props}
    >
        <svg
            className="exch-form__switch-arrows"
            viewBox="0 0 45.402 45.402"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g>
                <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141 c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27 c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435 c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z" />
            </g>
        </svg>
    </div>
);

export const ArrowWrapper = styled.div``;

export const ArrowGroupIcon = props => (
    <ArrowWrapper
        className={`arrow-group ${props.isBuy ? 'buy' : 'sell'} ${props.isDefaultCrypto ? 'left' : ''} `}
        {...props}
    >
    </ArrowWrapper>
);

const BTCSvg = styled.svg`
    width: 25px;
    height: 25px;
`;

export const BTCIcon = (props) => (
    <BTCSvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 226.777 226.777" >
        <path d="M182.981 112.854c-7.3-5.498-17.699-7.697-17.699-7.697s8.8-5.102 12.396-10.199c3.6-5.099 5.399-12.999 5.7-17.098.299-4.101 1-21.296-12.399-31.193-10.364-7.658-22.241-10.698-38.19-11.687V.278h-21.396V34.57H95.096V.278H73.702V34.57H31.61v22.219h12.372c3.373 0 9.372.375 11.921 3.228 2.55 2.848 3 4.349 3 9.895l.001 88.535c0 2.099-.4 4.697-2.201 6.398-1.798 1.701-3.597 2.098-7.898 2.098H36.009l-4.399 25.698h42.092v34.195h21.395v-34.195h16.297v34.195h21.396v-34.759c5.531-.323 10.688-.742 13.696-1.136 6.1-.798 19.896-2.398 32.796-11.397 12.896-9 15.793-23.098 16.094-37.294.304-14.197-5.102-23.897-12.395-29.396zM95.096 58.766s6.798-.599 13.497-.501c6.701.099 12.597.3 21.398 3 8.797 2.701 13.992 9.3 14.196 17.099.199 7.799-3.204 12.996-9.2 16.296-5.998 3.299-14.292 5.099-22.094 5.396-7.797.301-17.797 0-17.797 0v-41.29zm47.89 102.279c-4.899 2.701-14.698 5.1-24.194 5.798-9.499.701-23.696.401-23.696.401v-45.893s13.598-.698 24.197 0c10.597.703 19.495 3.4 23.492 5.403 3.999 1.998 11 6.396 11 16.896 0 10.496-5.903 14.696-10.799 17.395z"/>
    </BTCSvg>
);

export const ScanContainer = styled.div.attrs({ className: 'scan-container' })`
    position: absolute;
    z-index: 1000;
    left: calc(50% - 20px);
    width: 40px;
    bottom: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .on {
        background-color: #fff8;
    }
    .off {
        background-color: #fff4;
    }
`;

export const ScanIcon = styled.div.attrs({ className: 'scan-icon' })`
    width: 10px;
    height: 10px;
    border-radius: 50%;
`;