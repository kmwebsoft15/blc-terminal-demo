import React from 'react';
import { injectIntl } from 'react-intl';
import styled from 'styled-components/macro';

import InputCell from './InputOrderCell';

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: stretch;
    width: 100%;
    
    & > div {
        background: ${props => props.darkBg ? `${props.theme.palette.orderFormInputDisabledBg} !important` : 'transparent'};
    }
    
    input, [data-coin] {
        ${props => props.darkBg ? `color: ${props.theme.palette.orderFormInputDisabledText} !important;` : ''}
    }
`;

const Header = styled.p`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin: 0;
    padding: 0 4px 0 0;
    width: 40%;
    font-size : 16px;
    font-weight: 600;
    color : ${props => props.theme.palette.contrastText};
    text-transform: uppercase;

    &:lang(pl) {
        line-height: 14px;
    }
`;

export const Row = ({
    width, header, amount, coin, onChange, readOnly, darkBg, intl,
}) => {
    return (
        <Wrapper darkBg={darkBg}>
            <Header lang={intl.locale}>{header}</Header>
            <InputCell amount={amount} coin={coin} onChange={onChange} maxWidth={width / 2} readOnly={readOnly} />
        </Wrapper>
    );
};

export default injectIntl(Row);
