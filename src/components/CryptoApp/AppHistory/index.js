import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { AutoSizer, Column, Table } from 'react-virtualized';
import QRCode from 'qrcode-react';
import moment from 'moment';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import {
    format2DigitString,
    getItemColor
} from '../../../utils';
import { STORE_KEYS } from '../../../stores';
import DataLoader from '../../../components-generic/DataLoader';
import {
    Wrapper,
    HeaderWrapper,
    ContentWrapper,
    List,
    LoadingWrapper,
    NoDataText,
    TableWrapper,
    InnerWrapper,
    InfoItem,
    ArrowIcon,
    InnerList,
    BalanceRow,
    AddPhoto,
    SettingItem,
    OptionTransfer
} from './Components';
import logoutIcon from '../asset/img/logout.png';
import settingIcon from '../asset/img/setting.png';
import acceptIcon from '../asset/img/accept.png';
import rejectIcon from '../asset/img/reject.png';

class AppHistory extends React.Component {
    state = {
        isLogoutScreen: false,
        isSettingScreen: false,
        isAccept: null,
        loading: false,
        scrollTop: 0,
        openedMenu: '',
        history: this.props[STORE_KEYS.SENDCOINSTORE].transferHistory,
    };

    mounted = true;
    scrollRef = null;
    psRef = null;
    tableRef = null;
    interval = null;

    componentDidMount() {
        const {
            [STORE_KEYS.SENDCOINSTORE]: {
                requestTransferHistory,
            },
        } = this.props;

        requestTransferHistory();

        this.interval = setInterval(() => {
            if (this.mounted) {
                this.setState({ loading: true });
            }
        }, 1000);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.isVisible === true && this.props.isVisible === false) {
            const {
                [STORE_KEYS.SENDCOINSTORE]: {
                    requestTransferHistory,
                },
            } = this.props;

            requestTransferHistory()
                .then(res => {
                    if (this && this.mounted && this.psRef) {
                        this.psRef.updateScroll();
                    }
                });
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        this.mounted = false;
    }

    handleScroll = ({ scrollTop }) => {
        this.setState({ scrollTop });
    };

    handleClose = (e) => {
        // const { isCoinTransfer } = this.props;

        // if (isCoinTransfer) {
        //     this.props.history.push('/');
        // } else if (this.props.onClose) {
        //     this.props.onClose(true);
        // }
        if(e) e.stopPropagation();
        this.props.onClose(true);
    };

    historyCellRenderer = ({ rowData }) => {
        const {
            [STORE_KEYS.TELEGRAMSTORE]: {
                loggedInUser,
            },
            [STORE_KEYS.SETTINGSSTORE]: {
                getLocalFiatPrice, getCoinPrice, getFiatSymbolFromName, defaultFiat,
            },
        } = this.props;

        const {
            Amount,
            Coin,
            CreatedAt,
            DefaultCurrency,
            Executor,
            Initiator,
            IsMemberSender,
            Status,
            TrId,
        } = rowData;

        let executorFullName = '';
        let executorUserName = '';
        let initiatorFullName = '';
        let initiatorUserName = '';

        if (Executor) {
            executorFullName = Executor.FullName || '';
            executorUserName = Executor.Username || '';
        }

        if (Initiator) {
            initiatorFullName = Initiator.FullName || '';
            initiatorUserName = Initiator.Username || '';
        }

        let userName = (loggedInUser && loggedInUser.username) || '';

        let displayFullName = (Status ==='pending' ? 'Pending' : 'User');
        let qrCodeValue = 'https://' + window.location.hostname + '/cointransfer/' + TrId;

        if (userName === initiatorUserName) {
            if (executorFullName !== '') {
                displayFullName = executorFullName;
            }
        } else if (initiatorFullName !== '') {
            displayFullName = initiatorFullName;
        }

        let createdAt = CreatedAt;

        try {
            const createdAtMoment = moment(CreatedAt);
            if (createdAtMoment.isValid()) {
                createdAt = createdAtMoment.format('lll');
            }
        } catch (e) {
            console.log(e);
        }

        let labelAmount = getFiatSymbolFromName(defaultFiat) + format2DigitString(Amount);
        // if (defaultFiat !== '') {
        //     labelAmount = getFiatSymbolFromName(defaultFiat) + format2DigitString(getLocalFiatPrice(getCoinPrice(Coin.toUpperCase()) * Amount, defaultFiat));
        // } else {
        //     labelAmount = format2DigitString(Amount) + ' ' + Coin.toUpperCase();
        // }

        return (
            <InfoItem
                isActive={this.state.openedMenu === 'activity'}
            >
                <div className="prefix">
                    {Status === 'pending' ? (
                        <div className="circleText transparent">
                            <img src={`${process.env.PUBLIC_URL}/img/gold_certificate.png`} alt="" />
                            <QRCode
                                value={qrCodeValue}
                                size={20}
                                bgColor="#FFB400"
                                fgColor="#000"
                            />
                        </div>
                    ) : (
                        <div className="circleText">
                            <span className="circleContent">U</span>
                        </div>
                    )}
                    <div className="containerText">
                        <div className={Status === 'pending' ? 'titleText grey' : 'titleText'}>{displayFullName}</div>
                        <div className="descText">{createdAt}</div>
                    </div>
                </div>
                <div className="prefix">
                    <div className="containerText">
                        <div className={Status === 'pending' ? 'titleText grey' : 'titleText'}>{IsMemberSender ? '-' : '+'} {labelAmount}</div>
                        <div className="descText">{Status}</div>
                    </div>
                </div>
            </InfoItem>
        );
    };

