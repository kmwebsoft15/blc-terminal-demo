import React from 'react';
import styled from 'styled-components/macro';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { withSafeTimeout } from '@hocs/safe-timers';

import { STORE_KEYS } from '../../../stores/index';
import { Logo, LogoWrapper } from '../Components';
import { GlobalIcon } from '../../OrderTabs/Components';
import DataLoader from '../../../components-generic/DataLoader/index';

const ApiKeyWrapper = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    padding: 5px 15px 5px 70px;
    display: flex;
    align-items: center;
    background-color: ${props => props.theme.palette.clrMainWindow};
    cursor: initial;
`;

const Wrapper = styled.div`
    position: relative;
    height: 40px;
    flex: 1;
    display: flex;
    align-items: center;
    background-color: ${props => props.theme.palette.clrBackground};
    border: 1px solid ${props => props.theme.palette.clrBorder};
    border-radius: ${props => props.theme.palette.borderRadius};
`;

const Input = styled.input`
    padding: 0 15px;
    flex: 1;
    background: none;
    border: none;
    font-size: 13px;
    color: ${props => props.theme.palette.clrPurple};
    outline: none !important;

    &::placeholder {
        color: ${props => props.theme.palette.clrPurple};
    }
`;

const InputAddon = styled.div`
    position: relative;
    width: 132px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.palette.clrBorder};
    font-size: 20px;
    font-weight: 600;
    color: ${props => props.theme.palette.clrHighContrast};
    text-transform: uppercase;
    cursor: pointer;
`;

class ApiKey extends React.Component {
    state = {
        step: 0,
        apiKey: '',
        apiSecret: '',
    };

    clearHandleConfirmButtonTimeout = null;

    componentWillUnmount() {
        if (this.clearHandleConfirmButtonTimeout) {
            this.clearHandleConfirmButtonTimeout();
        }
    }

    goNextStep = () => {
        this.setState({ step: 1 });
    };

    changeValue = field => e => {
        this.setState({
            [field]: e.target.value,
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
            this.props.updateExchange(this.props.selectedExchange.name, {
                apiKey: this.state.apiKey,
                apiSecret: this.state.apiSecret,
                enabled: true,
                active: true,
            });

            this.props.setExchangeApiSynced(this.props.selectedExchange.name, true);

            if (this.props.onCloseHandler) {
                this.props.onCloseHandler();
            }
        }, 3000);
    };

    render() {
        const { selectedExchange } = this.props;
        const {
            step, apiKey, apiSecret, isInProgress,
        } = this.state;

        const isGlobal = selectedExchange && selectedExchange.name === 'Global';
        const disabled = !apiKey || !apiSecret || isInProgress;

        return (
            <ApiKeyWrapper onClick={this.props.onClick}>
                {isGlobal
                    ? (
                        <GlobalIcon size={38} marginRight={15} color="#fff"/>
                    ) : (
                        <LogoWrapper size={38}>
                            <Logo src={`/img/exchange/${selectedExchange.icon}`} alt=""/>
                        </LogoWrapper>
                    )
                }

                {step === 0 && (
                    <Wrapper>
                        <Input
                            placeholder={`Enter Your ${selectedExchange.name} API Key`}
                            value={apiKey}
                            onChange={this.changeValue('apiKey')}
                        />

                        <InputAddon onClick={this.goNextStep}>Next</InputAddon>
                    </Wrapper>
                )}

                {step === 1 && (
                    <Wrapper>
                        <Input
                            placeholder={`Enter Your ${selectedExchange.name} API Secret`}
                            value={apiSecret}
                            onChange={this.changeValue('apiSecret')}
                        />

                        <InputAddon
                            disabled={disabled}
                            onClick={this.handleConfirmButton}
                        >
                            {isInProgress
                                ? (
                                    <DataLoader width={30} height={30}/>
                                )
                                : (
                                    <span>Sync</span>
                                )
                            }
                        </InputAddon>
                    </Wrapper>
                )}
            </ApiKeyWrapper>
        );
    }
}

const enchanced = compose(
    withSafeTimeout,
    inject(
        STORE_KEYS.EXCHANGESSTORE
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.EXCHANGESSTORE]: {
                updateExchange,
                setExchangeApiSynced,
            },
        }) => ({
            updateExchange,
            setExchangeApiSynced,
        })
    ),
);

export default enchanced(ApiKey);
