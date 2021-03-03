import React from 'react';
import styled from 'styled-components/macro';

export const Wrapper = styled.div.attrs({ className: 'historyAdv-wrapper' })`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-weight: 700;
    letter-spacing: 1px;
    background-color: ${props => props.theme.palette.clrBackground};
`;

export const InnerWrapper = styled.div.attrs({ className: 'historyAdv-inner-wrapper' })`
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: ${props => props.theme.palette.clrBackground};
`;

export const HeaderMenu = styled.div`
    background-clip: border-box;
    background-origin: padding-box;
    background-size: auto;
    box-sizing: border-box;
    cursor: auto;
    display: block;
    font-size: 14px;
    height: 34px;
    position: relative;
`;

export const DropMenuWrapper = styled.div`
    position: absolute;
    top: 0;
    right: 50px;
    left: auto;
    bottom: 0;
`;

export const Menu = styled.div`
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    height: 34px;
    min-width: 100px;
    padding: 0 8px;
    text-align: center;
    position: relative;

    background: ${props => props.active ? props.theme.palette.clrBackground : props.theme.palette.clrMainWindow};
    color: ${props => props.active ? props.theme.palette.clrHighContrast : props.theme.palette.clrPurple};

    &:first-child {
        padding-left: 16px;
    }
    &:last-child {
        padding-right: 16px;
    }

    &:hover {
        color: ${props => props.theme.palette.clrHighContrast};
    }
    ${props => props.active ? `
        &:after {
            content: "";
            position: absolute;
            display: block;
            width: 80%;
            border-bottom: 2px solid ${props => props.theme.palette.clrHighContrast};
            bottom: 3px;
            left: 10%;
        }
    ` : ''};
`;

export const List = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

export const StyleWrapper = styled.div`
    width: ${props => props.width}px;
    height: ${props => props.height}px;

    .scrollbar-container {
        height: min-content;
        max-height: 100%;
        overflow: hidden;
        
        &.d-flex {
            flex-wrap: wrap;
        }
    }

    .ps__rail-y {
        background-color: ${props => props.theme.palette.depositBackground} !important;
        border-left: 1px solid ${props => props.theme.palette.clrPurple};
        opacity: 1 !important;

        .ps__thumb-y {
            z-index: 9999;
            cursor: pointer;

            &:before {
                background-color: ${props => props.theme.palette.clrPurple};
            }
        }
    }

    .ReactVirtualized__Table__rowColumn {
        height: 100%;
        margin: 0;
        padding: 0 15px;
        display: flex;
        justify-content: center;
        align-items: center;

        &:not(:first-child) {
            border-left: 1px solid ${props => props.theme.palette.clrBorderLight};
        }
    }

    .ReactVirtualized__Table__row {
        padding-right: 15px !important;
        border-bottom: 1px solid ${props => props.theme.palette.clrBorderLight};

        &:hover {
            background-color: ${props => props.theme.palette.clrBorder};
            color: ${props => props.theme.palette.clrHighContrast} !important;
        }
    }

    .ReactVirtualized__Table__Grid {
        outline: none !important;
    }

    .ReactVirtualized__Table__headerRow {
        background-color: ${props => props.theme.palette.clrMainWindow};
        border-bottom: 1px solid ${props => props.theme.palette.clrBorder};
        position: fixed;
        bottom: 16px;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;

        .ReactVirtualized__Table__headerColumn {
            &:last-child {
                min-width: 12px;
            }
            &:not(:last-child) {
                border-right: 1px solid ${props => props.theme.palette.orderBookHistoryCellInnerborder};
            }
        }
    }
`;

