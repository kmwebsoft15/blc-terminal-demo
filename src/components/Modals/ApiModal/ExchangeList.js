import React, { Component } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import {
    Check, Item, LabelAPI, List, Logo, LogoWrapper, Name, StyleWrapper
} from './Components';
import { marginExchanges } from '../../SideBar/ExchangePop/margin-de-exchanges';
import { mockData } from '../../SideBar/ExchangePop/mock';
import { STORE_KEYS } from '../../../stores';

class ExchangeList extends Component {
    state = {
        scrollTop: 0,
    };

    nameCellRenderer = ({ rowData }) => {
        let isActive = true;

        if (this.props.exchanges && this.props.exchanges[rowData.name]) {
            const exchangeValue = this.props.exchanges[rowData.name];
            isActive = exchangeValue && (typeof exchangeValue.active === 'undefined' ? true : exchangeValue.active);
        }

        return (
            <Item>
                <LogoWrapper>
                    <Logo src={`/img/exchange/${rowData.icon}`} alt=""/>
                </LogoWrapper>

                <Name
                    href={rowData.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    status={isActive ? 'active' : ''}
                >
                    {rowData.name}
                </Name>
            </Item>
        );
    };

    priceCellRenderer = ({ rowData }) => {
        let isActive = true;

        if (this.props.exchanges && this.props.exchanges[rowData.name]) {
            const exchangeValue = this.props.exchanges[rowData.name];
            isActive = exchangeValue && (typeof exchangeValue.active === 'undefined' ? true : exchangeValue.active);
        }

        return (
            <Item>
                {isActive ? (
                    '0.3001 BTC'
                ) : (
                    <Name
                        href={rowData.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        status={isActive ? 'active' : ''}
                    >
                        {rowData.name}
                    </Name>
                )}
            </Item>
        );
    };

    apiCellRenderer = ({ rowData }) => {
        let isApiConnected = false;
        let isActive = true;

        if (this.props.exchanges && this.props.exchanges[rowData.name]) {
            const exchangeValue = this.props.exchanges[rowData.name];
            isApiConnected = exchangeValue && !!exchangeValue.enabled;
            isActive = exchangeValue && (typeof exchangeValue.active === 'undefined' ? true : exchangeValue.active);
        }

        const included = marginExchanges.includes(rowData.name);

        return (
            <Item>
                {isApiConnected ? (
                    <Check
                        checked={isActive}
                        onClick={() => this.props.setExchangeActive(rowData.name, !isActive)}
                    />
                ) : (
                    <LabelAPI
                        included={included}
                        onClick={() => this.props.openApi({ included, exchange: rowData.name })}
                        isVerified={isApiConnected}
                    >
                        API
                    </LabelAPI>
                )}
            </Item>
        );
    };

    handleScroll = ({ scrollTop }) => {
        this.setState({ scrollTop });
    };

    render() {
        const { scrollTop } = this.state;
        let data = mockData;

        return (
            <List>
                <AutoSizer>
                    {({ width, height }) => {
                        return (
                            <StyleWrapper width={width} height={height} length={data.length}>
                                <PerfectScrollbar
                                    options={{
                                        suppressScrollX: true,
                                        minScrollbarLength: 50,
                                    }}
                                    onScrollY={this.handleScroll}
                                >
                                    <Table
                                        autoHeight={true}
                                        width={width}
                                        height={height}
                                        headerHeight={20}
                                        disableHeader={true}
                                        rowCount={data.length}
                                        rowGetter={({ index }) => data[index]}
                                        rowHeight={60}
                                        overscanRowCount={0}
                                        scrollTop={scrollTop}
                                    >
                                        <Column
                                            width={width * 0.35}
                                            dataKey="Name"
                                            cellRenderer={this.nameCellRenderer}
                                        />

                                        <Column
                                            width={width * 0.35}
                                            dataKey="Price"
                                            cellRenderer={this.priceCellRenderer}
                                        />

                                        <Column
                                            width={width * 0.3}
                                            dataKey="Api"
                                            cellRenderer={this.apiCellRenderer}
                                        />
                                    </Table>
                                </PerfectScrollbar>
                            </StyleWrapper>
                        );
                    }}
                </AutoSizer>
            </List>
        );
    }
}

const withStores = compose(
    inject(STORE_KEYS.EXCHANGESSTORE),
    observer,
    withProps(
        ({
            [STORE_KEYS.EXCHANGESSTORE]: {
                exchanges,
                setExchangeActive,
            },
        }) => ({
            exchanges,
            setExchangeActive,
        })
    )
);

export default withStores(ExchangeList);
