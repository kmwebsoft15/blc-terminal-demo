import React from 'react';
import styled, { keyframes, css } from 'styled-components/macro';
import { BuyArrowIcon, SellArrowIcon } from '@/components-generic/ArrowIcon'

export const OrdersWrapper = styled.div`
    position: relative;
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    background: ${props => props.theme.palette.clrBackground};
    border-radius: ${props => props.theme.palette.borderRadius};
    font-size: 14px;
    line-height: 1.2;
    color: ${props => props.theme.palette.orderHistoryText};
    overflow: hidden;
    
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

const dropAnim = (height) => keyframes`
    0% { margin-top: ${-0.5 * height - 6}px; }
    100% { margin-top: 0; }
`;
export const RowWrapper = styled.div`
    position: relative;
    height: ${props => props.isWhite ? 'calc(25% - 3px)' : '50%' };
    margin-bottom: ${props => !props.isBuy && '12px'};
    display: block;
    border: 1px solid ${props => props.theme.palette.clrBorder};
    border-bottom: ${props => props.isBuy && '0px'};
    border-top: ${props => !props.isBuy && '0px'};
    border-radius: ${props => `${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius} 0 0`};
    font-size: 12px;
    background: ${props => props.theme.palette.clrChartBackground};
    
    ${props => !props.animatable && props.isBuy && !props.isWhite && css`
        margin-top: ${props => -0.5 * props.height - 6}px;
    `}
    
    ${props => props.animatable === 1 && props.isBuy && !props.isWhite && css`
        animation: ${props => dropAnim(props.height)} 2s linear;
        margin-top: 0;
    `}
    
    ${props => props.animatable === 2 && props.isBuy && !props.isWhite && css`
        margin-top: 0;
    `}
`;

export const InfoHistory = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;

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
            color: ${props => props.isBuy ? '#01B067' : '#09f'};
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

export const InfoSendSection = styled.div.attrs({ className: 'info-send-section' })`
    width: 260px;
    height: 100%;
    position: relative;
    justify-content: flex-start;
`;

export const InfoGetSection = styled.div.attrs({ className: 'info-get-section' })`
    width: 260px;
    height: 100%;
    position: relative;
    justify-content: flex-end;
`;

const BTCSvg = styled.svg`
    width: 25px;
    height: 25px;
`;

export const BTCIcon = () => (
    <BTCSvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 226.777 226.777" >
        <path d="M182.981 112.854c-7.3-5.498-17.699-7.697-17.699-7.697s8.8-5.102 12.396-10.199c3.6-5.099 5.399-12.999 5.7-17.098.299-4.101 1-21.296-12.399-31.193-10.364-7.658-22.241-10.698-38.19-11.687V.278h-21.396V34.57H95.096V.278H73.702V34.57H31.61v22.219h12.372c3.373 0 9.372.375 11.921 3.228 2.55 2.848 3 4.349 3 9.895l.001 88.535c0 2.099-.4 4.697-2.201 6.398-1.798 1.701-3.597 2.098-7.898 2.098H36.009l-4.399 25.698h42.092v34.195h21.395v-34.195h16.297v34.195h21.396v-34.759c5.531-.323 10.688-.742 13.696-1.136 6.1-.798 19.896-2.398 32.796-11.397 12.896-9 15.793-23.098 16.094-37.294.304-14.197-5.102-23.897-12.395-29.396zM95.096 58.766s6.798-.599 13.497-.501c6.701.099 12.597.3 21.398 3 8.797 2.701 13.992 9.3 14.196 17.099.199 7.799-3.204 12.996-9.2 16.296-5.998 3.299-14.292 5.099-22.094 5.396-7.797.301-17.797 0-17.797 0v-41.29zm47.89 102.279c-4.899 2.701-14.698 5.1-24.194 5.798-9.499.701-23.696.401-23.696.401v-45.893s13.598-.698 24.197 0c10.597.703 19.495 3.4 23.492 5.403 3.999 1.998 11 6.396 11 16.896 0 10.496-5.903 14.696-10.799 17.395z"/>
    </BTCSvg>
);

export const InfoArrow = styled.div`
    height: 100%;
    display: flex;
    ${props => props.isBuy ? `
        justify-content: flex-end;
        align-items: flex-end;
        padding-bottom: 32px;
        ` : `
        justify-content: flex-start;
        align-items: flex-start;
        padding-top: 32px;
    `}
    
