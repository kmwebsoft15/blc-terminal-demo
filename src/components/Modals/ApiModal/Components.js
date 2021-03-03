import React from 'react';
import styled from 'styled-components/macro';

export const InnerWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
`;

export const List = styled.div`
    width: 100%;
    height: 100%;
    border-radius: ${props => `0 0 ${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius}`};
    overflow: hidden;
`;

export const StyleWrapper = styled.div`
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    
    .ps__rail-y {
        background-color: ${props => props.theme.palette.depositBackground} !important;
        border-left: 1px solid ${props => props.theme.palette.clrPurple};
        opacity: 1 !important;
        
        .ps__thumb-y {
            z-index: 9999;
            cursor: pointer;
            
            &:before {
                background-color: ${props => props.theme.palette.clrPurple};
            }
        }
    }
    
    .ReactVirtualized__Table__rowColumn {
        height: 100%;
        margin: 0;
        padding: 0 15px;
        
        &:not(:first-child) {
            border-left: 1px solid ${props => props.theme.palette.clrBorderLight};
        }
    }
    
    .ReactVirtualized__Table__row {
        padding-right: 15px !important;
        border-bottom: 1px solid ${props => props.theme.palette.clrBorderLight};

        &:last-child {
            border-bottom: none;
        }
        
        &:hover {
            background-color: ${props => props.theme.palette.clrBorder};
            color: ${props => props.theme.palette.clrHighContrast} !important;
        }
    }
    
    .ReactVirtualized__Table__Grid {
        outline: none !important;
    }
`;

const CheckWrapper = styled.button`
    z-index: 10;
    position: relative;
    width: 20px;
    height: 20px;
    margin-left: auto;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 0;
    outline: none;
    cursor: pointer;
`;

const CheckBox = styled.svg`
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 20px;
    height: 20px;
    fill: ${props => props.theme.palette.settingsCheckBackground};
    stroke: ${props => props.theme.palette.settingsCheckBorder};
`;

const Checked = styled.svg`
    width: 14px;
    height: 14px;
    fill: ${props => props.theme.palette.settingsItemActive};
`;

export const Check = props => (
    <CheckWrapper {...props}>
        <CheckBox viewBox="0 0 20 20">
            <rect x="0.5" y="0.5" width="19" height="19"/>
        </CheckBox>

        {props.checked && (
            <Checked viewBox="0 0 13.01 9.97">
                <path d="M12.78,1.38,11.64.23a.83.83,0,0,0-1.15,0L5,5.75,2.52,3.27A.81.81,0,0,0,2,3a.78.78,0,0,0-.57.23L.23,4.42A.78.78,0,0,0,0,5a.81.81,0,0,0,.23.57l3,3L4.42,9.74A.74.74,0,0,0,5,10a.77.77,0,0,0,.57-.23L6.7,8.6l6.08-6.08A.81.81,0,0,0,13,2a.78.78,0,0,0-.23-.57Z"/>
            </Checked>
        )}
    </CheckWrapper>
);

export const Item = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
`;

export const LogoWrapper = styled.div`
    width: 40px;
    height: 40px;
    background: ${props => props.theme.palette.clrHighContrast};
    border-radius: 50%;
    overflow: hidden;
`;

export const Logo = styled.img`
    width: 100%;
    height: 100%;
`;

export const Name = styled.a`
    margin-left: 8px;
    flex: 1;
    font-size: 18px;
    text-overflow: ellipsis;
    text-decoration: none;
    overflow: hidden;

    color: ${props => props.status === 'active'
        ? props.theme.palette.settingsItemActive
        : props.status === 'disabled' ? props.theme.palette.settingsItemDisabled : props.theme.palette.settingsText};
    
    span {
        font-weight: normal;
    }
`;

export const LabelAPI = styled.a`
    font-size: 14px;
    color: ${props => props.included ? props.theme.palette.clrBlue : props.theme.palette.clrHighContrast};
    margin-left: ${props => props.isVerified ? '10px' : 'auto'};
    cursor: ${props => props.included ? 'pointer' : 'initial'};
    text-decoration: underline;
    
    &:hover {
        text-decoration: ${props => props.included ? 'underline' : 'none'};
    }
`;

export const InputOuterWrapper = styled.div`
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: space-between;
`;
