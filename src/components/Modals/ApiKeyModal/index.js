import React, { Component } from 'react';
import styled from 'styled-components/macro';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { withSafeTimeout } from '@hocs/safe-timers';

import { InnerWrapper, Wrapper, Label } from './Components';
import { STORE_KEYS } from '../../../stores';
import InputField from './InputField';
import GradientButton from '../../../components-generic/GradientButtonSquare';
import DataLoader from '../../../components-generic/DataLoader';
import { TransferHistoryRequest } from '../../../lib/bct-ws';

const InputOuterWrapper = styled.div`
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: space-between;
`;

const enhanced = compose(
    withSafeTimeout,
    inject(STORE_KEYS.MODALSTORE, STORE_KEYS.EXCHANGESSTORE),
    observer,
    withProps(
        ({
            [STORE_KEYS.MODALSTORE]: {
                onClose,
                setApiKeyModalOpenState,
            },
            [STORE_KEYS.EXCHANGESSTORE]: {
                updateExchange,
            },
        }) => ({
            onClose,
            updateExchange,
            setApiKeyModalOpenState,
        })
    ),
);

class ApiKeyModal extends Component {
    state = {
        apiKey: '',
        apiSecret: '',
        isInProgress: false,
    };

    clearConfirmButtonTimeout = null;

    componentDidMount() {
        if (this.props.setApiKeyModalOpenState) this.props.setApiKeyModalOpenState(true);
    }

    componentWillUnmount() {
        if (this.props.setApiKeyModalOpenState) this.props.setApiKeyModalOpenState(false);
        if (this.clearConfirmButtonTimeout) {
            this.clearConfirmButtonTimeout();
        }
    }

    handleChange = field => value => {
        this.setState({
            [field]: value,
        });
    };

    handleConfirmButton = () => {
        this.setState({
            isInProgress: true,
        });

        if (this.clearConfirmButtonTimeout) {
            this.clearConfirmButtonTimeout();
        }
        this.clearConfirmButtonTimeout = this.props.setSafeTimeout(() => {
            this.props.updateExchange(this.props.exchange, {
                apiKey: this.state.apiKey,
                apiSecret: this.state.apiSecret,
                enabled: true,
                active: true,
            });

            this.props.onClose();
            if (this.props.onCloseHandler) {
                this.props.onCloseHandler();
            }
        }, 3000);
    };

    render() {
        const { exchange } = this.props;
        const { apiKey, apiSecret, isInProgress } = this.state;
        const disabled = !apiKey || !apiSecret || isInProgress;

        return (
            <Wrapper>
                <Label>
                    <span>{exchange} API</span>
                </Label>

                <InnerWrapper>
                    <InputOuterWrapper>
                        <InputField
                            label="API Key"
                            value={apiKey}
                            readOnly={false}
                            changeValue={this.handleChange('apiKey')}
                        />

                        <InputField
                            label="API Secret"
                            value={apiSecret}
                            readOnly={false}
                            changeValue={this.handleChange('apiSecret')}
                        />
                    </InputOuterWrapper>

                    <GradientButton
                        className="primary-solid confirm-button"
                        height={60}
                        disabled={disabled}
                        onClick={() => {
                            if (!disabled) {
                                this.handleConfirmButton();
                            }
                        }}
                    >
                        {isInProgress
                            ? (
                                <DataLoader/>
                            )
                            : (
                                <span className="btn-text">Connect {exchange === 'CoinbasePro' ? 'Coinbase Pro' : exchange}</span>
                            )
                        }
                    </GradientButton>
                </InnerWrapper>
            </Wrapper>
        );
    }
}

export default enhanced(ApiKeyModal);
