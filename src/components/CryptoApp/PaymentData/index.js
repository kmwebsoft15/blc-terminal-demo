import React from 'react';

import {
    PaymentDataWrapper,
    CornerTopLeft,
    CornerBottomLeft,
    CornerTopRight,
    CornerBottomRight,
    AmountText,
    AmountTextMid,
    StatusTextTop,
    StatusTextBottom,
    AdditionText,
    RightHighlightText,
    TestText
} from './Components';
var converter = require('number-to-words');

class PaymentData extends React.Component {

    getCornerStyle = (value) => {
        let amount = Math.round(value);
        let os = (/Android/i.test(navigator.userAgent) ? 'android ' : '');
        if(amount < 10) return os + 'usd_1';
        if(amount < 100) return os + 'usd_10';
        if(amount < 1000) return os + 'usd_100';
        if(amount < 10000) return os + 'usd_1000';
        return os + 'usd_10000';
    };

    getAmountStr = (value) => {
        let amount = this.round(value);
        if(amount < 10000) return amount.toString();
        return amount.toLocaleString();
    }

    getAmountText = (value) => {
        let amount = this.round(value);
        if(amount < 2) return `${this.getAdditionText(value)} DOLLAR`;
        if(amount < 1000) return `${this.getAdditionText(value)} DOLLARS`;
        return `${this.getAdditionText(value)} DOLLARS IN USDT`;
    }

    getAmountTextMid = (value) => {
        return this.getAdditionText(value).split('-').join(' ');
    }

    getAdditionText = (value) => {
        let amount = this.round(value);
        if (amount < 100) return converter.toWords(amount).toUpperCase();
        if (amount < 10000) return amount.toString();
        return amount.toLocaleString();
    }

    getStatusText = (value, totalValue, isScanned) => {
        let amount = this.round(value);
        if(isScanned) return 'GET' + amount + 'USDT';
        return 'PAY' + amount + 'USDT';
    }

    round = (value) => {
        return Math.max(Math.round(value), 1);
    }

