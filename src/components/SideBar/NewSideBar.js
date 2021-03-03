/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import findIndex from 'lodash/findIndex';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { Tooltip } from 'react-tippy';

import { STORE_KEYS } from '../../stores';
import { format7DigitString, formatNegativeNumber } from '../../utils';
import Items from './Items/NewItems';
import {
    SideBarWrapper, Head, ImageWrapper, CreditIcon
} from './Component';
import KeyModal from '../KeyModal';
import TermsModal from '../YourAccount/TermsModal';
import AddFundsModal from '../YourAccount/AddFundsModal2';

const addFundsModal = (Modal, portalFromParameter, additionalVerticalSpace, heading1, heading2) => () => {
    const portal = ['/', '/trading'].indexOf(window.location.pathname) !== -1
        ? portalFromParameter
        : 'root';
    return Modal({
        portal,
        additionalVerticalSpace,
        ModalComponentFn: () => <AddFundsModal portal={portal} heading1={heading1} heading2={heading2} />,
    });
};

class Sidebar extends Component {
    state = {
        isTermsModalOpen: false,
        isKeyModalOpen: false,
    };

    toggleTermsModal = () => {
        this.setState(prevState => ({
            isTermsModalOpen: !prevState.isTermsModalOpen,
        }));
    };

    toggleKeyModal = (isKeyModalOpen) => {
        this.setState(prevState => ({
            isKeyModalOpen: (typeof isKeyModalOpen === 'boolean') ? isKeyModalOpen : !prevState.isKeyModalOpen,
        }));
    };

    render() {
        const {
            isTermsModalOpen,
            isKeyModalOpen,
        } = this.state;
        const {
            height, width, isHover, Modal, portfolioData,
        } = this.props;

        const bctIndex = findIndex(portfolioData, { Coin: 'BCT' });
        let storeCredit = 0;
        if (bctIndex !== -1) {
            storeCredit = (portfolioData[bctIndex] && portfolioData[bctIndex].Amount) || 0;
        }
        const storeCreditStr = formatNegativeNumber(format7DigitString(storeCredit)).replace('+', '');

        return (
            <React.Fragment>
                <SideBarWrapper
                    width={width}
                    isHover={isHover}
                >
                    {/*
                    <Head>
                        <Tooltip
                            arrow={true}
                            animation="shift"
                            position="right"
                            theme="bct"
                            title="Add Funds"
                        >
                            <ImageWrapper onClick={addFundsModal(
                                Modal,
                                'graph-chart-parent',
                                true,
                                `Your Store Credit: ${storeCreditStr}`,
                                'Add $1,000 to your store credit to access all apps. Instantly.'
                            )}
                            >
                                <CreditIcon />
                            </ImageWrapper>
                        </Tooltip>
                    </Head>

                    <Items
                        pathname={window.location.pathname}
                        height={height - 75}
                    />

                    {isTermsModalOpen && <TermsModal show={this.toggleTermsModal}/>}

                    <KeyModal
                        toggleModal={this.toggleKeyModal}
                        hoverMode
                        inLineMode
                        isModalOpen={isKeyModalOpen}
                    />
                    */}
                </SideBarWrapper>
            </React.Fragment>
        );
    }
}

const withStores = compose(
    inject(STORE_KEYS.MODALSTORE, STORE_KEYS.YOURACCOUNTSTORE),
    observer,
    withProps(
        ({
            [STORE_KEYS.MODALSTORE]: {
                Modal,
            },
            [STORE_KEYS.YOURACCOUNTSTORE]: {
                portfolioData,
            },
        }) => ({
            Modal,
            portfolioData,
        })
    )
);

export default withStores(Sidebar);
