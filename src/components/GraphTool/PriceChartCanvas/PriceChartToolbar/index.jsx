import React, { PureComponent } from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { STORE_KEYS } from '@/stores';
import TimerTools from './TimerTools';
import { ToolbarWrapper } from './PriceChartToolbar.style';

const injectProps = compose(
    inject(
        STORE_KEYS.HISTORICALPRICESSTORE,
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.SETTINGSSTORE,
    ),
    withProps(
        (store) => ({
            selectedFilterKey: store[STORE_KEYS.HISTORICALPRICESSTORE].selectedFilterKey,
            onChangeFilter: store[STORE_KEYS.HISTORICALPRICESSTORE].onChangeFilter,
            tradingViewMode: store[STORE_KEYS.VIEWMODESTORE].tradingViewMode,
        })
    ),
    observer,
)

const PriceChartToolbar = (props) => {
    const { onChangeFilter, selectedFilterKey, tradingViewMode } = props;
    return (
        <ToolbarWrapper>
            <TimerTools
                onChange={onChangeFilter}
                selected={selectedFilterKey}
                isDisabled={tradingViewMode}
            />
        </ToolbarWrapper>
    )
}

export default injectProps(PriceChartToolbar);
