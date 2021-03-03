import React, { PureComponent, Fragment } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { Swipeable } from 'react-swipeable';

import ExchangeListComponent from '../SideHeader/ExchangeListComponent';
import { STORE_KEYS } from '@/stores';
import DataLoader from '@/components-generic/DataLoader';
import { getScreenInfo } from '@/utils';

import OrderBookTable from './OrderBookTable';

const IS_MOBILE = getScreenInfo().isMobileDevice;
const Wrapper = IS_MOBILE ? Swipeable : Fragment;

const defaultCellMaxNumberOfDigits = 9;
const defaultPriceMaxNumberOfDigits = 7;

class OrderBook extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }

    componentDidMount() {
        if (IS_MOBILE) {
            this.props.createSubscription();
        }
    }

    componentWillUnmount() {
        if (IS_MOBILE) {
            this.props.removeSubscription();
        }
    }

    swipeHandler = event => {
        const { setPageIndexOfSmart, setIsPayApp, setArbMode } = this.props;

        if (event.dir === 'Left') {
            setPageIndexOfSmart(1);
            setIsPayApp(true);
        } else if (event.dir === 'Right') {
            this.setState({
                isLoading: true
            });
            setPageIndexOfSmart(-1);
            setIsPayApp(false);
            setArbMode(true);
        }
    };

    setSettingsExchangeViewMode = event => {
        const {
            isLoggedIn,
            isUserDropDownOpen,
            setUserDropDownOpen,
            setSettingsExchangeViewMode,
            setAppStoreDropDownOpen
        } = this.props;

        if (isLoggedIn) {
            setUserDropDownOpen(!isUserDropDownOpen);
            setSettingsExchangeViewMode(true);
            setAppStoreDropDownOpen(false);
        }
    };

    render() {
        const {
            selectExchangeActive,
            setExchangeActive,
            toggleExchangeViewMode,
            isExchangeViewMode,
            exchangeSearchValue,
            maxAskPrice,
            maxBidPrice,
            maxOrderSize,
            totalOrderSize
        } = this.props;

        const { isLoading } = this.state;

        if (isLoading) {
            return <DataLoader width={100} height={100} />;
        }

        const wrapperProps = IS_MOBILE ? { onSwiped: this.swipeHandler, style: { height: '100%' } } : {};

        if (isExchangeViewMode) {
            return (
                <Wrapper {...wrapperProps}>
                    <ExchangeListComponent
                        isFromOrderBook
                        searchValue={exchangeSearchValue}
                        selectExchangeActive={selectExchangeActive}
                        setExchangeActive={setExchangeActive}
                        toggleExchangeViewMode={toggleExchangeViewMode}
                    />
                </Wrapper>
            );
        }

        const priceLimit = Math.max(maxBidPrice, maxAskPrice);
        const amountIntLength = `${parseInt(maxOrderSize, 10)}`.length;
        const amountFractionDigits = Math.max(defaultCellMaxNumberOfDigits - amountIntLength, 0);
        const amountQuoteIntLength = `${parseInt(totalOrderSize, 10)}`.length;
        const amountQuoteFractionDigits = Math.max(defaultCellMaxNumberOfDigits - amountQuoteIntLength, 0);
        const priceIntLength = `${parseInt(priceLimit, 10)}`.length;
        const priceFractionDigits =
            priceIntLength > 3 ? 2 : Math.max(defaultPriceMaxNumberOfDigits - priceIntLength, 0);

        const props = {
            amountIntLength: amountIntLength,
            amountFractionDigits: amountFractionDigits,
            amountQuoteIntLength: amountQuoteIntLength,
            amountQuoteFractionDigits: amountQuoteFractionDigits,
            priceIntLength: priceIntLength,
            priceFractionDigits: priceFractionDigits,
            setSettingsExchangeViewMode: this.setSettingsExchangeViewMode
        };

        return (
            <Wrapper {...wrapperProps}>
                <OrderBookTable {...props} />
            </Wrapper>
        );
    }
}

const withOrderInstruments = compose(
    inject(
        STORE_KEYS.ORDERBOOKBREAKDOWN,
        STORE_KEYS.ORDERENTRY,
        STORE_KEYS.EXCHANGESSTORE,
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.CONVERTSTORE,
        STORE_KEYS.TELEGRAMSTORE
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.ORDERBOOKBREAKDOWN]: {
                createSubscription,
                removeSubscription,
                maxAskPrice,
                maxBidPrice,
                maxOrderSize,
                totalOrderSize
            },
            [STORE_KEYS.EXCHANGESSTORE]: { setExchangeActive, selectExchangeActive, exchangeSearchValue },
            [STORE_KEYS.VIEWMODESTORE]: {
                isExchangeViewMode,
                toggleExchangeViewMode,
                setSettingsExchangeViewMode,
                setAppStoreDropDownOpen,
                setPageIndexOfSmart,
                setIsPayApp,
                isUserDropDownOpen,
                setUserDropDownOpen,
                setArbMode
            },
            [STORE_KEYS.TELEGRAMSTORE]: { isLoggedIn }
        }) => ({
            setExchangeActive,
            selectExchangeActive,
            createSubscription,
            removeSubscription,
            isExchangeViewMode,
            toggleExchangeViewMode,
            setSettingsExchangeViewMode,
            setAppStoreDropDownOpen,
            setPageIndexOfSmart,
            setIsPayApp,
            exchangeSearchValue,
            isUserDropDownOpen,
            setUserDropDownOpen,
            isLoggedIn,
            maxAskPrice,
            maxBidPrice,
            maxOrderSize,
            totalOrderSize,
            setArbMode
        })
    )
);

export default withOrderInstruments(OrderBook);
