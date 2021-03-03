import React, { PureComponent, Fragment } from 'react';
import { AutoSizer } from 'react-virtualized';
import styled from 'styled-components/macro';
import { withOrderFormToggleData } from '@/hocs/OrderFormToggleData';
import { orderFormToggleKeys } from '@/stores/MarketMaker';
import LeftLowerSectionGrid from '@/grid/LeftLowerSectionGrid';
import WalletHeader from '@/components/WalletHeader';
import OrderBook from '@/components/OrderBook';
import DataLoader from '@/components-generic/DataLoader';
import { STATE_KEYS } from '@/stores/ConvertStore';
import { getScreenInfo } from '@/utils';

const AdvancedDropdownGrid = styled.div`
    position: relative;
    height: 100%;
    display: grid;
    grid-template-areas:
        ${props =>
            props.isUserDropDownOpen || props.isArbitrageMonitorMode || !props.isLoggedIn ? "'walletheader'" : ''}
        'ordercontent'
        ${props => (!props.open ? "'leftlowersection'" : '')};
    grid-template-rows: ${props =>
            props.isUserDropDownOpen || props.isArbitrageMonitorMode || !props.isLoggedIn ? '60px' : ''} auto ${props =>
            !props.open ? props.lowerSectionHeight : ''};
    grid-template-columns: 100%;
    grid-gap: 12px;
`;

const OrderBookWrapper = styled.div.attrs({ className: 'order-book-wrapper' })`
    position: relative;
    grid-area: ordercontent;
    background: ${props => props.theme.palette.clrChartBackground};
    border: 1px solid ${props => props.theme.palette.orderBookHeaderBorder};
    border-radius: ${props => `${props.theme.palette.borderRadius}`};
    overflow: hidden;

    .wallet-header {
        border-top: 0 !important;
        border-left: 0 !important;
        border-right: 0 !important;
    }
`;

const ScanContainer = styled.div.attrs({ className: 'scan-container' })`
    position: absolute;
    z-index: 1000;
    left: calc(50% - 20px);
    width: 40px;
    bottom: -10px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .on {
        background-color: #fff8;
    }
    .off {
        background-color: #fff4;
    }
`;

const ScanIcon = styled.div.attrs({ className: 'scan-icon' })`
    width: 10px;
    height: 10px;
    border-radius: 50%;
`;

const IS_MOBILE = getScreenInfo().isMobileDevice;

class OrderBookRecentTradesContainer extends PureComponent {
    render() {
        const { toggleMode, selectedBase, selectedQuote, isMobileDevice, isUserDropDownOpen, isLoggedIn } = this.props;
        const open = toggleMode === orderFormToggleKeys.offToggleKey;

        const { isArbitrageMode, tradeColStatus, convertState } = this.props;
        const isArbitrageMonitorMode = isArbitrageMode && convertState !== STATE_KEYS.coinSearch;
        const showOrderForm = !isArbitrageMonitorMode && !open;

        return (
            <AdvancedDropdownGrid
                open={open}
                isMobileDevice={isMobileDevice}
                lowerSectionHeight={IS_MOBILE ? '33%' : '263px'}
                isUserDropDownOpen={isUserDropDownOpen}
                isLoggedIn={isLoggedIn}
            >
                <WalletHeader isOrderbook isSeparate />

                {(!isArbitrageMonitorMode || (isArbitrageMonitorMode && tradeColStatus === 'open')) && (
                    <OrderBookWrapper open={open} isMobileDevice={isMobileDevice}>
                        {selectedBase && selectedQuote ? <OrderBook /> : <DataLoader width={100} height={100} />}
                    </OrderBookWrapper>
                )}

                {showOrderForm && !isUserDropDownOpen && <LeftLowerSectionGrid />}

                {isMobileDevice && (
                    <ScanContainer>
                        {convertState === STATE_KEYS.coinSearch && (
                            <Fragment>
                                <ScanIcon className="off" />
                                <ScanIcon className="on" />
                                <ScanIcon className="off" />
                            </Fragment>
                        )}
                    </ScanContainer>
                )}
            </AdvancedDropdownGrid>
        );
    }
}

export default withOrderFormToggleData()(OrderBookRecentTradesContainer);