`;

const FatIcon = styled.svg`
    flex-shrink: 0;
    width: 35px;
`;

export const ArrowIcon = () => (
    <FatIcon
        className="top-bar__icon"
        viewBox="0 0 4.7625 2.6458"
        role="img"
        aria-hidden="true"
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
    ${props => props.isBuy && 'justify-content: flex-end;'}
    align-items: center;
    overflow: hidden;
    position: absolute;
`;

const arrowAnim = (start) => keyframes`
    0% { width: 0; }
    ${start}% { width: 0; }
    ${start + 10}% { width: 100%; }
    100% { width: 100%; }
`;

const ArrowIconGroup = styled.div`
    display: flex;
    ${props => props.isBuy && 'justify-content: flex-end;'}
    align-items: center;
    width: 30px;
    height: 30px;
    fill: ${props => props.isBuy ? props.theme.palette.btnPositiveBg : props.theme.palette.btnNegativeBg};

    .arrow-icon-wrapper:last-child {
        position: relative;
        width: 0;

        svg {
            fill: ${props => props.theme.palette.clrHighContrast};
        }
        
        ${props => props.isWhite && css`
            width: 100%;
        `}
        
        ${props => props.animatable && !props.isWhite && css`
            animation: ${arrowAnim(props.isBuy ? 70 : 20)} 5s linear;
            width: 100%;
        `}
    }
`;
export const ArrowIconAnim = (props) => (
    <ArrowIconGroup {...props}>
        <ArrowIconWrapper {...props}>
            {props.isBuy ? <BuyArrowIcon className='trading-arrow' withText /> : <SellArrowIcon className='trading-arrow' withText />}
        </ArrowIconWrapper>
        <ArrowIconWrapper {...props}>
            {props.isBuy ? <BuyArrowIcon className='trading-arrow' withText /> : <SellArrowIcon className='trading-arrow' withText />}
        </ArrowIconWrapper>
    </ArrowIconGroup>
);

export const SvgSide = styled.svg`
    position: absolute;
    right: -8px;
    top: calc(50% - 15px);
    height: 30px;
    fill: ${props => props.theme.palette.clrBackground};
    stroke: ${props => props.theme.palette.clrInnerBorder};
    stroke-miterlimit: 10;
    stroke-width: 1px;
    margin: 0 !important;
    right: -5px;
    left: initial;
    
    circle {
      fill: ${props => props.theme.palette.clrBorder};
    }
    
    path {
      fill: transparent;
    }
`;

export const WalletSideIcon = () => (
    <SvgSide viewBox="0 0 22.47 19.27">
        <path d="M9.63,1h8.83a3,3,0,0,1,3,3V15.27a3,3,0,0,1-3,3H9.63A8.63,8.63,0,0,1,1,9.63v0A8.63,8.63,0,0,1,9.63,1Z" />
        <circle cx="9.68" cy="9.63" r="3.11" />
    </SvgSide>
);

const slideAnimation1 = keyframes`
    0% { width: 100%; }
    75% { width: 100%; }
    100% { width: 0; }
`;

const slideAnimation2 = keyframes`
    0% { width: 100%; }
    50% { width: 100%; }
    75% { width: 0%; }
    100% { width: 0; }
`;

export const MaskAnimation = styled.div`
    height: 100%;
    width: 0;

    position: absolute;
    top: 0;
    ${props => props.isBuy ? 'left: 0' : 'right: 0'};

    background: ${props => props.theme.palette.clrChartBackground};
    display: flex;
    align-self: ${props => props.isBuy ? 'flex-end' : 'flex-start'};

    ${props => props.animatable && css`
        animation: ${props => props.isBuy ? slideAnimation1 : slideAnimation2} 8s linear;
        width: 0%;
    `};
`;

export const HistoryListWrapper = styled.div`
    height: 100%;
    margin-top: 12px;
`;