import { observable, action, reaction } from 'mobx';
import { darkTheme } from '../theme/core';
import { MODE_KEYS } from '@/components/OrderHistoryAdv/Constants';

export const viewModeKeys = {
    basicModeKey: 'basic', // Wallet Table view mode
    friendModeKey: 'friend', // Telegram Friend list view mode
    publicChatModeKey: 'chat', // Telegram Public Coin's channel view mode
    advancedModeKey: 'advanced', // Global Order Book view mode
    exchangesModeKey: 'exchanges', // Exchanges list view mode
    settingsModeKey: 'settings', // Settings view mode
    historyModeKey: 'history', // History view mode
    depositModeKey: 'deposit', // Deposit view mode
    forexModeKey: 'forex', // Forex view mode
};

export const appStoreModeKeys = {
    marketMakerModeKey: 'Market Maker Mode',
    hedgeFundModeKey: 'Hedge Fund Mode',
    forexTradeModeKey: 'Forex Trader Mode',
};

export const settingsViewModeKeys = {
    privacyList: 'privacyList',
    affiliateList: 'affiliateList',
    advancedList: 'advancedList',
    appStoreList: 'appStoreList',
};

const StateSequence = new Set([
    viewModeKeys.basicModeKey,
    viewModeKeys.friendModeKey,
    viewModeKeys.publicChatModeKey,
    viewModeKeys.advancedModeKey,
    viewModeKeys.exchangesModeKey,
    viewModeKeys.settingsModeKey,
    viewModeKeys.historyModeKey,
    viewModeKeys.depositModeKey,
    viewModeKeys.forexModeKey
]);

class ViewModeStore {
    @observable viewMode;
    @observable theme = darkTheme;
    @observable isFullScreen = false;
    @observable depthChartMode = true;
    @observable orderHistoryMode = false;
    @observable tradingViewMode = false;
    @observable isSearchEnabled = false;
    @observable isGBExistMonitor = false; // TRUE: state of checking if data stream exists; FALSE: state of unchecking.
    @observable depositActiveCoin = null;
    @observable isUserDropDownOpen = false;
    @observable isSettingsOpen = false;
    @observable isAppStoreDropDownOpen = false;
    @observable settingsViewMode = settingsViewModeKeys.advancedList; // Which group of settings items to show
    @observable graphSwitchMode = false; // false: donut, true: portfolio
    @observable isFirstLoad = true; // true: first-loading
    @observable isAdvancedAPIMode = false;
    @observable rightBottomSectionOpenMode = 'depth-chart';
    @observable rightBottomSectionFullScreenMode = false;
    @observable masterSwitchMode = false;
    @observable isExchangeViewMode = false;
    @observable isSettingsExchangeViewMode = false;
    @observable isPayApp = true;
    @observable isPayAppLoading = true;
    @observable pageIndexOfSmart = 1;
    @observable rightLowerDivision = 0;
    @observable isLoaded = false;
    @observable arbMode = false;
    @observable isArbDetailMode = true;
    @observable appStoreMode = appStoreModeKeys.marketMakerModeKey;
    @observable isAppStoreControlsOpen = false;

    statesSequence = null;

    constructor() {
        this.gotoFirstState();
    }

    /**
     *  ViewMode State Control
     */
    @action.bound gotoFirstState() {
        this.__initStateSequence();
        this.viewMode = this.__nextState();
    }

    @action.bound progressState() {
        this.viewMode = this.__nextState();
    }

    __initStateSequence() {
        this.statesSequence = StateSequence.values();
    }

    __nextState() {
        const nextState = this.statesSequence.next();

        if (nextState.done) {
            this.__initStateSequence();
            return this.statesSequence.next().value;
        }

        return nextState.value;
    }

    /**
     *  Observable actions
     */
    @action.bound setViewMode(viewMode) {
        this.isSearchEnabled = false;

        if (viewMode === this.viewMode) { return; }
        this.viewMode = viewMode;

        let state = '';
        do {
            state = this.__nextState();
        } while (state !== viewMode);
    }

    @action.bound toggleFullmode() {
        this.isFullScreen = !this.isFullScreen;
    }

    @action.bound toggleDepthChartMode() {
        this.depthChartMode = !this.depthChartMode;
        this.rightLowerDivision = this.depthChartMode ? 1 : 0;
    }

