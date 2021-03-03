import React from 'react';
import styled from 'styled-components/macro';

export const Wrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    align-self: stretch;
`;

export const CoinIconWrapper = styled.div.attrs({ className: 'coin-icon-wrapper' })`
    display: flex;
    align-items: center;
    flex-direction: ${props => props.isLeft ? 'row' : 'row-reverse'};
`;

export const DropdownWrapper = styled.div.attrs({ className: 'social-link-wrapper' })`
    position: absolute;
    ${props => props.isLeft ? `
        left: 100%;
        align-items: flex-start;
    ` : `
        right: 100%;
        align-items: flex-end;
    `}

    bottom: 0;
    height: 100%;
    padding: 3px 12px;
    display: flex;
    flex-direction: column;
    z-index: 100;
    cursor: initial;
    @media screen and (max-width: 1400px) {
        top: 100%;
        bottom: unset;
        background: #020518;
        ${props => props.isLeft ? `
            left: 0;
        ` : `
            right: 0;
        `}
    }

    .social-link-list {
        display: flex;
        a {
            ${props => props.isLeft ? 'margin-right: 10px' : 'margin-left: 10px'}
        }
    }
    
    .img-icon {
        width: 24px;
        height: 24px;
    }
`;

const IconSvg = styled.svg`
    width: ${props => props.size || 38}px;
    height: ${props => props.size || 38}px;
    cursor: pointer;
    
    .cls-1 {
        fill: ${props => props.theme.palette.clrHighContrast};
    }
    
    .cls-2 {
        fill: none;
        stroke: ${props => props.theme.palette.clrHighContrast};
        stroke-miterlimit: 10;
        stroke-width: 1.52px;
    }
`;

export const InfoIcon = (props) => (
    <IconSvg {...props} viewBox="0 0 38.62 38.62">
        <path className="cls-1" d="M31.17,10.19a.76.76,0,1,0,.76-.76.76.76,0,0,0-.76.76Z"/>
        <path
            className="cls-1"
            d="M34.21,19.31a14.76,14.76,0,0,1-.29,2.89.75.75,0,0,0,.59.89l.15,0a.77.77,0,0,0,.75-.61,16.2,16.2,0,0,0,.32-3.19,15.88,15.88,0,0,0-1.54-6.85.76.76,0,1,0-1.38.66,14.2,14.2,0,0,1,1.4,6.19Z"
        />
        <path
            className="cls-1"
            d="M23.11,26.15h-.76V16.27a.76.76,0,0,0-.76-.76H15.51a.76.76,0,0,0-.76.76v3a.76.76,0,0,0,.76.76h.76v6.08h-.76a.76.76,0,0,0-.76.76v3a.76.76,0,0,0,.76.76h7.6a.76.76,0,0,0,.76-.76v-3a.76.76,0,0,0-.76-.76Zm-.76,3H16.27V27.67H17a.76.76,0,0,0,.76-.76v-7.6a.76.76,0,0,0-.76-.76h-.76V17h4.56v9.88a.76.76,0,0,0,.76.76h.76Z"
        />
        <path className="cls-1" d="M19.31,14a3,3,0,1,0-3-3,3,3,0,0,0,3,3Zm0-4.56A1.52,1.52,0,1,1,17.79,11a1.52,1.52,0,0,1,1.52-1.52Z"/>
        <circle className="cls-2" cx="19.31" cy="19.31" r="18.55"/>
    </IconSvg>
);

export const InfoWrapper = styled.div`
    height: 100%;
    margin-left: auto;
    display: flex;
    justify-content: center;
    font-size: 16px;
    color: ${props => props.theme.palette.clrPurple};
    white-space: nowrap;

    .market-cap-info {
        margin-right: 12px;
    }

    span {
        color: ${props => props.theme.palette.clrHighContrast};
    }
`;

const BTCFontIconWrapper = styled.span`
    font-family: BTC, sans-serif;
`;

export const BTCFontIcon = () => (
    <BTCFontIconWrapper className="CurrencySymbol">BTC</BTCFontIconWrapper>
);
