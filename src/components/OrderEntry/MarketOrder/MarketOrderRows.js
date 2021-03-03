import React from 'react';
import styled from 'styled-components/macro';
import { FormattedMessage } from 'react-intl';

import Row from '../Row';

const Wrapper = styled.div`
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    width: 100%;
`;

export const MarketOrderRows = ({
    amount,
    price,
    handleAmountChange,
    amountMistake,
    priceLabel,
    baseSymbol,
    quoteSymbol,
    estimatedAmountReceived,
}) => {
    return (
        <Wrapper>
            <FormattedMessage
                id="order_history.label_amount"
                defaultMessage="Amount"
            >
                {value =>
                    <Row
                        header={value}
                        amount={amount}
                        coin={baseSymbol}
                        onChange={handleAmountChange}
                        userInputMistake={amountMistake}
                        darkBg
                    />
                }
            </FormattedMessage>
            <Row
                header={priceLabel}
                readOnly={true}
                amount={price}
                coin={quoteSymbol}
                onChange={() => {}}
                userInputMistake=""
                darkBg
            />
            <FormattedMessage
                id="order_history.label_total"
                defaultMessage="Total"
            >
                {value =>
                    <Row
                        header={value}
                        readOnly={true}
                        amount={estimatedAmountReceived}
                        coin={quoteSymbol}
                        onChange={() => {}}
                        userInputMistake=""
                    />
                }
            </FormattedMessage>
        </Wrapper>
    );
};
