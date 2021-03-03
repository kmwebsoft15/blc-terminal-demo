import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { STORE_KEYS } from '../../../stores';
import { STATE_KEYS } from '../../../stores/ConvertStore';

class CoinSwap extends Component {
    state = {
        isClicked: false,
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.wrapperRef && this.wrapperRef.contains && this.wrapperRef.contains(event.target)) {
            const {
                [STORE_KEYS.CONVERTSTORE]: { convertState },
                [STORE_KEYS.VIEWMODESTORE]: { setGraphSwitchMode },
            } = this.props;
            if (convertState === STATE_KEYS.amtInput) {
                setGraphSwitchMode(!this.state.isClicked);
                this.setState(prevState => ({
                    isClicked: !prevState.isClicked,
                }));
            }
        }
    };

    handleFocus = () => {
        const {
            [STORE_KEYS.CONVERTSTORE]: convertStore,
            [STORE_KEYS.VIEWMODESTORE]: viewModeStore,
        } = this.props;
        // if (convertStore.convertState === STATE_KEYS.amtInput) {
        viewModeStore.setGraphSwitchMode(true);
        // }
    };

    handleBlur = () => {
        const {
            [STORE_KEYS.VIEWMODESTORE]: viewModeStore,
        } = this.props;
        if (!this.state.isClicked) {
            viewModeStore.setGraphSwitchMode(false);
        }
    };

    render() {
        const { isShortSell, isSwapMode, isCoinPairInversed } = this.props;
        return (
            <div
                // ref={ref => this.wrapperRef = ref}
                className={isShortSell ? 'exch-form__sep' : 'exch-form__sep shortsell'}
                // onMouseEnter={this.handleFocus}
                // onMouseLeave={this.handleBlur}
                onClick={this.handleClick}
            >
                {
                    (isShortSell || isSwapMode) ? (
                        <svg className="exch-form__switch-arrows" viewBox="0 0 1400 980">
                            <g className="arrow_top" strokeMiterlimit="10" strokeWidth="10" transform="matrix(188.16722106933594, 0, 0, 188.16722106933594, 425.3118591308594, 57.448905944824226)">
                                <g transform="translate(0 -294.35)">
                                    <g transform="matrix(.0064849 0 0 .0064849 3.9451 294.35)">
                                        <g transform="matrix(149.4 0 0 154.2 -907.11 -45390)">
                                            <g transform="matrix(.0064849 0 0 .0064849 3.9451 294.35)">
                                                <path d="M 204 306 L -300 306 L -300 102 L 204 102 L 204 0 L 458 204 L 204 408 Z" />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                            <g className="arrow_bottom" strokeMiterlimit="10" strokeWidth="10" transform="matrix(-188.16722106933594, 0, 0, 188.16722106933594, 978.9641723632811, 429.2027282714843)">
                                <g transform="translate(0 -294.35)">
                                    <g transform="matrix(.0064849 0 0 .0064849 3.9451 294.35)">
                                        <g transform="matrix(149.4 0 0 154.2 -907.11 -45390)">
                                            <g transform="matrix(.0064849 0 0 .0064849 3.9451 294.35)">
                                                <path d="M 204 306 L -300 306 L -300 102 L 204 102 L 204 0 L 458 204 L 204 408 Z"/>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    ) : (
                        <svg className="exch-form__switch-arrows" viewBox="0 0 1400 980">
                            <g className="arrow_top" strokeMiterlimit="10" strokeWidth="10" transform="matrix(188.16722106933594, 0, 0, 188.16722106933594, 425.3118591308594, 57.448905944824226)">
                                <g transform="translate(0 -294.35)">
                                    <g transform="matrix(.0064849 0 0 .0064849 3.9451 294.35)">
                                        <g transform="matrix(149.4 0 0 154.2 -907.11 -45390)">
                                            <g transform="matrix(.0064849 0 0 .0064849 3.9451 294.35)">
                                                <path d="M 204 306 L -300 306 L -300 102 L 204 102 L 204 0 L 458 204 L 204 408 Z" />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                            <g className="arrow_bottom" strokeMiterlimit="10" strokeWidth="10" transform="matrix(-188.16722106933594, 0, 0, 188.16722106933594, 978.9641723632811, 429.2027282714843)">
                                <g transform="translate(0 -294.35)">
                                    <g transform="matrix(.0064849 0 0 .0064849 3.9451 294.35)">
                                        <g transform="matrix(149.4 0 0 154.2 -907.11 -45390)">
                                            <g transform="matrix(.0064849 0 0 .0064849 3.9451 294.35)">
                                                <path d="M 204 306 L -300 306 L -300 102 L 204 102 L 204 0 L 458 204 L 204 408 Z"/>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    )
                }
                <span className="type-label">{isCoinPairInversed ? 'BUY' : 'SELL'}</span>
            </div>
        );
    }
}
export default inject(
    STORE_KEYS.VIEWMODESTORE,
    STORE_KEYS.CONVERTSTORE
)(observer(CoinSwap));