    render() {
        const {
            amount,
            totalValue,
            isScanned,
            onClose,
        } = this.props;

        const cornerStyle = this.getCornerStyle(amount);
        const amountStr = this.getAmountStr(amount);
        const amountText = this.getAmountText(amount);
        const amountTextMid = this.getAmountTextMid(amount);
        const additionText = this.getAdditionText(amount);
        const statusText = this.getStatusText(amount, totalValue, isScanned);

        return (
            <PaymentDataWrapper id="payment-data-wrapper" billHeight={this.props.billHeight}>
                <CornerTopLeft
                    className={cornerStyle + ' corner-text-len-' + amountStr.length}
                >
                    <span data-text={amountStr}>{amountStr}</span>
                </CornerTopLeft>
                <CornerBottomLeft
                    className={cornerStyle + ' corner-text-len-' + amountStr.length}
                >
                    <span data-text={amountStr}>{amountStr}</span>
                </CornerBottomLeft>
                <CornerTopRight
                    className={cornerStyle + ' corner-text-len-' + amountStr.length}
                >
                    {amount < 1000 ? (
                        <span data-text={amountStr}>{amountStr}</span>
                    ) : (
                        amountStr.split('').map((item, index) =>
                            (amount < 10000 ? (
                                <div
                                    key={'char-rotation-' + index}
                                    className={'char-' + index}
                                >
                                    <span data-text={item}>{item}</span>
                                </div>
                            ) : (
                                <div
                                    key={'char-rotation-' + index}
                                    className={'char-' + index}
                                    style={{
                                        position: 'relative',
                                        display: 'inline-block',
                                        paddingTop: `${80 * ((amountStr.length - 1) / 2 - index) * ((amountStr.length - 1) / 2 - index) / (amountStr.length * amountStr.length)}px`,
                                    }}
                                >
                                    <span data-text={item}>{item}</span>
                                </div>
                            )))
                    )}
                </CornerTopRight>
                <CornerBottomRight
                    className={cornerStyle + ' corner-text-len-' + amountStr.length}
                >
                    {amount < 1000 ? (
                        <span data-text={amountStr}>{amountStr}</span>
                    ) : (
                        amountStr.split('').map((item, index) =>
                            (amount < 10000 ? (
                                <div
                                    key={'char-rotation-' + index}
                                    className={'char-' + index}
                                >
                                    <span data-text={item}>{item}</span>
                                </div>
                            ) : (
                                <div
                                    key={'char-rotation-' + index}
                                    className={'char-' + index}
                                    style={{
                                        position: 'relative',
                                        display: 'inline-block',
                                        paddingTop: `${80 * ((amountStr.length - 1) / 2 - index) * ((amountStr.length - 1) / 2 - index) / (amountStr.length * amountStr.length)}px`,
                                    }}
                                >
                                    <span data-text={item}>{item}</span>
                                </div>
                            )))
                    )}
                </CornerBottomRight>

                <AmountText
                    className={cornerStyle + ' amount-text-len-' + amountText.length}
                >
                    <span data-text={amountText.split(' ').join('   ')}>{amountText.split(' ').join('   ')}</span>
                </AmountText>

                <AmountTextMid
                    className={cornerStyle + (amountTextMid.split(' ').length > 1 ? ' two' : ' amount-text-mid-len-' + amountTextMid.length)}
                >
                    <span data-text={amountTextMid}>{amountTextMid}</span>
                </AmountTextMid>

                {/* <StatusTextTop
                    className={cornerStyle}
                >
                    {statusText}
                </StatusTextTop> */}
                <StatusTextBottom
                    className={cornerStyle}
                >
                    {statusText}
                </StatusTextBottom>

                {Math.round(amount) >= 10 && Math.round(amount) < 100 && (
                    <CornerTopLeft
                        className={cornerStyle + ' highlight-text'}
                    >
                        <span className={'detail-' + additionText.length}>{additionText}</span>
                    </CornerTopLeft>
                )}
                {Math.round(amount) >= 10 && Math.round(amount) < 100 && (
                    <CornerBottomLeft
                        className={cornerStyle + ' highlight-text'}
                    >
                        <span className={'detail-' + additionText.length}>{additionText}</span>
                    </CornerBottomLeft>
                )}
                {Math.round(amount) < 10 && (
                    <RightHighlightText className={'top right-highlight-' + additionText.length}>
                        {
                            additionText.split('').map((item, index) =>
                                <div
                                    key={'char-rotation-' + index}
                                    className={'right-highlight-len-' + index}
                                >
                                    <span>{item}</span>
                                </div>)
                        }
                    </RightHighlightText>
                )}
                {Math.round(amount) < 10 && (
                    <RightHighlightText className={'bottom right-highlight-' + additionText.length}>
                        {
                            additionText.split('').map((item, index) =>
                                <div
                                    key={'char-rotation-' + index}
                                    className={'right-highlight-len-' + index}
                                >
                                    <span>{item}</span>
                                </div>)
                        }
                    </RightHighlightText>
                )}
                {Math.round(amount) < 10 && (<AdditionText className={cornerStyle + ' addition-text top'}><span>{additionText}</span></AdditionText>)}
                {Math.round(amount) < 10 && (<AdditionText className={cornerStyle + ' addition-text bottom'}><span>{additionText}</span></AdditionText>)}
                {(Math.round(amount) < 10 || (Math.round(amount) >= 100 && Math.round(amount) < 1000)) && (<AdditionText className={cornerStyle + ' addition-text left-top'}><span>{additionText}</span></AdditionText>)}
                {(Math.round(amount) < 10 || (Math.round(amount) >= 100 && Math.round(amount) < 1000)) && (<AdditionText className={cornerStyle + ' addition-text left-bottom'}><span>{additionText}</span></AdditionText>)}
                {Math.round(amount) < 10 && (<AdditionText className={cornerStyle + ' addition-text right-top'}><span>{additionText}</span></AdditionText>)}
                {Math.round(amount) < 10 && (<AdditionText className={cornerStyle + ' addition-text right-bottom'}><span>{additionText}</span></AdditionText>)}

                <TestText style={{ fontFamily: 'ARB-187 Modern Caps' }}>Test</TestText>
                <TestText style={{ fontFamily: 'Century Ultra Condensed' }}>Test</TestText>
                <TestText style={{ fontFamily: 'Bernard MT Condensed' }}>Test</TestText>
                <TestText style={{ fontFamily: 'Europa Grotesque Extra Bold' }}>Test</TestText>
                <TestText style={{ fontFamily: 'Federal Regular' }}>Test</TestText>
                <TestText style={{ fontFamily: 'Tungsten Medium' }}>Test</TestText>
                <TestText style={{ fontFamily: 'Caslon RR Regular ExtraCond Outline' }}>Test</TestText>
                <TestText style={{ fontFamily: 'Caslon RR Regular ExtraCond Diagonal' }}>Test</TestText>
            </PaymentDataWrapper>
        );
    }
}

export default PaymentData;