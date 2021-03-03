import React from 'react';
import styled from 'styled-components/macro';
import { darkTheme } from '../../theme/core';

const { palette } = darkTheme;

export const Wrapper = styled.div`
    flex-grow: 1;
    flex-shrink: 1;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: stretch;
    margin: 0;
    border: none;
    padding: 10px;
    width: 100%;
    height: 100%;
`;

export const InputWrapper = styled.div`
    flex-grow: 1;
    flex-shrink: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 10px 0 0;
    border: 1px solid ${palette.clrBlue};
    border-radius: ${palette.borderRadius};
    width: 100%;
    height: 100%;
    overflow: hidden;
    min-height: 38px !important;
    
    &:last-child {
        margin-right: 0 !important;
    }
`;

export const Input = styled.input`
    flex-grow: 1;
    flex-shrink: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 0;
    border: none;
    padding: 5px 10px;
    width: calc(100% - 55px);
    height: 100%;
    background: transparent;
    font-size: 20px;
    line-height: 1em;
    font-weight: 400;
    color: ${props => props.theme.palette.clrHighContrast};
    outline: none !important;
    &::placeholder {
        color: ${props => props.theme.palette.clrPurple};
    }
`;

export const InputAddon = styled.div`
    flex-shrink: 0;
    flex-grow: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    border: none;
    padding: 0;
    width: 55px;
    height: 100%;
    background: ${palette.clrBlue};
    cursor: pointer;
    min-height: 33px;
    
    .sprite-icon.close {
        width: 20px;
        height: 20px;
    }
    
    &:hover {
        svg {
            .svg-stroke {
                stroke: ${palette.clrHighContrast} !important;
            }
            
            .svg-fill {
                fill: ${palette.clrHighContrast} !important;
            }
        }
    }
`;

const SendIconSvg = styled.svg`
    width: 18px;
    height: 18px;
    cursor: pointer;

    & * {
        fill: ${props => props.theme.palette.mobile2PhoneInputBorder};
    }
`;

export const SendIcon = props => (
    <SendIconSvg {...props} viewBox="0 0 16.18 13.02">
        <polygon className="cls-1" points="16.18 6.51 9.68 0 9.68 3.22 0 3.22 0 9.08 9.68 9.08 9.68 13.02 16.18 6.51" />
    </SendIconSvg>
);

const SpinnerIconSvg = styled.svg`
    width: 18px;
    height: 18px;
`;

export const SpinnerIcon = props => (
    <SpinnerIconSvg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" {...props}>
        <g transform="rotate(0 50 50)">
            <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9333333333333333s" repeatCount="indefinite" />
            </rect>
        </g>
        <g transform="rotate(24 50 50)">
            <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8666666666666667s" repeatCount="indefinite" />
            </rect>
        </g>
        <g transform="rotate(48 50 50)">
            <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8s" repeatCount="indefinite" />
            </rect>
        </g>
        <g transform="rotate(72 50 50)">
            <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.7333333333333333s" repeatCount="indefinite" />
            </rect>
        </g>
        <g transform="rotate(96 50 50)">
            <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite" />
            </rect>
        </g>
        <g transform="rotate(120 50 50)">
            <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6s" repeatCount="indefinite" />
            </rect>
        </g>
        <g transform="rotate(144 50 50)">
            <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5333333333333333s" repeatCount="indefinite" />
            </rect>
        </g>
        <g transform="rotate(168 50 50)">
            <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4666666666666667s" repeatCount="indefinite" />
            </rect>
        </g>
        <g transform="rotate(192 50 50)">
            <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4s" repeatCount="indefinite" />
            </rect>
        </g>
        <g transform="rotate(216 50 50)">
            <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite" />
            </rect>
        </g>
        <g transform="rotate(240 50 50)">
            <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.26666666666666666s" repeatCount="indefinite" />
            </rect>
        </g>
        <g transform="rotate(264 50 50)">
            <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.2s" repeatCount="indefinite" />
            </rect>
        </g>
        <g transform="rotate(288 50 50)">
            <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.13333333333333333s" repeatCount="indefinite" />
            </rect>
        </g>
        <g transform="rotate(312 50 50)">
            <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.06666666666666667s" repeatCount="indefinite" />
            </rect>
        </g>
        <g transform="rotate(336 50 50)">
            <rect x="47" y="9" rx="30.55" ry="5.8500000000000005" width="6" height="18" fill="rgb(50, 102, 209)">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite" />
            </rect>
        </g>
    </SpinnerIconSvg>
);

const PhoneIconSvg = styled.svg`
    width: 17.84px;
    height: 29.42px;

    .svg-stroke {
        stroke: ${palette.clrBackground};
    }

    .svg-fill {
        fill: ${palette.clrBackground};
    }
`;

export const PhoneIcon = props => (
    <PhoneIconSvg {...props} viewBox="0 0 17.84 29.42">
        <path d="M15.49,0H2.35A2.35,2.35,0,0,0,0,2.35V27.07a2.35,2.35,0,0,0,2.35,2.35H15.49a2.35,2.35,0,0,0,2.35-2.35V2.35A2.35,2.35,0,0,0,15.49,0ZM16.9,22.85h-2a.47.47,0,1,0,0,.94h2v3.28a1.41,1.41,0,0,1-1.41,1.41H2.35A1.41,1.41,0,0,1,.94,27.07V23.79H13a.47.47,0,0,0,0-.94H.94V6.57h16Zm0-17.22H.94V2.35A1.41,1.41,0,0,1,2.35.94H15.49A1.41,1.41,0,0,1,16.9,2.35Z" />
        <path d="M8.92,24.72a1.41,1.41,0,1,0,1.41,1.41,1.41,1.41,0,0,0-1.41-1.41Zm0,1.88a.47.47,0,1,1,.47-.47.47.47,0,0,1-.47.47Z" />
        <path d="M10.8,2.82H7a.47.47,0,0,0,0,.94H10.8a.47.47,0,0,0,0-.94Z" />
    </PhoneIconSvg>
);

const SendIcon2Svg = styled.svg`
    width: 32.61px;
    height: 27.71px;
    
    & * {
        fill: transparent;
        stroke: transparent;
    }
    
    .svg-stroke {
        stroke: ${palette.clrHighContrast};
        stroke-miterlimit: 10;
    }
    
    .svg-fill {
        fill: ${palette.clrHighContrast};
    }
    
    &.disabled {
        .svg-stroke {
            stroke: ${palette.clrBackground};
            stroke-miterlimit: 10;
        }
        
        .svg-fill {
            fill: ${palette.clrBackground};
        }
    }
`;

export const SendIcon2 = props => (
    <SendIcon2Svg {...props} viewBox="0 0 32.61 27.71">
        <path className="svg-stroke" d="M1.71,18.71H17.54V26a1.18,1.18,0,0,0,.36.86,1.16,1.16,0,0,0,.85.36,1.18,1.18,0,0,0,.87-.34L31.77,14.73a1.22,1.22,0,0,0,.34-.88,1.18,1.18,0,0,0-.35-.87L19.66.88A1.42,1.42,0,0,0,18.75.5a1.16,1.16,0,0,0-1.21,1.21V9H1.71a1.16,1.16,0,0,0-.85.36,1.16,1.16,0,0,0-.36.85V17.5a1.17,1.17,0,0,0,.36.85,1.16,1.16,0,0,0,.85.36Z" />
    </SendIcon2Svg>
);
