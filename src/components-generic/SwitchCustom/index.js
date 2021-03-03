import React from 'react';
import styled from 'styled-components/macro';
import { FormattedMessage, injectIntl } from 'react-intl';

const width = 78;
const height = 32;
const iconWidth = 32;
const iconHeight = 32;
const borderRadius = 3;
const borderWidth = 1;

const SwitchStyleWrapper = styled.div.attrs({ className: 'switch-custom-component' })`
    position: relative;
    width: ${width}px;
    height: ${height}px;
    cursor: pointer;
    
    .back {
        position: relative;
        border: ${borderWidth}px solid ${props => props.theme.palette.clrBackground};
        border-radius: ${borderRadius}px;
        width: ${width}px;
        height: ${height}px;
        background: ${props => props.theme.palette.clrBackground};
        box-shadow: inset 0 0 6px 0 black;
    }
    
    .icon {
        position: absolute;
        top: ${Math.floor((height - iconWidth) / 2) - borderWidth}px;
        left: ${Math.floor((height - iconWidth) / 2) - borderWidth}px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        border: ${borderWidth}px solid ${props => props.theme.palette.clrBackground} !important;
        border-radius: ${borderRadius}px;
        padding: 0;
        width: ${iconWidth}px;
        height: ${iconHeight}px;
        background: ${props => props.theme.palette.clrBorderHover};
        transition: .3s;
        box-shadow: 0 0 2px 0 #000;
        
        svg {
            width: 20px;
            height: 15px;

            &, & * {
                fill: ${props => props.theme.palette.clrMainWindow} !important;
                stroke: ${props => props.theme.palette.clrMainWindow} !important;
            }
        }
    }
    
    .toggleOn {
        position: absolute;
        top: 4px;
        right: 7px;
        left: auto;
        color: ${props => props.theme.palette.clrDisabled};
        font-size: 18px;
        font-weight: 700;
    }
    
    &.open {
        .back {
            background: ${props => props.theme.palette.clrBlue};
        }
        
        .icon {
            left: ${width - (height - iconWidth) / 2 - iconWidth}px;
        }
    
        .toggleOn {
            position: absolute;
            left: 9px;
            right: auto;
        }
    }
`;

class SwitchCustom extends React.Component {
    state = {};

    render() {
        const {
            checked,
            onChange,
            readOnly,
            ...props
        } = this.props;
        const lang = this.props.intl.locale;
        return (
            <SwitchStyleWrapper
                className={checked ? ' open' : ''}
                onClick={() => {
                    if (!readOnly && (typeof onChange === 'function')) {
                        onChange(!checked);
                    }
                }}
                lang={lang}
                {...props}
            >
                <div className="back">
                    <div className="toggleOn">
                        {checked ? '' : 'OFF'}
                    </div>
                    <div className="icon">
                        {/*
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8.46 14.31">
                            <g id="Layer_2" data-name="Layer 2">
                                <g id="Layer_1-2" data-name="Layer 1">
                                    <line className="cls-1" x1="0.5" x2="0.5" y2="14.31"/>
                                    <line className="cls-1" x1="4.23" x2="4.23" y2="14.31"/>
                                    <line className="cls-1" x1="7.96" x2="7.96" y2="14.31"/>
                                </g>
                            </g>
                        </svg>
                        */}
                    </div>
                </div>
            </SwitchStyleWrapper>
        );
    }
}

export default injectIntl(SwitchCustom);
