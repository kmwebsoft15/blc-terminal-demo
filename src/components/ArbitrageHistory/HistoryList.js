import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '@/stores';

import { HistoryListWrapper } from './Components';
import Row from './Row';
import DataLoader from "components-generic/DataLoader";

class HistoryList extends Component {
    render() {
        const { OrderHistoryData } = this.props;
        return (
            <HistoryListWrapper>
                { OrderHistoryData.map((element, index) => {
                    if (index === 0 && !element.advancedMode) {
                        return null;
                    }
                    const leftValue = Number.parseFloat(element.filled);
                    const rightValue = Number.parseFloat(element.total);
                    return (
                        <Row key={element.timeUnFormatted} leftValue={leftValue} rightValue={rightValue} isWhite isBuy={element.advancedMode} userDefaultFiat={element.userDefaultFiat} />
                    );
                })}
                {OrderHistoryData.length === 0 && <DataLoader width={100} height={100}/>}
            </HistoryListWrapper>
        );
    }
}

export default compose(
    inject(
        STORE_KEYS.ORDERHISTORY,
    ),
    observer,
    withProps(
        ({
             [STORE_KEYS.ORDERHISTORY]: { OrderHistoryData },
        }) => ({
             OrderHistoryData,
        })
    )
)(HistoryList);
