import React from 'react';
import styled from 'styled-components/macro';

export const CoinPairRatioText = styled.span.attrs({ className: 'exch-head__switch__ratio' })`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    font-size: 10px;
    font-weight: 300;
    line-height: 1em;
    color: ${props => props.theme.palette.coinPairDropDownItemText};
    text-align: center;
    
    span {
        margin-left: 2px;
        font-size: ${props => props.isLongNumber ? '10px' : '13px'};
        font-weight: 600;
    }
`;

export const Addon = styled.div.attrs({ className: 'exch-dropdown-addon' })`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin: 0;
    padding: 0;
    width: 100%;
`;

export const AddonLabel = styled.div.attrs({ className: 'exch-dropdown-addon__label' })`
    font-size: 18px;
    font-weight: 600;
    color: ${props => props.theme.palette.clrHighContrast};
    margin: 0 15px;
`;

export const LoaderWrapper = styled.div`
    position: absolute;
    top: 0;
    ${props => props.isCoinPairInversed ? 'right: 135px;' : 'left: 135px;'}
    bottom: 0;
    z-index: 2;
    background: rgba(0, 0, 0, 0.6);
`;

export const WalletButton = styled.div`
    width: ${props => props.width || 220}px;
    ${props => props.direction === 'Left' ? 'left: 0;' : 'right: 0;'}
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border: 2px solid ${props => props.theme.palette.walletBtn};
    border-radius: 7px;
    border-right: props.theme.palette.clrHighContrast;
    outline-offset: -10px;
    padding: 5px 20px;
    height: 65px;
    color: ${props => props.theme.palette.clrPurple};
    font-size: 33px;
    text-align: right;
    cursor: pointer;
    opacity: 1 !important;
    word-break: break-all;
    white-space: nowrap;
    background: ${props => props.theme.palette.clrBackground};
    outline: 2px dashed ${props => props.theme.palette.clrMouseClick} !important;

    div {
        overflow: hidden;
        white-space: initial;
        word-break: break-word;
    }

    &:hover {
        background: ${props => props.theme.palette.clrWalletHover};
        color: ${props => props.theme.palette.clrHighContrast};
        
        .wallet-top-icon,
        .wallet-side-icon {
            fill: ${props => props.theme.palette.clrWalletHover};
        }
    }

    &:active {
        background: ${props => props.theme.palette.clrBackground};
        color: ${props => props.theme.palette.clrHighContrast};
        .wallet-top-icon,
        .wallet-side-icon {
            fill: ${props => props.theme.palette.clrBackground};
        }
    }
`;

export const SvgSide = styled.svg.attrs({ className: 'wallet-side-icon' })`
    position: absolute;
    right: -5px;
    width: 23px;
    height: 20px;
    fill: ${props => props.theme.palette.clrBackground};
    stroke: ${props => props.theme.palette.clrInnerBorder};
    stroke-miterlimit: 10;
    stroke-width: 2px;
`;

export const WalletSideIcon = () => (
    <SvgSide viewBox="0 0 22.47 19.27">
        <path d="M9.63,1h8.83a3,3,0,0,1,3,3V15.27a3,3,0,0,1-3,3H9.63A8.63,8.63,0,0,1,1,9.63v0A8.63,8.63,0,0,1,9.63,1Z" />
        <circle cx="9.68" cy="9.63" r="3.11" />
    </SvgSide>
);

export const SvgTop = styled.svg.attrs({ className: 'wallet-top-icon' })`
    position: absolute;
    left: -2px;
    right: -2px;
    top: -4px;
    width: 130px;
    height: 12px;
    fill: ${props => props.theme.palette.clrBackground};
    stroke: ${props => props.theme.palette.clrInnerBorder};
    stroke-miterlimit: 10;
    stroke-width: 2px;
`;

export const WalletTopIcon = () => (
    <SvgTop viewBox="0 0 178.06 11.95">
        <path d="M174.06,1H6A5,5,0,0,0,1,6H1a5,5,0,0,0,5,5H177.06V4A3,3,0,0,0,174.06,1Z" />
        <line x1="167.29" y1="5.97" x2="172.34" y2="5.97" />
        <line x1="6.03" y1="5.97" x2="162.85" y2="5.97" />
    </SvgTop>
);

