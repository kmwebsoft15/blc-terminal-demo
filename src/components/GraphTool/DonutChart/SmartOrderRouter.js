import React, { Component } from 'react';
import ExchangeCellsV2 from "components/GraphTool/ExchangeCellsV2";
import {compose, withProps} from "recompose";
import {inject, observer} from "mobx-react";
import {STORE_KEYS} from "stores";
import {arbStateKeys} from "stores/ArbitrageStore";
import DataLoader from "components-generic/DataLoader";

class SmartOrderRouter extends Component {
    render() {
        return null;
        /*
        const { arbState } = this.props;
        const isArb = arbState === arbStateKeys.ARB_SETT;
        return isArb ? (
            <ExchangeCellsV2 isDonutMode={true}/>
        ) : (
            <DataLoader width={50} height={50}/>
        ); */
    }
}

const withStore = compose(
    inject(
        STORE_KEYS.ARBITRAGESTORE,
    ),
    observer,
    withProps(
        ({
             [STORE_KEYS.ARBITRAGESTORE]: {
                 arbState,
             },
         }) => ({
            arbState,
        })
    )
);

export default withStore(SmartOrderRouter);
