import React from 'react';
import styled  from 'styled-components/macro';

export const Wrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    background: ${props => props.isDonutMode && props.theme.palette.donutBackground};
    border: ${props => !props.isExecPlanExist && '1px solid ' + props.theme.palette.clrBorder};
`;

export const DonutChartWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: transparent;
    transition: ${props => props.disableTransition ? 'none' : 'transform .7s ease-out'};
    z-index: 3;
    transform:scale(0.55);
    transform-origin:0 0;
    width: 181.81%;
    height: 181.81%;

    .donut-placeholder {
        position: absolute;
        // bottom: 50px;
        // left: 50px;
        bottom: 0;
        left: 0;
        width: 70px;
        height: 30px;
        background-color: ${props => props.theme.palette.donutBackground};
    }
`;

export const Donut = styled.div`
    z-index: 4;
    width: 90%;
    height: 90%;
    // background: radial-gradient(closest-side, #2C0C47, #2C0C47, ${props => props.theme.palette.donutBackground});
    background: transparent;

    svg>g>g:last-child>g:last-child {
        display: none;
    }
`;

export const SvgComplete = styled.div`
    svg {
        position: absolute;
        left: calc(50% - ${props => props.width ? props.width / 2 : 50}px);
        top: calc(50% - ${props => props.height ? props.height / 2 : 50}px);
        z-index: 1;
        width: 100px;
        height: 100px;
        fill: #fff;
    }
`;

export const ArbSwitcher = styled.div`
    position: absolute;
    bottom: 70px;
    right: 80px;
`;