export const WalletButtonCentered = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.palette.clrMainWindow};
    border: 1px solid ${props => props.theme.palette.walletBtn};
    border-radius: ${props => props.theme.palette.borderRadius};
    padding: 0;
    height: 40px;
    min-width: 135px;
    outline: none;
    font-size: 14px;
    font-weight: bold;
    color: ${props => props.theme.palette.walletBtn};
    line-height: 1em;
    cursor: pointer;
    opacity: 1 !important;
    pointer-events: all;
    word-break: break-all;
    white-space: normal;

    .unit {
        margin-left: 3px;
        color: ${props => props.theme.palette.walletBtn} !important;
    }
    
    .value {
        color: ${props => props.theme.palette.clrHighContrast} !important;
    }

    &:after {
        content: '';
        position: absolute;
        right: -4px;
        top: calc(50% - 7px);
        width: 14px;
        height: 14px;
        background: transparent url('/img/wallet-button-after.png') no-repeat center;
        background-size: cover;
    }
`;

const Svg = styled.svg`
    height: 50px;
    fill: ${props => props.theme.palette.clrHighContrast};
`;

// old seach icon
// export const SearchIcon = props => (
//     <Svg
//         role="img"
//         aria-hidden="true"
//         viewBox="0 0 379.999 379.999"
//         {...props}
//     >
//         <g>
//             <path
//                 d="M368.088,310.574l-66.061-66.062c-7.292-7.289-16.664-11.221-26.202-11.82l-22.438-22.438 c33.337-53,26.958-124.013-19.145-170.118c-53.516-53.516-140.592-53.515-194.106,0c-53.515,53.515-53.515,140.591,0.001,194.106 c46.103,46.104,117.114,52.48,170.116,19.146l22.438,22.438c0.601,9.541,4.532,18.91,11.82,26.199l66.063,66.062 c15.883,15.883,41.632,15.881,57.514,0C383.968,352.209,383.971,326.459,368.088,310.574z M205.482,205.484 c-37.656,37.658-98.933,37.658-136.589,0c-37.661-37.66-37.66-98.935-0.001-136.593c37.656-37.659,98.93-37.659,136.59,0.002 C243.141,106.553,243.142,167.827,205.482,205.484z"
//             />
//         </g>
//     </Svg>
// );

export const SearchIcon = props => (
    <svg className="exch-search__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path fill="white" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path>
    </svg>
    // <svg className="exch-search__icon" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 100 100" x="0px" y="0px">
    //     <path d="M38,76.45A38.22,38.22,0,1,1,76,38.22,38.15,38.15,0,0,1,38,76.45Zm0-66.3A28.08,28.08,0,1,0,65.84,38.22,28,28,0,0,0,38,10.15Z"/>
    //     <rect x="73.84" y="54.26" width="10.15" height="49.42" transform="translate(-32.73 79.16) rotate(-45.12)"/>
    // </svg>
    // <svg className="exch-search__icon" role="img" aria-hidden="true" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
    //     <g transform="translate(0 -286.42)">
    //         <path d="m10.144 295.34-2.3931-2.3786c-0.35646 0.55128-0.82824 1.0202-1.3829 1.3745l2.3931 2.3784c0.382 0.37989 1.0015 0.37989 1.3829 0 0.382-0.37885 0.382-0.99463 0-1.3743"/>
    //         <path d="m3.9114 293.44c-1.618 0-2.9338-1.3079-2.9338-2.9157 0-1.608 1.3158-2.9157 2.9338-2.9157 1.6178 0 2.9336 1.3076 2.9336 2.9157 0 1.6078-1.3158 2.9157-2.9336 2.9157m3.9111-2.9157c0-2.1469-1.751-3.8877-3.9111-3.8877-2.1601 0-3.9114 1.7407-3.9114 3.8877 0 2.147 1.7513 3.8874 3.9114 3.8874 2.1601 0 3.9111-1.7404 3.9111-3.8874"/>
    //         <path d="m1.6296 290.52h0.65211c0-0.89326 0.73083-1.6199 1.6296-1.6199v-0.6479c-1.2579 0-2.2817 1.0173-2.2817 2.2678"/>
    //     </g>
    // </svg>
);

export const CoinWrapper = styled.div`
    display: flex;
    align-items: center;
`;

export const PlayIcon = props => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path fill="white" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path>
    </svg>
);
