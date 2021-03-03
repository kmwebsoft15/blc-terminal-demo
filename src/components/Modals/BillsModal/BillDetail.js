import React, { Fragment } from 'react';
import ClipboardJS from 'clipboard';
import { Tooltip } from 'react-tippy';

import {
    unifyDigitString,
    getDenoSymbol,
    getUpperLowerValue,
    customDigitFormat
} from '@/utils';
import {
    BillWrapper,
    BillBGImg,
    BillContent,
    PriceSection,
    PriceValue,
    PriceInfo,
    SignSection,
    WaterMark,
    CoinIconWrapper,
    QRWrapperLeft,
    QRWrapperRight,
    Code,
    DetailsWrapper,
    DetailsContent,
    PrivateAddress,
    PublicAddress,
    Issue,
    Balance,
    QRLabelLeft,
    QRLabelRight,
    PriceLabel,
    PublicAddressWrapper,
    InputWrapper,
    InputAddon,
    CheckIcon,
    CopyIcon,
    InputTextarea,
    convertLevel,
    DepositLabel
} from './ChipComponents';
import CoinIcon from '../../CoinPairSearchV2/ExchDropdownRV/CoinIcon';

const colors = [
    '#2f6c7e',
    '#2f6c7e',
    '#2f6c7e',
    '#51477c',
    '#2f4e84',
    '#265e83',
    '#2f6c7e',
    '#3d857f',
    '#428d72',
    '#7a9979',
    '#c3ab6f',
    '#c2ac6f',
    '#ac4e35',
    '#2f6c7e',
    '#2f6c7e',
    '#2f6c7e'
];

class BillDetail extends React.Component {
    state = {
        depositAddressCopied: false,
    };

    componentDidMount() {
        if (this.props.isDeposit) {
            this.clipboard = new ClipboardJS('#chip_deposit_address');
            this.clipboard.on('success', () => {
                // self.props.copy();
            });
        }
    }

    handleClickCopy = (e) => {
        e.stopPropagation();
        if (this.depositAddressRef) {
            this.depositAddressRef.focus();
            this.depositAddressRef.select();
        }
        this.setState({
            depositAddressCopied: true,
        });
    };

