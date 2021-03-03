import styled from 'styled-components/macro';

import { Cell } from '../commonStyles';

export const Wrapper = styled(Cell)`
    justify-content: flex-end;

    .wrapper_arrow {
        display: flex;
        align-items: center;
    }

    .arrow-icon {
        position: absolute;
        left: -8px;
        z-index: 100000;
    }
`;

export const Container = styled.span`
    white-space: nowrap;
    font-weight: ${({ type }) => (type === 'header' ? 700 : 400)};
    padding-right: 12px;
    color: ${({ type, theme }) => {
        switch (type) {
            case 'header':
                return theme.palette.orderBookHeaderText2;
            default:
                return theme.palette.orderBookTableCellTextAmount;
        }
    }};
`;
