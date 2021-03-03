import React from 'react';
import styled from 'styled-components/macro';

const Wrapper = styled.div.attrs({ className: 'add-funds2__select' })`
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin: 0;
    padding: 0;
    cursor: pointer;
    
    span {
        color: ${props => props.theme.palette.clrBlue};
    }
    
    svg {
        width: 13px;
        height: 13px;
        margin-left: .5em;
        
        &, & * {
            fill: ${props => props.theme.palette.clrHighContrast} !important;
        }
    }
`;

const IconChecked = () => (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path
            fill="currentColor"
            d="M400 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zm0 400H48V80h352v352zm-35.864-241.724L191.547 361.48c-4.705 4.667-12.303 4.637-16.97-.068l-90.781-91.516c-4.667-4.705-4.637-12.303.069-16.971l22.719-22.536c4.705-4.667 12.303-4.637 16.97.069l59.792 60.277 141.352-140.216c4.705-4.667 12.303-4.637 16.97.068l22.536 22.718c4.667 4.706 4.637 12.304-.068 16.971z"
        >
        </path>
    </svg>
);

const IconEmpty = () => (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path
            fill="currentColor"
            d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"
        >
        </path>
    </svg>
);

const CheckField = ({ label = '', isChecked = false, onChange }) => (
    <Wrapper
        onClick={() => {
            if (onChange) {
                onChange(!isChecked);
            }
        }}
    >
        <span>{label}</span>
        {isChecked
            ? (
                <IconChecked/>
            )
            : (
                <IconEmpty/>
            )
        }
    </Wrapper>
);

export default CheckField;
