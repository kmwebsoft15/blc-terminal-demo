import React from 'react';
import styled, { keyframes } from 'styled-components/macro';

const ThreeDotSvg = styled.svg`
    width: 20px;
    height: 100%;
    fill: ${props => props.theme.palette.clrHighContrast};
    cursor: pointer;
`;

export const ThreeDotIcon = (props) => (
    <ThreeDotWrapper>
        <ThreeDotSvg
            viewBox="0 0 38 38"
            role="img"
            aria-hidden="true"
            {...props}
        >
            <path d="M10.5 10l17 0"/>
            <path d="M10.5 19l17 0"/>
            <path d="M10.5 28l17 0"/>
        </ThreeDotSvg>
    </ThreeDotWrapper>
);

export const ThreeDotWrapper = styled.div`
    display: flex;
    height: 45px;
    width: 90px;
    position: absolute;
    top: 10px;

    svg {
        width: 45px;
        height: 45px;
        stroke-width: 3;
        stroke-linecap: square;
        stroke: white;
        margin: auto;
        padding: 10px;
        margin-left: 12px;
    }

    &:hover svg{
        background: ${props => props.theme.palette.clrBorderHover};
        border-radius: 50%;
        transition-duration: 0.3s;
        transform: scale(1.2);
    }
`;