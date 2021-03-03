import React, { PureComponent, Fragment } from 'react';

import { withOrderFormToggleData } from '@/hocs/OrderFormToggleData';
import { STORE_KEYS } from '@/stores';
import { getScreenInfo } from '@/utils';
import { ORDER_BOOK_ROWS_COUNT } from '@/config/constants';
import ExchangesLabel from '@/components/OrderTabs/ExchangesLabel';
import DataLoader from '@/components-generic/DataLoader';

import ExchangeCell from '../Cells/ExchangeCell';
import AmountCell from '../Cells/AmountCell';
import PriceCell from '../Cells/PriceCell';
import ProgressCell from '../Cells/ProgressCell';
import ExchangeHeader from '../HeaderCells/ExchangeHeader';
import TotalBaseHeader from '../HeaderCells/TotalBaseHeader';
import TotalQuoteHeader from '../HeaderCells/TotalQuoteHeader';
import PriceHeader from '../HeaderCells/PriceHeader';

import { Table, Row, HeaderRow } from './styles';

let selectedOrderIndex = -1;
const IS_MOBILE_PORTRAIT = getScreenInfo().isMobilePortrait;

class OrderBookTable extends PureComponent {
    state = {
        hoverMeta: { index: -1 }
    };

    onRowClick = (callback, index) => () => {
        if (IS_MOBILE_PORTRAIT) {
            return;
        }

        const { showOrderForm, showDepthChartMode } = this.props;

        if (selectedOrderIndex === index) {
            selectedOrderIndex = -1;
        } else {
            selectedOrderIndex = index;
            showOrderForm();
            showDepthChartMode(true);
        }
        callback({ index });
    };

    onMouseEnter = (type, index) => () => {
        this.setState({
            hoverMeta: {
                type,
                index
            }
        });
    };

    onMouseLeave = () => {
        this.setState({
            hoverMeta: { index: -1 }
        });
    };

    getCellsWidth = () => {
        const { screenWidth, isMobilePortrait, isSmallWidth } = getScreenInfo();
        const rowWidth = isSmallWidth || isMobilePortrait ? screenWidth : screenWidth * 0.33;
        const isWidthOverThreshold = rowWidth > 530;

        return {
            exchangeWidth: isWidthOverThreshold ? 40 : 33,
            amountWidth: isWidthOverThreshold ? 20 : 23,
            amountQuoteWidth: isWidthOverThreshold ? 22 : 24,
            priceWidth: isWidthOverThreshold ? 18 : 20
        };
    };

    getBaseAmountCell = (amount, type, width, hovered) => {
        const { amountIntLength, amountFractionDigits, selectedBase } = this.props;

        return this.getAmountCell(amount, type, width, amountIntLength, amountFractionDigits, selectedBase, hovered);
    };

    getQuoteAmountCell = (amount, type, width, hovered) => {
        const { amountQuoteIntLength, amountQuoteFractionDigits, selectedQuote } = this.props;

        return this.getAmountCell(
            amount,
            type,
            width,
            amountQuoteIntLength,
            amountQuoteFractionDigits,
            selectedQuote,
            hovered,
            true
        );
    };

    getAmountCell = (amount, type, width, intLength, fractionDigits, coin, isHovered, showArrow) => {
        // DON'T ADD ANY LOGIC HERE!
        // Add to the AmountCell component
        return (
            <AmountCell
                type={type}
                intLength={intLength}
                fractionDigits={fractionDigits}
                coin={coin}
                cellWidth={width}
                isHovered={isHovered}
                showArrow={showArrow}
            >
                {amount}
            </AmountCell>
        );
    };

    getPriceCell = (price, type, width, isHovered) => {
        const { priceIntLength, priceFractionDigits } = this.props;

        // DON'T ADD ANY LOGIC HERE!
        // Add to the PriceCell component
        return (
            <PriceCell
                type={type}
                cellWidth={width}
                intLength={priceIntLength}
                fractionDigits={priceFractionDigits}
                isHovered={isHovered}
            >
                {price}
            </PriceCell>
        );
    };

    getProgressCell = (price, isBuy) => {
        const { maxAskPrice, minAskPrice, maxBidPrice, minBidPrice } = this.props;
        const maxPrice = isBuy ? maxBidPrice : maxAskPrice;
        const minPrice = isBuy ? minBidPrice : minAskPrice;
        return <ProgressCell price={price} isBuy={isBuy} maxPrice={maxPrice} minPrice={minPrice} />;
    };

