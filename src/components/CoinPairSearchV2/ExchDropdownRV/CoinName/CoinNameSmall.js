import React from 'react';
import { Tooltip } from 'react-tippy';
import COIN_DATA_MAP from '../../../../mock/coin-data-map';

import { highlightSearchDom } from '../../../../utils';

const CoinNameSmall = (
    {
        value,
        search,
        defaultFiat,
        isMobile,
    }
) => {
    if (typeof value === 'string') {
        const symbol = (value || '').replace('F:', '');

        return (COIN_DATA_MAP[value] && COIN_DATA_MAP[value].name)
            ? (
                <React.Fragment>
                    {/* // old code
                    <p className="exch-dropdown__title">
                        <span>
                            {highlightSearchDom(symbol, search)}
                            {!isMobile &&
                            <React.Fragment> - {highlightSearchDom(COIN_DATA_MAP[value].name, search)}</React.Fragment>
                            }
                        </span>
                    </p>
                    */}

                    <p className="exch-dropdown__title">
                        <span>
                            {symbol ===  'USDT' ? (defaultFiat === 'USD' ? 'USDT' : defaultFiat) : highlightSearchDom(symbol, search)}
                        </span>
                    </p>
                </React.Fragment>
            )
            : (
                <p className="exch-dropdown__title"><span>{highlightSearchDom(symbol, search)}</span></p>
            );
    }
    const symbol = ((value && value.symbol) ? value.symbol : '').replace('F:', '');

    return (value && value.name)
        ? (
            <React.Fragment>
                {/*
                <p className="exch-dropdown__title">
                    <span>{highlightSearchDom(symbol, search)}</span>
                    {!isMobile &&
                    <React.Fragment> - {highlightSearchDom(value.name, search)}</React.Fragment>
                    }
                </p>
                */}
                <Tooltip
                    arrow={true}
                    animation="shift"
                    position="bottom"
                    followCursor
                    theme="bct"
                    title={(symbol ===  'USDT' ? highlightSearchDom(value.name, search) + ' tethered to ' + defaultFiat : highlightSearchDom(value.name, search))}
                >
                    <p className="exch-dropdown__title">
                        <span>
                            {highlightSearchDom(symbol, search)}
                        </span>
                    </p>
                </Tooltip>
            </React.Fragment>
        )
        : (
            <p className="exch-dropdown__title"><span>{highlightSearchDom(symbol, search)}</span></p>
        );

};

export default CoinNameSmall;