    render() {
        const {
            width,
            height,
            symbol,
            hoverable = true,
            disabled = false,
            deno,
            isOpened,
            isDeposit,
            publicAddress = '1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX',
            serial = '',
            depositBalance,
            level,
            estFilled,
            estTotal,
            isDefaultCrypto,
        } = this.props;

        let newWidth = Math.floor(height * 3192 / 1800);
        let newHeight = height;
        if (newWidth > width) {
            newWidth = width;
            newHeight = Math.floor(width * 1800 / 3192);
        }

        const { unit, unitSymbol } = getDenoSymbol(deno);

        const privateAddress = '1Usd9f29fjsAVs2si4d3f553e121aa5uu55saf';
        const issue = '9cfbc6fb-2ba0-4f7c-b707-4bb87d5ff79e';

        let black = false;
        if (level === 9 || level === 10 || level === 11 || isDeposit) {
            black = true;
        }

        let fontStyle = 'normal';
        if (deno < 0) {
            fontStyle = 'stroke';
        }

        const color = isDeposit ? '#454746' : colors[level];
        const detailBalance = (deno > 3)
            ? unifyDigitString(Math.pow(10, deno))
            : (deno > -4)
                ? Math.pow(10, deno).toFixed(3)
                : (1 / Math.pow(10, -deno)).toFixed(-deno);

        const balance = depositBalance || (isDefaultCrypto ? estFilled : estTotal);

        const { upper, lower } = getUpperLowerValue(balance);
        const priceUnit = isDeposit ? upper : unifyDigitString(unit);
        const digit = lower.toString().substr(0, 4);
        const length = lower.length === 3 || priceUnit === '0';

        const depositBalanceStr = (unifyDigitString(balance) === '0') ? '0.00' : customDigitFormat(balance, 6);
        // Prevent URL pointing non supported images
        // We have 1-10 images atm, need all 16 level images.
        const srcUrl = `./img/bills/bill_${isDeposit ? 11 : convertLevel(level)}.png`

        return (
            <BillWrapper
                width={newWidth}
                height={newHeight}
                disabled={disabled}
                isOpened={isOpened}
                hoverable={hoverable}
                onClick={this.props.onClick}
            >
                <BillBGImg src={srcUrl} />
                <BillContent>
                    {isDeposit && (
                        <DepositLabel>{`Deposit ${symbol}`}</DepositLabel>
                    )}

                    <QRWrapperLeft disabled={disabled}>
                        {isDeposit ? (
                            <Tooltip
                                arrow
                                animation="shift"
                                position="bottom"
                                followCursor
                                theme="bct"
                                html={
                                    <div style={{ maxWidth: 200, textAlign: 'center' }}>
                                        {isDeposit && (
                                            <div>
                                                Whitelisted Recipient
                                                    <br />
                                            </div>
                                        )}
                                        This is your Public Key.
                                            <br />
                                        It is the only recipient from cold storage.
                                        </div>
                                }
                                distance={30}
                            >
                                <div>
                                    <Code
                                        value={publicAddress}
                                        size={150}
                                        level="L"
                                        includemargin="true"
                                        renderAs="svg"
                                        logo="/img/qr_logo.png"
                                        color={color}
                                    />
                                </div>
                            </Tooltip>
                        ) : (
                                <Code
                                    value={publicAddress}
                                    size={150}
                                    level="L"
                                    includemargin="true"
                                    renderAs="svg"
                                    logo="/img/qr_logo.png"
                                    color={color}
                                />
                            )}


                        {!disabled && (
                            <QRLabelLeft isDeposit={isDeposit}>
                                {isDeposit ? (
                                    <Fragment>
                                        <PublicAddressWrapper>
                                            <InputWrapper
                                                onClick={this.handleClickCopy}
                                                color={this.state.depositAddressCopied ? 'green' : ''}
                                            >
                                                <InputTextarea
                                                    value={publicAddress}
                                                    id="chip_deposit_address"
                                                    readOnly
                                                    onClick={this.handleClickCopy}
                                                    ref={ref => this.depositAddressRef = ref}
                                                />
                                                <InputAddon>
                                                    {this.state.depositAddressCopied
                                                        ? <CheckIcon fill="green" />
                                                        : <CopyIcon />
                                                    }
                                                </InputAddon>
                                            </InputWrapper>
                                        </PublicAddressWrapper>
                                    </Fragment>
                                ) : publicAddress}
                            </QRLabelLeft>
                        )}
                    </QRWrapperLeft>

                    <QRWrapperRight>
                        {isDeposit ? (
                            <QRLabelRight>Whitelisted wallet private key</QRLabelRight>
                        ) : (
                                <QRLabelRight>Cold wallet private key</QRLabelRight>
                            )}

                        <Code
                            value={privateAddress}
                            size={150}
                            level="L"
                            includemargin="true"
                            renderAs="svg"
                            logo="/img/qr_logo.png"
                        />
                    </QRWrapperRight>

                    <WaterMark>
                        <CoinIconWrapper color={color} isDeposit={isDeposit}>
                            <CoinIcon
                                showTether
                                value={symbol}
                            />
                        </CoinIconWrapper>
                        <CoinIconWrapper color={color} isDeposit={isDeposit}>
                            <CoinIcon
                                showTether
                                value={symbol}
                            />
                        </CoinIconWrapper>
                    </WaterMark>

                    <PriceSection black={black}>
                        <PriceValue fontStyle={fontStyle} black={black}>{priceUnit}</PriceValue>
                        <PriceInfo fontStyle={fontStyle} black={black} length={length}>
                            <div className="symbol">{symbol}</div>
                            <div className="unit">{isDeposit ? (lower === '.0' || lower === '' ? (priceUnit === '0' ? '.00' : '') : digit) : unitSymbol}</div>
                            {/* <div className="address">{publicAddress}</div> */}
                        </PriceInfo>
                    </PriceSection>

                    <SignSection level={convertLevel(level) - 1} isDeposit={isDeposit} black={black}>
                        <img src={`/img/bills/signature/${isDeposit ? 10 : convertLevel(level) - 1}.png`} alt="" />
                        <div>VIRES IN NUMERIS</div>
                    </SignSection>

                    {!disabled && (
                        <DetailsWrapper>
                            <CoinIcon
                                showTether
                                value={symbol}
                            />

                            <DetailsContent>
                                <Balance>
                                    {`${symbol} ${isDeposit ? depositBalanceStr : (detailBalance === '0' ? '0.00' : customDigitFormat(detailBalance, 6))}`}
                                </Balance>
                                {!disabled && <PrivateAddress>{privateAddress}</PrivateAddress>}
                                <Issue>{`ISSUE: ${isDeposit ? issue : serial}`}</Issue>
                                {!isDeposit && (
                                    <PriceLabel isDeposit={isDeposit}>Whitelisted recipient</PriceLabel>
                                )}
                                {!isDeposit && (
                                    <PublicAddress isDeposit={isDeposit}>{publicAddress}</PublicAddress>
                                )}
                                {disabled && <span className="specimen-label">Specimen</span>}
                            </DetailsContent>
                        </DetailsWrapper>
                    )}
                </BillContent>
            </BillWrapper>
        );
    }
}

export default BillDetail;
