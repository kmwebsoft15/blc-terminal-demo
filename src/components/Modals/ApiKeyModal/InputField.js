import React from 'react';
import styled from 'styled-components/macro';

const Wrapper = styled.div.attrs({ className: 'api-key-modal' })`
    flex-grow: 1;
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const LabelWrapper = styled.div.attrs({ className: 'api-key-modal__label-wrapper' })`
    position: absolute;
    margin: 0 0 5px 10px;
    padding: 2px;
    display: flex;
    align-items: center;
    background-color: ${props => props.theme.palette.clrback};
`;

const Label = styled.p`
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 0.8;
    color: ${props => props.theme.palette.depositLabel};
`;

const InputWrapper = styled.div.attrs({ className: 'api-key-modal__input-wrapper' })`
    margin-top: 10px;
    display: flex;
`;

const Input = styled.input`
    width: 100%;
    height: 41px;
    padding: 11px;
    background-color: ${props => props.theme.palette.depositInputBackground};
    border: 1px solid ${props => props.theme.palette.depositInputBorder};
    border-radius: ${props => props.theme.palette.borderRadius};
    font-size: 14px;
    color: ${props => props.theme.palette.contrastText};
    
    &:focus {
        outline: none;
    }
    
    &::placeholder {
        color: ${props => props.theme.palette.depositText};
    }
`;

export const InputField = ({
    className, label, placeholder, value, changeValue, readOnly,
}) => (
    <Wrapper className={className}>
        <LabelWrapper>
            <Label>{label}</Label>
        </LabelWrapper>

        <InputWrapper>
            <Input
                type="text"
                placeholder={placeholder || ''}
                value={value}
                readOnly={readOnly}
                onChange={e => changeValue ? changeValue(e.target.value) : null}
            />
        </InputWrapper>
    </Wrapper>
);

export const InputFieldGroup = styled.div`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: stretch;
    
    // input {
    //     border-left: none !important;
    //     border-top-left-radius: 0 !important;
    //     border-bottom-left-radius: 0 !important;
    // }
`;

export const InputFieldAddon = styled.div`
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 22px 0 0;
    border: 1px solid ${props => props.theme.palette.depositInputBorder};
    border-right: none;
    border-top-left-radius: ${props => props.theme.palette.borderRadius};
    border-bottom-left-radius: ${props => props.theme.palette.borderRadius};
    padding: 0 0 0 11px;
    width: min-content;
    height: 41px;
    background-color: ${props => props.theme.palette.depositInputBackground};
    font-size: 14px;
`;

export default InputField;
