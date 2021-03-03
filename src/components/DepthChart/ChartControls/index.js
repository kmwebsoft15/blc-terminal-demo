import React, { memo, Fragment } from 'react';

import { getScreenInfo, format2DigitString } from '@/utils';

import { Container, PriceWrapper, Price, Label, ZoomButton, FlexWrapper, ArbLabel } from './styles';

import minus from './icons/minus.svg';
import plus from './icons/plus.svg';

const ChartControls = memo(({ midPrice, onZoom, plusDisabled, minusDisabled, quoteSymbol, isArbitrage }) => {
    if (!midPrice) {
        return null;
    }

    const { isMobileDevice, isMobilePortrait } = getScreenInfo();

    return (
        <Container>
            <FlexWrapper>
                <ZoomButton
                    src={minus}
                    type="out"
                    alt="Zoom out"
                    isMobile={isMobileDevice && !isMobilePortrait}
                    disabled={minusDisabled}
                    onClick={() => !minusDisabled && onZoom('out')}
                />
                <PriceWrapper isArbitrage={isArbitrage}>
                    {!isArbitrage && (
                        <Fragment>
                            <Label>Mid Price</Label>
                            <Price>{`${quoteSymbol}${format2DigitString(midPrice, 6)}`}</Price>
                        </Fragment>
                    )}
                    {isArbitrage && <ArbLabel>ARB</ArbLabel>}
                </PriceWrapper>
                <ZoomButton
                    src={plus}
                    type="in"
                    alt="Zoom in"
                    isMobile={isMobileDevice && !isMobilePortrait}
                    disabled={plusDisabled}
                    onClick={() => !plusDisabled && onZoom('in')}
                />
            </FlexWrapper>
        </Container>
    );
});

export default ChartControls;