export const HeaderWrapper = styled.div`
    border-collapse: collapse;
    box-sizing: border-box;
    color: ${props => props.theme.palette.clrPurple};
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 11px;
    height: 28px;
    z-index: 3;
    -webkit-border-horizontal-spacing: 2px;
    -webkit-border-vertical-spacing: 2px;
    white-space: nowrap;
`;
export const ImgCancelSvg = styled.svg`
    fill: ${props => props.theme.palette.clrPurple};
    width: 12px;
    min-width: 12px;
    margin-top: 7px;
    margin-left: 7px;
    &:hover {
        fill: ${props => props.theme.palette.clrHighContrast};
    }
`;
export const ImgCancel = props => (
    <ImgCancelSvg
        viewBox="0 0 13.01 18"
        role="img"
        aria-hidden="true"
        {...props}
    >
        <path d="M5.34,16H5.36a0.41,0.41,0,0,0,.4-0.42V6.18a0.415,0.415,0,0,0-.83,0v9.41A0.41,0.41,0,0,0,5.34,16Z" transform="translate(-0.495 -0.5)"/>
        <path d="M8.66,16H8.68a0.41,0.41,0,0,0,.4-0.42V6.18a0.415,0.415,0,0,0-.83,0v9.41A0.41,0.41,0,0,0,8.66,16Z" transform="translate(-0.495 -0.5)"/>
        <path d="M13.09,2.72H9.35V1.81A1.31,1.31,0,0,0,8.04.5H5.96A1.31,1.31,0,0,0,4.67,1.82v0.9H0.91a0.415,0.415,0,0,0,0,.83h0.7V17.19A1.31,1.31,0,0,0,2.92,18.5H11.1a1.31,1.31,0,0,0,1.3-1.32V3.55h0.69A0.415,0.415,0,0,0,13.09,2.72ZM5.5,1.82a0.48,0.48,0,0,1,.46-0.48h2.1A0.48,0.48,0,0,1,8.5,1.86V2.72h-3V1.82Zm6.07,15.36a0.48,0.48,0,0,1-.48.48H2.92a0.48,0.48,0,0,1-.48-0.48V3.55h9.13V17.18Z" transform="translate(-0.495 -0.5)"/>
    </ImgCancelSvg>
);

export const Item = styled.div`
    color: #7f8bc2;
    font-size: 11px;
    overflow: hidden;
    display: block;

    .text-overflow-ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
    }
`;

export const ToolbarItem = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    width: 50px;
    height: 100%;
    font-size: 14px;
    background: ${({ isActive }) => (isActive ? '#1a1b3d' : '#020517')};
    border: 1px solid #454c73;
    color: ${({ isActive }) => (isActive ? '#fff' : '#7f8bc2')};
    text-align: center;
    padding: 4px 10px;
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${({ disabled }) => (disabled ? '0.3' : '1')};
    &:hover {
        ${({ disabled }) => (!disabled && `
            color: white;
            border-color: white;
        `)}
    }
`;

export const SVG = styled.svg`
    width: 18px;
    height: 18px;
    fill: ${({ isActive }) => (isActive ? '#fff' : '#7f8bc2')};
    &:hover {
        fill: #fff;
    }

    > g {
        fill: ${({ isActive }) => (isActive ? '#fff' : '#7f8bc2')};
        &:hover {
            fill: #fff;
        }
    }
`;

export const IcFullScreen = props => (
    <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.1 24.1" {...props}>
        <path d="M14 23.05v-2c0-.6.4-1 1-1h1c.4 0 .7-.5.4-.9l-2-2c-.4-.4-.4-1 0-1.4l1.4-1.4c.4-.4 1-.4 1.4 0l2 2c.3.3.9.1.9-.4v-1c0-.6.4-1 1-1h2c.6 0 1 .4 1 1v8c0 .6-.4 1-1 1h-8c-.7.1-1.1-.3-1.1-.9zM6.9 9.75l-2-2c-.3-.3-.9-.1-.9.4v1c0 .6-.4 1-1 1H1c-.6 0-1-.4-1-1v-8c0-.6.4-1 1-1h8c.6 0 1 .4 1 1v2c0 .6-.4 1-1 1H8c-.4 0-.7.5-.4.9l2 2c.4.4.4 1 0 1.4l-1.4 1.4c-.3.3-.9.3-1.3-.1zM14 1.05v2c0 .6.4 1 1 1h1c.4 0 .7.5.4.9l-2 2c-.4.4-.4 1 0 1.4l1.4 1.4c.4.4 1 .4 1.4 0l2-2c.3-.3.9-.1.9.4v1c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-8c0-.6-.4-1-1-1h-8c-.7-.1-1.1.3-1.1.9zM6.9 14.35l-2 2c-.3.3-.9.1-.9-.4v-1c0-.6-.4-1-1-1H1c-.6 0-1 .4-1 1v8c0 .6.4 1 1 1h8c.6 0 1-.4 1-1v-2c0-.6-.4-1-1-1H8c-.4 0-.7-.5-.4-.9l2-2c.4-.4.4-1 0-1.4l-1.4-1.4c-.3-.3-.9-.3-1.3.1z"/>
    </SVG>
);

export const IcExitFullScreen = props => (
    <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
        <g>
            <path d="M24.586 27.414L29.172 32 32 29.172l-4.586-4.586L32 20H20v12zM0 12h12V0L7.414 4.586 2.875.043.047 2.871l4.539 4.543zM0 29.172L2.828 32l4.586-4.586L12 32V20H0l4.586 4.586zM20 12h12l-4.586-4.586 4.547-4.543L29.133.043l-4.547 4.543L20 0z"/>
        </g>
    </SVG>
);
