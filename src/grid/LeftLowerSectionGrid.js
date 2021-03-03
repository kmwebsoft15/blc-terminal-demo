import React from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { compose } from 'recompose';
import styled from 'styled-components/macro';
import { STORE_KEYS } from '@/stores';
import MarketOrderEntryForm from '@/components/OrderEntry/MarketOrder';
import LimitOrderEntryForm from '@/components/OrderEntry/LimitOrder';
import StopOrderEntryForm from '@/components/OrderEntry/StopOrder';
import OrderTabs from '@/components/OrderTabs';

const StyledLeftLowerSectionGrid = styled.div`
    grid-area: leftlowersection;
    border-radius: 4px 4px 0 0;
`;

const OrderWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    height: 100%;
    width: 100%;
    border-radius: ${props => props.theme.palette.borderRadius};
    background: ${props => props.theme.palette.orderFormBg};
    border: 1px solid ${props => props.theme.palette.orderFormBorder};
    overflow: hidden;
`;

const BuySellOrderWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: stretch;
    height: calc(100% - 38px);
    width: 100%;
    
    & > * {
      width: 50%;
    }
`;

const LIST = [
    [
        <FormattedMessage
            id="grid.good_till_canceled"
            defaultMessage="Good Till Canceled"
        />,
        <FormattedMessage
            id="grid.good_till_date"
            defaultMessage="Good Till Date"
        />,
        <FormattedMessage
            id="grid.fill_or_kill"
            defaultMessage="Fill or Kill"
        />,
        <FormattedMessage
            id="grid.immediate_or_cancel"
            defaultMessage="Immediate or Cancel"
        />,
        <FormattedMessage
            id="grid.day_valid_till_utc"
            defaultMessage="Day (Valid till 00:00 UTC)"
        />
    ],
    [
        <FormattedMessage
            id="grid.label_market"
            defaultMessage="Market"
        />,
        <FormattedMessage
            id="grid.label_limit"
            defaultMessage="Limit"
        />,
        <FormattedMessage
            id="grid.label_stop"
            defaultMessage="Stop"
        />,
        <FormattedMessage
            id="grid.label_stop_limit"
            defaultMessage="Stop Limit"
        />
    ]
];

const LeftLowerSectionGrid = ({
    [STORE_KEYS.ORDERENTRY]: {
        LimitOrderFormBuy: {
            amount: buyAmount,
        },
        LimitOrderFormSell: {
            amount: sellAmount,
        },
    },
    [STORE_KEYS.VIEWMODESTORE]: {
        setUserDropDownOpen,
        setSettingsExchangeViewMode,
    },
    [STORE_KEYS.MARKETMAKER]: {
        requestMarketTrading,
    },
}) => {
    // TODO refactoring: move to a separate method
    const showModal = (side) => () => {
        const amount = side === 'buy' ? buyAmount : sellAmount;
        requestMarketTrading({ side, amount });
        setUserDropDownOpen(true);
        setSettingsExchangeViewMode(true);
    };

    return (
        <StyledLeftLowerSectionGrid id="left-lower-section">
            <OrderWrapper id="order-wrapper">
                <OrderTabs tabs={LIST}>
                    <BuySellOrderWrapper id="buy-sell-wrapper-market">
                        <MarketOrderEntryForm showModal={showModal}/>
                    </BuySellOrderWrapper>

                    <BuySellOrderWrapper id="buy-sell-wrapper-limit">
                        <LimitOrderEntryForm showModal={showModal}/>
                    </BuySellOrderWrapper>

                    <BuySellOrderWrapper id="buy-sell-wrapper-stop">
                        <StopOrderEntryForm showModal={showModal}/>
                    </BuySellOrderWrapper>

                    <BuySellOrderWrapper id="buy-sell-wrapper-limit">
                        <StopOrderEntryForm showModal={showModal}/>
                    </BuySellOrderWrapper>
                </OrderTabs>
            </OrderWrapper>
        </StyledLeftLowerSectionGrid>
    );
};

export default compose(
    inject(
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.MARKETMAKER,
        [STORE_KEYS.ORDERENTRY],
    ),
    observer,
)(LeftLowerSectionGrid);
