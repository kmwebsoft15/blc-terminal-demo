import React from 'react';
import styled from 'styled-components/macro';

export const Wrapper = styled.section.attrs({ className: 'add-funds2' })`
    position: relative;
    display: flex;
    flex-direction: column;
    margin: 0;
    border: 1px solid ${props => props.theme.palette.clrBorderHover};
    border-radius: ${props => props.submitted ? `${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius} 0 0` : props.theme.palette.borderRadius};
    padding: 0;
    width: 246px;
    background-color: ${props => props.theme.palette.depositBackground};
    box-shadow: 0 3px 15px rgba(0, 0, 0, .5);
    color: ${props => props.theme.palette.depositText};
    
    .confirm-button:disabled {
        filter: drop-shadow(0px 0px 1px ${props => props.theme.palette.clrBorderHover}) !important;
    }
    
    .add-funds-name-input-field {
        input {
            font-weight: normal !important;
        }
    }
`;

export const CreditSection = styled.div.attrs({ className: 'add-funds2__credit-section' })`
    display: flex;
    flex-direction: column;
    padding: 0 15px 15px;
    border: none;
    width: 100%;
    
    input {
        font-weight: 600;
        color: ${props => props.theme.palette.contrastText};
        
        &::placeholder {
            color: ${props => props.theme.palette.contrastText};
        }
    }
    
    .primary-solid {
        margin-top: 20px;
        
        .btn-text {
            font-size: 24px;
            font-weight: bold;
        }
    }
`;

export const CvcWrapper = styled.div.attrs({ className: 'add-funds2__cvc-section' })`
    display: flex;
    align-items: center;
    
    .horizontal-input-fields {
        flex: 1;
        
        &:not(:last-child) {
            margin-right: -1px;
        }
        
        p {
            color: ${props => props.theme.palette.clrHighContrast};
        }
        
        input {
            text-align: center;
        }
        
        &:first-child input {
            border-radius: ${props => props.theme.palette.borderRadius} 0 0 ${props => props.theme.palette.borderRadius};
        }
        
        &:last-child input {
            border-radius: 0 ${props => props.theme.palette.borderRadius} ${props => props.theme.palette.borderRadius} 0;
        }
    }
`;

export const Label = styled.div.attrs({ className: 'add-funds2__label' })`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    border-bottom: 1px solid ${props => props.theme.palette.clrBorderHover};
    padding: 13px;
    width: 100%;
    min-height: 62px;
    text-align: center;
    font-size: 15px;
    line-height: 19px;
    font-weight: normal;
    color: ${props => props.theme.palette.clrHighContrast};
    background: ${props => props.theme.palette.clrBackground};
    
    span {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        line-height: 1.1em;
    }

    .heading1 {
        // font-weight: bold;
        margin-bottom: 6px;
    }
    
    .heading2 {
    }
`;

export const IconVisa = styled.img`
    width: 23px;
    height: 22px;
`;

export const Text = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    width: 100%;
    text-align: center;
    font-size: 11px;
    line-height: 1em;
    color: ${props => props.theme.palette.clrHighContrast};
    cursor: pointer;

    > span {
        color: ${props => props.theme.palette.clrBlue};
    }
`;

export const Error = styled.div`
    color:#f00;
    font-size: 11px;
`;