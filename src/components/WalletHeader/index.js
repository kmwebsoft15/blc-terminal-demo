import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';

import { STORE_KEYS } from '@/stores/index';
import { STATE_KEYS } from '@/stores/ConvertStore';
import { languages } from '@/lib/translations/languages';
import {
    Wrapper,
    AvatarWrapper,
} from './Components';
import UserAvatarComponent from '@/components/SideHeader/UserAvatarComponent';
import { getScreenInfo } from '@/utils/index';
import SelectDropdown2Columns from '@/components-generic/SelectDropdown/SelectDropdown2Columns';
import { SearchInput } from '@/components-generic/SelectDropdown/Components';
import SMSVerification from '@/components-generic/SMSVerification2/index';
import UserAvatarPopupMenu from '@/components/SideHeader/UserAvatarPopupMenu';
import Coin2PairSimple from './Coin2PairSimple';
import DesktopHeader from './DesktopHeader';

class WalletHeader extends React.Component {
    state = {
        loginMode: false,
        isArbOpen: false,
        searchValue: '',
    };

    headerRef = React.createRef();
    exchangeRef = React.createRef();
    searchValueRef = React.createRef();

    componentWillReceiveProps(nextProps) {
        const {
            [STORE_KEYS.VIEWMODESTORE]: {
                isExchangeViewMode,
            },
            [STORE_KEYS.EXCHANGESSTORE]: {
                setExchangeSearchValue,
            },
        } = this.props;
        if (!isExchangeViewMode) {
            this.setState({ searchValue: '' });
            setExchangeSearchValue('');
        }
    }

    componentDidUpdate() {
        if (this.searchValueRef && this.searchValueRef.current !== null) {
            this.searchValueRef.focus();
        }
    }

    handleLanguage = (lang) => {
        // this.props.toggleKeyModal(true);
        const { setLanguage } = this.props[STORE_KEYS.SETTINGSSTORE];
        setLanguage(lang);
    };

    refresh = () => {
        window.location.reload();
    };

    handleLogin = () => {
        this.setState(prevState => ({
            loginMode: !prevState.loginMode,
        }));
    };

    toggleDropDown = (isInner = true) => {
        const {
            [STORE_KEYS.SETTINGSSTORE]: {
                tradeColStatus,
                setTradeColStatus,
                sidebarStatus,
                setSidebarStatus,
            },
            [STORE_KEYS.CONVERTSTORE]: {
                convertState,
            },
            [STORE_KEYS.VIEWMODESTORE]: {
                isUserDropDownOpen,
                setUserDropDownOpen,
                setAppStoreDropDownOpen,
                setSettingsExchangeViewMode,
            },
        } = this.props;

        setUserDropDownOpen(!isUserDropDownOpen);
        setAppStoreDropDownOpen(false);
        setSettingsExchangeViewMode(false);

        if (convertState !== STATE_KEYS.coinSearch) {
            if (!isInner) return;
        } else {
            const { isArbOpen } = this.state;
            if (sidebarStatus === 'closed') {
                setSidebarStatus('open');
                return;
            }
            if (isUserDropDownOpen) {
                if (isArbOpen) {
                    this.setState(prevState => ({
                        isArbOpen: !prevState.isArbOpen,
                    }));
                }
            }
        }
    };

    handleShowHistory = () => {
        const {
            [STORE_KEYS.CONVERTSTORE]: {
                convertState,
            },
            [STORE_KEYS.VIEWMODESTORE]: {
                isUserDropDownOpen,
                setUserDropDownOpen,
            },
        } = this.props;

        this.setState({ isArbOpen: true });
        if (convertState !== STATE_KEYS.coinSearch) {
            setUserDropDownOpen(false);
        }
    };

    handleShowExchanges = () => {
        this.toggleDropDown();
        // this.exchangeRef.current.wrappedInstance.ref.current.wrappedInstance.toggleDropDown();
        const {
            [STORE_KEYS.VIEWMODESTORE]: {
                setSettingsExchangeViewMode,
            },
        } = this.props;
        setSettingsExchangeViewMode(true);
    };

    handleChangeSearchValue = (e) => {
        e.stopPropagation();

        const {
            [STORE_KEYS.EXCHANGESSTORE]: {
                setExchangeSearchValue,
            },
        } = this.props;

        this.setState({
            searchValue: e.target.value,
        });
        setExchangeSearchValue(e.target.value);
    };

