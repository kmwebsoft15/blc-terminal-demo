import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';
import { AutoSizer } from 'react-virtualized';

import { STORE_KEYS } from '../../../stores';
import { customDigitFormat } from '../../../utils';
import {
    Wrapper,
    InnerWrapper,
    RefWrapper
} from './Components';
import Portal from './Portal';
import DataLoader from '../../../components-generic/DataLoader';

class BillsModal extends Component {
    state = {
        baseDepositAddress: '',
        quoteDepositAddress: '',
    };

    componentDidMount() {
        this.props.createDepositAddress('BTC')
            .then(address => {
                this.setState({
                    baseDepositAddress: address,
                });
            });
        this.props.createDepositAddress('USDT')
            .then(address => {
                this.setState({
                    quoteDepositAddress: address,
                });
            });

        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (
            this.props.isOpen &&
            this.wrapperRef && this.wrapperRef.contains && this.wrapperRef.contains(event.target) &&
            ((this.upperPortalRef && this.upperPortalRef.contains && !this.upperPortalRef.contains(event.target)) ||
                (this.lowerPortalRef && this.lowerPortalRef.contains && !this.lowerPortalRef.contains(event.target)))
        ) {
            this.props.onClosePopup();
        }
    };

    getUpperInnerRef = ref => this.upperPortalRef = ref;

    getLowerInnerRef = ref => this.lowerPortalRef = ref;

    render() {
        const { baseDepositAddress, quoteDepositAddress } = this.state;
        const {
            isOpen,
            PortfolioData,
            baseSymbol,
            baseIsReceivedUserBills,
            baseListUserBills,
            baseListUserBillsRequest,
            baseSetWithdrawAmount,
            quoteSymbol,
            quoteIsReceivedUserBills,
            quoteListUserBills,
            quoteListUserBillsRequest,
            quoteSetWithdrawAmount,
            isDefaultCrypto,
        } = this.props;

        if (!baseDepositAddress || !quoteDepositAddress) {
            return (isOpen &&
                <Wrapper>
                    <DataLoader width={100} height={100} />
                </Wrapper>
            );
        }

        let basePosition = 0;
        let quotePosition = 0;
        let isBaseFound = false;
        let isQuoteFound = false;
        if (baseSymbol && quoteSymbol) {
            for (let i = 0; i < PortfolioData.length; i++) {
                if (PortfolioData[i] && PortfolioData[i].Coin === baseSymbol) {
                    basePosition = PortfolioData[i].Position;
                    isBaseFound = true;
                }
                if (PortfolioData[i] && PortfolioData[i].Coin === quoteSymbol) {
                    quotePosition = PortfolioData[i].Position;
                    isQuoteFound = true;
                }
                if (isBaseFound && isQuoteFound) {
                    break;
                }
            }
        }
        const baseBalance = (basePosition !== 1) ? ((basePosition && basePosition >= 0.00001) ? customDigitFormat(basePosition) : '0.00') : '1.00';
        const quoteBalance = (quotePosition !== 1) ? ((quotePosition && quotePosition >= 0.00001) ? customDigitFormat(quotePosition) : '0.00') : '1.00';

        if (isOpen && this.basePosition !== basePosition) {
            if (this.basePosition !== undefined) {
                baseListUserBillsRequest();
                quoteListUserBillsRequest();
            }

            this.basePosition = basePosition;
        }

        return (
            isOpen && <Wrapper>
                <RefWrapper ref={ref => this.wrapperRef = ref}>
                    <AutoSizer>
                        {({ width, height }) => {
                            const padding = 15;
                            const innerWrapperWidth = width;
                            const innerWrapperHeight = height;

                            const deltaH = 60 + 2 * padding;
                            const deltaV = 100 + 3 * padding;

                            // Calculate real width and height based on scale
                            const previewWidth = width - deltaH;
                            const previewHeight = (height - deltaV) / 2;
                            let newWidth = Math.floor(previewHeight * 3192 / 1800) + deltaH;
                            let newHeight = previewHeight * 2 + deltaV;
                            if (newWidth > previewWidth + deltaH) {
                                newWidth = previewWidth + deltaH;
                                newHeight = Math.floor(previewWidth * 1800 / 3192) * 2 + deltaV;
                            }

                            const portalWrapperWidth = newWidth - 2 * padding;
                            const portalWrapperHeight = (newHeight - 3 * padding) / 2;

                            return (
                                <InnerWrapper
                                    width={innerWrapperWidth}
                                    height={innerWrapperHeight}
                                    padding={padding}
                                >
                                    {isDefaultCrypto ? (
                                        <Portal
                                            getInnerRef={this.getUpperInnerRef}
                                            width={portalWrapperWidth}
                                            height={portalWrapperHeight}
                                            padding={padding}
                                            isOpen={isOpen}
                                            coinDepositAddress={baseDepositAddress}
                                            balance={baseBalance}
                                            position={basePosition}
                                            symbol={baseSymbol}
                                            isReceivedUserBills={baseIsReceivedUserBills}
                                            listUserBills={baseListUserBills}
                                            setWithdrawAmount={baseSetWithdrawAmount}
                                            isDefaultCrypto={isDefaultCrypto}
                                        />
                                    ) : (
                                        <Portal
                                            getInnerRef={this.getLowerInnerRef}
                                            width={portalWrapperWidth}
                                            height={portalWrapperHeight}
                                            padding={padding}
                                            isOpen={isOpen}
                                            coinDepositAddress={quoteDepositAddress}
                                            balance={quoteBalance}
                                            position={quotePosition}
                                            symbol={quoteSymbol}
                                            isReceivedUserBills={quoteIsReceivedUserBills}
                                            listUserBills={quoteListUserBills}
                                            setWithdrawAmount={quoteSetWithdrawAmount}
                                            isDefaultCrypto={isDefaultCrypto}
                                        />
                                    )}
                                </InnerWrapper>
                            );
                        }}
                    </AutoSizer>
                </RefWrapper>
            </Wrapper>
        );
    }
}

