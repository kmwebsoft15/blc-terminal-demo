import React from 'react';
import { inject, observer } from 'mobx-react';
import { Wrapper, ApiButton, PayButton } from './Components';
import { STORE_KEYS } from '@/stores';
import { STATE_KEYS } from '@/stores/ConvertStore';
import {ArbButton} from '@/components/WalletHeader/DesktopHeader/AppStoreControls/Components';
import { viewModeKeys, appStoreModeKeys } from '@/stores/ViewModeStore';
import { orderFormToggleKeys } from '@/stores/MarketMaker';

const AppStoreControls = (props) => {
    const {
        [STORE_KEYS.VIEWMODESTORE]: { appStoreMode, setAppStoreControlsOpen },
    } = props;

    const openAPIApp = () => {
        if (appStoreMode !== appStoreModeKeys.marketMakerModeKey) {
            const {
                [STORE_KEYS.VIEWMODESTORE] : { setAppStoreMode, showDepthChartMode, setArbMode, setViewMode, },
                [STORE_KEYS.CONVERTSTORE] : { setCancelOrder, setConvertState },
                [STORE_KEYS.MARKETMAKER]: { showOrderFormWith },
                [STORE_KEYS.EXCHANGESSTORE]: { clearExchanges }
            } = props;
            setViewMode(viewModeKeys.basicModeKey);
            showOrderFormWith(orderFormToggleKeys.onToggleKey);
            setArbMode(false);
            setCancelOrder(true);
            setConvertState(STATE_KEYS.coinSearch);
            setAppStoreMode(appStoreModeKeys.marketMakerModeKey);
            showDepthChartMode(true);
            clearExchanges();
        }
        setAppStoreControlsOpen(false);
    };

    const openForexApp = () => {
        if (appStoreMode !== appStoreModeKeys.forexTradeModeKey) {
            const {
                [STORE_KEYS.VIEWMODESTORE] : { setViewMode, showDepthChartMode, setAppStoreMode, setArbMode },
                [STORE_KEYS.CONVERTSTORE] : { setConvertState }
            } = props;
            setArbMode(false);
            showDepthChartMode(false);
            setViewMode(viewModeKeys.forexModeKey);
            setConvertState(STATE_KEYS.coinSearch);
            setAppStoreMode(appStoreModeKeys.forexTradeModeKey);
        }
        setAppStoreControlsOpen(false);
    };

    const openArbApp = () => {
        if (appStoreMode !== appStoreModeKeys.hedgeFundModeKey) {
            const {
                [STORE_KEYS.VIEWMODESTORE] : { setViewMode, setArbMode, setAppStoreMode, showDepthChartMode, },
                [STORE_KEYS.CONVERTSTORE] : { setConvertState },
                [STORE_KEYS.MARKETMAKER]: { showOrderFormWith }
            } = props;
            setViewMode(viewModeKeys.basicModeKey);
            showOrderFormWith(orderFormToggleKeys.onToggleKey);
            setArbMode(true);
            setConvertState(STATE_KEYS.coinSearch);
            setAppStoreMode(STATE_KEYS.hedgeFundModeKey);
            showDepthChartMode(true);
        }
        setAppStoreControlsOpen(false);
    };

    return (
        <Wrapper>
            <ApiButton onClick={openAPIApp} appStoreMode={appStoreModeKeys.marketMakerModeKey} />
            <ArbButton onClick={openArbApp} appStoreMode={appStoreModeKeys.hedgeFundModeKey} />
            <PayButton onClick={openForexApp} appStoreMode={appStoreModeKeys.forexTradeModeKey} />
        </Wrapper>
    );
};

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
    [STORE_KEYS.MARKETMAKER],
)(observer(AppStoreControls));
