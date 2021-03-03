import React, { Fragment } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import sortBy from 'lodash/sortBy';
import { compose } from 'recompose';
import uuidv4 from 'uuid/v4';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withSafeTimeout } from '@hocs/safe-timers';
import { Tooltip } from 'react-tippy';
import CoinIcon from './CoinIcon';
import CoinNameSmall from './CoinName/CoinNameSmall';
import {
    ExchDropdownList,
    StyleWrapper,
    ItemButtonWrapper,
    ItemButton,
    CoinItemWrapper,
    CoinSelection,
    ForexInput,
    DataLoaderWrapper
} from './Components';
import DataLoader from '../../../../components-generic/DataLoader';
import COIN_DATA_MAP from '../../../../mock/coin-data-map';
import { formatIntegerString } from '../../../../utils';
import { valueNormalized } from '../../../../stores/utils/OrderEntryUtils';

class ExchDropdown extends React.PureComponent {
    constructor(props) {
        super(props);
        this.inputRef = null;
        this.id = `dropdown-id-${uuidv4()}`;

        this.state = {
            searchInputValue: '',
            tableItems: [],
            scrollTop: 0,
            id: this.id,
            selectedValue: '',
            selectedIndex: -1,
            isEmpty: true,

            isAmtInputFocused: false,
            isAmtChangedAfterFocus: false,
            amount: '',
        };

        this.currentIndex = -1;
        this.scrollHeight = 0;

        this.width = 0;
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        this.updateTableItems();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.updateTableItems();
    }