const withStore = compose(
    inject(
        STORE_KEYS.COINADDRESSSTORE,
        STORE_KEYS.BILLSMODALSTORE,
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.SETTINGSSTORE,
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.COINADDRESSSTORE]: {
                createDepositAddress,
            },
            [STORE_KEYS.BILLSMODALSTORE]: {
                isOpen,
                baseChip: {
                    symbol: baseSymbol,
                    isReceivedUserBills: baseIsReceivedUserBills,
                    listUserBills: baseListUserBills,
                    listUserBillsRequest: baseListUserBillsRequest,
                    setWithdrawAmount: baseSetWithdrawAmount,
                },
                quoteChip: {
                    symbol: quoteSymbol,
                    isReceivedUserBills: quoteIsReceivedUserBills,
                    listUserBills: quoteListUserBills,
                    listUserBillsRequest: quoteListUserBillsRequest,
                    setWithdrawAmount: quoteSetWithdrawAmount,
                },
                onClosePopup,
            },
            [STORE_KEYS.YOURACCOUNTSTORE]: {
                PortfolioData,
            },
            [STORE_KEYS.SETTINGSSTORE]: {
                isDefaultCrypto,
            },
        }) => ({
            createDepositAddress,
            isOpen,
            baseSymbol,
            baseIsReceivedUserBills,
            baseListUserBills,
            baseListUserBillsRequest,
            baseSetWithdrawAmount,
            quoteSymbol,
            quoteIsReceivedUserBills,
            quoteListUserBills,
            quoteListUserBillsRequest,
            quoteSetWithdrawAmount,
            onClosePopup,
            PortfolioData,
            isDefaultCrypto,
        })
    )
);

export default withStore(BillsModal);
