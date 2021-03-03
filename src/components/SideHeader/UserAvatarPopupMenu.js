import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from 'react-tippy';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { STORE_KEYS } from '../../stores';
import { STATE_KEYS } from '../../stores/ConvertStore';
import { autoConvertOptions } from '../../stores/SettingsStore';
import { SETTING_TIPPY_INFO } from '../../config/constants';
import {
    format7DigitString,
    formatNegativeNumber,
    getScreenInfo
} from '../../utils';
import {
    InputTextCustom,
    Item,
    SettingsBtn,
    UserInfoWrapper
} from '../SideBar/NewSettingsPop/Components';
import {
    DropdownWrapper,
    DropdownMenu,
    DropdownMenuItem,
    OrderHistoryWrapper,
    // Spacer,
    GlobalIcon,
    OpenArrow,
    CloseIcon,
    LanguageWrapper,
    PageButtonsWrapper
} from './Components';
import DesktopHeader from '../../components/WalletHeader/DesktopHeader';
import PerfectScrollWrapper from '../../components-generic/PerfectScrollWrapper';
import {
    ActivityMenuIcon,
    AffiliateMenuIcon,
    AppStoreMenuIcon,
    SettingsMenuIcon
} from './icons';
import OrderHistoryTable from '../OrderHistory/OrderHistoryTable';
import SelectDropdown from '../../components-generic/SelectDropdown';
import { SearchInput } from '../../components-generic/SelectDropdown/Components';
import {
    accessLevels,
    defaultCurrencies,
    autoFlips,
    c1s,
    c2s,
    swaps,
    timerList,
    timerAfterList
} from '../SideBar/NewSettingsPop/mock';
import SwitchCustom from '../../components-generic/SwitchCustom';
import { languages } from '../../lib/translations/languages';
import KeyModal from '../KeyModal';
import LogoutModal from '../LogoutModal';
import CurrencySelectDropdown from '../../components-generic/SelectDropdown/CurrencySelectDropdown';
import LanguageSelectDropdown from '../../components-generic/SelectDropdown/LanguageSelectDropdown';
import ForexDropdown from '../../components-generic/SelectDropdown/ForexDropdown';
import InputCustom from '../../components-generic/InputCustom';
import GradientButton from '@/components-generic/GradientButtonSquare';
// import SendCoinsModal from '../SendCoinsModal';
import SeedWordsModal from '../SeedWordsModal';
import AvatarImage from './AvatarImage';
import ExchangeListComponent from './ExchangeListComponent';
import { viewModeKeys, appStoreModeKeys } from '@/stores/ViewModeStore';
import PageModal from '../Modals/PageModal';
import { ApiButton, ArbButton, PayButton } from '../WalletHeader/DesktopHeader/AppStoreControls/Components';

class UserAvatarPopupMenu extends React.Component {
    ref = React.createRef();

    state = {
        isLogoutModalOpen: false,
        isExchangeListOpen: false,
        isChildOpen: false,
        isKeyModalOpen: false,
        isAdvancedListOpen: false,
        isPrivacyListOpen: false,
        isAffiliateListOpen: false,
        isPreferencesListOpen: false,
        isHelpDeskListOpen: false,
        tab: 'all',
        searchValue: '',
        tooltipWidth: window.innerWidth,
        isAppStoreOpen: false,
        page: null,
    };