    getRows = (type, items, cellWidth) => {
        const { manualOrderBookHoverItem = {}, selectAsk, selectBid, priceFractionDigits } = this.props;

        const { hoverMeta } = this.state;
        const hoverRowMeta = manualOrderBookHoverItem.type ? manualOrderBookHoverItem : hoverMeta;

        const { exchangeWidth, amountWidth, amountQuoteWidth, priceWidth } = cellWidth;
        const onClickCallback = type === 'buy' ? selectAsk : selectBid;
        const isBuy = type === 'buy';

        return items.map(({ price, amount, amountQuote, exchange, total }, index) => {
            const hovered = hoverRowMeta && hoverRowMeta.index === index && hoverRowMeta.type === type;
            return (
                <Row
                    key={index}
                    onClick={this.onRowClick(onClickCallback, index)}
                    onMouseEnter={this.onMouseEnter(type, index)}
                    onMouseLeave={this.onMouseLeave}
                    priceFractionDigits={priceFractionDigits}
                    index={index}
                    isBuy={isBuy}
                    price={price}
                    exchange={exchange}
                    total={total}
                >
                    <ExchangeCell isBuy={isBuy} exchange={exchange} cellWidth={exchangeWidth} />
                    {this.getBaseAmountCell(amount, type, amountWidth, hovered)}
                    {this.getQuoteAmountCell(amountQuote, type, amountQuoteWidth, hovered)}
                    {this.getPriceCell(price, type, priceWidth, hovered)}
                    {this.getProgressCell(price, isBuy)}
                </Row>
            );
        });
    };

    getHeader = cellWidth => {
        const {
            setSettingsExchangeViewMode,
            selectedBase,
            selectedQuote,
            totalOrderAmount,
            totalOrderSize,
            amountIntLength,
            priceIntLength,
            amountQuoteIntLength,
            amountFractionDigits,
            amountQuoteFractionDigits,
            priceFractionDigits
        } = this.props;

        const { exchangeWidth, amountWidth, amountQuoteWidth, priceWidth } = cellWidth;

        return (
            <HeaderRow>
                <ExchangeHeader
                    text={<ExchangesLabel className="exchanges-label" />}
                    onClick={setSettingsExchangeViewMode}
                    cellWidth={exchangeWidth}
                />
                <TotalBaseHeader
                    coin={selectedBase}
                    amount={totalOrderAmount}
                    intLength={amountIntLength}
                    fractionDigits={amountFractionDigits}
                    cellWidth={amountWidth}
                />
                <TotalQuoteHeader
                    coin={selectedQuote}
                    amount={totalOrderSize}
                    intLength={amountQuoteIntLength}
                    fractionDigits={amountQuoteFractionDigits}
                    cellWidth={amountQuoteWidth}
                />
                <PriceHeader intLength={priceIntLength} fractionDigits={priceFractionDigits} cellWidth={priceWidth} />
            </HeaderRow>
        );
    };

    render() {
        const { asks, bids } = this.props;

        if (!asks.length || !bids.length) {
            return <DataLoader width={100} height={100} />;
        }

        const sells = asks.slice(-ORDER_BOOK_ROWS_COUNT);
        const buys = bids.slice(0, ORDER_BOOK_ROWS_COUNT);
        const cellWidth = this.getCellsWidth();

        return (
            <Table>
                {this.getRows('sell', sells, cellWidth)}
                {this.getHeader(cellWidth)}
                {this.getRows('buy', buys, cellWidth)}
            </Table>
        );
    }
}

export default withOrderFormToggleData(stores => {
    const {
        AsksForOrderBook,
        BidsForOrderBook,
        maxAskPrice,
        minAskPrice,
        manualOrderBookHoverItem,
        maxBidPrice,
        minBidPrice,
        totalOrderAmount,
        totalOrderSize
    } = stores[STORE_KEYS.ORDERBOOKBREAKDOWN];

    const { selectAsk, selectBid } = stores[STORE_KEYS.ORDERENTRY];

    return {
        asks: AsksForOrderBook,
        bids: BidsForOrderBook,
        selectAsk,
        selectBid,
        maxAskPrice,
        minAskPrice,
        maxBidPrice,
        minBidPrice,
        totalOrderAmount,
        totalOrderSize,
        manualOrderBookHoverItem
    };
})(OrderBookTable);
