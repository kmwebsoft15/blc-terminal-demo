import React, { Component } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import styled from 'styled-components/macro';
import 'react-circular-progressbar/dist/styles.css';
import { arbStateKeys } from 'stores/ArbitrageStore';
import {compose, withProps} from "recompose";
import {inject, observer} from "mobx-react";
import {STORE_KEYS} from "stores";
import DataLoader from "components-generic/DataLoader";
import { ImgBills } from '../CryptoApp/PayQRCodeV2InCurrency/Components';

const Wrapper = styled.div`
    position: absolute;
    ${props => !props.isGraph ? `
        left: calc(50% - 38px);
        top: calc(50% - 38px);    
    ` : `
        left: 10px;
        bottom: 10px;
    `};
    
    z-index: 200;
    
    svg.CircularProgressbar  {
        width: 76px;
        height: 76px;
    }
    
    .CircularProgressbar .CircularProgressbar-text {
        font-weight: 800;
    }
`;

class ActiveStatusCircle extends Component {
    maxTimer = 25;
    hdCircle = null;
    state = {
        value: 0,
        isExecStateUpdate: false,
    };

    componentDidMount() {
        clearTimeout(this.hdCircle);
        this.hdCircle = setInterval(() => {
            const { value, lastArbState } = this.state;
            if (lastArbState === arbStateKeys.ARB_PLAN) {
                this.setState({
                    value: value + 1,
                });
            } else if (lastArbState === arbStateKeys.ARB_EXEC) {
                this.setState({
                    value: this.maxTimer,
                });
            } else {
                this.setState({
                    value: 0,
                });
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearTimeout(this.hdCircle);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const lastArbState = nextProps.arbState;
        return {
            lastArbState,
        };
    }

    getLabel = () => {
        const { arbState } = this.props;
        switch (arbState) {
            case arbStateKeys.ARB_NONE:
                return 'Loading';
            case arbStateKeys.ARB_LOAD:
                return "Loading";
            case arbStateKeys.ARB_PLAN:
                return 'Plan';
            case arbStateKeys.ARB_EXEC:
                return 'Execute';
            case arbStateKeys.ARB_RUN:
                return 'Settle';
            case arbStateKeys.ARB_SETT:
                return 'Settle';
            case arbStateKeys.ARB_DONE:
                return 'Settle';
            default:
                return (arbState || '').toUpperCase();
        }
    };

    render() {
        const { value } = this.state;
        const { isGraph, arbState } = this.props;
        const isSettle = arbState === arbStateKeys.ARB_SETT;

        return (
            <Wrapper isGraph={isGraph}>
                {
                (arbState !== arbStateKeys.ARB_LOAD) ?
                    <CircularProgressbar
                        strokeWidth={10}
                        value={value}
                        maxValue={this.maxTimer}
                        text={ this.getLabel() }
                        background={true}
                        styles={buildStyles({
                            textSize: '16px',
                            textColor: '#fff',
                            pathColor: `rgba(255, 255, 255, 1})`,
                            trailColor: 'rgba(255, 255, 255, .15)',
                            backgroundColor: '#080924',
                        })}
                    />
                 :
                    <img width="76" height="76" src="/img/gears-2.gif" alt="Trade Is Loading" />
                }
                { isSettle && <DataLoader/> }
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
                 arbState,
             },
         }) => ({
            arbState,
        })
    )
)(ActiveStatusCircle);
