import React from 'react';
import { compose } from 'recompose';
import styled from 'styled-components/macro';
import { withSnackBar } from '../../hocs/WithSnackBar';
import OrderGradientButton from '../../components-generic/GradientButtonSquare';

const OrderButtonText = styled.span`
    border: none !important;
    font-size: 23px;
    font-weight: bold;
`;

const OrderButton = (({
    isBuy, onClick, orderButtonText = 'PLACE ORDER', disabled,
}) => {
    return (
        <OrderGradientButton
            className={isBuy ? 'positive-solid' : 'negative-solid'}
            onClick={onClick}
            disabled={disabled}
            height={40}
        >
            <OrderButtonText>
                {orderButtonText}
            </OrderButtonText>
        </OrderGradientButton>
    );
});

export default compose(
    withSnackBar,
)(OrderButton);
