import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '../../../stores';
import { InnerWrapper } from './Components';
import { Wrapper, Label } from '../Components';
import ExchangeList from './ExchangeList';
import ApiPartial from './ApiPartial';

class ApiModal extends Component {
    state = {
        isListOpen: true,
        selectedExchange: '',
        isSelectedExchangeIncluded: false,
    };

    toggleList = () => {
        this.setState(prevState => ({
            isListOpen: !prevState.isListOpen,
        }));
    };

    openApi = ({ exchange, included }) => {
        this.setState({
            selectedExchange: exchange,
            isSelectedExchangeIncluded: included,
        });

        this.toggleList();
    };

    render() {
        const { isListOpen, selectedExchange } = this.state;

        return (
            <Wrapper>
                <Label>
                    <span>{isListOpen ? 'API' : `${selectedExchange}API`}</span>
                </Label>

                <InnerWrapper>
                    {isListOpen ? (
                        <ExchangeList
                            toggle={this.toggleList}
                            openApi={this.openApi}
                        />
                    ) : (
                        <ApiPartial
                            toggle={this.toggleList}
                            exchange={selectedExchange}
                            updateExchange={this.props.updateExchange}
                        />
                    )}
                </InnerWrapper>
            </Wrapper>
        );
    }
}

const withStores = compose(
    inject(STORE_KEYS.EXCHANGESSTORE),
    observer,
    withProps(
        ({
            [STORE_KEYS.EXCHANGESSTORE]: {
                exchanges,
                setExchangeActive,
                updateExchange,
            },
        }) => ({
            exchanges,
            setExchangeActive,
            updateExchange,
        })
    )
);

export default withStores(ApiModal);
