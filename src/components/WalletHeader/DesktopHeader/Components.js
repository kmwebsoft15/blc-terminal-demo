import React from 'react';
import styled from 'styled-components/macro';
import { FormattedMessage } from 'react-intl';

export const Wrapper = styled.div.attrs({ className: 'coin2pair-simple' })`
    position: ${props => !props.isLoggedIn ? '' : 'absolute'};
    top:0;
    left: 0;
    height: 60px;
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    border: none;
    border-radius: ${props => props.isMenuOpened ? '0' : '30px'};

    .coin-pair-form-v2 {
        width: 60px;
    }
    .exch-search__icon {
        position: absolute;
        width: 38px;
        fill: ${props => props.theme.palette.clrHighContrast} !important;
    }
    .exch-form__switch-arrows{
        width: 38px;
        stroke: ${props => props.theme.palette.clrHighContrast};
        fill: ${props => props.theme.palette.clrChartBackground};
    }
`;

export const Title = styled.div`
    font-size: 22px;
    font-weight: 600;
    color: ${props => props.theme.palette.clrHighContrast};
    padding-left: ${props => props.isLeft ? '4px' : ''};
    padding-right: ${props => !props.isLeft ? '4px' : ''};
    @media (max-width: 768px) {
        font-size: 28px;
    }
`;

export const CWrapper = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    justify-content: flex-end;
    width: ${props => props.width ? props.width : '25%'};
    padding-right: 12px;

    span {
        font-size: 22px;
        color: white;
        line-height: 28px;
    }

    .coin-icon-usdt {
        color: white;
        font-size: 22px;
    }

    & > div:last-child {
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    @media (max-width: 768px) {
        margin: 0 5px;
        padding-right: 0;
    }
`;

export const SearchIcon = props => (
    <svg className="exch-search__icon" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 100 100" x="0px" y="0px">
        <path d="M38,76.45A38.22,38.22,0,1,1,76,38.22,38.15,38.15,0,0,1,38,76.45Zm0-66.3A28.08,28.08,0,1,0,65.84,38.22,28,28,0,0,0,38,10.15Z" />
        <rect x="73.84" y="54.26" width="10.15" height="49.42" transform="translate(-32.73 79.16) rotate(-45.12)" />
    </svg>
);

const ExchangeChild = styled.div`
    position: absolute;
    left: 0;
    height: 45px;
    display: flex;
    align-items: center;

    .txt-settings {
        font-size: 40px;
        font-weight: 600;
        color: #fff;
        text-transform: uppercase;
        margin-left: 12px;
    }
`

const ThreeDotSvg = styled.svg`
    width: 45px;
    height: 100%;
    fill: ${props => props.theme.palette.clrHighContrast};
    stroke-width: 3;
    stroke: white;
    cursor: pointer;
    margin-left: 12px;
    padding: 10px;
    background: ${props => props.theme.palette.clrBorderHoverLight};
    border-radius: 50%;
    &:hover {
        background: ${props => props.theme.palette.clrBorderHover};
        transition-duration: 0.3s;
        transform: scale(1.2);
    }
`;

export const ThreeDotIcon = (props) => (
    <ExchangeChild>
        <ThreeDotSvg
            viewBox="0 0 38 38"
            role="img"
            aria-hidden="true"
            onMouseEnter={props.toggleAppStoreMenu(true)}
            // onMouseLeave={props.toggleAppStoreMenu(false)}
            {...props}
        >
            <path d="M10.5 10l17 0" />
            <path d="M10.5 19l17 0" />
            <path d="M10.5 28l17 0" />
        </ThreeDotSvg>

        {props.isMenuOpened &&
            <span className="txt-settings">
                <FormattedMessage
                    id="settings.label_settings"
                    defaultMessage="Settings"
                />
            </span>
        }
    </ExchangeChild>
);
