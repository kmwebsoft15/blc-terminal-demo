import { inject } from 'mobx-react';
import { compose } from 'recompose';

import { STORE_KEYS } from '../../stores';

const {
    MARKETMAKER,
    ORDERBOOKBREAKDOWN,
    VIEWMODESTORE,
    CONVERTSTORE,
    SETTINGSSTORE,
    EXCHANGESSTORE,
} = STORE_KEYS;

export const withOrderFormToggleData = customInjector =>
    compose(
        inject(stores => {
            const customData = customInjector ? customInjector(stores) : {};

            return {
                toggleMode: stores[MARKETMAKER].toggleMode,
                toggleViewMode: stores[MARKETMAKER].toggleViewMode,
                showOrderForm: stores[MARKETMAKER].showOrderForm,
                toggleExchangeViewMode: stores[VIEWMODESTORE].toggleExchangeViewMode,
                showDepthChartMode: stores[VIEWMODESTORE].showDepthChartMode,
                selectedBase: stores[ORDERBOOKBREAKDOWN].base,
                selectedQuote: stores[ORDERBOOKBREAKDOWN].quote,
                convertState: stores[CONVERTSTORE].convertState,
                isLoggedIn: stores[SETTINGSSTORE].isLoggedIn,
                isArbitrageMode: stores[SETTINGSSTORE].isArbitrageMode,
                tradeColStatus: stores[SETTINGSSTORE].tradeColStatus,
                marketExchanges: stores[EXCHANGESSTORE].marketExchanges,
                exchanges: stores[EXCHANGESSTORE].exchanges,
                setExchangeActive: stores[EXCHANGESSTORE].setExchangeActive,
                ...customData,
            };
        })
    );