    @action.bound showDepthChartMode(mode) {
        this.depthChartMode = mode;
        this.rightLowerDivision = this.depthChartMode ? 1 : 0;
    }

    @action.bound toggleOrderHistoryMode(mode) {
        this.orderHistoryMode = mode;
    }

    @action.bound setTradingViewMode(mode) {
        this.tradingViewMode = mode;
    }

    @action.bound setRightBottomSectionOpenMode(mode) {
        const oldFullScreenMode = this.rightBottomSectionFullScreenMode;
        if (this.rightBottomSectionOpenMode === mode) {
            if (mode !== MODE_KEYS.depthChartKey) {
                this.rightBottomSectionFullScreenMode = false;
                if (oldFullScreenMode) {
                    setTimeout(() => {
                        this.rightBottomSectionOpenMode = MODE_KEYS.depthChartKey;
                    }, 500);
                } else {
                    this.rightBottomSectionOpenMode = MODE_KEYS.depthChartKey;
                }
            }
        } else {
            this.rightBottomSectionFullScreenMode = mode !== MODE_KEYS.depthChartKey;
            if (oldFullScreenMode && !this.rightBottomSectionFullScreenMode) {
                setTimeout(() => {
                    this.rightBottomSectionOpenMode = mode;
                }, 500);
            } else {
                this.rightBottomSectionOpenMode = mode;
            }
        }
    }

    @action.bound setRightBottomSectionFullScreenMode(mode) {
        this.rightBottomSectionFullScreenMode = mode;
    }

    @action.bound toggleSearchEnabled(isSearchEnabled) {
        this.isSearchEnabled = (typeof isSearchEnabled === 'boolean') ? isSearchEnabled : !this.isSearchEnabled;
    }

    @action.bound setGBExistMonitor(mode) {
        this.isGBExistMonitor = mode;
    }

    @action.bound openDepositView(coin) {
        this.depositActiveCoin = coin;
    }

    @action.bound setUserDropDownOpen(mode) {
        this.isUserDropDownOpen = mode;
    }

    @action.bound setSettingsOpen(mode) {
        this.isSettingsOpen = mode;
    }

    @action.bound setAppStoreDropDownOpen(mode) {
        this.isAppStoreDropDownOpen = mode;
    }

    @action.bound openSettingsView(mode) {
        this.isUserDropDownOpen = false;
        this.isSettingsOpen = true;
        this.settingsViewMode = mode;
        this.setViewMode(viewModeKeys.settingsModeKey);
    }

    @action.bound setGraphSwitchMode(mode) {
        if (this.masterSwitchMode === false) {
            this.graphSwitchMode = mode;
        }
    }

    @action.bound setMasterSwitchMode(mode) {
        this.masterSwitchMode = mode;
        this.graphSwitchMode = mode;
    }

    @action.bound setIsFirstLoad(mode) {
        this.isFirstLoad = mode;
    }

    @action.bound setAdvancedAPIMode(mode) {
        this.isAdvancedAPIMode = mode;
        this.rightLowerDivision = this.isAdvancedAPIMode ? 1 : 0;
    }

    @action.bound setSettingsExchangeViewMode(mode) {
        this.isSettingsExchangeViewMode = mode;
    }

    @action.bound toggleExchangeViewMode() {
        this.isExchangeViewMode = !this.isExchangeViewMode;
    }

    @action.bound setIsPayApp(mode) {
        this.isPayApp = mode;
        this.isPayAppLoading = false;
    }

    @action.bound setPageIndexOfSmart(idx) {
        this.pageIndexOfSmart = idx;
    }

    @action.bound setIsLoaded() {
        this.isLoaded = true;
    }

    @action.bound setRightLowerDivision(division) {
        this.rightLowerDivision = division;
    }

    @action.bound setArbMode(mode) {
        this.arbMode = mode;
        console.log('arbMode: ', this.arbMode);
    }

    @action.bound setArbDetailMode(mode) {
        this.isArbDetailMode = mode;
    }

    @action.bound setAppStoreMode(mode) {
        this.appStoreMode = mode;
    }

    @action.bound setAppStoreControlsOpen(status) {
        this.isAppStoreControlsOpen = status;
    }
}

export default () => {
    const store = new ViewModeStore();
    return store;
};
