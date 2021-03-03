import React from 'react';
import styled, { keyframes } from 'styled-components/macro';

import rotationIcon from '../icons/rotation.png';

const openAnim = keyframes`
    0% { transform: scale(0); }
    100% { transform: scale(1); }
`;

export const OuterWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`;

export const Wrapper = styled.section`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 900000;
    margin: 0;
    // padding: 15px;
    // background-color: ${props => props.theme.palette.clrBackground};
    // border: 1px solid ${props => props.theme.palette.clrBorder};
    // border-radius: ${props => props.theme.palette.borderRadius};
    font-weight: 600;
    color: ${props => props.theme.palette.clrMainWindow};

    .pan-container {
        @media (min-width: 1300px) {
            width: unset !important;
            height: unset !important;
        }
    }
`;

export const InnerWrapper = styled.div.attrs({ className: 'qr-portal-inner-wrapper' })`
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => props.width || 136}px;
    height: ${props => props.height || 136}px;
    padding-bottom: ${props => props.padding || 15}px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.palette.clrBackground};
    border: 1px solid ${props => props.theme.palette.clrBorder};
    border-radius: ${props => props.theme.palette.borderRadius};
`;

export const ContentWrapper = styled.div`
    position: relative;
    padding: 30px 50px 45px 50px;
    background: #0d112b;
    border: 2px solid #fff;
    border-radius: 3px;
`;

export const PortalWrapper = styled.div.attrs({ className: 'qr-portal-wrapper' })`
    position: relative;
    width: ${props => props.width || 136}px;
    height: ${props => props.height || 136}px;
    margin-top: ${props => props.margin || 15}px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    // .change-deposit {
    //     left: unset;
    //     right: 0;
    // }
    //
    // .close-deposit {
    //     left: 0;
    //     right: unset;
    // }
`;

export const PortalInnerWrapper = styled.div`
    width: 100%;
    height: 100%;
    text-align: center;
    transform-style: preserve-3d;
    transition: 0.5s;

    &.flip {
        transform: rotateY(180deg);
    }

    > img {
        height: 100%;
    }

    .coin-icon {
        position: relative;
        width: 100%;
        height: 100%;
        background-size: cover !important;
    }
`;

export const WithdrawInfo = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    backface-visibility: hidden;

    span {
        font-size: ${props => Math.ceil(props.width * 0.1) || 10}px;
        font-weight: 600;
        color: ${props => props.theme.palette.clrRed};
        text-transform: uppercase;
    }

    &.deposit-info {
        transform: rotateY(0deg);
        z-index: 100002;
    }

    &.withdraw-info {
        transform: rotateY(180deg);
    }
`;

export const RefWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;

    > div {
        width: 100% !important;
        height: 100% !important;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

export const ChangeDeposit = styled.div.attrs({ className: 'change-deposit' })`
    position: absolute;
    left: 0;
    // top: 50px;
    // right: -50px;
    bottom: 0;
    z-index: 100010;
    width: 50px;
    height: 40px;
    background: ${props => props.theme.palette.clrHighContrast} url('${rotationIcon}') center no-repeat;
    background-size: 100% auto;
    border: 4px solid transparent;
    font-size: 12px;
    font-weight: 900;
    color: ${props => props.theme.palette.clrHighContrast};
    cursor: pointer;
`;

export const BillsInnerWrapper = styled.div.attrs({ className: 'bills-modal-inner' })`
    position: relative;
    width: ${props => props.width || 1504}px;
    height: ${props => props.height || 852}px;
    // padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // background-color: ${props => props.theme.palette.clrHighContrast};
    // border-radius: ${props => props.theme.palette.borderRadius};
    // box-shadow: 0 3px 15px rgba(0, 0, 0, .7);
    text-align: center;
    transform: scale(${props => (props.realHeight || 55) / (props.height || 852)});
    transform-origin: left top;

    .bill-description {
        width: 100%;
        height: 70px;
        background-color: ${props => props.theme.palette.clrHighContrast};
        font-size: 60px;
        font-weight: 600;
        line-height: 70px;
        color: ${props => props.theme.palette.clrBackground};
        letter-spacing: 15px;
        text-align: center;
    }
`;

export const BillsWrapper = styled.div`
    width: 100%;
    display: flex;
    flex: 1;
    justify-content: space-between;
    padding: ${props => props.padding || 0}px;

    ${props => !props.isFromMarketModal && `
        &:after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: -1;
            height: ${props.chipHeight || 70}px;
            background-color: ${props.theme.palette.clrHighContrast};
        }
    `}
`;

export const BillLine = styled.div`
    position: relative;
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    margin-left: 10px;
    margin-top: 0;
    // padding: 8px 0;
    display: flex;
    flex-direction: column;

    &:first-child {
        margin-left: 0;
        margin-top: 0;
    }

    overflow: hidden;
`;

export const BalanceCol = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.4);
    font-size: 60px;
    font-weight: 600;
    color: ${props => props.isFromMarketModal ? props.theme.palette.clrHighContrast : props.theme.palette.clrBackground};
    opacity: ${props => props.isTransparent ? 0.39 : 1};
    transition: 0.2s;

    ${props => props.active ? `
        &::after {
            content: '.';
            position: absolute;
            right: -2px;
            bottom: 0;
        }
    ` : ''};

    ${props => props.isShowComma ? `
        &::after {
            content: ',';
            position: absolute;
            right: -2px;
            bottom: 0;
        }
    ` : ''};

    &:hover {
        opacity: 0.1;
    }
`;

export const Close = styled.button.attrs({ className: 'close-deposit' })`
    position: absolute;
    top: 0;
    right: 0;
    z-index: 100010;
    width: 30px;
    height: 30px;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.palette.telegramLoginControlAddonColor};
    border: 0;
    border-radius: 50%;
    // transform: translate(50%, -50%);

    &:hover {
        cursor: pointer;
        filter: brightness(110%);
    }

    &:focus {
        outline: none;
    }
`;

export const Icon = styled.img`
    width: 50%;
    height: 50%;
`;

const growAnim = keyframes`
    0% { transform: scale(0); }
    100% { transform: scale(1); }
`;

export const BillDetailWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${props => !props.isDeposit ? 'rgba(0, 0, 0, 0.3)' : '#fff'};
    animation: ${growAnim} 0.5s linear;
    z-index: 100005;
`;

export const InputAddon = styled.div`
    position: relative;
    width: ${props => props.width || 136}px;
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.palette.clrWalletHover};
    // border-left: 1px solid ${props => props.theme.palette.clrBorder};
    // border-radius: 0 ${props => props.theme.palette.borderRadius} ${props => props.theme.palette.borderRadius} 0;
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.theme.palette.clrHighContrast};
    text-transform: uppercase;
    cursor: pointer;

    svg {
        &, & * {
            fill: ${props => props.theme.palette.clrMouseClick};
        }
    }

    &:hover {
        color: ${props => props.theme.palette.clrHighContrast};

        svg {
            &, & * {
                fill: ${props => props.theme.palette.clrHighContrast};
            }
        }
    }

    &:disabled {
      cursor: not-allowed;
    }

    .telegram-channel-avatar {
        margin: 0;
    }
`;

export const InputFieldWrapper = styled.div`
    position: relative;
    width: ${props => props.width || 136}px;
    height: ${props => props.height || 136}px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
`;
