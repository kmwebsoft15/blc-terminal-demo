import React from 'react';
import styled, { keyframes } from 'styled-components';
import { darkTheme } from '../../../theme/core';

const { palette } = darkTheme;

const keyFrameSpin = keyframes`
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
`;

const keyFrameShake = keyframes`
    0%  { -webkit-transform:     translate(8px, 0px) rotate(0deg); }
    10% { -webkit-transform:     translate(-4px, -0px) rotate(-0deg); }
    20% { -webkit-transform:     translate(-12px, 0px) rotate(0deg); }
    30% { -webkit-transform:     translate(0px, 0px) rotate(0deg); }
    40% { -webkit-transform:     translate(4px, -0px) rotate(0deg); }
    50% { -webkit-transform:     translate(-4px, 0px) rotate(-0deg); }
    60% { -webkit-transform:     translate(-12px, 0px) rotate(0deg); }
    70% { -webkit-transform:     translate(8px, 0px) rotate(-0deg); }
    80% { -webkit-transform:     translate(-4px, -0px) rotate(0deg); }
    90% { -webkit-transform:     translate(8px, 0px) rotate(0deg); }
    100%{ -webkit-transform:     translate(4px, -0px) rotate(-0deg); }
}`;

export const LoadingSpinner = styled.div`
    position: absolute !important;
    right: 8px !important;
    top: 8px !important;
    width: 58px !important;
    height: 58px !important;
    border-radius: 50% !important;
    animation: ${keyFrameSpin} 1s linear infinite !important;
    text-align: center;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 9.32px rgba(255, 255, 255, 0.5) !important;

    p {
        position: absolute;
        top: -19px;
        width: 13px;
        height: 8px;
        border-radius: 105%;
        background-color: white;
        box-shadow: 0 0 5.67px #fff;
    }

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

export const CountrySelect = styled.div`
    position: absolute;
    width: 75%;
    height: 54vh;
    background-color: black;
    border: solid 1.69px white;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    top: calc(20.7% + 66px);
    left: 50%;
    transform: translateX(-50%);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
`;

export const CountrySelectItem = styled.div`
    border-bottom: 0.5px solid white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 1rem 1.5rem 1rem;

    h1 {
        font-size: 18px;
        font-family: 'Exo 2', sans-serif;
        font-weight: 600;
        margin-left: 1rem;
    }

    span {
        cursor: pointer;
        display: block !important;
        position: relative;
        background-size: auto 100% !important;
        width: 34px !important;
        height: 34px !important;
        border-radius: 50%
    }

    &:hover {
        background-color: rgb(50, 105, 209);
    }
`;

export const SMLoadingSpinner = styled.div`
    position: absolute !important;
    right: 8px !important;
    top: 8px !important;
    width: 58px !important;
    height: 58px !important;
    border-radius: 50% !important;
    animation: ${keyFrameSpin} 1s linear infinite !important;
    text-align: center;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 9.32px rgba(255, 255, 255, 0.5) !important;

    &.left {
        left: 8px !important;
        right: auto;
    }

    p {
        position: absolute;
        top: -19px;
        width: 13px;
        height: 8px;
        border-radius: 105%;
        background-color: white;
        box-shadow: 0 0 5.67px #fff;
    }

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

