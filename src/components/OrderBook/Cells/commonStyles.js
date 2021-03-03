import styled from 'styled-components/macro';
import { Tooltip } from 'react-tippy';

import { darkTheme } from '@/theme/core';

export const Cell = styled.div`
    display: flex;
    position: relative;
    align-items: center;
    ${props => props.cellWidth && `width: ${props.cellWidth}%;`}
    flex-shrink: 0;
    flex-grow: 0;

    &:not(:last-child) {
        border-right: 1px solid ${props => props.theme.palette.orderBookHistoryCellInnerborder};
    }
`;

export const HeaderCellStyled = styled(Tooltip)`
    display: flex;
    position: relative;
    align-items: center;
    ${props => props.cellWidth && `width: ${props.cellWidth}%;`}
    flex-shrink: 0;
    flex-grow: 0;
    justify-content: flex-end;

    &:not(:last-child) {
        border-right: 1px solid ${darkTheme.palette.orderBookHistoryCellInnerborder};
    }

    .tooltip-text-wrapper {
        span {
            font-size: 16px;
        }
    }
`;