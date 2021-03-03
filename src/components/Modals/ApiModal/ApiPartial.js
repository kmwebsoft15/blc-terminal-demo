import React, { Component } from 'react';

import { InputOuterWrapper } from './Components';
import { InnerWrapper } from '../Components';
import InputField from '../InputField';
import GradientButton from '../../../components-generic/GradientButtonSquare';
import DataLoader from '../../../components-generic/DataLoader';

class ApiPartial extends Component {
    state = {
        apiKey: '',
        apiSecret: '',
        isInProgress: false,
    };

    clearHandleConfirmButtonTimeout = null;

    componentWillUnmount() {
        if (this.clearHandleConfirmButtonTimeout) {
            this.clearHandleConfirmButtonTimeout();
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


        if (this.clearHandleConfirmButtonTimeout) {
            this.clearHandleConfirmButtonTimeout();
        }
        this.clearHandleConfirmButtonTimeout = this.props.setSafeTimeout(() => {
            this.props.updateExchange(this.props.exchange, {
                apiKey: this.state.apiKey,
                apiSecret: this.state.apiSecret,
                enabled: true,
                active: true,
            });

            this.props.toggle();
        }, 3000);
    };

    render() {
        const { exchange } = this.props;
        const { apiKey, apiSecret, isInProgress } = this.state;
        const disabled = !apiKey || !apiSecret || isInProgress;

        return (
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
                            <span className="btn-text">Connect {exchange}</span>
                        )
                    }
                </GradientButton>
            </InnerWrapper>
        );
    }
}

export default ApiPartial;
