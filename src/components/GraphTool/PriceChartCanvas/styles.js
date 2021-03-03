import styled from 'styled-components/macro';

export const ChartWrapper = styled.div`
    position: absolute;
    ${props => props.isBorderHidden && 'border: none !important;'}
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: ${props => props.theme.palette.borderRadius};
    border-style: solid;
    border-color: ${props => props.theme.palette.clrBorder};
    border-width: 1px 0 1px 1px;
    ${props => props.noBorder && 'border: none !important;'}
    cursor: crosshair;
    z-index: 3;
`;

export const ChartInfoWrapper = styled.div`
    position: absolute;
    right: 100px;
    bottom: 50px;
`;

export const ChartCanvasWrapper = styled.div`
    height: ${props => !props.isArbitrageMode ? 'calc(100% - 30px)' : '100%'};
`;
