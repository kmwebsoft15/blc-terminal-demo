import styled, { css } from 'styled-components/macro';

import { AtSymbol } from '../HeaderCells/PriceHeader/styles';
import { SwipArrowIconStyled } from '../HeaderCells/TotalQuoteHeader/styles';
import RowTooltip from '../RowTooltip';

export const Table = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    font-size: 16px;
    font-weight: 400;
    color: ${props => props.theme.palette.orderBookTableCellText};
`;

const RowStyles = css`
    position: relative;
    display: flex;
    flex-grow: 1;
`;

export const Row = styled(RowTooltip)`
    ${RowStyles}
    width: 100%;
    &:hover {
        background: ${props => props.theme.palette.orderBookTableCellHoverBg};
        cursor: pointer;
    }
`;

export const HeaderRow = styled.div`
    ${RowStyles}
    background: ${props => props.theme.palette.orderBookTableHeaderBg};
    border-color: ${props => props.theme.palette.orderBookHeaderBorder};
    border-style: solid;
    border-width: 1px 0;
    color: ${props => props.theme.palette.orderBookHeaderText2};

    &:hover ${SwipArrowIconStyled} {
        display: initial;
    }

    &:hover ${AtSymbol} {
        display: initial;
    }
`;
