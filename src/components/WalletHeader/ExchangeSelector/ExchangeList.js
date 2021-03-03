import React, { Fragment } from "react";
import { Table, Column } from "react-virtualized";
import sortBy from "lodash/sortBy";
import isEqual from "lodash/isEqual";
import { Tooltip } from "react-tippy";
import { inject, observer } from "mobx-react";

import { STORE_KEYS } from "@/stores";
import { highlightSearchDom } from "@/utils";
import { Logo, LogoWrapper } from "../Components";
import { ListItem } from "@/components-generic/SelectDropdown/Components";
import { GlobalIcon } from "@/components/OrderTabs/Components"
import {
    Checkbox,
    InfoIcon,
    ApiIcon,
    TransactionIcon,
    TradingIcon,
    BalanceIcon
} from "../icons";
import ApiKey from "./ApiKey";
import { animateButton } from "@/utils/CustomControls";

class ExchangeList extends React.Component {
    state = {
        tableItems: [],
        hoveredIndex: -1,
        selectedExchange: null,
        selectedMenu: null
    };

    componentDidMount() {
        this.updateTableItems(this.props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (
            this.props.searchValue !== nextProps.searchValue ||
            !isEqual(this.props.items, nextProps.items)
        ) {
            this.updateTableItems(nextProps);
        }
    }

    isSearched = (item, query) => {
        if (!query) {
            return 999;
        }

        const lowerCaseQuery = query.toString().toLowerCase();
        let srcStr = item.name
            ? item.name === "Global"
                ? "all"
                : item.name.toString().toLowerCase()
            : "";

        const srcContains = srcStr.includes(lowerCaseQuery);
        const srcWeight = Math.abs(lowerCaseQuery.length - srcStr.length);

        return srcContains ? srcWeight : -1;
    };

    updateTableItems = propsInput => {
        let props = propsInput || this.props;

        let tableItems = [];

        if (props && props.items && props.items.length) {
            const items = props.items;
            for (let i = 0; i < items.length; i++) {
                const weight = this.isSearched(items[i], props.searchValue);

                if (weight >= 0) {
                    tableItems.push({
                        weight,
                        value: items[i]
                    });
                }
            }

            tableItems = sortBy(tableItems, item => item.weight).map(
                item => item.value
            );
        }

        this.setState({
            tableItems
        });

        this.props.setContentHeight(
            tableItems.length * props.rowHeight + props.headerHeight
        );
    };

    handleSelectItem = (rowData, status) => e => {
        if (rowData.name === "Global") {
            this.props.setExchangeActive("Global", status);
            this.props.toggleDropDown();
        } else if (rowData.status === "active") {
            this.props.selectExchangeActive(rowData.name, status);
        }
    };

    changeMenu = menu => e => {};

    handleItemMouseEnter = rowIndex => e => {
        this.setState({
            hoveredIndex: rowIndex
        });
    };

    handleExchangeIconClicked = (rowData, menu) => e => {
        e.stopPropagation();
        this.setState({
            selectedExchange: rowData,
            selectedMenu: menu
        });
        const { setRightBottomSectionOpenMode } = this.props[
            STORE_KEYS.VIEWMODESTORE
        ];
        if (menu === "transaction") {
            setRightBottomSectionOpenMode("reports");
        } else if (menu === "trading") {
            setRightBottomSectionOpenMode("accounts");
        } else {
            this.props.changeMenu(menu);
        }
        animateButton(menu);
    };

    handleApiKeyClose = () => {
        this.setState({
            selectedExchange: null,
            selectedMenu: null
        });
    }

    itemCellRenderer = ({ rowData, rowIndex }) => {
        const { value, searchValue, exchanges, setExchangeActive } = this.props;
        const { hoveredIndex, selectedExchange, selectedMenu } = this.state;
        let isActive = false;
        let isApiSynced = false;
        if (exchanges && exchanges[rowData.name]) {
            const exchangeValue = exchanges[rowData.name];
            isActive = exchangeValue && exchangeValue.active;
            isApiSynced = exchangeValue && exchangeValue.apiSynced;
        }

        const isGlobal = rowData.name === "Global";
        const name = rowData.name === "Global" ? "All" : rowData.name;
        const isHovered = rowIndex === hoveredIndex;
        const activeExchange = isGlobal || rowData.status === "active";
        return (
            <ListItem
                className={`exchange-item${activeExchange ? "" : " disabled"}`}
                onClick={this.handleSelectItem(rowData, !isActive)}
            >
                {isGlobal ? (
                    <GlobalIcon size={38} marginRight={12} color="#fff" />
                ) : (
                    <LogoWrapper size={38}>
                        <Logo src={`/img/exchange/${rowData.icon}`} alt="" />
                    </LogoWrapper>
                )}

                {highlightSearchDom(name, searchValue)}

                {!isHovered && (
                    <InfoIcon
                        marginLeft={15}
                        onMouseEnter={this.handleItemMouseEnter(rowIndex)}
                    />
                )}

                {isHovered && (
                    <div className="exchange-action">
                        {!isGlobal && (
                            <ApiIcon
                                marginLeft={5.5}
                                active={selectedMenu === "api"}
                                isApiSynced={isApiSynced}
                                onClick={this.handleExchangeIconClicked(
                                    rowData,
                                    "api"
                                )}
                            />
                        )}

                        <Tooltip
                            arrow
                            animation="shift"
                            position="bottom"
                            // followCursor
                            theme="bct"
                            title="Reports"
                            distance={30}
                            style={{ marginLeft: 15 }}
                        >
                            <TransactionIcon
                                // marginLeft={15}
                                active={selectedMenu === "transaction"}
                                onClick={this.handleExchangeIconClicked(
                                    rowData,
                                    "transaction"
                                )}
                            />
                        </Tooltip>

                        <Tooltip
                            arrow
                            animation="shift"
                            position="bottom"
                            // followCursor
                            theme="bct"
                            title="Accounts"
                            distance={30}
                            style={{ marginLeft: 15 }}
                        >
                            <TradingIcon
                                // marginLeft={15}
                                active={selectedMenu === "trading"}
                                onClick={this.handleExchangeIconClicked(
                                    rowData,
                                    "trading"
                                )}
                            />
                        </Tooltip>
                        {!isGlobal && (
                            <Tooltip
                                arrow
                                animation="shift"
                                position="bottom"
                                // followCursor
                                theme="bct"
                                title="Your Access is Restricted to Level 1"
                                distance={30}
                                style={{ marginLeft: 15 }}
                            >
                                <BalanceIcon
                                    active={selectedMenu === "balance"}
                                    onClick={e => {
                                        this.handleSelectItem(
                                            rowData,
                                            !isActive
                                        );
                                        animateButton("balance");
                                    }}
                                />
                            </Tooltip>
                        )}
                    </div>
                )}

                {activeExchange && setExchangeActive && (
                    <div
                        className="api-link"
                        onClick={e => {
                            e.stopPropagation();
                        }}
                    >
                        <Checkbox
                            size={38}
                            active={isActive}
                            name={rowData.name}
                            onClick={() => {
                                this.props.setExchangeActive(
                                    rowData.name,
                                    !isActive
                                );
                                animateButton(rowData.name);
                            }}
                        />
                    </div>
                )}

                {selectedMenu === "api" &&
                    selectedExchange.name === rowData.name && (
                        <ApiKey
                            selectedExchange={selectedExchange}
                            onClick={e => {
                                e.stopPropagation();
                                animateButton("api");
                            }}
                            onCloseHandler={this.handleApiKeyClose}
                        />
                    )}
            </ListItem>
        );
    };

    render() {
        const { tableItems } = this.state;
        const {
            scrollTop,
            width,
            height,
            rowHeight,
            headerHeight
        } = this.props;
        return (
            <Table
                autoHeight
                width={width}
                height={height}
                headerHeight={headerHeight}
                disableHeader
                rowCount={tableItems.length}
                rowGetter={({ index }) => tableItems[index]}
                rowHeight={rowHeight}
                overscanRowCount={0}
                scrollTop={scrollTop}
            >
                <Column
                    width={width}
                    dataKey="Dropdown"
                    cellRenderer={this.itemCellRenderer}
                />
            </Table>
        );
    }
}

export default inject(STORE_KEYS.VIEWMODESTORE)(observer(ExchangeList));