    componentDidUpdate() {
        if (this.scrollRef) {
            this.scrollRef.scrollTop = this.state.scrollTop;
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        if (this.clearOnChangeSearchInputValueTimeout) {
            this.clearOnChangeSearchInputValueTimeout();
        }
        if (this.clearScrollTopTimeout) {
            this.clearScrollTopTimeout();
        }
        if (this.clearToggleDropdownTimeout) {
            this.clearToggleDropdownTimeout();
        }
    }

    onChangeSearchInputValue = (e) => {
        if (e.target.value === '') {
            this.setState({ isEmpty: true });
        } else {
            this.setState({ isEmpty: false });
        }
        this.setState({
            searchInputValue: e.target.value,
            scrollTop: 0,
        });

        if (this.scrollRef) {
            this.scrollRef.scrollTop = 0;
        }

        if (this.clearOnChangeSearchInputValueTimeout) {
            this.clearOnChangeSearchInputValueTimeout();
        }
        this.clearOnChangeSearchInputValueTimeout = this.props.setSafeTimeout(this.updateTableItems, 0);
        window.dropDownFocusIndex = 0;
        this.currentIndex = -1;
    };

    onSelectItem = (value, rowIndex) => {
        this.toggleDropdown();
        this.props.onChange(value);
        this.setState({ selectedValue: value });
    };

    getRowHeight = ({ index }) => {
        if (this.state.tableItems[index] && this.state.tableItems[index].type && this.state.tableItems[index].type === 'label') {
            return 0;
        }

        return 110;
    };

    handleScroll = ({ scrollTop }) => {
        this.setState({ scrollTop });
    };

    handleClickOutside = (event) => {
        if (this.props.isOpen && this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.toggleDropdown();
            if (this.scrollRef) {
                this.scrollRef.scrollTop = 0;
            }
            this.setState({ scrollTop: 0 });
        }
    };

    scrollTop = (duration = 300) => {
        if (duration > 0) {
            const difference = this.state.scrollTop;
            const perTick = (difference / duration) * 50;

            if (this.clearScrollTopTimeout) {
                this.clearScrollTopTimeout();
            }
            this.clearScrollTopTimeout = this.props.setSafeTimeout(() => {
                const scrollTop = this.state.scrollTop - perTick;
                this.setState({ scrollTop });
                if (this.scrollRef) {
                    this.scrollRef.scrollTop = scrollTop;
                }

                this.scrollTop(duration - 10);
            }, 10);
        }
    };

    toggleDropdown = () => {
        const {
            toggleDroplist,
            isOpen,
        } = this.props;

        toggleDroplist();

        if (!isOpen) {
            if (this.clearToggleDropdownTimeout) {
                this.clearToggleDropdownTimeout();
            }
            this.clearToggleDropdownTimeout = this.props.setSafeTimeout(() => {
                this.updateTableItems();
                if (this.inputRef) {
                    this.inputRef.focus();
                }
            }, 300);
        } else {
            this.setState({
                searchInputValue: '',
                selectedIndex: -1,
            });
        }

        this.forceUpdate();
        window.dropDownFocusIndex = 0;
    };

    updateTableItems = () => {
        let tableItems = [];

        let searchedCurrencyItems = [];
        let searchedCurrencyItemsWeights = [];

        if (COIN_DATA_MAP) {
            const keys = Object.keys(COIN_DATA_MAP);
            for (let i = 0; i < keys.length; i++) {
                const coinRaw = COIN_DATA_MAP[keys[i]];
                const coin = { ...coinRaw, symbol: coinRaw.symbol };
                if (coin.fiat) {
                    const weight = this.isSearched(coin, this.state.searchInputValue);
                    if (weight >= 0) {
                        searchedCurrencyItemsWeights.push({
                            weight,
                            item: coin,
                        });
                    }
                }
            }

            if (searchedCurrencyItemsWeights.length) {
                searchedCurrencyItemsWeights = sortBy(searchedCurrencyItemsWeights, item => item.weight);
                searchedCurrencyItems = searchedCurrencyItemsWeights.map(val => val.item);
                tableItems = tableItems.concat(searchedCurrencyItems);
            }
        }
        const { selectedValue } = this.state;
        tableItems.sort((x, y) => x.symbol === selectedValue ? -1 : y === selectedValue ? 1 : 0);

        this.setState({
            tableItems,
        });

        if (this.tableRef) {
            this.tableRef.recomputeRowHeights();
        }
    };

    isSearched = (item, query) => {
        const lowerCaseQuery = query.toLowerCase();
        let symbolSrcStr;
        let nameSrcStr;

        try {
            symbolSrcStr = ((item.symbol && item.symbol.length) ? item.symbol : '').replace('F:', '').toLowerCase();
            nameSrcStr = ((item.name && item.name.length) ? item.name : '').toLowerCase();
        } catch (e) {
            return -1;
        }

        if (!query) {
            return 999;
        }

        const symbolContains = symbolSrcStr.includes(lowerCaseQuery);
        const nameContains = nameSrcStr.includes(lowerCaseQuery);

        const symbolWeight = Math.abs(lowerCaseQuery.length - symbolSrcStr.length);
        const nameWeight = Math.abs(lowerCaseQuery.length - nameSrcStr.length);

        let weight = -1;

        if (symbolContains) {
            weight = symbolWeight;
        }

        if (nameContains) {
            weight = (weight < nameWeight && weight !== -1) ? weight : nameWeight;
        }

        return weight;
    };

    cellRenderer = ({ rowIndex }) => {
        let itemValue = '';
        const data = this.state.tableItems[rowIndex];
        const {
            defaultFiat,
            isMobile,
        } = this.props;

        if (!data) {
            return;
        }

        if (data.type && data.type === 'label') {
            return <div className="exch-dropdown__list-title" key={rowIndex} />;
        }

        if (!this.state.selectedValue || this.state.selectedValue === '') {
            itemValue = this.props.value;
        } else {
            itemValue = this.state.selectedValue;
        }

        const className = 'exch-dropdown__item' + (data.symbol === itemValue ? ' current' : '') + (!data.enabled ? ' disabled' : '');

        if (data.symbol === itemValue) {
            this.currentIndex = rowIndex;
        }

        return (
            <ItemButtonWrapper>
                <ItemButton
                    className={className}
                    key={rowIndex}
                    onClick={() => this.onSelectItem(data.symbol, rowIndex)}
                    id={`dropdown-btn-${data.symbol}`}
                >
                    <CoinIcon value={data} defaultFiat={defaultFiat} />
                    <CoinNameSmall value={data} search={this.state.searchInputValue} defaultFiat={defaultFiat} isMobile={isMobile} />
                </ItemButton>
            </ItemButtonWrapper>
        );
    };

    handleAmtInputFocus = () => {
        this.setState({
            amount: '',
            isAmtInputFocused: true,
            isAmtChangedAfterFocus: false,
        });
    };

    handleAmtInputBlur = () => {
        this.setState({
            isAmtInputFocused: false,
        });
    };

    handleAmountChange = (event) => {
        const value = event.target.value;

        let oldValue = String(this.state.amount);
        let newValue = valueNormalized(oldValue, value);

        this.props.onChangeAmount(newValue || 0, this.props.isDefaultMode);
        this.setState({
            amount: newValue,
            isAmtChangedAfterFocus: true,
        });
    };

    render() {
        const {
            searchInputValue,
            tableItems,
            scrollTop,
            id,
            isAmtInputFocused,
            isAmtChangedAfterFocus,
            amount : amountFromState,
        } = this.state;

        const {
            value,
            isLeft,
            isCoinPairInversed,
            isOpen,
            defaultFiat,
            toggleDroplist,
            amount,
            isDefaultMode,
        } = this.props;

        const isRateReady = true; // this.checkRateReady();

        return (
            <div
                className={`exch-dropdown${isOpen ? ' open' : ''}`}
                id={id}
                ref={(node) => {
                    this.wrapperRef = node;
                }}
                tabIndex="0"
            >
                <div
                    className="exch-dropdown__border"
                    onClick={this.props.onClick}
                >
                    <CoinItemWrapper>
                        {isLeft ? (
                            <Fragment>
                                <CoinSelection
                                    isLeft
                                    onClick={isDefaultMode ? this.toggleDropdown : null}
                                >
                                    <Tooltip
                                        arrow={true}
                                        animation="shift"
                                        position="bottom"
                                        theme="bct"
                                        // className="full-width"
                                        html={
                                            <div style={{ maxWidth: '400px' }}>
                                                Step 1)
                                                <br />
                                                Enter the amount of KRW customer wants to convert. Tell customer USDT amount, then collect cash payment.
                                            </div>
                                        }
                                    >
                                        <CoinIcon value={value} defaultFiat={defaultFiat} />
                                    </Tooltip>
                                    <CoinNameSmall value={value} isMobile={false} defaultFiat={defaultFiat} />
                                </CoinSelection>

                                <div className="exch-dropdown__title__wrapper">
                                    <ForexInput
                                        type="text"
                                        value={isAmtInputFocused ? (isAmtChangedAfterFocus ? amountFromState : '') : formatIntegerString(amount)}
                                        onFocus={this.handleAmtInputFocus}
                                        onBlur={this.handleAmtInputBlur}
                                        onChange={this.handleAmountChange}
                                        isCoinPairInversed={isCoinPairInversed}
                                    />
                                </div>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <div className="exch-dropdown__title__wrapper">
                                    <p className="estimate_price">
                                        <span>
                                            {isRateReady && formatIntegerString(Math.round(amount))}
                                        </span>
                                    </p>
                                    {!isRateReady && (
                                        <DataLoaderWrapper>
                                            <DataLoader width={50} height={50} />
                                        </DataLoaderWrapper>
                                    )}
                                </div>

                                <CoinSelection onClick={!isDefaultMode ? this.toggleDropdown : null}>
                                    <CoinNameSmall value={value} isMobile={false} defaultFiat={defaultFiat} />
                                    <Tooltip
                                        arrow={true}
                                        animation="shift"
                                        position="bottom"
                                        theme="bct"
                                        // className="full-width"
                                        html={
                                            <div style={{ maxWidth: '400px' }}>
                                                Step 2)
                                                <br />
                                                Show customer your QR Code.
                                                <br />
                                                (So they can scan it and get USDT)
                                            </div>
                                        }
                                    >
                                        <CoinIcon value={value} defaultFiat={defaultFiat} />
                                    </Tooltip>
                                </CoinSelection>
                            </Fragment>
                        )}
                    </CoinItemWrapper>

                    <div className={`exch-search${isOpen ? '' : ' hidden'}`}>
                        <svg className="exch-search__icon" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 100 100" x="0px" y="0px">
                            <path d="M38,76.45A38.22,38.22,0,1,1,76,38.22,38.15,38.15,0,0,1,38,76.45Zm0-66.3A28.08,28.08,0,1,0,65.84,38.22,28,28,0,0,0,38,10.15Z" />
                            <rect x="73.84" y="54.26" width="10.15" height="49.42" transform="translate(-32.73 79.16) rotate(-45.12)" />
                        </svg>
                        <input
                            className="exch-search__input"
                            type="text"
                            value={searchInputValue}
                            onChange={this.onChangeSearchInputValue}
                            onClick={toggleDroplist}
                            ref={el => {
                                this.inputRef = el;
                            }}
                        />
                    </div>
                </div>

                {(isDefaultMode === isLeft) && (
                    <ExchDropdownList itemCount={tableItems.length} className="exch-dropdown__list">
                        <div
                            className={`scroll__scrollup${scrollTop > 1 ? '' : ' hide'}`}
                            onClick={() => this.scrollTop(300)}
                        >
                            <button className="scroll-up-button">
                                <svg className="sprite-icon" role="img" aria-hidden="true">
                                    <use
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        xlinkHref="img/sprite-basic.svg#arrow-up"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="exch-dropdown__list__rvtable-wrapper">
                            <AutoSizer>
                                {({ width, height }) => {
                                    this.scrollHeight = height;
                                    this.width = width;
                                    return (
                                        <StyleWrapper width={width} height={height}>
                                            <PerfectScrollbar
                                                containerRef={ref => {
                                                    this.scrollRef = ref;
                                                }}
                                                options={{
                                                    suppressScrollX: true,
                                                    minScrollbarLength: 50,
                                                }}
                                                onScrollY={this.handleScroll}
                                            >
                                                <Table
                                                    ref={el => {
                                                        this.tableRef = el;
                                                    }}
                                                    autoHeight={true}
                                                    width={width}
                                                    height={height}
                                                    headerHeight={0}
                                                    disableHeader={true}
                                                    rowCount={tableItems.length} // should get length
                                                    rowGetter={({ index }) => tableItems[index]}
                                                    rowHeight={this.getRowHeight}
                                                    overscanRowCount={0}
                                                    id="wallet-table"
                                                    scrollTop={scrollTop}
                                                >
                                                    <Column
                                                        dataKey="name"
                                                        width={width}
                                                        cellRenderer={this.cellRenderer}
                                                    />
                                                </Table>
                                            </PerfectScrollbar>
                                        </StyleWrapper>
                                    );
                                }}
                            </AutoSizer>
                        </div>
                    </ExchDropdownList>
                )}
            </div>
        );
    }
}

const enhanced = compose(
    withSafeTimeout
);
export default enhanced(ExchDropdown);