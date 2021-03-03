import styled from 'styled-components/macro';

// use `attrs` for a frequently changed styles as suggested by `styled-components`
export const Container = styled.div.attrs(({ left }) => ({
    style: {
        left: `${left}px`
    }
}))`
    position: absolute;
    bottom: -${props => props.theme.palette.contentGap};
    transform: translateX(
        ${props => {
            switch (props.tooltipXPosition) {
                case 'right':
                    return '0';
                case 'left':
                    return '-100';
                case 'middle':
                default:
                    return '-50';
            }
        }}%
    );
    color: #fff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: ${props => (props.datasetIndex ? '#20405d' : '#264535')};
    border-width: 1px;
    border-style: solid;
    border-color: ${({ datasetIndex, theme: { palette } }) =>
        datasetIndex ? palette.orderBookTableCellTextSellBright : palette.orderBookTableCellTextBuyBright};
    border-radius: 6px;
    pointer-events: none;
    padding: 2px 3px;
    z-index: 1;
    transition: transform 0.5s ease;
`;

export const PriceWrapper = styled.div`
    font-size: 14px;
`;

export const Icon = styled.img`
    width: 18px;
    height: 18px;
    margin: 0 3px;
`;

export const Arrow = styled.svg`
    width: 20px;
    height: 12px;
    fill: #fff;
`;
