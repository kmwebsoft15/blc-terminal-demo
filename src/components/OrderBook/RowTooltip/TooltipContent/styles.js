import styled from 'styled-components/macro';

export const CellTooltipItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: ${props => (props.isOwnPriceIdx ? 'bold' : 'normal')};

    .exchange-list-item {
        min-width: 86px;
        text-align: left;
        font-weight: ${props => (props.isOwnPriceIdx ? 'bold' : 'normal')};
    }

    .right-value {
        position: relative;
        min-width: 70px;
        text-align: right;
    }

    .own-price {
        font-weight: bold;
        color: ${props => (props.isBuy ? '#68B168' : '#09f')};
    }
`;
