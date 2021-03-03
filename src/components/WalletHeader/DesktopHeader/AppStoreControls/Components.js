import React from 'react';
import { Tooltip } from 'react-tippy';
import styled from 'styled-components/macro';

const AppStoreButton = styled.div`
    position: relative;
    width: 40px;
    height: 40px;
    margin: 5px 14px;
    color: white;
    background-color: ${props => props.color};
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;

    padding: 0 10px;
    
    &:hover {
        opacity: 0.9;
        transition-duration: 0.3s;
        transform: scale(1.2);
    }
`;

export const Wrapper = styled.div`
    display: ${props => props.isMenuOpened ? 'none' : 'flex'};
    align-items: center;
    flex-direction: column;
    position: absolute;
    top: 45px;
    left: 2px;
    padding-top: 20px;
`;

const StyledTooltip = styled(Tooltip)`
    width: 68px;
`

export const AppStoreButtonWithTooltip = (props) => {
    const { text, color, appStoreMode } = props;
    const tooltipText = appStoreMode || '';

    return (
        <StyledTooltip
            arrow={true}
            animation="shift"
            position="right"
            theme="bct"
            title={tooltipText}
        >
            <AppStoreButton {...props} color={color}>
                {text}
            </AppStoreButton>
        </StyledTooltip>
    );
};

export const ApiButton = props => (
    <AppStoreButtonWithTooltip text="MM" {...props} color="#42569d">
    </AppStoreButtonWithTooltip>
);

export const ArbButton = props => (
    <AppStoreButtonWithTooltip text="HF" {...props} color="#70abef">
    </AppStoreButtonWithTooltip>
);

export const PayButton = props => (
    <AppStoreButtonWithTooltip text="FX" {...props} color="#75d549">
    </AppStoreButtonWithTooltip>
);
