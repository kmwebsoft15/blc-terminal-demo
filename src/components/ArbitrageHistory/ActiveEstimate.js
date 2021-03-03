import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components/macro';
import { STORE_KEYS } from '@/stores';
import { arbStateKeys } from '@/stores/ArbitrageStore';

import Row from './Row';

const Wrapper = styled.div`
    position: relative;
    height: calc(50% - 6px);
`;

class ActiveEstimate extends Component {
    render() {
        const {
            hStep1,
            hStep2,
            hStep3,
            hStep4,
            arbState, // PLAN, EXECUTE, SETTLEMENT
            height,
        } = this.props;



        const animatable = (arbState === arbStateKeys.ARB_NONE || arbState === arbStateKeys.ARB_LOAD)
            ? 1 : arbState === arbStateKeys.ARB_PLAN
                ? 2 : arbState === arbStateKeys.ARB_EXEC
                    ? 3 : arbState === arbStateKeys.ARB_RUN
                        ? 4 : 0;


        return (
            <Wrapper>
                <Row leftValue={hStep4} rightValue={hStep3} isBuy animatable={animatable} height={height} />
                <Row leftValue={hStep1} rightValue={hStep2} animatable={animatable} height={height} />
            </Wrapper>
        );
    }
}

export default compose(
    inject(
        STORE_KEYS.ARBITRAGESTORE,
    ),
    observer,
    withProps(
        ({
             [STORE_KEYS.ARBITRAGESTORE]: {
                 hStep1,
                 hStep2,
                 hStep3,
                 hStep4,
                 arbState,
             },
         }) => ({
            hStep1,
            hStep2,
            hStep3,
            hStep4,
            arbState,
        })
    )
)(ActiveEstimate);
