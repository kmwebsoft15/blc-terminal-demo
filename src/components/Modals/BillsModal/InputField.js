import React from 'react';

import {
    Wrapper,
    LabelWrapper,
    Label,
    InputFieldWrapper,
    Input,
    InputMulti
} from './ChildComponents';

export const InputField = ({
    className, id, addonWidth, label, placeholder, icon, size, value, changeValue, readOnly, addon, multiLine, slider,
}) => (
    <Wrapper className={className}>
        <LabelWrapper>
            <Label>{label}</Label>
        </LabelWrapper>

        <InputFieldWrapper>
            {multiLine ? (
                <InputMulti
                    autoFocus
                    type="text"
                    id={id}
                    addonWidth={addonWidth}
                    placeholder={placeholder || ''}
                    value={value}
                    readOnly={readOnly}
                    onChange={e => changeValue ? changeValue(e.target.value) : null}
                />
            ) : (
                <Input
                    autoFocus
                    type="text"
                    id={id}
                    addonWidth={addonWidth}
                    placeholder={placeholder || ''}
                    value={value}
                    readOnly={readOnly}
                    onChange={e => changeValue ? changeValue(e.target.value) : null}
                />)
            }
            {addon}
            {/* {slider} */}
        </InputFieldWrapper>
    </Wrapper>
);

export default InputField;
