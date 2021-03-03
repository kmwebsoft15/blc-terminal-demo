import React from 'react';
import styled from 'styled-components/macro';

export const Wrapper = styled.div`
    position: absolute;
    left: 100%;
    top: 0;
    background: rgba(0, 0, 0, 0.6);
    height: calc(100% - 760px);
    margin: 380px 0;
    padding: 0 18px;
    margin-left: ${props => props.isOpen ? 15 : 0}px;
    display: flex;
    align-items: center;
    z-index: 100000;
    cursor: pointer;
    opacity: ${props => props.isMobileLandscape ? 1 : 0};
    &:hover {
        opacity: 1;
    }
    transition: opacity .5s ease;
`;

const OpenArrowSvg = styled.svg`
    width: 44px;
    // stroke-width: 35px;
    // stroke: ${props => props.theme.palette.clrHighContrast};
    // margin: 10px;
    ${props => props.isOpen ? null : 'transform: rotateZ(180deg);'}
`;

export const ToggleButton = props => (
    <OpenArrowSvg
        viewBox="0 0 1000 1000"
        {...props}
    >
        <path
            fill="#FFFFFF"
            d="M743,986.4l8.7-8.7c4.8-4.8,4.8-12.6,0-17.3L291.4,500.1L751.9,39.6c4.8-4.8,4.8-12.5,0-17.3l-8.7-8.7c-4.8-4.8-12.5-4.8-17.3,0L248.1,491.4c-2.4,2.4-3.6,5.5-3.6,8.7c0,3.1,1.2,6.3,3.6,8.7l477.6,477.6C730.5,991.2,738.3,991.2,743,986.4z"
        />
    </OpenArrowSvg>
);