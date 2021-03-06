import React from 'react';
import styled from 'styled-components/macro';

const Icon = styled.svg`
    width: 33px;
    height: 19px;
    fill: ${props => props.theme.palette.sidebarIconActive};
`;

export const TradingViewIcon = props => (
    <Icon
        className="top-bar__icon"
        viewBox="0 0 33 19"
        role="img"
        aria-hidden="true"
        active={props.tradingViewMode}
        {...props}
    >
        <path d="M29.032 7.382a5.47 5.47 0 0 1 .963 2.872A4.502 4.502 0 0 1 28.5 19H6a5.98 5.98 0 0 1-4.222-1.737l9.546-7.556c.35.187.75.293 1.176.293a2.49 2.49 0 0 0 1.066-.238l4.55 3.981a2.5 2.5 0 1 0 4.711-.157l6.205-6.204zm-1.414-1.414l-6.204 6.204A2.494 2.494 0 0 0 20.5 12a2.49 2.49 0 0 0-1.066.238l-4.55-3.981a2.5 2.5 0 1 0-4.801-.118L.608 15.638A6 6 0 0 1 6.061 7a8.001 8.001 0 0 1 15.625-1.227A5.474 5.474 0 0 1 24.5 5c1.157 0 2.231.358 3.118.968z" />
    </Icon>
);

const IconSvg = styled.svg`
    margin-top: 10px;
    width: ${props => props.size || 40}px;
    height: ${props => props.size || 40}px;
    display: block;
    cursor: pointer;
    
    .cls-1 {
        fill: transparent;
        stroke-miterlimit: 10;
        stroke-width: 0.99px;
    }
    
    .cls-2, .cls-3 {
        fill: ${props => props.active ? props.theme.palette.clrBlue : props.theme.palette.clrBorder};
    }
    
    .cls-3 {
        font-size: 7.22px;
        font-family: OpenSans-Bold, Open Sans;
        font-weight: 700;
    }
`;

export const TradingViewImg = props => (
    <IconSvg {...props} viewBox="0 0 60.99 60.99">
        <rect className="cls-1" x="0.5" y="0.5" width="60" height="50" rx="3" ry="3"/>
        <path
            className="cls-2"
            d="M11,33.6c.2-.16.33-.28.47-.38Q17.32,28.6,23.15,24a.87.87,0,0,1,1-.18,3.2,3.2,0,0,0,2.16,0,.74.74,0,0,1,.58.11c1.82,1.57,3.62,3.16,5.44,4.74a.6.6,0,0,1,.22.65A3.32,3.32,0,1,0,39,29.1a.58.58,0,0,1,.15-.63c2.56-2.54,5.1-5.09,7.66-7.64.07-.07.15-.13.27-.23.1.14.21.25.29.38a6.8,6.8,0,0,1,.93,2.86.73.73,0,0,0,.5.68,5.92,5.92,0,0,1-1.2,11.22,7,7,0,0,1-1.44.14H16.78a8.06,8.06,0,0,1-5.11-1.71C11.46,34,11.28,33.82,11,33.6Z"
        />
        <path
            className="cls-2"
            d="M37.36,18.36a7.47,7.47,0,0,1,7.81.25c-.15.18-.25.3-.36.41l-7.49,7.5a.78.78,0,0,1-.69.22,10.18,10.18,0,0,0-1.91.07.72.72,0,0,1-.66-.17c-1.77-1.55-3.55-3.11-5.33-4.65a.72.72,0,0,1-.27-.76A3.32,3.32,0,0,0,21.94,20a4.34,4.34,0,0,0,0,1.14.67.67,0,0,1-.28.64L9.77,31.16c-.09.07-.2.12-.42.25a21.43,21.43,0,0,1-.6-2.24,7.91,7.91,0,0,1,6.82-9.08c.36-.05.81,0,1-.19s.19-.65.27-1a10.58,10.58,0,0,1,20.3-1C37.23,18,37.29,18.17,37.36,18.36Z"
        />
    </IconSvg>
);

export const ArbitrageIcon = props => (
    <IconSvg {...props} viewBox="0 0 60.99 60.99">
        <rect className="cls-1" x="0.5" y="0.5" width="60" height="60" rx="3" ry="3"/>
        <path className="cls-2" d="M21.64,5.22a9.53,9.53,0,0,0-4.1.93.73.73,0,0,0,.63,1.32,8,8,0,1,1-3.79,3.79.73.73,0,0,0-1.32-.63,9.5,9.5,0,1,0,8.58-5.41Z"/>
        <path
            className="cls-2"
            d="M40.07,23.65a9.51,9.51,0,1,0,0,19,9.31,9.31,0,0,0,4.09-.93.73.73,0,0,0,.35-1,.74.74,0,0,0-1-.35,7.94,7.94,0,0,1-3.46.79,8.06,8.06,0,1,1,7.25-4.58.74.74,0,0,0,.35,1,.73.73,0,0,0,1-.35,9.33,9.33,0,0,0,.93-4.1,9.51,9.51,0,0,0-9.5-9.5Z"
        />
        <path
            className="cls-2"
            d="M36.07,17a.74.74,0,0,0,1,0,.72.72,0,0,0,0-1l-.53-.54h2a.73.73,0,0,1,.73.73V20a.74.74,0,0,0,1.47,0v-3.8A2.2,2.2,0,0,0,38.6,14h-2l.53-.54a.73.73,0,0,0-1-1l-1.79,1.78a.75.75,0,0,0,0,1Z"
        />
        <path
            className="cls-2"
            d="M25.64,30.85a.74.74,0,0,0-1,1l.54.53h-2a.73.73,0,0,1-.73-.73v-3.8a.73.73,0,0,0-1.46,0v3.8a2.2,2.2,0,0,0,2.19,2.2h2l-.54.53a.75.75,0,0,0,0,1,.73.73,0,0,0,.52.21.75.75,0,0,0,.52-.21l1.78-1.79a.72.72,0,0,0,0-1Z"
        />
        <path className="cls-2" d="M15.44,9.26A.74.74,0,0,0,16,9a.73.73,0,0,0-1-1h0a.72.72,0,0,0,0,1,.74.74,0,0,0,.52.22Z"/>
        <path className="cls-2" d="M45.78,38.82h0a.73.73,0,0,0-.05,1,.71.71,0,0,0,.54.24.73.73,0,1,0-.49-1.27Z"/>
        <circle className="cls-2" cx="21.64" cy="14.73" r="4.83"/>
        <circle className="cls-2" cx="40.07" cy="33.15" r="4.83"/>
        <text className="cls-3" transform="translate(14.06 51.84)">Arbitrage</text>
    </IconSvg>
);
