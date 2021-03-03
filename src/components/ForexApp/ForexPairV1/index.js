import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import { withSafeTimeout, withSafeInterval } from '@hocs/safe-timers';

import { STORE_KEYS } from '@/stores';
import { STATE_KEYS } from '@/stores/ConvertStore';
import { getScreenInfo } from '@/utils';
import { SwipArrowIcon } from '@/components-generic/ArrowIcon'
import ExchDropdown from './ExchDropdownRV';
import { currencyList } from '@/components-generic/CurrencyDropdown/currencies';

import StyleWrapper from './style';

class ForexPairV1 extends React.Component {
    state = {
        isDefaultMode: true,
        amount: '',
        isAmtInputFocused: false,
        isAmtChangedAfterFocus: false,
        isOpenLeftList: false,
        isOpenRightList: false,
        isCoinPairInversed: false,
    };

    toggleLeftList = () => {
        this.setState(prevState => ({
            isOpenLeftList: !prevState.isOpenLeftList,
        }));
    };

    toggleRightList = () => {
        this.setState(prevState => ({
            isOpenRightList: !prevState.isOpenRightList,
        }));
    };

    toggleSwap = () => {
        const {
            [STORE_KEYS.SETTINGSSTORE]: { accessLevel, },
        } = this.props;
        if (accessLevel && accessLevel !== 'Level 1') {
            this.setState(prevState => ({
                isCoinPairInversed: !prevState.isCoinPairInversed,
            }));
        }
    }

    onChangeForexCurrency = coinName => {
        const { [STORE_KEYS.FOREXSTORE]: { setForexCurrency, setForexCurrencySymbol } } = this.props;
        setForexCurrency(coinName);
        const currency = currencyList.find(c => c.code === coinName.replace('F:', ''));
        if (currency) {
            setForexCurrencySymbol(currency.symbol);
        }
    };

    changeMode = () => {
        this.setState(prevState => ({
            isDefaultMode: !prevState.isDefaultMode,
        }));
    };

    render() {
        const {
            [STORE_KEYS.CONVERTSTORE]: { convertState },
            [STORE_KEYS.SETTINGSSTORE]: { defaultFiat },
            [STORE_KEYS.MODALSTORE]: { open: modalOpened },
            [STORE_KEYS.FOREXSTORE]: {
                forexCurrency, forexUSDT, forexInput, setForexInput,
            },
            isSimple,
            isHidden,
        } = this.props;

        const {
            isDefaultMode,
            isOpenLeftList,
            isOpenRightList,
            isCoinPairInversed,
        } = this.state;

        const {
            gridHeight,
        } = getScreenInfo(true);

        return (
            <StyleWrapper
                modalOpened={modalOpened}
                gridHeight={gridHeight}
                isSimple={isSimple}
                isHidden={isHidden}
                isCoinPairInversed={isCoinPairInversed}
            >
                <div
                    className={'coin-pair-form-inner-wrapper' + (convertState !== STATE_KEYS.coinSearch ? ' open' : '')}
                >
                    <div className="exch-head">
                        <div className="exch-head__coin-pair">
                            <div className="exch-head__send">
                                <ExchDropdown
                                    value={isDefaultMode ? forexCurrency : 'USDT'}
                                    amount={isDefaultMode ? forexInput : forexUSDT}
                                    onChangeAmount={setForexInput}
                                    onChange={isDefaultMode ? this.onChangeForexCurrency : null}
                                    isLeft
                                    isDefaultMode={isDefaultMode}
                                    onClick={() => {}}
                                    mainItems={[]}
                                    defaultFiat={defaultFiat}
                                    isOpen={isOpenLeftList}
                                    toggleDroplist={this.toggleLeftList}
                                />
                            </div>

                            <button
                                className="exch-head__switch"
                                onClick={this.changeMode}
                            >
                                <SwipArrowIcon />
                            </button>

                            <div className="exch-head__get">
                                <ExchDropdown
                                    value={!isDefaultMode ? forexCurrency : 'USDT'}
                                    amount={!isDefaultMode ? forexInput : forexUSDT}
                                    onChangeAmount={null}
                                    onChange={!isDefaultMode ? this.onChangeForexCurrency : null}
                                    isLeft={false}
                                    isDefaultMode={isDefaultMode}
                                    onClick={() => {}}
                                    mainItems={[]}
                                    defaultFiat={defaultFiat}
                                    isOpen={isOpenRightList}
                                    toggleDroplist={this.toggleRightList}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </StyleWrapper>
        );
    }
}

const enhanced = compose(
    withSafeTimeout,
    withSafeInterval,
    inject(
        STORE_KEYS.CONVERTSTORE,
        STORE_KEYS.ORDERENTRY,
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.MODALSTORE,
        STORE_KEYS.FOREXSTORE,
    ),
    observer,
);

export default enhanced(ForexPairV1);
