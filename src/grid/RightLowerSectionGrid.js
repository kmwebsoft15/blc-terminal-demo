import React from 'react';
import styled from 'styled-components/macro';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '../stores';
import OrderHistoryAdv from '../components/OrderHistoryAdv';

const StyledRightLowerSectionGrid = styled.div`
    position: absolute;
    bottom: 0;
    z-index: 100;
    width: 100%;
    height: ${props => props.rightBottomSectionFullScreenMode ? (!props.arbMode ? 'calc(100% + 72px)' : '100%') : `${props.height}px`};
    transition: all .5s ease-in-out;

    margin-top: ${props => props.hasMargin ? '12px' : '0'};
    // grid-area: rightlowersection;
    display: flex;
    flex-direction: column;
    border: 1px solid ${props => props.theme.palette.clrBorder};
    border-radius: ${props => props.theme.palette.borderRadius};
`;

const RightLowerSectionGrid = ({ height, hasMargin, [STORE_KEYS.VIEWMODESTORE]: viewModeStore }) => {
    const {
        rightBottomSectionOpenMode,
        setRightBottomSectionOpenMode,
        rightBottomSectionFullScreenMode,
        setRightBottomSectionFullScreenMode,
        arbMode
    } = viewModeStore;
    return (
        <StyledRightLowerSectionGrid
            id="rightLowerSectionGrid"
            height={height}
            hasMargin={hasMargin}
            rightBottomSectionFullScreenMode={rightBottomSectionFullScreenMode}
            arbMode={arbMode}
        >
            <OrderHistoryAdv
                rightBottomSectionOpenMode={rightBottomSectionOpenMode}
                setRightBottomSectionOpenMode={setRightBottomSectionOpenMode}
                rightBottomSectionFullScreenMode={rightBottomSectionFullScreenMode}
                setRightBottomSectionFullScreenMode={setRightBottomSectionFullScreenMode}
                arbMode={arbMode}
            />
        </StyledRightLowerSectionGrid>
    );
};

export default inject(STORE_KEYS.VIEWMODESTORE)(observer(RightLowerSectionGrid));
