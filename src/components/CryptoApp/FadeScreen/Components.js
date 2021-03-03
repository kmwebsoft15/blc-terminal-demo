import React from 'react';
import styled, { keyframes } from 'styled-components';

const keyFrameSpin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const keyFrameFadeIn = keyframes`
    0% {
        background-color: #000c;
    }
    100% {
        background-color: black;
    }
`;

export const FadeWrapper = styled.div.attrs({ className: 'crypto-app-fade-wrapper' })`
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
    background-color: #000c;

    &.on {
        background-color: transparent;
    }

    &.fade {
        animation: ${keyFrameFadeIn} ease-in 1;
        animation-fill-mode: forwards;
        animation-duration:1s;
        // animation-delay: 1s;
    }
`;

export const CircleContainer = styled.div.attrs({ className: 'crypto-app-fade-circle-container' })`
    position: absolute;
    height: 74px;
    width: 74px;
    top: calc(21% - 7px);
    left: calc(50% - 37px);
`;

export const SMLoadingSpinner = styled.div`
    position: absolute !important;
    right: 0 !important;
    top: 0 !important;
    width: 74px !important;
    height: 74px !important;
    border-radius: 50% !important;
    animation: ${keyFrameSpin} 1s linear infinite !important;
    text-align: center;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 9.32px rgba(255, 255, 255, 0.5) !important;

    img {
        width: 99% !important;
        height: 99% !important;
    }

    &:after {
        content: "";
        width: 99%;
        height: 99%;
        border-radius: 50%;
        position: absolute;
        background-color: transparent;
    }
`;

export const InputCircle = styled.div.attrs({ className: 'fade-input-circle' })`
    position: absolute;
    top: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    background-color: black;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px ${props => props.borderColor ? props.borderColor : 'rgba(255, 255, 255, 0.5)'};

    img {
        width: 60%;
        height: auto;
    }
`;