    render() {
        const { loginMode, isArbOpen } = this.state;
        const {
            [STORE_KEYS.TELEGRAMSTORE]: {
                isLoggedIn, isProfileLogoExists, logoURL, setLoginBtnLocation,
            },
            [STORE_KEYS.SETTINGSSTORE]: {
                language, isRealTrading, isArbitrageMode, tradeColStatus, sidebarStatus,
            },
            [STORE_KEYS.VIEWMODESTORE]: {
                isUserDropDownOpen,
                isExchangeViewMode,
            },
            [STORE_KEYS.CONVERTSTORE]: { convertState },
            isOrderbook,
            isSeparate,
        } = this.props;

        const isArbitrageMonitorMode = isArbitrageMode && (convertState !== STATE_KEYS.coinSearch);
        const {
            isMobileDevice,
        } = getScreenInfo();

        const languagesArray = [];
        for (let i = 0; i < languages.length; i++) {
            languagesArray.push({
                name: languages[i].value,
                flag: languages[i].flag,
            });
        }

        const isOpenMenu = (isUserDropDownOpen || (isArbitrageMonitorMode && tradeColStatus === 'open')) && sidebarStatus === 'open';

        return (
            <Fragment>
                {isExchangeViewMode && (
                    <SearchInput
                        value={this.state.searchValue}
                        onChange={this.handleChangeSearchValue}
                        placeholder="Exchanges"
                        isBigger
                        isFromOrderHistory
                        ref={ref => { this.searchValueRef = ref; }}
                    />
                )}
                {!isExchangeViewMode && (
                    <Wrapper
                        isUserDropDownOpen={isUserDropDownOpen}
                        isArbitrageMonitorMode={isArbitrageMonitorMode}
                        isTelegram={false}
                        isOrderbook={isOrderbook}
                        isSeparate={isSeparate}
                        isPadding={isLoggedIn && !isMobileDevice}
                        ref={this.headerRef}
                        isClosed={(convertState !== STATE_KEYS.coinSearch && tradeColStatus === 'closed') || (convertState === STATE_KEYS.coinSearch && sidebarStatus === 'closed')}
                        isLoggedIn={isLoggedIn}
                    >
                        {!isLoggedIn && (
                            <AvatarWrapper
                                isLoggedIn={isLoggedIn}
                                onClick={isLoggedIn ? null : this.handleLogin}
                            >
                                <UserAvatarComponent
                                    toggleDropDown={this.toggleDropDown}
                                />

                                <span className="login-title">
                                    {!isLoggedIn ? (
                                        <FormattedMessage
                                            id="pay_app.pay_window.label_login"
                                            defaultMessage="Login"
                                        />
                                    ) : (
                                        isRealTrading ? (
                                            <FormattedMessage
                                                id="pay_app.pay_window.label_real_trading"
                                                defaultMessage="Real"
                                            />
                                        ) : (
                                            isArbitrageMode ? (
                                                <FormattedMessage
                                                    id="pay_app.pay_window.label_arbitrage"
                                                    defaultMessage="Arbitrage"
                                                />
                                            ) : (
                                                <FormattedMessage
                                                    id="pay_app.pay_window.label_demo"
                                                    defaultMessage="Demo"
                                                />
                                            )
                                        )
                                    )}
                                </span>
                            </AvatarWrapper>
                        )}

                        {!isLoggedIn && (
                            <SelectDropdown2Columns
                                isSearchable={false}
                                value={language}
                                items={languagesArray}
                                onChange={this.handleLanguage}
                            />
                        )}

                        {(!isLoggedIn && loginMode) ? (
                            <SMSVerification handleBack={this.handleLogin} />
                        ) : (
                            <Fragment>
                                {convertState !== STATE_KEYS.coinSearch  && !isOpenMenu ? (
                                    <Coin2PairSimple
                                        isLoggedIn={isLoggedIn}
                                        toggleDropDown={this.toggleDropDown}
                                        onLogin={this.handleLogin}
                                        isMenuOpened={isUserDropDownOpen}
                                    />
                                ) : (
                                    (!isArbitrageMonitorMode || isOpenMenu) &&
                                    <DesktopHeader
                                        isLoggedIn={isLoggedIn}
                                        toggleDropDown={this.toggleDropDown}
                                        onLogin={this.handleLogin}
                                        isMenuOpened={isUserDropDownOpen}
                                    />
                                )}
                            </Fragment>
                        )}

                        {isOpenMenu && (
                            <UserAvatarPopupMenu
                                isLoggedIn={isLoggedIn}
                                isProfileLogoExists={isProfileLogoExists}
                                logoURL={logoURL}
                                setLoginBtnLocation={setLoginBtnLocation}
                                onClose={this.toggleDropDown}
                                isArbOpen={isArbOpen}
                                onShowHistory={this.handleShowHistory}
                                onShowExchanges={this.handleShowExchanges}
                                headerRef={this.headerRef}
                            />
                        )}
                    </Wrapper>
                )}
            </Fragment>
        );
    }
}

export default inject(
    STORE_KEYS.TELEGRAMSTORE,
    STORE_KEYS.SETTINGSSTORE,
    STORE_KEYS.MODALSTORE,
    STORE_KEYS.CONVERTSTORE,
    STORE_KEYS.VIEWMODESTORE,
    STORE_KEYS.EXCHANGESSTORE,
)(observer(WalletHeader));
