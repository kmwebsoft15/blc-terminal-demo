import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components/macro';
import { Tooltip } from 'react-tippy';

import { STORE_KEYS } from '../../../stores';
import { viewModeKeys } from '../../../stores/ViewModeStore';
import {
    SearchIcon,
    WalletIcon,
    ContactsIcon,
    ChatIcon,
    OrderBookIcon,
    ChartIcon,
    SettingsIcon,
    TradingViewGraphIcon,
    ExchangesIcon
} from '../icons';
import { STATE_KEYS } from '../../../stores/ConvertStore';

const Wrapper = styled.div`
    width: 100%;
    padding-top: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    .top-bar__item {
        flex: 1;
    }
`;

const TopBarItem = styled.div.attrs({ className: 'top-bar__item' })`
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
    &:hover {
        &:after {
            border-color: transparent transparent ${props => props.theme.palette.clrHighContrast} transparent !important;
        }
        
        .top-bar__icon {
            fill: ${props => props.theme.palette.clrHighContrast};
        }
    }
    
    .top-bar__icon {
        fill: ${props => (props.current || props.active) ? props.theme.palette.sidebarIconActive : props.theme.palette.sidebarIcon};
    }
    
    svg {
        width: ${props => props.search ? '21px !important' : ''};
        height: ${props => props.search ? '21px !important' : ''};
    }
`;

class TopSection extends React.Component {
    state = {
        walletSelected: 'wallet',
    };

    static getDerivedStateFromProps(props, state) {
        const {
            viewMode,
        } = props;
        const { walletSelected } = state;

        const newState = {};

        if (viewMode === viewModeKeys.basicModeKey && walletSelected !== 'wallet') {
            newState.walletSelected = 'wallet';
        }
        if (viewMode === viewModeKeys.advancedModeKey && walletSelected !== 'orderbook') {
            newState.walletSelected = 'orderbook';
        }
        if (viewMode === viewModeKeys.friendModeKey && walletSelected !== 'contacts') {
            newState.walletSelected = 'contacts';
        }
        if (viewMode === viewModeKeys.publicChatModeKey && walletSelected !== 'chat') {
            newState.walletSelected = 'chat';
        }
        if (viewMode === viewModeKeys.settingsModeKey && walletSelected !== 'settings') {
            newState.walletSelected = 'settings';
        }
        if (viewMode === viewModeKeys.exchangesModeKey && walletSelected !== 'exchanges') {
            newState.walletSelected = 'exchanges';
        }

        if (Object.keys(newState).length > 0) {
            return newState;
        }

        return null;
    }

    changeWallet = walletSelected => {
        if (walletSelected !== this.state.walletSelected) {
            this.setState({
                walletSelected,
            });

            const {
                isLoggedIn, isOrderBookStop, setViewMode, openSettingsView,
            } = this.props;
            if (walletSelected === 'wallet') {
                setViewMode(viewModeKeys.basicModeKey);
            }
            if (/* !isOrderBookStop && */walletSelected === 'orderbook') {
                setViewMode(viewModeKeys.advancedModeKey);
            }
            if (isLoggedIn && walletSelected === 'contacts') {
                setViewMode(viewModeKeys.friendModeKey);
            }
            if (walletSelected === 'chat') {
                setViewMode(viewModeKeys.publicChatModeKey);
            }
            if (walletSelected === 'settings') {
                openSettingsView();
            }
            if (walletSelected === 'exchanges') {
                setViewMode(viewModeKeys.exchangesModeKey);
            }
        }

        if (this.props.pathname !== '/') {
            this.props.router.push('/');
        }
    };

