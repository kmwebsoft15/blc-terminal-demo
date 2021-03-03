import React from 'react';
import styled from 'styled-components/macro';

export const Wrapper = styled.section.attrs({ className: 'api-key-modal' })`
    position: relative;
    display: flex;
    flex-direction: column;
    margin: 0;
    border: 1px solid ${props => props.theme.palette.clrBorder};
    border-radius: ${props => props.theme.palette.borderRadius};
    width: 100%;
    height: 100%;
    background-color: ${props => props.theme.palette.depositBackground};
    box-shadow: 0 3px 15px rgba(0, 0, 0, .5);
    color: ${props => props.theme.palette.depositText};
    
    .confirm-button:disabled {
        filter: drop-shadow(0px 0px 1px ${props => props.theme.palette.clrBorder}) !important;
    }

    .btn-text {
        font-size: 24px;
        font-weight: bold;
        text-transform: uppercase;
    }
`;

export const InnerWrapper = styled.div`
    width: 100%;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
`;

export const Label = styled.div`
    width: 100%;
    min-height: 41px;
    margin: 0;
    padding: 5px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: ${props => props.theme.palette.clrBackground};
    border-bottom: 1px solid ${props => props.theme.palette.clrBorder};
    border-radius: ${props => `${props.theme.palette.borderRadius} ${props.theme.palette.borderRadius} 0 0`};
    font-size: 18px;
    font-weight: 600;
    color: ${props => props.theme.palette.clrHighContrast};
    
    .terms {
        font-weight: normal;
        color: ${props => props.theme.palette.clrBlue};
        text-decoration: underline;
        cursor: pointer;
    }
`;