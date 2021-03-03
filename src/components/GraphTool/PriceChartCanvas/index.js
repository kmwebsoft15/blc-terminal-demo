import React from 'react';

import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '@/stores';
import PriceChartLive from './PriceChartLive';
import PriceChartHistorical from './PriceChartHistorical';
import PriceChartToolbar from './PriceChartToolbar';

import { ChartWrapper } from './styles';

const PriceChartCanvas = ({
    [STORE_KEYS.HISTORICALPRICESSTORE]: { selectedFilterKey },
    isLowerSectionOpened,
    isBorderHidden,
    isArbitrageMode,
    isFromColdStorage = false,
    noBorder
}) => {
    return (
        <ChartWrapper isLowerSectionOpened={isLowerSectionOpened} isBorderHidden={isBorderHidden} noBorder={noBorder}>
            {!isArbitrageMode && <PriceChartToolbar />}
            {selectedFilterKey ? (
                <PriceChartHistorical />
            ) : (
                <PriceChartLive
                    isArbitrageMode={isArbitrageMode}
                    isFromColdStorage={isFromColdStorage}
                />
            )}
        </ChartWrapper>
    );
};

export default inject(STORE_KEYS.HISTORICALPRICESSTORE)(observer(PriceChartCanvas));
