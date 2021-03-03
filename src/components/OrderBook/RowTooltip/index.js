import React, { PureComponent } from 'react';
import { Tooltip } from 'react-tippy';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { getScreenInfo } from '@/utils';
import { STORE_KEYS } from '@/stores';
import TooltipContent from './TooltipContent';

import { Wrapper } from './styles';

const IS_MOBILE = getScreenInfo().isMobileDevice;

const TOOLTIP_OPTIONS = {
    modifiers: {
        preventOverflow: { enabled: true },
        flip: { enabled: true },
        hide: { enabled: false }
    }
};

class RowTooltip extends PureComponent {
    state = {
        isVisible: false
    };

    getTooltipContent = () => {
        const { isBuy, price, exchange, index, total, priceFractionDigits, bestPrice } = this.props;

        return (
            <TooltipContent
                isBuy={isBuy}
                price={price}
                exchange={exchange}
                index={index}
                total={total}
                bestPrice={bestPrice}
                priceFractionDigits={priceFractionDigits}
            />
        );
    };

    render() {
        const { className, children, onClick, onMouseEnter, onMouseLeave } = this.props;

        return (
            <Wrapper onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                <Tooltip
                    arrow
                    unmountHTMLWhenHide
                    animation="fade"
                    position="right"
                    placement="right"
                    theme="bct"
                    className={className}
                    style={{ display: 'flex' }}
                    disabled={IS_MOBILE}
                    html={this.getTooltipContent()}
                    popperOptions={TOOLTIP_OPTIONS}
                >
                    {children}
                </Tooltip>
            </Wrapper>
        );
    }
}

const withStore = compose(
    inject(STORE_KEYS.PRICECHARTSTORE),
    observer,
    withProps(({ [STORE_KEYS.PRICECHARTSTORE]: { price } }) => ({
        bestPrice: price
    }))
);

export default withStore(RowTooltip);
