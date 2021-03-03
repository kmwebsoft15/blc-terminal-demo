import React, { Fragment } from 'react';
import { Tooltip } from 'react-tippy';
import COIN_DATA_MAP from '../../../../../mock/coin-data-map';

import { highlightSearchDom } from '../../../../../utils';

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
                <Fragment>
                    {/* // old code
                    <p className="exch-dropdown__title">
                        <span>
                            {highlightSearchDom(symbol, search)}
                            {!isMobile &&
                            <Fragment> - {highlightSearchDom(COIN_DATA_MAP[value].name, search)}</Fragment>
                            }
                        </span>
                    </p>
                    */}

                    <p className="exch-dropdown__title">
                        <span>
                            {symbol ===  'USDT' ? (defaultFiat === 'USD' ? 'USDT' : defaultFiat) : highlightSearchDom(symbol, search)}
                        </span>
                    </p>
                </Fragment>
            )
            : (
                <p className="exch-dropdown__title"><span>{highlightSearchDom(symbol, search)}</span></p>
            );
    }
    const symbol = ((value && value.symbol) ? value.symbol : '').replace('F:', '');

    return (value && value.name)
        ? (
            <Fragment>
                {/*
                <p className="exch-dropdown__title">
                    <span>{highlightSearchDom(symbol, search)}</span>
                    {!isMobile &&
                    <Fragment> - {highlightSearchDom(value.name, search)}</Fragment>
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
                        <span>{highlightSearchDom(symbol, search)}</span>
                        {!isMobile &&
                        <Fragment> ({highlightSearchDom(value.name, search)})</Fragment>
                        }
                    </p>
                </Tooltip>
            </Fragment>
        )
        : (
            <p className="exch-dropdown__title"><span>{highlightSearchDom(symbol, search)}</span></p>
        );

};

export default CoinNameSmall;
