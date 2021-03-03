import React, { PureComponent } from 'react';
import styled from 'styled-components/macro';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { STORE_KEYS } from '../stores';
import { viewModeKeys } from '../stores/ViewModeStore';
import { STATE_KEYS } from '../stores/ConvertStore';
import OrderBookRecentTradesContainer from '../components/OrderBookRecentTradesContainer';
import PayApp from '../components/CryptoApp';
import ForexApp from '../components/ForexApp';
import SettingsPanel from '../components/SettingsPanel';
import ExchangeCellsV2 from '../components/GraphTool/ExchangeCellsV2';
import CoinPairSearchV2 from '../components/CoinPairSearchV2';

const StyledLeftTopSectionGrid = styled.div`
    position: relative;
    ${props =>
        props.isMobilePortrait || props.isSmallWidth ? 'width: calc(100% - 8px);' : 'max-width: 33%; width: 33%;'}
    margin-left: ${props => ((props.isTrading || !props.isSidebar) && !props.isMobilePortrait ? '-33%' : '12px')};
    transition: margin .1s linear;
    border: ${props => (props.isForex && !props.isSidebarMenuOpen) && `1px solid ${props.theme.palette.clrMouseClick}`};

    & > div:first-child {
        transition: none !important;
        margin-left: 0 !important;
        width: 100% !important;
    }
`;

class LeftTopSectionGrid extends PureComponent {
    getComponentToRender = () => {
        const {
            viewMode,
            isSettingsOpen,
            isPayApp,
            isEmptyExchange,
            isOrderBookBreakDownStop,
            isOrderBookDataLoaded,
            isMobileDevice
        } = this.props;

        if (isSettingsOpen) {
            return SettingsPanel;
        }

        switch (viewMode) {
            case viewModeKeys.basicModeKey:
                if (isMobileDevice && isPayApp) {
                    return PayApp;
                }
                return OrderBookRecentTradesContainer;
            case viewModeKeys.advancedModeKey:
                if (!isOrderBookBreakDownStop && isOrderBookDataLoaded && !isEmptyExchange) {
                    return OrderBookRecentTradesContainer;
                }
                return ExchangeCellsV2;
            case viewModeKeys.settingsModeKey:
                return SettingsPanel;
            case viewModeKeys.exchangesModeKey:
                return ExchangeCellsV2;
            case viewModeKeys.forexModeKey:
                return ForexApp;
            default:
                return PayApp;
        }
    };
    render() {
        const {
            viewMode,
            isPayAppLoading,
            isUserDropDownOpen,
            isArbitrageMode,
            tradeColStatus,
            sidebarStatus,
            convertState,
            isCoinTransfer,
            isMobileDevice,
            isMobilePortrait,
            isSmallWidth
        } = this.props;

        const isArbitrageMonitorMode = isArbitrageMode && convertState !== STATE_KEYS.coinSearch;

        const ComponentToRender = this.getComponentToRender();

        const isSidebarMenuOpen = (isUserDropDownOpen || (isArbitrageMonitorMode && tradeColStatus === 'open')) &&
            sidebarStatus === 'open';

        return (
            <StyledLeftTopSectionGrid
                id="left-sidebar"
                isMobilePortrait={isMobilePortrait}
                isSmallWidth={isSmallWidth}
                isForex={viewMode === viewModeKeys.forexModeKey}
                isTrading={isArbitrageMonitorMode && tradeColStatus === 'closed'}
                isSidebar={sidebarStatus === 'open'}
                isSidebarMenuOpen={isSidebarMenuOpen}
            >
                <ComponentToRender
                    isLeftTop
                    isMobileDevice={isMobileDevice}
                    isCoinTransfer={isCoinTransfer}
                    trId={isCoinTransfer ? this.props.trId : null}
                    firstLoad={isPayAppLoading}
                    isUserDropDownOpen={isUserDropDownOpen}
                    isArbitrageMonitorMode={isArbitrageMonitorMode}
                    isSidebarMenuOpen={isSidebarMenuOpen}
                />
                {/* // TODO refactoring: This component is always hidden! Need to review the logic */}
                {isMobileDevice && !isArbitrageMonitorMode && <CoinPairSearchV2 isSimple isHidden />}
            </StyledLeftTopSectionGrid>
        );
    }
}

const withStore = compose(
    inject(
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.LOWESTEXCHANGESTORE,
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.EXCHANGESSTORE,
        STORE_KEYS.ORDERBOOKBREAKDOWN,
        STORE_KEYS.CONVERTSTORE,
        STORE_KEYS.MARKETMAKER
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.VIEWMODESTORE]: {
                viewMode,
                isSettingsOpen,
                isPayApp,
                isPayAppLoading,
                isUserDropDownOpen
            },
            [STORE_KEYS.SETTINGSSTORE]: { isArbitrageMode, tradeColStatus, sidebarStatus },
            [STORE_KEYS.EXCHANGESSTORE]: { isEmptyExchange },
            [STORE_KEYS.ORDERBOOKBREAKDOWN]: { isOrderBookBreakDownStop, isOrderBookDataLoaded },
            [STORE_KEYS.CONVERTSTORE]: { convertState }
        }) => ({
            viewMode,
            isSettingsOpen,
            isPayApp,
            isPayAppLoading,
            isArbitrageMode,
            tradeColStatus,
            sidebarStatus,
            isEmptyExchange,
            isOrderBookBreakDownStop,
            isOrderBookDataLoaded,
            convertState,
            isUserDropDownOpen
        })
    )
);

export default withStore(LeftTopSectionGrid);
