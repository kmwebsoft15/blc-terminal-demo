import React, { Component, Fragment } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { STORE_KEYS } from '../../../stores';
import { toFixedWithoutRounding } from '../../../utils';
import {
    ModalWrapper,
    InnerWrapper,
    ModalBody,
    StyleWrapper,
    TableHeader,
    TableFooter,
    FooterColumn,
    AccountCell,
    APICell,
    LogoWrapper,
    Logo
} from './Components';
import ModalHeader from './ModalHeader';
import BillsInner from '../BillsModal/BillsInner';
import { Checkbox } from '../../WalletHeader/icons';

class MarketMakerModal extends Component {
    state = {
        menu: 'On Exchanges',
        scrollTop: 0,
    };

    menuItems = [
        'On Exchanges',
        'In Cold Storage'
    ];

    isFirstRender = true;

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.symbol !== this.props.symbol) {
            this.isFirstRender = true;
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (
            this.props.isOpen &&
            this.wrapperRef && this.wrapperRef.contains && this.wrapperRef.contains(event.target) &&
            this.innerRef && this.innerRef.contains && !this.innerRef.contains(event.target)
        ) {
            if (this.scrollRef) {
                this.scrollRef.scrollTop = 0;
            }
            this.setState({ scrollTop: 0, menu: 'On Exchanges' });
            this.props.closeModal();
        }
    };

    selectMenu = (menu) => {
        this.setState({
            menu,
        });
        this.isFirstRender = false;
    };

    handleScroll = ({ scrollTop }) => {
        this.setState({ scrollTop });
    };

    headerRenderer = (label) => () => (
        <TableHeader>
            {label}
        </TableHeader>
    );

    accountRenderer = ({ rowData }) => (
        <AccountCell className="exchange-item">
            <LogoWrapper size={38}>
                <Logo src={`/img/exchange/${rowData.icon}`} alt=""/>
            </LogoWrapper>

            <span>{rowData.name}</span>
        </AccountCell>
    );

    mockCellRenderer = () => (
        <Fragment>0.000000</Fragment>
    );

    mockApiRenderer = ({ rowData }) => {
        const { exchanges } = this.props;
        let isActive = false;
        if (exchanges && exchanges[rowData.name]) {
            isActive = exchanges[rowData.name].active;
        }

        return (
            <APICell>
                <Checkbox
                    size={30}
                    active={isActive}
                    onClick={() => this.props.setExchangeActive(rowData.name, !isActive)}
                />
            </APICell>
        );
    };

    render() {
        const { menu, scrollTop } = this.state;
        const {
            isOpen,
            symbol,
            isReceivedUserBills,
            listUserBills,
            listUserBillsRequest,
            PortfolioData,
            marketExchanges,
        } = this.props;

        if (!isOpen) {
            return null;
        }

        let position = 0;
        for (let i = 0; i < PortfolioData.length; i++) {
            if (PortfolioData[i] && PortfolioData[i].Coin === symbol) {
                position = PortfolioData[i].Position;
                break;
            }
        }

        if (this.position !== position) {
            if (this.position !== undefined) {
                listUserBillsRequest();
            }

            this.position = position;
        }

        let centerPos = 9;
        const count = Math.log10(position);
        if (count > 5) {
            centerPos = count + 1;
        }

        // 16 total amount of columns in cold storage table (BillsInner)
        const newPosition = toFixedWithoutRounding(position.toFixed(20), 16 - centerPos);
        const balance = parseFloat(newPosition);
        const newDeno = centerPos - 1;

        let activeMenu = menu;
        if (this.isFirstRender) {
            activeMenu = balance > 0 ? 'In Cold Storage' : 'On Exchanges';
        }

        return (
            <ModalWrapper ref={ref => this.wrapperRef = ref}>
                <InnerWrapper ref={ref => this.innerRef = ref}>
                    <ModalHeader
                        symbol={symbol}
                        menu={activeMenu}
                        menuItems={this.menuItems}
                        selectMenu={this.selectMenu}
                    />

                    <ModalBody>
                        <AutoSizer>
                            {({ width, height }) => {
                                if (activeMenu === 'On Exchanges') {
                                    return (
                                        <Fragment>
                                            <StyleWrapper
                                                width={width + 15}
                                                height={height - 50}
                                            >
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
                                                        autoHeight={true}
                                                        width={width}
                                                        height={height - 50}
                                                        headerHeight={60}
                                                        rowCount={marketExchanges.length}
                                                        rowGetter={({ index }) => marketExchanges[index]}
                                                        rowHeight={50}
                                                        overscanRowCount={0}
                                                        scrollTop={scrollTop}
                                                    >
                                                        <Column
                                                            width={width * 0.17}
                                                            dataKey="Account"
                                                            headerRenderer={this.headerRenderer('Account')}
                                                            cellRenderer={this.accountRenderer}
                                                        />
                                                        <Column
                                                            width={width * 0.09}
                                                            dataKey="API"
                                                            headerRenderer={this.headerRenderer('API')}
                                                            cellRenderer={this.mockApiRenderer}
                                                        />
                                                        <Column
                                                            width={width * 0.14}
                                                            dataKey="Available"
                                                            headerRenderer={this.headerRenderer('Available')}
                                                            cellRenderer={this.mockCellRenderer}
                                                        />
                                                        <Column
                                                            width={width * 0.12}
                                                            dataKey="Amount"
                                                            headerRenderer={this.headerRenderer('Amount')}
                                                            cellRenderer={this.mockCellRenderer}
                                                        />
                                                        <Column
                                                            width={width * 0.14}
                                                            dataKey="Reserved"
                                                            headerRenderer={this.headerRenderer('Reserved')}
                                                            cellRenderer={this.mockCellRenderer}
                                                        />
                                                        <Column
                                                            width={width * 0.17}
                                                            dataKey="TotalInUSD"
                                                            headerRenderer={this.headerRenderer('Total in USD')}
                                                            cellRenderer={this.mockCellRenderer}
                                                        />
                                                        <Column
                                                            width={width * 0.17}
                                                            dataKey="TotalInEUR"
                                                            headerRenderer={this.headerRenderer('Total in EUR')}
                                                            cellRenderer={this.mockCellRenderer}
                                                        />
                                                    </Table>
                                                </PerfectScrollbar>
                                            </StyleWrapper>

                                            <TableFooter>
                                                <FooterColumn width={(width * 0.17).toFixed(2)}>Total</FooterColumn>
                                                <FooterColumn width={(width * 0.09).toFixed(2)} />
                                                <FooterColumn width={(width * 0.14).toFixed(2)}>0.000000</FooterColumn>
                                                <FooterColumn width={(width * 0.12).toFixed(2)}>0.000000</FooterColumn>
                                                <FooterColumn width={(width * 0.14).toFixed(2)}>0.000000</FooterColumn>
                                                <FooterColumn width={(width * 0.17).toFixed(2)}>0.000000</FooterColumn>
                                                <FooterColumn width={(width * 0.17).toFixed(2)}>0.000000</FooterColumn>
                                            </TableFooter>
                                        </Fragment>
                                    );
                                }

                                return (
                                    <BillsInner
                                        isFromMarketModal
                                        width={width}
                                        height={height}
                                        padding={0}
                                        isDeposit={false}
                                        symbol={symbol}
                                        balance={balance}
                                        newDeno={newDeno}
                                        isReceivedUserBills={isReceivedUserBills}
                                        listUserBills={listUserBills}
                                    />
                                );
                            }}
                        </AutoSizer>
                    </ModalBody>
                </InnerWrapper>
            </ModalWrapper>
        );
    }
}

const withStore = compose(
    inject(
        STORE_KEYS.MARKETMODALSTORE,
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.EXCHANGESSTORE,
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.MARKETMODALSTORE]: {
                isOpen,
                symbol,
                isReceivedUserBills,
                listUserBills,
                listUserBillsRequest,
                closeModal,
            },
            [STORE_KEYS.YOURACCOUNTSTORE]: {
                PortfolioData,
            },
            [STORE_KEYS.EXCHANGESSTORE]: {
                exchanges,
                marketExchanges,
                setExchangeActive,
            },
        }) => ({
            isOpen,
            symbol,
            isReceivedUserBills,
            listUserBills,
            listUserBillsRequest,
            closeModal,
            PortfolioData,
            exchanges,
            marketExchanges,
            setExchangeActive,
        })
    )
);

export default withStore(MarketMakerModal);