    componentDidMount() {
        window.addEventListener('resize', this.handleResizeWindow);
        document.addEventListener('mousedown', this.handleClickOutside);
        this.props[STORE_KEYS.ORDERHISTORY].requestOrderHistory();
        this.props[STORE_KEYS.SETTINGSSTORE].getOrderHistory();
        this.props[STORE_KEYS.VIEWMODESTORE].toggleOrderHistoryMode(false);
        this.setState({
            isExchangeListOpen: this.props[STORE_KEYS.VIEWMODESTORE].isSettingsExchangeViewMode,
            isAppStoreOpen: this.props[STORE_KEYS.VIEWMODESTORE].isAppStoreDropDownOpen,
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResizeWindow);
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setChildOpen = value => {
        this.setState({
            isChildOpen: value,
        });
    };

    handleResizeWindow = () => {
        this.forceUpdate();
    };

    handleClickOutside = (event) => {
        const { isLogoutModalOpen, page } = this.state;
        const {
            [STORE_KEYS.VIEWMODESTORE]: {
                isUserDropDownOpen,
            },
            headerRef,
        } = this.props;

        if (
            isUserDropDownOpen
            && headerRef.current && !headerRef.current.contains(event.target)
            && !isLogoutModalOpen
            && !page
        ) {
            this.props.onClose(false);
        }
    };

    handlePageOpen = (pageId = null) => () => this.handlePageToggle(pageId);

    handlePageToggle = (pageId = null) => {
        this.setState({
            page: pageId,
        });
    }

    openAPIApp = () => {
        const {
            [STORE_KEYS.CONVERTSTORE] : { setCancelOrder, setConvertState },
            [STORE_KEYS.VIEWMODESTORE] : { setViewMode, setArbMode, showDepthChartMode },
            [STORE_KEYS.EXCHANGESSTORE] : { clearExchanges },
            onClose
        } = this.props;
        setViewMode(viewModeKeys.basicModeKey);
        setArbMode(false);
        setCancelOrder(true);
        onClose();
        setConvertState(STATE_KEYS.coinSearch);
        showDepthChartMode(true);
        clearExchanges();
    };

    openForexApp = () => {
        const {
            [STORE_KEYS.VIEWMODESTORE] : { setViewMode, showDepthChartMode, setArbMode },
            [STORE_KEYS.CONVERTSTORE] : { setConvertState },
            onClose,
        } = this.props;
        onClose();
        setArbMode(false);
        showDepthChartMode(false);
        setViewMode(viewModeKeys.forexModeKey);
        setConvertState(STATE_KEYS.coinSearch);
    };

    openArbApp = () => {
        const {
            [STORE_KEYS.VIEWMODESTORE] : { setViewMode, setArbMode },
            onClose,
        } = this.props;
        onClose();
        setViewMode(viewModeKeys.basicModeKey);
        setArbMode(true);
    };

    toggleSettings = (mode) => {
        const {
            [STORE_KEYS.VIEWMODESTORE]: {
                openSettingsView,
            },
        } = this.props;

        openSettingsView(mode);
    };

    handleLogin = e => {
        e.preventDefault();

        this.props.setLoginBtnLocation(true);
        this.props.onClose();
    };

    toggleLogoutModal = (isLogoutModalOpen) => {
        this.setState(prevState => ({
            isLogoutModalOpen: (typeof isLogoutModalOpen === 'boolean') ? isLogoutModalOpen : !prevState.isLogoutModalOpen,
        }));
    };

    handleResetBalance = (e) => {
        e.stopPropagation();
        this.props[STORE_KEYS.YOURACCOUNTSTORE].resetDemoBalances();
        this.props[STORE_KEYS.YOURACCOUNTSTORE].resetWalletTableState();
        // this.props[STORE_KEYS.SETTINGSSTORE].setShortSellWith(false);
        this.props[STORE_KEYS.CONVERTSTORE].gotoFirstState();
        this.props[STORE_KEYS.INSTRUMENTS].setBase('BTC');
        this.props[STORE_KEYS.INSTRUMENTS].setQuote('USDT');
        this.props[STORE_KEYS.SETTINGSSTORE].resetBalance();
        this.props[STORE_KEYS.ORDERHISTORY].resetOrderHistory();
        this.props[STORE_KEYS.SETTINGSSTORE].resetHistory();
        this.props.onClose();
    };

    handleLanguage = (lang) => {
        // this.props.toggleKeyModal(true);
        const {
            [STORE_KEYS.SETTINGSSTORE]: {
                setLanguage,
            },
            [STORE_KEYS.MODALSTORE]: {
                onClose,
            },
        } = this.props;
        setLanguage(lang);
        // close LanguageCurrencyModal manually
        onClose();
    };

    toggleKeyModal = (isKeyModalOpen) => {
        this.setState(prevState => ({
            isKeyModalOpen: (typeof isKeyModalOpen === 'boolean') ? isKeyModalOpen : !prevState.isKeyModalOpen,
        }));
    };

    toggleAppStore = () => {
        this.setState(prevState => ({
            isAppStoreOpen: !prevState.isAppStoreOpen,
            isKeyModalOpen: false,
            isAdvancedListOpen: false,
            isAffiliateListOpen: false,
            isPreferencesListOpen: false,
            isHelpDeskListOpen: false,
            isExchangeListOpen: false,
            isPrivacyListOpen: false,
        }));
        this.props[STORE_KEYS.VIEWMODESTORE].toggleOrderHistoryMode(false);
    };

    toggleExchangeList = (isOpen) => {
        this.setState(prevState => ({
            isExchangeListOpen: (typeof isOpen === 'boolean') ? isOpen : !prevState.isExchangeListOpen,
            isAdvancedListOpen: false,
            isKeyModalOpen: false,
            isPrivacyListOpen: false,
            isAffiliateListOpen: false,
            isPreferencesListOpen: false,
            isHelpDeskListOpen: false,
            isAppStoreOpen: false,
        }), () => {
            if (this.state.isExchangeListOpen) {
                this.searchValueRef.focus();
            }
        });
        this.props[STORE_KEYS.VIEWMODESTORE].toggleOrderHistoryMode(false);
    };

    toggleAdvancedList = (isOpen) => {
        this.setState(prevState => ({
            isAdvancedListOpen: (typeof isOpen === 'boolean') ? isOpen : !prevState.isAdvancedListOpen,
            isKeyModalOpen: false,
            isPrivacyListOpen: false,
            isAffiliateListOpen: false,
            isPreferencesListOpen: false,
            isHelpDeskListOpen: false,
            isExchangeListOpen: false,
            isAppStoreOpen: false,
        }));
        this.props[STORE_KEYS.VIEWMODESTORE].toggleOrderHistoryMode(false);
    };

    togglePrivacyList = (isOpen) => {
        this.setState(prevState => ({
            isPrivacyListOpen: (typeof isOpen === 'boolean') ? isOpen : !prevState.isPrivacyListOpen,
            isKeyModalOpen: false,
            isAdvancedListOpen: false,
            isAffiliateListOpen: false,
            isPreferencesListOpen: false,
            isHelpDeskListOpen: false,
            isExchangeListOpen: false,
            isAppStoreOpen: false,
        }));
        this.props[STORE_KEYS.VIEWMODESTORE].toggleOrderHistoryMode(false);
    };

    toggleAffiliateList = (isOpen) => {
        this.setState(prevState => ({
            isAffiliateListOpen: (typeof isOpen === 'boolean') ? isOpen : !prevState.isAffiliateListOpen,
            isKeyModalOpen: false,
            isAdvancedListOpen: false,
            isPrivacyListOpen: false,
            isPreferencesListOpen: false,
            isHelpDeskListOpen: false,
            isExchangeListOpen: false,
            isAppStoreOpen: false,
        }));
        this.props[STORE_KEYS.VIEWMODESTORE].toggleOrderHistoryMode(false);
    };

    toggleHelpDeskList = (isOpen) => {
        this.setState(prevState => ({
            isHelpDeskListOpen: (typeof isOpen === 'boolean') ? isOpen : !prevState.isHelpDeskListOpen,
            isKeyModalOpen: false,
            isAdvancedListOpen: false,
            isPrivacyListOpen: false,
            isPreferencesListOpen: false,
            isAffiliateListOpen: false,
            isExchangeListOpen: false,
            isAppStoreOpen: false,
        }));
        this.props[STORE_KEYS.VIEWMODESTORE].toggleOrderHistoryMode(false);
    };

    togglePreferencesList = (isOpen) => {
        this.setState(prevState => ({
            isPreferencesListOpen: (typeof isOpen === 'boolean') ? isOpen : !prevState.isPreferencesListOpen,
            isKeyModalOpen: false,
            isAdvancedListOpen: false,
            isPrivacyListOpen: false,
            isAffiliateListOpen: false,
            isHelpDeskListOpen: false,
            isExchangeListOpen: false,
            isAppStoreOpen: false,
        }));
        this.props[STORE_KEYS.VIEWMODESTORE].toggleOrderHistoryMode(false);
    };

    handleLogoutBtn = () => {
        this.toggleLogoutModal(true);
    };

    setAccessLevel = (accessLevel) => {
        const { referredBy, setAccessLevel } = this.props[STORE_KEYS.SETTINGSSTORE];
        const { Modal } = this.props[STORE_KEYS.MODALSTORE];

        // if (accessLevel !== 'Level 1') {
        //     Modal({
        //         portal: 'graph-chart-parent',
        //         ModalComponentFn: () => (
        //             <SendCoinsModal
        //                 coin="USDT"
        //                 name={referredBy}
        //                 user={{
        //                     name: referredBy,
        //                 }}
        //                 onFinish={() => {
        //                     setAccessLevel(accessLevel);
        //                 }}
        //             />
        //         ),
        //     });
        // } else {
        //     setAccessLevel(accessLevel);
        // }
        setAccessLevel(accessLevel);
    };

    setDefaultCurrency = defaultCurrency => {
        const { referredBy, setDefaultCurrencySetting } = this.props[STORE_KEYS.SETTINGSSTORE];
        setDefaultCurrencySetting(defaultCurrency);
    }

    handleViewSeedWords = () => {
        const { Modal } = this.props[STORE_KEYS.MODALSTORE];
        Modal({
            portal: 'graph',
            ModalComponentFn: () => (
                <SeedWordsModal isShow={true} isBackUp={true} />
            ),
        });
    };

    setRealTradingWith = () => {
        const { setRealTrading } = this.props[STORE_KEYS.SETTINGSSTORE];
        const { isLoggedIn } = this.props[STORE_KEYS.TELEGRAMSTORE];
        if (isLoggedIn) {
            setRealTrading();
        } else {
            console.log('Login with Telegram');
        }
    };

    handleChangeSearchValue = (e) => {
        e.stopPropagation();
        this.setState({
            searchValue: e.target.value,
        });
    };

    toggleDropDown = () => {
        const {
            [STORE_KEYS.VIEWMODESTORE]: {
                isUserDropDownOpen,
                setUserDropDownOpen,
                showDepthChartMode,
            },
        } = this.props;
        setUserDropDownOpen(!isUserDropDownOpen);
        showDepthChartMode(true);
    };

    onShowTooltip = ({ target }) => {
        const clientWidth = window.innerWidth;
        if (clientWidth > 768) {
            return;
        }

        const rect = target.getBoundingClientRect();
        this.setState({
            tooltipWidth: clientWidth - rect.right - 10,
        });
    };

    getTooltip = (tooltipText, props = {}) => {
        const { tooltipWidth } = this.state;

        return (
            <Tooltip
                arrow={true}
                animation="shift"
                position="right"
                theme="bct"
                useContext
                html={(
                    <div style={{ maxWidth: tooltipWidth }}>
                        {tooltipText}
                    </div>
                )}
                popperOptions={{
                    modifiers: {
                        preventOverflow: { enabled: false },
                        flip: { enabled: false },
                        hide: { enabled: false },
                    },
                }}
                {...props}
            >
                <span className="symbol_i" onClick={this.onShowTooltip}>i</span>
            </Tooltip>
        );
    };

    render() {
        const {
            isAppStoreOpen,
            isExchangeListOpen,
            isKeyModalOpen,
            isAdvancedListOpen,
            isPrivacyListOpen,
            isAffiliateListOpen,
            isPreferencesListOpen,
            isHelpDeskListOpen,
            isLogoutModalOpen,
            tooltipWidth,
        } = this.state;

        const {
            isLoggedIn,
            loggedInUser,
        } = this.props[STORE_KEYS.TELEGRAMSTORE];

        const { setExchangeActive } = this.props[STORE_KEYS.EXCHANGESSTORE];

        const {
            isShortSell, isRealTrading, defaultURL, isGoogle2FA, isEmail2FA,
            setShortSell, setDefaultURL,
            setPortfolioIncludesBct, portfolioIncludesBct,
            accessLevel, isDefaultCrypto,
            privateVpn, setPrivateVpn,
            referredBy, setReferredBy,
            referCount, setReferCount,
            language,
            isAutoConvert, setIsAutoConvert,
            swap, setSwap,
            c2, setC2,
            c1, setC1,
            autoFlip, setAutoFlip,
            timer, setTimer,
            timerAfter, setTimerAfter,
            withdrawAddress,
            defaultForex, setDefaultForex,
        } = this.props[STORE_KEYS.SETTINGSSTORE];
        const defaultCurrency = isDefaultCrypto ? 'Crypto' : 'Fiat';
        const {
            orderHistoryMode,
            isUserDropDownOpen,
        } = this.props[STORE_KEYS.VIEWMODESTORE];

        const {
            convertState,
        } = this.props[STORE_KEYS.CONVERTSTORE];

        const { isArbOpen } = this.props;

        const authClientId = localStorage.getItem('authClientId');

        const userId = (isLoggedIn && loggedInUser) ? authClientId : '';

        let phoneNumber;
        try {
            phoneNumber = parsePhoneNumberFromString(localStorage.getItem('phoneNumber'));
            phoneNumber = phoneNumber.formatInternational();
        } catch(e) {
            phoneNumber = '';
        }

        // -----
        const isBackendTelLogin = localStorage.getItem('authToken');
        let languagesArray = [];
        for (let i = 0; i < languages.length; i++) {
            languagesArray.push({
                name: languages[i].value,
                flag: languages[i].flag,
            });
        }

        // ------
        const { storeCredit } = this.props[STORE_KEYS.YOURACCOUNTSTORE];
        const storeCreditStr = formatNegativeNumber(format7DigitString(storeCredit)).replace('+', '');

        const { gridHeight, leftSidebarWidth, isMobileDevice } = getScreenInfo(true);

        const appStoreList = (
            <Fragment >
                <Item btn appStoreButton onClick={this.openAPIApp}>
                    <ApiButton
                        appStoreMode={appStoreModeKeys.marketMakerModeKey}
                        onClick={this.openAPIApp}
                    />
                    <span>
                        <FormattedMessage
                            id="settings.market_maker_mode"
                            defaultMessage="Market Maker Mode"
                        />

                        <Tooltip
                            arrow={true}
                            animation="shift"
                            position="right"
                            theme="bct"
                            title={SETTING_TIPPY_INFO.MARKET_MAKER_MODE}
                            popperOptions={{
                                modifiers: {
                                    preventOverflow: { enabled: false },
                                    flip: { enabled: false },
                                    hide: { enabled: false },
                                },
                            }}
                        >
                            <span className="symbol_i">i</span>
                        </Tooltip>
                    </span>
                </Item>

                <Item btn appStoreButton onClick={this.openArbApp}>
                    <ArbButton
                        appStoreMode={appStoreModeKeys.hedgeFundModeKey}
                        onClick={this.openArbApp}
                    />
                    <span>
                        <FormattedMessage
                            id="settings.hedge_fund_mode"
                            defaultMessage="Hedge Fund Mode"
                        />

                        <Tooltip
                            arrow={true}
                            animation="shift"
                            position="right"
                            theme="bct"
                            title={SETTING_TIPPY_INFO.HEDGE_FUND_MODE}
                            popperOptions={{
                                modifiers: {
                                    preventOverflow: { enabled: false },
                                    flip: { enabled: false },
                                    hide: { enabled: false },
                                },
                            }}
                        >
                            <span className="symbol_i">i</span>
                        </Tooltip>
                    </span>
                </Item>

                <Item btn appStoreButton onClick={this.openForexApp}>
                    <PayButton
                        appStoreMode={appStoreModeKeys.forexTradeModeKey}
                        onClick={this.openForexApp}
                    />
                    <span>
                        <FormattedMessage
                            id="settings.forex_trader_mode"
                            defaultMessage="Forex Trader Mode"
                        />

                        <Tooltip
                            arrow={true}
                            animation="shift"
                            position="right"
                            theme="bct"
                            title={SETTING_TIPPY_INFO.FOREX_TRADER_MODE}
                            popperOptions={{
                                modifiers: {
                                    preventOverflow: { enabled: false },
                                    flip: { enabled: false },
                                    hide: { enabled: false },
                                },
                            }}
                        >
                            <span className="symbol_i">i</span>
                        </Tooltip>
                    </span>
                </Item>

            </Fragment>
        );

        const advancedList = (
            <Fragment>
                <Item>
                    <span>
                        <FormattedMessage
                            id="settings.label_store_credit"
                            defaultMessage="Store Credit"
                        />

                        {this.getTooltip(`Your Store Credit: ${storeCreditStr}`)}
                    </span>
                    <SwitchCustom
                        checked={isShortSell}
                        onChange={isRealTrading ? this.toggleKeyModal : setShortSell}
                        onMouseLeave={() => {
                            this.toggleKeyModal(false);
                        }}
                    />
                </Item>

                <Item>
                    <span>
                        <FormattedMessage
                            id="settings.label_balance_includes_credit"
                            defaultMessage="Balance includes Credit"
                        />

                        {this.getTooltip(SETTING_TIPPY_INFO.BALANCE_CREDIT)}
                    </span>
                    <SwitchCustom
                        checked={portfolioIncludesBct}
                        // onChange={this.toggleKeyModal}
                        onChange={setPortfolioIncludesBct}
                        onMouseLeave={() => {
                            this.toggleKeyModal(false);
                        }}
                    />
                </Item>

                <Item>
                    <span>
                        <FormattedMessage
                            id="settings.label_12words"
                            defaultMessage="12-word phrase"
                        />

                        {this.getTooltip(SETTING_TIPPY_INFO.WORD12_PHRASE)}
                    </span>
                    <button
                        className="btn_normal"
                        onClick={this.handleViewSeedWords}
                    >
                        <Tooltip
                            arrow={true}
                            animation="shift"
                            position="left"
                            followCursor
                            theme="bct"
                            title="Your Access is Restricted to Level 1"
                            popperOptions={{
                                modifiers: {
                                    preventOverflow: { enabled: false },
                                    flip: { enabled: false },
                                    hide: { enabled: false },
                                },
                            }}
                        >
                            <FormattedMessage
                                id="settings.btn_view"
                                defaultMessage="View"
                            />
                        </Tooltip>
                    </button>
                </Item>

                <Item>
                    <span>
                        <FormattedMessage
                            id="settings.label_private_vpn"
                            defaultMessage="Private VPN"
                        />

                        {this.getTooltip(SETTING_TIPPY_INFO.PRIVATE_VPN)}
                    </span>
                    <SwitchCustom
                        checked={privateVpn}
                        onChange={setPrivateVpn}
                        // readOnly
                        // onMouseEnter={() => { this.toggleKeyModal(true); }}
                        onMouseLeave={() => {
                            this.toggleKeyModal(false);
                        }}
                    />
                </Item>

                <Item>
                    <span>
                        <FormattedMessage
                            id="settings.forex_profit_margin"
                            defaultMessage="Forex Profit Margin"
                        />

                        {this.getTooltip(SETTING_TIPPY_INFO.FOREX_PROFIT_MARGIN)}
                    </span>

                    <ForexDropdown
                        width={180}
                        value={defaultForex}
                        isSearchable={false}
                        onChange={setDefaultForex}
                    />
                </Item>

                <Item>
                    <span>
                        <FormattedMessage
                            id="settings.timer"
                            defaultMessage="Timer (seconds)"
                        />

                        {this.getTooltip(SETTING_TIPPY_INFO.TIMER)}
                    </span>
                    <Tooltip
                        arrow={true}
                        animation="shift"
                        position="right"
                        theme="bct"
                        title="Your level is not allowed to change this"
                        popperOptions={{
                            modifiers: {
                                preventOverflow: { enabled: false },
                                flip: { enabled: false },
                                hide: { enabled: false },
                            },
                        }}
                    >
                        <SelectDropdown
                            width={180}
                            value={timer}
                            items={timerList}
                            isSearchable={false}
                            onChange={setTimer}
                        />
                    </Tooltip>
                </Item>

                <Item>
                    <span>
                        <FormattedMessage
                            id="settings.timer"
                            defaultMessage="Initiate Timer"
                        />

                        {this.getTooltip(SETTING_TIPPY_INFO.TIMER_AFTER)}
                    </span>
                    <SelectDropdown
                        width={180}
                        value={timerAfter}
                        items={timerAfterList}
                        isSearchable={false}
                        onChange={setTimerAfter}
                    />
                </Item>

                <Item>
                    <span>
                        User ID

                        {this.getTooltip("User ID")}
                    </span>
                    <InputTextCustom
                        width={180}
                        value={userId}
                        readOnly
                    />
                </Item>

                <Item>
                    <span>
                        Withdraw Address

                        {this.getTooltip("Withdraw Address")}
                    </span>
                    <InputTextCustom
                        width={180}
                        value={withdrawAddress}
                        readOnly
                    />
                </Item>
            </Fragment>
        );

        const privacyList = (
            <Fragment>
                <Item>
                    <span>
                        <FormattedMessage
                            id="settings.label_google_2fa"
                            defaultMessage="Google 2FA"
                        />

                        {this.getTooltip(SETTING_TIPPY_INFO.GOOGLE_2FA)}
                    </span>
                    <SwitchCustom
                        checked={isGoogle2FA}
                        // onChange={this.toggleKeyModal}
                        // onChange={setGoogle2FA}
                        // onMouseLeave={() => { this.toggleKeyModal(false); }}
                    />
                </Item>
                <Item>
                    <span>
                        <FormattedMessage
                            id="settings.label_email_2fa"
                            defaultMessage="Email 2FA"
                        />

                        {this.getTooltip(SETTING_TIPPY_INFO.EMAIL_2FA)}
                    </span>
                    <SwitchCustom
                        checked={isEmail2FA}
                    />
                </Item>
            </Fragment>
        );

        const preferenceList = (
            <Fragment >
                <Item>
                    <span>
                        <FormattedMessage
                            id="settings.label_real_trading"
                            defaultMessage="Real Trading (Level1 Access)"
                        />

                        {this.getTooltip(SETTING_TIPPY_INFO.REAL_TREADING)}
                    </span>
                    <SwitchCustom
                        checked={isRealTrading}
                        onChange={this.setRealTradingWith}
                    />
                </Item>

                <Item>
                    <span>
                        <FormattedMessage
                            id="settings.label_access_level"
                            defaultMessage="Access Level"
                        />

                        {this.getTooltip(SETTING_TIPPY_INFO.ACCESS_LEVEL)}
                    </span>

                    <SelectDropdown
                        width={180}
                        value={accessLevel}
                        items={accessLevels}
                        isSearchable={false}
                        alignTop={false}
                        onChange={this.setAccessLevel}
                    />
                </Item>

                <Item>
                    <span>
                        <FormattedMessage
                            id="settings.label_default_fiat"
                            defaultMessage="Default Fiat"
                        />

                        {this.getTooltip(SETTING_TIPPY_INFO.DEFAULT_FIAT)}
                    </span>

                    <CurrencySelectDropdown
                        width={180}
                        height={200}
                        type="fiat"
                        isFullScreen
                        // onClick={showLanguageCurrencyModal(ModalPopup, onClose, 'graph-chart-parent', true)}
                    />
                </Item>

                <Item>
                    <span>
                        <FormattedMessage
                            id="settings.label_default_crypto"
                            defaultMessage="Default Crypto"
                        />

                        {this.getTooltip(SETTING_TIPPY_INFO.DEFAULT_CRYPTO)}
                    </span>

                    <CurrencySelectDropdown
                        width={180}
                        height={200}
                        type="crypto"
                        isFullScreen
                        disableCrypto
                    />
                </Item>

                <Item>
                    <span>
                        <FormattedMessage
                            id="settings.label_default_currency"
                            defaultMessage="Default Currency"
                        />

                        <Tooltip
                            arrow={true}
                            animation="shift"
                            position="right"
                            theme="bct"
                            title={SETTING_TIPPY_INFO.DEFAULT_CURRENCY}
                            popperOptions={{
                                modifiers: {
                                    preventOverflow: { enabled: false },
                                    flip: { enabled: false },
                                    hide: { enabled: false },
                                },
                            }}
                        >
                            <span className="symbol_i">i</span>
                        </Tooltip>
                    </span>

                    <SelectDropdown
                        width={180}
                        value={defaultCurrency}
                        items={defaultCurrencies}
                        isSearchable={false}
                        alignTop={false}
                        onChange={this.setDefaultCurrency}
                    />
                </Item>
            </Fragment>
        );

        const affiliateList = (
            <Fragment>
                <Item>
                    <span className="affliate-label-wrapper">
                        <FormattedMessage
                            id="settings.label_default_url"
                            defaultMessage="Default URL"
                        />

                        {this.getTooltip(SETTING_TIPPY_INFO.DEFAULT_URL)}
                    </span>
                    <InputTextCustom
                        // readOnly
                        width={280}
                        value={defaultURL}
                        onChange={setDefaultURL}
                        readOnly
                    />
                </Item>

                <Item>
                    <span className="affliate-label-wrapper">
                        <FormattedMessage
                            id="settings.label_referred_by"
                            defaultMessage="Referred by"
                        />

                        {this.getTooltip(SETTING_TIPPY_INFO.REFERRED_BY)}
                    </span>
                    <InputTextCustom
                        width={280}
                        value={referredBy}
                        onChange={setReferredBy}
                        readOnly
                    />
                </Item>
                <Item>
                    <span className="affliate-label-wrapper">
                        <FormattedMessage
                            id="settings.label_you_referred"
                            defaultMessage="You referred"
                        />

                        {this.getTooltip(SETTING_TIPPY_INFO.YOU_REFERRED)}
                    </span>
                    <InputTextCustom
                        width={280}
                        value={referCount}
                        onChange={setReferCount}
                        readOnly
                    />
                </Item>
            </Fragment>
        );

        const whitelabel = window.location.hostname;

        const helpdeskList = (
            <Fragment>
                <Item>
                    <span>
                        <FormattedMessage
                            id="settings.label_support_center"
                            defaultMessage="Platform Support Center"
                        />
                    </span>
                    {/* eslint-disable-next-line react/jsx-no-target-blank */}
                    <a href={`http://nswebdev.us/helpdesk/?${whitelabel}`} target="_blank">
                        <InputTextCustom
                            // readOnly
                            width={280}
                            value="http://nswebdev.us/helpdesk/"
                            readOnly
                        />
                    </a>
                </Item>
            </Fragment>
        );

        const isArbCondition = !isUserDropDownOpen && (convertState !== STATE_KEYS.coinSearch) || isArbOpen;

        return (
            <DropdownWrapper
                gridHeight={gridHeight}
                leftSidebarWidth={leftSidebarWidth}
                isArbCondition={isArbCondition}
            >
                {
                    isArbCondition &&
                    <DesktopHeader
                        isLoggedIn={isLoggedIn}
                        toggleDropDown={this.toggleDropDown}
                        onLogin={this.handleLogin}
                        width={leftSidebarWidth || 0}
                        isMenuOpened={isUserDropDownOpen}
                    />
                }
                <DropdownMenu isArbCondition={isArbCondition}>
                    <PerfectScrollWrapper
                        scrollTop={true}
                    >
                        {isArbCondition && (
                            <OrderHistoryWrapper>
                                <OrderHistoryTable />
                            </OrderHistoryWrapper>
                        )}

                        {!isArbCondition && (
                            <Fragment>
                                {!orderHistoryMode &&
                                <Fragment>
                                    <DropdownMenuItem
                                        isColumn
                                        opened={isAppStoreOpen}
                                    >
                                        <div
                                            className="d-flex"
                                            onClick={this.toggleAppStore}
                                        >
                                            <div className="icon-wrapper">
                                                <AppStoreMenuIcon />
                                            </div>
                                            <span className="label-wrapper">
                                                <FormattedMessage
                                                    id="settings.app_store"
                                                    defaultMessage="App Store"
                                                />
                                            </span>
                                            {isPreferencesListOpen ? <CloseIcon/> : <OpenArrow/>}
                                        </div>

                                        {isAppStoreOpen && appStoreList}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        isColumn
                                        opened={isExchangeListOpen}
                                        isChildOpen={this.state.isExchangeListOpen && !this.state.isChildOpen}
                                    >
                                        <div
                                            className="d-flex"
                                            onClick={this.toggleExchangeList}
                                        >
                                            <div className="icon-wrapper">
                                                <GlobalIcon size={38} color="#fff"/>
                                            </div>
                                            {!isExchangeListOpen ?
                                                <span className="label-wrapper">
                                                    <FormattedMessage
                                                        id="settings.exchanges"
                                                        defaultMessage="Exchanges"
                                                    />
                                                </span> :
                                                <SearchInput
                                                    value={this.state.searchValue}
                                                    onChange={this.handleChangeSearchValue}
                                                    placeholder="Exchanges"
                                                    isBigger
                                                    ref={ref => { this.searchValueRef = ref; }}
                                                />
                                            }
                                            {isExchangeListOpen ? <CloseIcon/> : <OpenArrow/>}
                                        </div>

                                        {isExchangeListOpen && <ExchangeListComponent searchValue={this.state.searchValue} setExchangeActive={setExchangeActive} />}
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        isColumn
                                        opened={isPreferencesListOpen}
                                    >
                                        <div
                                            className="d-flex"
                                            onClick={this.togglePreferencesList}
                                        >
                                            <div className="icon-wrapper">
                                                <AffiliateMenuIcon />
                                            </div>
                                            <span className="label-wrapper">
                                                <FormattedMessage
                                                    id="settings.preferences"
                                                    defaultMessage="Preferences"
                                                />
                                            </span>
                                            {isPreferencesListOpen ? <CloseIcon/> : <OpenArrow/>}
                                        </div>

                                        {isPreferencesListOpen && preferenceList}
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        isColumn
                                        opened={isPrivacyListOpen}
                                    >
                                        <div
                                            className="d-flex"
                                            onClick={this.togglePrivacyList}
                                        >
                                            <div className="icon-wrapper">
                                                <ActivityMenuIcon />
                                            </div>
                                            <span className="label-wrapper">
                                                <FormattedMessage
                                                    id="settings.privacy"
                                                    defaultMessage="Privacy"
                                                />
                                            </span>
                                            {isPrivacyListOpen ? <CloseIcon/> : <OpenArrow/>}
                                        </div>

                                        {isPrivacyListOpen && privacyList}
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        isColumn
                                        opened={isAffiliateListOpen}
                                    >
                                        <div
                                            className="d-flex"
                                            onClick={this.toggleAffiliateList}
                                        >
                                            <div className="icon-wrapper">
                                                <AffiliateMenuIcon />
                                            </div>
                                            <span className="label-wrapper">
                                                <FormattedMessage
                                                    id="settings.affiliate"
                                                    defaultMessage="Affiliate"
                                                />
                                            </span>
                                            {isAffiliateListOpen ? <CloseIcon/> : <OpenArrow/>}
                                        </div>

                                        {isAffiliateListOpen && affiliateList}
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        isColumn
                                        last
                                        opened={isAdvancedListOpen}
                                    >
                                        <div
                                            className="d-flex"
                                            onClick={this.toggleAdvancedList}
                                        >
                                            <div className="icon-wrapper">
                                                <SettingsMenuIcon />
                                            </div>
                                            <span className="label-wrapper">
                                                <FormattedMessage
                                                    id="settings.advanced"
                                                    defaultMessage="Advanced"
                                                />
                                            </span>
                                            {isAdvancedListOpen ? <CloseIcon/> : <OpenArrow/>}
                                        </div>

                                        {isAdvancedListOpen && advancedList}
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        isColumn
                                        opened={isHelpDeskListOpen}
                                    >
                                        <div
                                            className="d-flex"
                                            onClick={this.toggleHelpDeskList}
                                        >
                                            <div className="icon-wrapper">
                                                <AffiliateMenuIcon/>
                                            </div>
                                            <span className="label-wrapper">
                                                <FormattedMessage
                                                    id="settings.helpdesk"
                                                    defaultMessage="HelpDesk"
                                                />
                                            </span>
                                            {isHelpDeskListOpen ? <CloseIcon/> : <OpenArrow/>}
                                        </div>

                                        {isHelpDeskListOpen && helpdeskList}
                                    </DropdownMenuItem>

                                    {isBackendTelLogin && (
                                        <Item UserItem isMobileDevice={false}>
                                            <AvatarImage onClick={this.toggleDropDown}/>
                                            <UserInfoWrapper isMobileDevice={isMobileDevice}>
                                                <div className="user-info-top">
                                                    <div className="userContainer">
                                                        <span>{phoneNumber}</span>
                                                        <span>
                                                            {accessLevel}

                                                            {this.getTooltip(SETTING_TIPPY_INFO.ACCESS_LEVEL, {
                                                                className: "info-tooltip",
                                                                style: {display: 'inline-flex'}
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="btn-wrapper">
                                                        <button
                                                            className="btn_reset"
                                                            onClick={this.handleResetBalance}
                                                        >
                                                            <FormattedMessage
                                                                id="settings.btn_reset"
                                                                defaultMessage="Reset"
                                                            />
                                                        </button>

                                                        <SettingsBtn onClick={this.handleLogoutBtn}>
                                                            <FormattedMessage
                                                                id="settings.btn_logout"
                                                                defaultMessage="Logout"
                                                            />
                                                        </SettingsBtn>
                                                    </div>
                                                </div>
                                                <div className="affiliateContainer">
                                                    <span className="affliate-label-wrapper">
                                                        <FormattedMessage
                                                            id="settings.label_affiliate_link"
                                                            defaultMessage="Affiliate Link"
                                                        />

                                                        {this.getTooltip(SETTING_TIPPY_INFO.AFFILIATE_LINK, {
                                                            className: "info-tooltip",
                                                            style: {display: 'inline-flex'}
                                                        })}
                                                    </span>
                                                    <InputCustom
                                                        userId={userId}
                                                        noContrast
                                                    />
                                                </div>
                                            </UserInfoWrapper>
                                        </Item>
                                    )}
                                </Fragment>
                                }
                            </Fragment>
                        )}
                    </PerfectScrollWrapper>
                    {!isArbCondition && (
                        <LanguageWrapper>
                            <LanguageSelectDropdown
                                width={180}
                                height={200}
                                isFullScreen
                                value={language}
                                items={languagesArray}
                                onChange={this.handleLanguage}
                            />
                        </LanguageWrapper>
                    )}
                    {!isArbCondition && (
                        <PageButtonsWrapper>
                            <GradientButton
                                className="primary-solid"
                                header={true}
                                width={120}
                                height={40}
                                onClick={this.handlePageOpen('terms-of-use')}
                            >
                                <FormattedMessage
                                    id="modal.logout.button_terms_of_use"
                                    defaultMessage="Terms of Use"
                                />
                            </GradientButton>

                            <GradientButton
                                className="primary-solid"
                                header={true}
                                width={120}
                                height={40}
                                onClick={this.handlePageOpen('privacy-policy')}
                            >
                                <FormattedMessage
                                    id="modal.page.button_privacy_policy"
                                    defaultMessage="Privacy Policy"
                                />
                            </GradientButton>
                        </PageButtonsWrapper>
                    )}
                    {!!this.state.page && (
                        <PageModal
                            backdropClose={true}
                            pageId={this.state.page}
                            toggleModal={this.handlePageToggle}
                        />
                    )}
                </DropdownMenu>

                <KeyModal
                    toggleModal={this.toggleKeyModal}
                    hoverMode
                    inLineMode
                    isModalOpen={isKeyModalOpen}
                />

                <LogoutModal
                    toggleModal={this.toggleLogoutModal}
                    inLineMode
                    backdropClose
                    isModalOpen={isLogoutModalOpen}
                />
            </DropdownWrapper>
        );
    }
}

export default inject(
    STORE_KEYS.ORDERHISTORY,
    STORE_KEYS.TELEGRAMSTORE,
    STORE_KEYS.YOURACCOUNTSTORE,
    STORE_KEYS.SETTINGSSTORE,
    STORE_KEYS.INSTRUMENTS,
    STORE_KEYS.CONVERTSTORE,
    STORE_KEYS.MODALSTORE,
    STORE_KEYS.VIEWMODESTORE,
    STORE_KEYS.EXCHANGESSTORE,
    STORE_KEYS.SMSAUTHSTORE,
)(observer(UserAvatarPopupMenu));
