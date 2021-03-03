import styled from 'styled-components/macro';

import { Cell } from '../commonStyles';

export const Wrapper = styled(Cell).attrs(props => ({
    style: {
        color: props.isBuy
            ? props.theme.palette.orderBookTableCellTextBuy
            : props.theme.palette.orderBookTableCellTextSell
    }
}))`
    padding-left: 12px;
`;

export const Inner = styled.span`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
