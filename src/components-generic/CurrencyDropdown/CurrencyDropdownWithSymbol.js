import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import Icon from '@material-ui/core/Icon';
import { withSafeTimeout } from '@hocs/safe-timers';
import { compose } from 'recompose';

import { STORE_KEYS } from '@/stores';
import CurrencyDropdown from './index';
import { SelectedItem, CurrencyImage, CurrencySymbol } from '@/components/WalletHeader/Components';
import { CurrencyText } from './Components.js'
import { CoinIcon, BTCFontIcon } from '../CoinIcon';

class CurrencyDropdownWithSymbol extends Component {
    state = {
        isOpen: false,
    };

    wrapperRef = null;
    toggleDropDownTimeout = null;

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.state.isOpen && this.wrapperRef && this.wrapperRef.contains && !this.wrapperRef.contains(event.target)) {
            this.setState({
                isOpen: false,
            });
        }
    };

    toggleDropDown = isOpen => {
        const {
            isClickable = true,
            setSafeTimeout,
        } = this.props;

        if (isClickable) {
            this.setState(prevState => ({
                isOpen: (typeof isOpen === 'boolean') ? isOpen : !prevState.isOpen,
            }));
        }

        setSafeTimeout(() => {
            if (this.props.onToggleDropdown) {
                this.props.onToggleDropdown(this.state.isOpen);
            }
        });
    };

    render() {
        const { isOpen } = this.state;
        const {
            isColorfulToggle = false,
            isChild = false,
            isDisabled = false,
            isMobile = false,
            isMobileAbsolute = false,
            type = 'currency',
            hasBorder = true,
            alignLeft = false,
            alignRight = true,
            alignTop = true,
            width = 350,
            height = 500,
            maxHeight,
            coinSize,
            onChange,
            symbolSize,
            symbol = false,
            disableCrypto,
            isFromTrading,
            isBadgeMode,
            isForexMode,
            forexCurrency,
        } = this.props;
        const {
            defaultFiat, defaultFiatSymbol, defaultCrypto, defaultCryptoSymbol, isDefaultCrypto,
        } = this.props[STORE_KEYS.SETTINGSSTORE];

        const isFiat = (type === 'fiat') || (type === 'currency' && !isDefaultCrypto);
        const value = isForexMode ? forexCurrency : isFiat ? defaultFiat : defaultCrypto;

        const refreshHeight = height > (maxHeight - 100) ? (maxHeight - 100) : height;

        return (
            <div
                ref={ref => this.wrapperRef = ref}
                className="dropdown-wrapper btc-wrapper"
                style={this.props.style}
            >
                {isBadgeMode &&
                    <SelectedItem isChild onClick={this.toggleDropDown} size={symbolSize} isColorfulToggle={isColorfulToggle} isWhite={true}>
                        <Fragment>
                            <CurrencyImage src="/img/icon-currency_symbol.png" alt="" width={coinSize} />
                            <CurrencySymbol isFromTrading={isFromTrading}>
                                {isFiat ?
                                    `${defaultFiat} ${defaultFiatSymbol}`:
                                    defaultCryptoSymbol
                                }
                            </CurrencySymbol>
                        </Fragment>
                    </SelectedItem>
                }

                {!isBadgeMode &&
                    <CurrencyText onClick={this.toggleDropDown}>
                        {isFiat ?
                            `${defaultFiat} ${defaultFiatSymbol}`:
                            defaultCryptoSymbol
                        }
                    </CurrencyText>
                }

                {isOpen && (
                    <CurrencyDropdown
                        isChild={isChild}
                        isMobile={isMobile}
                        isMobileAbsolute={isMobileAbsolute}
                        hasBorder={hasBorder}
                        alignLeft={alignLeft}
                        alignRight={alignRight}
                        alignTop={alignTop}
                        w={width}
                        h={refreshHeight}
                        type={type}
                        value={value}
                        toggleDropDown={this.toggleDropDown}
                        isDisabled={isDisabled}
                        onChange={onChange}
                        disableCrypto={disableCrypto}
                        isForexMode={isForexMode}
                    />
                )}
            </div>
        );
    }
}

const enhanced = compose(
    withSafeTimeout,
    inject(
        STORE_KEYS.SETTINGSSTORE,
    ),
    observer
);

export default enhanced(CurrencyDropdownWithSymbol);