    toggleMenu = (openedMenu) => {
        if (this.state.openedMenu === openedMenu) {
            this.setState({
                openedMenu: '',
            });
        } else {
            this.setState({
                openedMenu,
            });
        }
    };

    onLogout = (e, option = -1) => {
        e.stopPropagation();
        if (option === -1) this.setState({ isLogoutScreen: true});
        if (option === false) {
            this.setState({
                isLogoutScreen: false,
                isAccept: null,
            });
        } else if (option === true) {
            localStorage.clear();
            window.location.reload();
        }
    }

    onSetting = (e) => {
        e.stopPropagation();
        this.setState({ isSettingScreen: true });
    }

    onSettingOut = e => {
        e.stopPropagation();
        this.setState({ isSettingScreen: false });
    }

    render() {
        const {
            scrollTop,
            openedMenu,
            isLogoutScreen,
            isSettingScreen,
        } = this.state;

        const {
            [STORE_KEYS.SMSAUTHSTORE]: {
                isLoggedIn,
            },
            [STORE_KEYS.SENDCOINSTORE]: {
                transferHistory: tableData,
                isFetchingTransferHistory,
            },
            [STORE_KEYS.MODALSTORE]: {
                Modal,
                onClose,
            },
            [STORE_KEYS.YOURACCOUNTSTORE]: {
                PortfolioData,
                PortfolioUSDTValue,
            },
        } = this.props;

        let phoneNumber;
        try {
            phoneNumber = parsePhoneNumberFromString(localStorage.getItem('phoneNumber'));
            phoneNumber = phoneNumber.formatInternational();
        } catch(e) {
            phoneNumber = '';
        }

        return (
            <Wrapper onClick={this.handleClose}>
                {isSettingScreen ? (
                        <ContentWrapper>
                            <HeaderWrapper justify={true} onClick={e => this.onSettingOut(e)}>
                                <AddPhoto>Add Photo</AddPhoto>
                            </HeaderWrapper>
                            <InnerWrapper onClick={e => e.stopPropagation()}>
                                <SettingItem>
                                    <p>User</p>
                                    <span> Display Name </span>
                                </SettingItem>

                                <SettingItem>
                                    <p>{phoneNumber}</p>
                                    <span> Your Phone</span>
                                </SettingItem>

                                <SettingItem>
                                    <OptionTransfer>
                                        <input type='checkbox' className='ios8-switch ios8-switch-sm' id='checkbox2' />
                                        <label htmlFor='checkbox2'></label>
                                    </OptionTransfer>
                                    <span> Require PIN to transfer funds </span>
                                </SettingItem>
                            </InnerWrapper>
                        </ContentWrapper>
                    ) : <ContentWrapper>
                        {isLogoutScreen ? (
                            <HeaderWrapper>
                                <img src={rejectIcon} alt="reject" onClick={e => this.onLogout(e, false)}/>
                                <BalanceRow isLogoutScreen={true}>
                                    Are you sure you want to sign out?
                                </BalanceRow>
                                <img src={acceptIcon} alt="accept" onClick={e => this.onLogout(e, true)} />
                            </HeaderWrapper>
                        ) : (
                            <HeaderWrapper onClick={e => e.stopPropagation()}>
                                <img src={settingIcon} alt="setting" onClick={e => this.onSetting(e)} />
                                <BalanceRow>
                                    <div><p>$</p></div>
                                    {`${Number(PortfolioUSDTValue).toLocaleString()}`}
                                </BalanceRow>
                                <img src={logoutIcon} alt="setting" onClick={e => this.onLogout(e)} />
                            </HeaderWrapper>
                        )}

                        {!isLogoutScreen && <InnerWrapper onClick={e => e.stopPropagation()}>
                            <List>
                                {isLoggedIn ? (
                                    isFetchingTransferHistory ? (
                                        <LoadingWrapper>
                                            <DataLoader width={120} height={120} />
                                        </LoadingWrapper>
                                    ) : (
                                        <InnerList>
                                            {(tableData && tableData.length) ? (
                                                <AutoSizer>
                                                    {({ width, height }) => (
                                                        <TableWrapper width={width} height={height}>
                                                            <PerfectScrollbar
                                                                containerRef={ref => {
                                                                    this.scrollRef = ref;
                                                                }}
                                                                ref={ref => {
                                                                    this.psRef = ref;
                                                                }}
                                                                options={{
                                                                    suppressScrollX: true,
                                                                }}
                                                                onScrollY={this.handleScroll}
                                                            >
                                                                <InfoItem style={{ backgroundColor: '#4080FF' }}>
                                                                    <div className="prefix">
                                                                        <div className="containerText">
                                                                            <div style={{ fontSize: '36px', paddingRight: '10px' }}>
                                                                                $5
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="prefix">
                                                                        <div className="containerText">
                                                                            <div style={{ fontSize: '12px' }}>
                                                                                Send any amount to your friends and we'll send you both $5 when they try this App!
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </InfoItem>
                                                                <Table
                                                                    ref={ref => {
                                                                        this.tableRef = ref;
                                                                    }}
                                                                    autoHeight
                                                                    width={width}
                                                                    height={height}
                                                                    disableHeader
                                                                    rowCount={tableData.length}
                                                                    rowGetter={({ index }) => tableData[index]}
                                                                    rowHeight={80}
                                                                    overscanRowCount={0}
                                                                    scrollTop={scrollTop}
                                                                >
                                                                    <Column
                                                                        width={width}
                                                                        dataKey="History"
                                                                        cellRenderer={this.historyCellRenderer}
                                                                        style={{ paddingRight: 0 }}
                                                                    >
                                                                    </Column>
                                                                </Table>
                                                            </PerfectScrollbar>
                                                        </TableWrapper>
                                                    )}
                                                </AutoSizer>
                                            ) : (
                                                <NoDataText>
                                                    <FormattedMessage
                                                        id="pay_app.history_view_v2.label_no_transaction"
                                                        defaultMessage="No Transaction Yet"
                                                    />
                                                </NoDataText>
                                            )}
                                        </InnerList>
                                    )
                                ) : (
                                    <NoDataText>
                                        <FormattedMessage
                                            id="pay_app.history_view_v2.label_login"
                                            defaultMessage="Please login to see transactions"
                                        />
                                    </NoDataText>
                                )}
                            </List>
                        </InnerWrapper>}
                    </ContentWrapper>
                }
            </Wrapper>
        );
    }
}

export default inject(
    STORE_KEYS.TELEGRAMSTORE,
    STORE_KEYS.SENDCOINSTORE,
    STORE_KEYS.SETTINGSSTORE,
    STORE_KEYS.MODALSTORE,
    STORE_KEYS.YOURACCOUNTSTORE,
    STORE_KEYS.SMSAUTHSTORE,
)(observer(withRouter(AppHistory)));
