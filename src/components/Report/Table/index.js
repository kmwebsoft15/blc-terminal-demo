import React, { Component } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Tooltip } from 'react-tippy';

import {
    List,
    StyleWrapper,
    HeaderWrapper,
    ImgCancel,
    Item
} from './Components';

const headerRenderer = (coin) => () => {
    return (
        <HeaderWrapper>
            {coin}
        </HeaderWrapper>
    );
};

const headerCancelRenderer = () => () => {
    return (
        <ImgCancel/>
    );
};

class ReportTable extends React.Component {
    timeCellRenderer = ({ rowData }) => {
        return (
            <Item>
                { rowData.time }
            </Item>
        );
    };

    orderIdCellRenderer = ({ rowData }) => {
        return (
            <Item>
                <Tooltip
                    arrow
                    animation="shift"
                    position="top"
                    theme="bct"
                    title={ rowData.orderId }
                    className="tooltipId"
                >
                    { rowData.orderId }
                </Tooltip>
            </Item>
        );
    };

    instrCellRenderer = ({ rowData }) => {
        return (
            <Item>
                { rowData.symbol }
            </Item>
        );
    };

    accountCellRenderer = ({ rowData }) => {
        return (
            <Item>
            </Item>
        );
    };

    sideCellRenderer = ({ rowData }) => {
        return (
            <Item>
                { rowData.side }
            </Item>
        );
    };

    amountCellRenderer = ({ rowData }) => {
        return (
            <Item>
                { rowData.filled }
            </Item>
        );
    };

    filledCellRenderer = ({ rowData }) => {
        return (
            <Item>
                { rowData.filled }
            </Item>
        );
    };

    priceCellRenderer = ({ rowData }) => {
        return (
            <Item>
                { rowData.price }
            </Item>
        );
    };

    avgPriceCellRenderer = ({ rowData }) => {
        return (
            <Item>
                { rowData.average }
            </Item>
        );
    };

    orderTypeCellRenderer = ({ rowData }) => {
        return (
            <Item>
                { rowData.type }
            </Item>
        );
    };

    tifCellRenderer = ({ rowData }) => {
        return (
            <Item>
            </Item>
        );
    };

    sourceCellRenderer = ({ rowData }) => {
        return (
            <Item>
            </Item>
        );
    };

    stopPriceCellRenderer = ({ rowData }) => {
        return (
            <Item>
            </Item>
        );
    };

    cancelCellRenderer = ({ rowData }) => {
        return (
            <Item>
            </Item>
        );
    };

    render() {
        const data = this.props.columns;

        return (
            <List>
                <AutoSizer>
                    {({ width, height }) => {
                        return (
                            <StyleWrapper width={width} height={height}>
                                <PerfectScrollbar
                                    options={{
                                        suppressScrollX: true,
                                        minScrollbarLength: 50,
                                    }}
                                >
                                    <Table
                                        width={width}
                                        height={height}
                                        headerHeight={27}
                                        disableHeader={false}
                                        rowCount={data.length}
                                        rowGetter={({ index }) => data[index]}
                                        rowHeight={27}
                                        overscanRowCount={0}
                                    >
                                        <Column
                                            width={width * 0.14}
                                            dataKey="Time"
                                            headerRenderer={headerRenderer('Time')}
                                            cellRenderer={this.timeCellRenderer}
                                        />

                                        <Column
                                            width={width * 0.07}
                                            dataKey="Order ID"
                                            headerRenderer={headerRenderer('Order ID')}
                                            cellRenderer={this.orderIdCellRenderer}
                                        />

                                        <Column
                                            width={width * 0.07}
                                            dataKey="Instr."
                                            headerRenderer={headerRenderer('Instr.')}
                                            cellRenderer={this.instrCellRenderer}
                                        />
                                        <Column
                                            width={width * 0.08}
                                            dataKey="Account"
                                            headerRenderer={headerRenderer('Account')}
                                            cellRenderer={this.accountCellRenderer}
                                        />

                                        <Column
                                            width={width * 0.07}
                                            dataKey="Side"
                                            headerRenderer={headerRenderer('Side')}
                                            cellRenderer={this.sideCellRenderer}
                                        />

                                        <Column
                                            width={width * 0.08}
                                            dataKey="Amount"
                                            headerRenderer={headerRenderer('Amount')}
                                            cellRenderer={this.amountCellRenderer}
                                        />
                                        <Column
                                            width={width * 0.07}
                                            dataKey="Filled"
                                            headerRenderer={headerRenderer('Filled')}
                                            cellRenderer={this.filledCellRenderer}
                                        />

                                        <Column
                                            width={width * 0.08}
                                            dataKey="Price"
                                            headerRenderer={headerRenderer('Price')}
                                            cellRenderer={this.priceCellRenderer}
                                        />

                                        <Column
                                            width={width * 0.09}
                                            dataKey="Avg Price"
                                            headerRenderer={headerRenderer('Avg. Price')}
                                            cellRenderer={this.avgPriceCellRenderer}
                                        />
                                        <Column
                                            width={width * 0.08}
                                            dataKey="Order Type"
                                            headerRenderer={headerRenderer('Order Type')}
                                            cellRenderer={this.orderTypeCellRenderer}
                                        />

                                        <Column
                                            width={width * 0.07}
                                            dataKey="TIF"
                                            headerRenderer={headerRenderer('TIF')}
                                            cellRenderer={this.tifCellRenderer}
                                        />

                                        <Column
                                            width={width * 0.07}
                                            dataKey="Source"
                                            headerRenderer={headerRenderer('Source')}
                                            cellRenderer={this.sourceCellRenderer}
                                        />
                                        <Column
                                            width={width * 0.07}
                                            dataKey="Stop Price"
                                            headerRenderer={headerRenderer('Stop Price')}
                                            cellRenderer={this.stopPriceCellRenderer}
                                        />

                                        <Column
                                            width={width * 0.03}
                                            dataKey="Cancel"
                                            headerRenderer={headerCancelRenderer()}
                                            cellRenderer={this.cancelCellRenderer}
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

export default ReportTable;
