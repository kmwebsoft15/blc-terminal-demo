import React from 'react';
import partial from 'lodash.partial';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { compose } from 'recompose';

import { STORE_KEYS } from '@/stores';
import { withValueFromEvent } from '@/utils';
import { MarketOrderContainer } from './MarketOrderContainer';

const MarketOrderSideBySideContainer = ({
    [STORE_KEYS.ORDERBOOK]: {
        base: baseSymbol, quote: quoteSymbol,
    },
    [STORE_KEYS.ORDERENTRY]: {
        MarketOrderBuyForm: {
            amount: buyAmount,
            price: buyPrice,
            total: buyTotal,
            setAmount: setMarketBuyAmount,
            enabled: marketOrderFormBuyEnabled,
            marketOrderPrice: buyEstimatedAmount,
            sliderMax: buySliderMax,
        },
        MarketOrderSellForm: {
            amount: sellAmount,
            price: sellPrice,
            total: sellTotal,
            setAmount: setMarketSellAmount,
            enabled: marketOrderFormSellEnabled,
            marketOrderPrice: sellEstimatedAmount,
            sliderMax: sellSliderMax,
        },
    },
    showModal,
}) => {
    return (
        <React.Fragment>
            <FormattedMessage
                id="order_entry.label_buy"
                defaultMessage="BUY"
            >
                {value1 =>
                    <FormattedMessage
                        id="order_entry.label_lowest_price"
                        defaultMessage="Lowest"
                    >
                        {value2 =>
                            <MarketOrderContainer
                                amount={buyAmount}
                                price={buyPrice}
                                total={buyTotal}
                                sliderMax={buySliderMax}
                                handleAmountChange={partial(withValueFromEvent, setMarketBuyAmount)}
                                orderButtonDisabled={!marketOrderFormBuyEnabled}
                                handleOrder={showModal}
                                orderButtonText={`${value1} ${baseSymbol}`}
                                amountCoin={baseSymbol}
                                baseSymbol={baseSymbol}
                                quoteSymbol={quoteSymbol}
                                sliderCurrency={quoteSymbol}
                                isBuy={true}
                                priceLabel={value2}
                                estimatedAmountReceived={buyAmount * buyEstimatedAmount}
                            />
                        }
                    </FormattedMessage>
                }
            </FormattedMessage>
            <FormattedMessage
                id="order_entry.label_sell"
                defaultMessage="SELL"
            >
                {value1 =>
                    <FormattedMessage
                        id="order_entry.label_highest_price"
                        defaultMessage="Highest"
                    >
                        {value2 =>
                            <MarketOrderContainer
                                amount={sellAmount}
                                price={sellPrice}
                                total={sellPrice}
                                sliderMax={sellSliderMax}
                                handleAmountChange={partial(withValueFromEvent, setMarketSellAmount)}
                                orderButtonText={`${value1} ${baseSymbol}`}
                                orderButtonDisabled={!marketOrderFormSellEnabled}
                                amountCoin={baseSymbol}
                                baseSymbol={baseSymbol}
                                quoteSymbol={quoteSymbol}
                                sliderCurrency={baseSymbol}
                                handleOrder={showModal}
                                isBuy={false}
                                priceLabel={value2}
                                estimatedAmountReceived={sellAmount * sellEstimatedAmount}
                            />
                        }
                    </FormattedMessage>
                }
            </FormattedMessage>
        </React.Fragment>
    );
};

export default compose(
    inject(
        STORE_KEYS.ORDERENTRY,
        STORE_KEYS.ORDERBOOK,
    ),
    observer,
)(MarketOrderSideBySideContainer);