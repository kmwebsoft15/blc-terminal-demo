import React from 'react';
import { compose } from 'recompose';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import partial from 'lodash.partial';

import { STORE_KEYS } from '../../../stores';
import LimitOrderContainer from './LimitOrderContainer';

const withValueFromEvent = (fn, { target: { value = '' } }) => fn(value.trim());

const LimitOrderSideBySideContainer = ({
    [STORE_KEYS.ORDERENTRY]: {
        LimitOrderFormBuy: {
            amount: buyAmount,
            price: buyPrice,
            total: buyTotal,
            setAmount: setLimitBuyAmount,
            setUserEnteredPrice: setLimitBuyPrice,
            enabled: limitOrderFormBuyEnabled,
            submitOrder: limitOrderFormBuySubmit,
            sliderMax: buySliderMax,
        },
        LimitOrderFormSell: {
            amount: sellAmount,
            price: sellPrice,
            total: sellTotal,
            setAmount: setLimitSellAmount,
            setUserEnteredPrice: setLimitSellPrice,
            enabled: limitOrderFormSellEnabled,
            submitOrder: limitOrderFormSellSubmit,
            sliderMax: sellSliderMax,
        },
    },
    // [STORE_KEYS.INSTRUMENTS]: {
    //     selectedInstrumentPair: [baseSymbol, quoteSymbol],
    // },
    [STORE_KEYS.ORDERBOOK]: {
        base: baseSymbol, quote: quoteSymbol,
    },
    [STORE_KEYS.SETTINGSSTORE]: {
        defaultFiat,
        price: rate,    // local to usdt
    },
    showModal,
}) => {
    return (
        <React.Fragment>
            <FormattedMessage
                id="order_entry.label_buy"
                defaultMessage="BUY"
            >
                {value =>
                    <LimitOrderContainer
                        amount={buyAmount}
                        sliderMax={buySliderMax}
                        price={buyPrice}
                        handleAmountChange={partial(withValueFromEvent, setLimitBuyAmount)}
                        handlePriceChange={partial(withValueFromEvent, setLimitBuyPrice)}
                        amountCoin={baseSymbol}
                        priceCoin={quoteSymbol}
                        total={buyTotal}
                        totalCoin={quoteSymbol}
                        rate={rate}
                        sliderCurrency={quoteSymbol}
                        orderButtonText={`${value} ${baseSymbol}`}
                        isBuy={true}
                        orderButtonDisabled={!limitOrderFormBuyEnabled}
                        handleOrder={showModal('buy')}
                        // handleOrder={() => {
                        //     showApiModal(Modal, 'graph-chart-parent');
                        //     // limitOrderFormBuySubmit();
                        // }}
                    />
                }
            </FormattedMessage>

            <FormattedMessage
                id="order_entry.label_sell"
                defaultMessage="SELL"
            >
                {value =>
                    <LimitOrderContainer
                        amount={sellAmount}
                        sliderMax={sellSliderMax}
                        price={sellPrice}
                        handleAmountChange={partial(withValueFromEvent, setLimitSellAmount)}
                        handlePriceChange={partial(withValueFromEvent, setLimitSellPrice)}
                        amountCoin={baseSymbol}
                        priceCoin={quoteSymbol}
                        total={sellTotal}
                        totalCoin={quoteSymbol}
                        rate={rate}
                        sliderCurrency={baseSymbol}
                        orderButtonText={`${value} ${baseSymbol}`}
                        isBuy={false}
                        orderButtonDisabled={!limitOrderFormSellEnabled}
                        handleOrder={showModal('sell')}
                        // handleOrder={() => {
                        //     showApiModal(Modal, 'graph-chart-parent');
                        //     // limitOrderFormSellSubmit();
                        // }}
                    />
                }
            </FormattedMessage>
        </React.Fragment>
    );
};

export default compose(
    inject(
        STORE_KEYS.ORDERENTRY,
        STORE_KEYS.INSTRUMENTS,
        STORE_KEYS.ORDERBOOK,
        STORE_KEYS.SETTINGSSTORE,
    ),
    observer,
)(LimitOrderSideBySideContainer);