export const Main = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 109;

    .icon__back {
        position: absolute;
        top: 1rem;
        right: 1rem;
    }


    .input-bar-containers {
        position: relative;
        top: calc(22.7% + 15px);
        transform: translateY(-50%);
        margin: 0 auto;
        z-index: 110;
        width: 95%;

        &.shadow {
            width: 90%;
            border-radius: 37px;
            top: calc(22.7% + 15px);
            height: 74px;

            .input-bar {
                box-shadow: none;
            }

            .input-bar-container {
                max-width: inherit !important;
            }
        }

        &.error {
            width: 90%;
            border-radius: 37px;
            top: calc(22.7% + 15px);

            .input-bar {
                top: 0 !important;
                box-shadow: none;
            }

            .input-bar-container {
                max-width: none !important;
            }
        }

    }

    .input-bar-container {
        display: block;
        max-width: calc(100% - 30px);
        margin: 0 auto;

        &:first-child {
            .input-bar {
                border-bottom: none;
                border-top-right-radius: 37px;
                border-top-left-radius: 37px;
            }
        }

        &:last-child {
            .input-bar {
                top: -1px;
                padding-bottom: 1px;
                -webkit-border-bottom-left-radius: 37px;
                -webkit-border-bottom-right-radius: 37px;
                border-bottom-left-radius: 37px;
                border-bottom-right-radius: 37px;
            }
        }
        &:nth-child(2) {
            // opacity: 0;
            .input-bar {
                border-top: none;
            }
        }
        .main-icon {
            display: flex;
            align-items: center;
            position: absolute;
            top: 8px;
            right: 8px;
            width: 58px;
            height: 58px;
            background-color: black;
            border-radius: 50%;
            padding: 12px;
            box-shadow: 0 0 9.07px rgba(0,112,235,0.5);

            img {
                width: 100%;
            }
        }

        .to-sms-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 8px;
            right: 8px;
            width: 58px;
            height: 58px;
            background-color: black;
            border-radius: 50%;
            box-shadow: 0 0 9.07px rgba(0,112,235,0.5);

            img {
                height: 60%;
            }
        }

        .flag {
            display: flex;
            align-items: center;
            position: absolute;
            top: 9.5px;
            right: 9.5px;
            width: 58px;
            height: 58px;
            background-color: black;
            border-radius: 50%;
            box-shadow: 0 0 9.07px rgba(255,255,255,0.5);

            > span {
                cursor: pointer;
                display: block !important;
                position: relative;
                background-size: auto 100% !important;
                width: 58px !important;
                height: 58px !important;
                border-radius: 50%
            }
        }
    }

    .input-bar {
        width: 100%;
        max-width: 74px;
        position: relative;
        box-shadow: 0 0 5.31px rgb(206, 206, 206);
        margin: 0 auto;
        transform: scale(1);
        background: black;
        transition: max-width 250ms ease-in 500ms, transform 250ms ease-in, left 250ms ease-in;

        .qr-code-container {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            height: 100%;
            padding: 12px;

            > span {
                display: none;
            }

            .qr-code {
                height: 100%;
                padding: 4px;
                object-fit: cover;
                transform: translateY(0%) rotate(0deg);
                transition: transform 250ms ease-in;
                opacity: 1;
            }

            .image-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                object-fit: contain;
                width: 100%;
                height: 100%;
            }

            .animate {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
            }

            &.arrow, &.spinner, &.none {
                .animate {
                    display: none;
                }
            }

            &.flag {
                display: none;

                > span {
                    cursor: pointer;
                    display: block !important;
                    position: relative;
                    background-size: auto 100% !important;
                    width: 58px !important;
                    height: 58px !important;
                    border-radius: 50%
                }

                > img {
                    display: none;
                }
            }

            &.arrow {
                .qr-code {
                    padding: 10px;
                }
            }

            &.money {
                .qr-code {
                    padding: 0px;
                }
            }

            &.spinner {
                .qr-code {
                    padding: 4px;
                }
            }

            &.none {
                border: none;
                .qr-code {
                    opacity: 0;
                }
            }
        }

        .number-input {
            // font-family: 'AvantGardeLT-CondBook';
            font-family: 'open-sans', sans-serif;
            font-weight: 500;
            font-size: 18px;
            width: 80%;
            height: 37px;
            box-sizing: border-box;
            margin: auto;
            text-align: center;
            padding-right: 7%;
            border: none;
            outline: none;
            background: transparent;
            color: #fff;
            z-index: 100;
            caret-color: white;

            &.sms-code {
                padding-left: 0 !important;
                padding-right: 0 !important;
                letter-spacing: 0.8rem;
                height: 37px;
                color: white !important;
                caret-color: transparent;
                box-shadow: 0 0 0 1000px black inset;
                width: 80% !important;
                margin: auto;

                &.error {
                    color: red !important;
                }

                &.submitted {
                    color: white !important;
                    pointer-events: none !important;
                }
            }

            &.payment {
                &::placeholder {
                    font-size: 12px !important;
                    font-family: 'Exo 2', sans-serif;
                    font-weight: 300 !important;
                    text-align: center;
                    letter-spacing: initial !important;
                    color: grey;            
                }
            }

            &.submitting {
                caret-color: transparent !important;
                point-events: none;
            }

            &.submitted {
                color: #0070EB !important;
            }

            &::placeholder {
                font-size: 18px;
                font-family: 'Exo 2', sans-serif;
                font-weight: 600;
                text-align: center;
                letter-spacing: 0.5px;
                color: grey;
                text-shadow: none !important;
            }

            &:focus {
                outline: none;
            }
        }

        &.qr-scanner {
            height: 74px;
            background: black;
            border: 1.51px solid white;
            border-radius: 50%;
            box-shadow: 0 0 11.8px #3269D1;
            max-width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            &.claiming {
                box-shadow: 0 0 11.8px #00AE53;
            }

            &.claimed {
                box-shadow: 0 0 11.8px #00AE53;
                max-width: 74px;
                transition: transform 250ms ease-in 500ms, max-width 250ms ease-in, border-width 250ms ease-in 250ms;
            }

            &.rejected {
                box-shadow: 0 0 11.8px rgba(237,28,36,0.25);
                max-width: 74px;
                transition: transform 250ms ease-in 500ms, max-width 250ms ease-in, border-width 250ms ease-in 250ms;
            }

            &.error {
                box-shadow: 0 0 11.8px #ED1C24;
            }

            .reject-section, .accept-section {
                padding-top: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;

                img {
                    width: 21px;
                    margin-bottom: 5px;
                }

                span {
                    font-size: 9.8px;
                    font-family: 'Exo 2', sans-serif;
                    color: #999;
                }
            }

            .reject-section {
                padding-left: 32px;
            }

            .accept-section {
                padding-right: 16px;
                min-width: 72px;
            }

            .scanned-balance {
                font-size: 41px;
                // font-family: 'AvantGardeLT-CondDemi';
                font-family: 'open-sans', sans-serif;
                font-weight: 700;
                font-style: normal;
                color: white;
                &.claiming {
                    color: #00AE53;
                }
            }

            .spinner {
                width: 74px;
                height: 74px;
                padding-right: 5px;

                > div {
                    background-color: #FFB400;
                    border-radius: 50%;
                }
            }
        }

        &.error {
            -webkit-animation-name:              ${keyFrameShake};
            -webkit-animation-duration:          0.8s;
            -webkit-animation-iteration-count:   1;
            -webkit-animation-timing-function:   linear;
            -webkit-transform-origin:            50% 100%;
            box-shadow: 0 0 11.8px #ED1C24;
        }

        &.error-form {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 74px;
            border: 1.51px solid #ED1C24 !important;
            box-shadow: none !important;
        }

        &.load {
            max-width: calc(100%);
            transform: scale(1);
            border: 1.51px solid white;
            box-shadow: 0 0 5.03px rgb(206, 206, 206);
            background: black;

            .active {
                padding-bottom: 37px;
            }

            .qr-code-container {
                top: 8px;
                right: 8px;
                bottom: 8px;
                height: 58px;
                width: 58px;
                padding: 0;
                background-color: black;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 9.32px rgba(255, 255, 255, 0.5);

                img {
                    width: 50%;
                    height: 50%;
                }

                .qr-code {
                    transform: translateY(0%) rotate(360deg);
                }

                &.arrow {
                    .qr-code {
                        &:active {
                            opacity: 0.7;
                        }
                    }
                }

                &.none {
                    border: none;
                    box-shadow: none;
                    display: none;
                }

                &.not-changed {
                    padding: 10px !important;
                }
            }

            .number-input {
                display: block;

                &::placeholder {
                    opacity: 1;
                }
            }
        }

        &.unload {
            max-width: calc(100%);
            transform: scale(1);
            border: 1.51px solid white;
            background: black;

            .active {
                color: #fff !important;
                pointer-events: none;
            }

            .number-input {
                padding-right: 17% !important;
                padding-left: 10% !important;
            }

            .qr-code-container {
                display: none !important;
                top: 8px;
                right: 8px;
                bottom: 8px;
                height: 58px;
                width: 58px;
                background-color: black;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;

                .qr-code {
                    transform: translateY(0%) rotate(360deg);
                }

                &.arrow {
                    .qr-code {
                        &:active {
                            opacity: 0.7;
                        }
                    }
                }

                &.none {
                    border: none;
                    box-shadow: none;
                    display: none;
                }
            }

            .number-input {
                display: block;

                &::placeholder {
                    opacity: 1;
                }
            }
        }
    }
`;

export const InputCircle = styled.div.attrs({ className: 'sms-input-circle' })`
    position: absolute;
    top: 7px;
    bottom: 7px;
    height: 60px;
    width: 60px;
    background-color: black;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px ${props => props.borderColor ? props.borderColor : 'rgba(255, 255, 255, 0.5)'};

    img {
        width: 70%;
        height: auto;
    }

    &.left {
        left: 7px;
    }
    &.right {
        right: 7px;
    }
    &.mid {
        left: auto;
        right: auto;
    }
    .balance {
        position: absolute;
        width: 28px;
        height: 18px;
        top: 26px;
        left: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        color: #00AE53;

        &.long span {
            transform: scale(0.65, 1)
        }
    }
`;
