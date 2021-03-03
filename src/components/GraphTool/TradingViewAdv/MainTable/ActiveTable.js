import React from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import {
    StyleWrapper,
    HeaderWrapper
} from './Components';

const headerRenderer = (coin) => () => {
    return (
        <HeaderWrapper>
            {coin}
        </HeaderWrapper>
    );
};

function ActiveTable(props) {
    const { selectedTotalCurrency } = props
    const data = [];
    return (
        <AutoSizer>
            {({ width, height }) => {
                return (
                    <StyleWrapper width={width} height={height}>
                        <Table
                            autoHeight={true}
                            width={width}
                            height={height}
                            headerHeight={40}
                            disableHeader={false}
                            rowHeight={60}
                            overscanRowCount={0}
                            rowCount={8}
                            rowGetter={({ index }) => data[index]}
                        >
                            <Column
                                width={width * 0.14}
                                dataKey="Name"
                                headerRenderer={headerRenderer('Account')}
                            />
                            <Column
                                width={width * 0.06}
                                dataKey="API"
                                headerRenderer={headerRenderer('API')}
                            />
                            <Column
                                width={width * 0.06}
                                dataKey="Currency"
                                headerRenderer={headerRenderer('Currency')}
                            />
                            <Column
                                width={width * 0.06}
                                dataKey="Api"
                                headerRenderer={headerRenderer('Pay-in')}
                            />
                            <Column
                                width={width * 0.07}
                                dataKey="Name"
                                headerRenderer={headerRenderer('Pay-out')}
                            />

                            <Column
                                width={width * 0.15}
                                dataKey="Price"
                                headerRenderer={headerRenderer('Available')}
                            />

                            <Column
                                width={width * 0.15}
                                dataKey="Api"
                                headerRenderer={headerRenderer('Amount')}
                            />
                            <Column
                                width={width * 0.15}
                                dataKey="Name"
                                headerRenderer={headerRenderer('Reserved')}
                            />
                            <Column
                                width={width * 0.15}
                                dataKey="Name"
                                headerRenderer={headerRenderer(`Total in ${selectedTotalCurrency || 'USDT'}`)}
                            />
                        </Table>
                    </StyleWrapper>
                );
            }}
        </AutoSizer>
    );
}

export default ActiveTable;