    render() {
        const {
            pathname, isLoggedIn, isOrderBookStop, setViewMode, telegram: isTelegram, showDepthChartMode, showOrderForm, updateExchange, convertState, isSearchEnabled, toggleSearchEnabled,
        } = this.props;

        const {
            walletSelected,
        } = this.state;

        if (!isLoggedIn && walletSelected === 'contacts') {
            setViewMode(viewModeKeys.basicModeKey);
        }

        const isApi = pathname === '/';
        const isBestRateMode = convertState === STATE_KEYS.coinSearch;

        return (
            <Wrapper isTelegram={isTelegram}>
                {
                    isBestRateMode &&
                    <TopBarItem
                        active={isApi && walletSelected === 'wallet'}
                        onClick={() => {
                            updateExchange(-1, '');
                            showDepthChartMode(false);
                            this.changeWallet('wallet');
                        }}
                    >
                        <Tooltip
                            arrow={true}
                            animation="shift"
                            position="right"
                            theme="bct"
                            title="Universal Wallet"
                        >
                            <WalletIcon/>
                        </Tooltip>
                    </TopBarItem>
                }
                <TopBarItem
                    active={isApi && walletSelected === 'exchanges'}
                    onClick={() => {
                        showDepthChartMode(false);
                        this.changeWallet('exchanges');
                    }}
                >
                    <Tooltip
                        arrow={true}
                        animation="shift"
                        position="right"
                        theme="bct"
                        title="Exchanges"
                    >
                        <ExchangesIcon/>
                    </Tooltip>
                </TopBarItem>
                <TopBarItem
                    active={isApi && walletSelected === 'orderbook'}
                    onClick={() => {
                        this.changeWallet('orderbook');
                        showDepthChartMode(true);
                        showOrderForm();
                    }}
                >
                    <Tooltip
                        arrow={true}
                        animation="shift"
                        position="right"
                        theme="bct"
                        title="WorldBook"
                    >
                        <OrderBookIcon/>
                    </Tooltip>
                </TopBarItem>
                {isLoggedIn && isBestRateMode && (
                    <TopBarItem
                        active={isApi && walletSelected === 'contacts'}
                        onClick={() => {
                            showDepthChartMode(false);
                            this.changeWallet('contacts');
                        }}
                    >
                        <Tooltip
                            arrow={true}
                            animation="shift"
                            position="right"
                            theme="bct"
                            title="Telegram Supergroups"
                        >
                            <ContactsIcon/>
                        </Tooltip>
                    </TopBarItem>
                )}
                {
                    isBestRateMode &&
                    <TopBarItem
                        active={isApi && walletSelected === 'chat'}
                        onClick={() => {
                            showDepthChartMode(false);

                            this.changeWallet('chat');
                        }}
                    >
                        <Tooltip
                            arrow={true}
                            animation="shift"
                            position="right"
                            theme="bct"
                            title="Telegram"
                        >
                            <ChatIcon/>
                        </Tooltip>
                    </TopBarItem>
                }
                {
                    isBestRateMode &&
                    <TopBarItem
                        search
                        onClick={() => {
                            showDepthChartMode(false);
                            // this.changeWallet('search');
                            if (isSearchEnabled) {
                                toggleSearchEnabled();
                            } else {
                                toggleSearchEnabled();
                                setTimeout(() => {
                                    let input = document.querySelector('#header-search-input');

                                    if (input) {
                                        input.focus();
                                    }
                                });
                            }
                        }}
                    >
                        <Tooltip
                            arrow={true}
                            animation="shift"
                            position="right"
                            theme="bct"
                            title="Search"
                        >
                            <SearchIcon/>
                        </Tooltip>
                    </TopBarItem>
                }
            </Wrapper>
        );
    }
}

const withStores = compose(
    inject(
        STORE_KEYS.TELEGRAMSTORE,
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.ORDERBOOK,
        STORE_KEYS.MARKETMAKER,
        STORE_KEYS.ROUTER,
        STORE_KEYS.LOWESTEXCHANGESTORE,
        STORE_KEYS.CONVERTSTORE,
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.TELEGRAMSTORE]: {
                isLoggedIn,
            },
            [STORE_KEYS.VIEWMODESTORE]: {
                viewMode,
                progressState,
                setViewMode,
                openSettingsView,
                showDepthChartMode,
                isSearchEnabled,
                toggleSearchEnabled,
            },
            [STORE_KEYS.ORDERBOOK]: {
                isOrderBookStop,
            },
            [STORE_KEYS.MARKETMAKER]: {
                showOrderForm,
            },
            [STORE_KEYS.LOWESTEXCHANGESTORE]: {
                updateExchange,
            },
            [STORE_KEYS.CONVERTSTORE]: {
                convertState,
            },
            [STORE_KEYS.ROUTER]: router,
        }) => ({
            isLoggedIn,
            viewMode,
            progressState,
            setViewMode,
            openSettingsView,
            isOrderBookStop,
            showDepthChartMode,
            showOrderForm,
            router,
            updateExchange,
            convertState,
            isSearchEnabled,
            toggleSearchEnabled,
        })
    )
);

export default withStores(TopSection);
