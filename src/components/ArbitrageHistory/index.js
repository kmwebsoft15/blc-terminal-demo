import React, { Component } from 'react';
import { AutoSizer } from 'react-virtualized';
import {inject, observer} from 'mobx-react';
import {STORE_KEYS} from 'stores/index';
import {compose, withProps} from 'recompose';
import {Swipeable} from 'react-swipeable';
import PerfectScrollbar from 'react-perfect-scrollbar';

import ActiveEstimate from './ActiveEstimate';
import { getScreenInfo } from 'utils/index';
import HistoryList from './HistoryList';
import { OrdersWrapper } from './Components';

class ArbitrageHistory extends Component {
    swipeHandler = event => {
        if (event.dir === 'Left') {
            this.props.setArbDetailMode(false);
            this.props.setArbMode(false);
        }
    };

    render() {
        const {
            isMobileLandscape,
        } = getScreenInfo();

        return (
            <AutoSizer>
                {({ width, height }) => (
                    <OrdersWrapper
                        width={width}
                        height={height}
                        isMobileLandscape={isMobileLandscape}
                    >
                        <Swipeable onSwiped={eventData => this.swipeHandler(eventData)}>
                            <PerfectScrollbar
                                options={{
                                    suppressScrollX: true,
                                    minScrollbarLength: 50,
                                }}
                            >
                                <ActiveEstimate height={height}/>
                                <HistoryList/>
                            </PerfectScrollbar>
                        </Swipeable>
                    </OrdersWrapper>
                )}
            </AutoSizer>
        );
    }
}

export default compose(
    inject(
        STORE_KEYS.VIEWMODESTORE,
    ),
    observer,
    withProps(
        ({
             [STORE_KEYS.VIEWMODESTORE]: {
                 setArbMode,
                 setArbDetailMode,
             },
         }) => ({
            setArbMode,
            setArbDetailMode,
        })
    )
)(ArbitrageHistory);
