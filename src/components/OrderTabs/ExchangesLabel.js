import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '../../stores';
import {
    Label,
    GlobalIcon,
    Logo
} from './Components';

const ExchangesLabel = ({
    exchanges, marketExchanges, getActiveExchanges, id, className
}) => {
    const activeExchanges = marketExchanges
        .filter(m => m.name !== 'Global' && exchanges[m.name] && exchanges[m.name].active);
    let selectedTableItem = activeExchanges[activeExchanges.length - 1];

    const activeMarketExchanges = marketExchanges.filter(m => m.status === 'active');
    const countExchange = (activeExchanges.length === 0)
        ? activeMarketExchanges.length
        : activeExchanges.length;
    if (activeExchanges.length === 0 && activeMarketExchanges.length === 1) {
        const activeMarketNotGlobalExchanges = marketExchanges
            .filter(m => m.name !== 'Global' && m.status === 'active');
        selectedTableItem = activeMarketNotGlobalExchanges[activeMarketNotGlobalExchanges.length - 1];
    }

    const selectedIcon = (selectedTableItem && selectedTableItem.icon) || null;

    return (
        <Label id={id} className={className}>
            {countExchange !== 1 ? (
                <GlobalIcon />
            ) : (
                <Logo src={`/img/exchange/${selectedIcon}`} alt="" />
            )}
            {getActiveExchanges(exchanges)}
        </Label>
    );
};

export default compose(
    inject(
        STORE_KEYS.EXCHANGESSTORE,
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.EXCHANGESSTORE]: {
                exchanges,
                marketExchanges,
                getActiveExchanges,
            },
        }) => {
            return ({
                exchanges,
                marketExchanges,
                getActiveExchanges,
            });
        }
    ),
)(ExchangesLabel);
