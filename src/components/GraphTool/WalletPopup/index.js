import React, { Component, Fragment } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
// import { FormattedMessage } from 'react-intl';

// import TradingViewToggleButton from '../TradingViewToggleButton';
import { STORE_KEYS } from '../../../stores';
import { viewModeKeys } from '../../../stores/ViewModeStore';
import { numberWithCommas } from '../../../utils';
import {
    Wrapper,
    CoinPriceBox,
    LabelPrice,
    Logo,
    LogoWrapper,
    GlobalIconNew,
    StatusSection,
    SectionTitle,
    SectionValue
} from './Components';

class WalletPopup extends Component {
    render() {
        const {
            OrderEventsData, selectedCoin, changeInPercent, baseSymbol : selectedBase, quoteSymbol : selectedQuote,
            price, isGlobal, viewMode, isLoggedIn, getDefaultPrice, getLocalCurrency, selectedExchange, baseFiatPrice,
            exchanges, marketExchanges,
        } = this.props;

        if (!price) return null;

        let activeCoin = (viewMode === viewModeKeys.advancedModeKey) ? selectedBase : selectedCoin;
        if (viewMode === viewModeKeys.exchangesModeKey && !isLoggedIn) {
            activeCoin = '';
        }

        for (let [key, data] of OrderEventsData) {
            if (data.Coin === activeCoin) {
                // const changeInPercentSign = changeInPercent >= 0 ? '+' : changeInPercent < 0 ? '-' : '';
                // const percentClassName = `change-in-percent ${(changeInPercent >= 0 ? ' positive' : ' negative')}`;

                // let rate = getLocalCurrency(selectedBase) === getLocalCurrency(selectedQuote) ?
                //     1 :
                //     numberWithCommas(getDefaultPrice(price, selectedQuote));

                let selectedTableItem = null;
                let activeExchanges = 0;
                for (let i = 0; i < marketExchanges.length; i++) {
                    if (marketExchanges[i].name !== 'Global' && exchanges[marketExchanges[i].name] && exchanges[marketExchanges[i].name].active) {
                        activeExchanges++;
                        selectedTableItem = marketExchanges[i];
                    }
                }
                const activeMarketExchanges = marketExchanges.filter(m => m.status === 'active');
                const countExchange = (activeExchanges === 0) ? activeMarketExchanges.length : activeExchanges;
                if (this.props.value === 'Global' && activeExchanges === 0 && activeMarketExchanges.length === 1) {
                    for (let i = 0; i < marketExchanges.length; i++) {
                        if (marketExchanges[i].name !== 'Global' && marketExchanges[i].status === 'active') {
                            selectedTableItem = marketExchanges[i];
                        }
                    }
                }

                const selectedIcon = (selectedTableItem && selectedTableItem.icon) || null;
                const selectedName = (selectedTableItem && selectedTableItem.name) || null;

                return (
                    <Wrapper>
                        <StatusSection>
                            {!isGlobal && (
                                <Fragment>
                                    <SectionTitle>
                                        {(countExchange !== 1 || selectedName === '')
                                            ? (
                                                <GlobalIconNew/>
                                            ) : (
                                                <LogoWrapper>
                                                    <Logo src={`/img/exchange/${selectedIcon}`} alt=""/>
                                                </LogoWrapper>
                                            )
                                        }
                                        {/* <span>{`${getLocalCurrency(selectedBase)}/${selectedQuote}`}</span> */}
                                    </SectionTitle>
                                    {/* <SectionValue>
                                        <CoinPriceBox>
                                            <LabelPrice>
                                                {rate}
                                            </LabelPrice>
                                            <div>
                                                {activeCoin !== '' && (
                                                    <span className={percentClassName}>
                                                        {changeInPercentSign + Math.abs(changeInPercent.toFixed(2))}%
                                                    </span>
                                                )}
                                            </div>
                                        </CoinPriceBox>
                                    </SectionValue> */}
                                </Fragment>
                            )}
                            {/* <TradingViewToggleButton /> */}
                        </StatusSection>
                    </Wrapper>
                )
            }
        }
    }
}

export default compose(
    inject(
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.ORDERBOOK,
        STORE_KEYS.PRICECHARTSTORE,
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.TELEGRAMSTORE,
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.EXCHANGESSTORE,
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.YOURACCOUNTSTORE]: {
                OrderEventsData,
                selectedCoin,
                changeInPercent,
            },
            [STORE_KEYS.ORDERBOOK]: {
                base : baseSymbol,
                quote : quoteSymbol,
            },
            [STORE_KEYS.PRICECHARTSTORE]: {
                price,
            },
            [STORE_KEYS.VIEWMODESTORE]: {
                viewMode,
            },
            [STORE_KEYS.TELEGRAMSTORE]: {
                isLoggedIn,
            },
            [STORE_KEYS.SETTINGSSTORE]: {
                getDefaultPrice,
                getLocalCurrency,
                price: baseFiatPrice,
            },
            [STORE_KEYS.EXCHANGESSTORE]: {
                selectedExchange,
                exchanges,
                marketExchanges,
            },
        }) => ({
            OrderEventsData,
            selectedCoin,
            changeInPercent,
            baseSymbol,
            quoteSymbol,
            price,
            viewMode,
            isLoggedIn,
            getDefaultPrice,
            baseFiatPrice,
            getLocalCurrency,
            selectedExchange,
            exchanges,
            marketExchanges,
        })
    )
)(WalletPopup);
