import React from 'react';

import { FILTERS } from '@/stores/HistoricalPricesStore';

import {
    ToolbarGroupWrapper, ToolbarItem, PulsateDot, ToolbarLiveItem
} from './PriceChartToolbar.style';

const TimerTools = ({ onChange, selected, minTime = 0, isDisabled }) => {
    const now = Date.now();
    const filterValues = Object.values(FILTERS);
    return (
        <ToolbarGroupWrapper>
            {!!selected && (
                <ToolbarLiveItem onClick={() => onChange()}>
                    <PulsateDot />
                    LIVE
                </ToolbarLiveItem>
            )}
            {filterValues.map((item, i) => {
                const disabled = i && minTime && minTime > now - filterValues[i - 1].ms;
                return (
                    <ToolbarItem
                        key={item.key}
                        onClick={(disabled || isDisabled) ? undefined : () => onChange(item.key)}
                        isActive={selected === item.key}
                        disabled={disabled || isDisabled}
                    >
                        {item.key}
                    </ToolbarItem>
                );
            })}
        </ToolbarGroupWrapper>
    );
};

export default TimerTools;
