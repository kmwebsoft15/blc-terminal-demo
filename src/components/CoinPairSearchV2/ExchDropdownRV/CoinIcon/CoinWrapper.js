import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { Tooltip } from 'react-tippy';

import { STORE_KEYS } from '../../../../stores';
import { formatStringForMKTCAP, highlightSearchDom } from '../../../../utils';
import CoinIcon from './index';
import CoinNameSmall from '../CoinName/CoinNameSmall';
import {
    Wrapper,
    DropdownWrapper,
    InfoIcon,
    InfoWrapper,
    CoinIconWrapper
} from './Components';
import COIN_DATA_MAP from '../../../../mock/coin-data-map';

import imgIconFacebook from './icon-facebook.svg';
import imgIconTwitter from './icon-twitter.svg';
import imgIconTelegram from './icon-telegram.svg';
import imgIconReddit from './icon-reddit.svg';
import imgIconDiscord from './icon-discord.svg';
import imgIconYoutube from './icon-youtube.svg';
import imgIconInstagram from './icon-instagram.svg';
import imgIconGithub from './icon-github.svg';

class CoinWrapper extends React.Component {
    state = {
        isOpened: false,
        isIconOver: false,
    };

    getSocialLinkItems = () => {
        const { value } = this.props;

        let socialInfo = [];
        if (COIN_DATA_MAP[value] === undefined) {
            socialInfo = [];
        } else {
            socialInfo = COIN_DATA_MAP[value].social_info;
        }

        const socialLinkItems = [];
        for (let i = 0; i < socialInfo.length; i++) {
            const splitArray = socialInfo[i].split('//');
            const domainArray = splitArray[1].split('/');
            const title = domainArray[0].split('.');

            let toolTip = '';
            if (title.length === 3) {
                toolTip = title[1];
            } else if (title.length === 2) {
                toolTip = title[0];
            }

            let imgSrc = 'SocialLinks/' + domainArray[0] + '.png';
            if (socialInfo[i].indexOf('https://facebook.com') !== -1 || socialInfo[i].indexOf('https://www.facebook.com') !== -1) {
                imgSrc = imgIconFacebook;
            } else if (socialInfo[i].indexOf('https://twitter.com') !== -1 || socialInfo[i].indexOf('https://www.twitter.com') !== -1) {
                imgSrc = imgIconTwitter;
            } else if (socialInfo[i].indexOf('https://discord.com') !== -1 || socialInfo[i].indexOf('https://www.discord.com') !== -1) {
                imgSrc = imgIconDiscord;
            } else if (socialInfo[i].indexOf('https://github.com') !== -1 || socialInfo[i].indexOf('https://www.github.com') !== -1) {
                imgSrc = imgIconGithub;
            } else if (socialInfo[i].indexOf('https://telegram.org') !== -1 || socialInfo[i].indexOf('https://www.telegram.org') !== -1) {
                imgSrc = imgIconTelegram;
            } else if (socialInfo[i].indexOf('https://reddit.com') !== -1 || socialInfo[i].indexOf('https://www.reddit.com') !== -1) {
                imgSrc = imgIconReddit;
            } else if (socialInfo[i].indexOf('https://youtube.com') !== -1 || socialInfo[i].indexOf('https://www.youtube.com') !== -1) {
                imgSrc = imgIconYoutube;
            } else if (socialInfo[i].indexOf('https://instagram.com') !== -1 || socialInfo[i].indexOf('https://www.instagram.com') !== -1) {
                imgSrc = imgIconInstagram;
            }

            socialLinkItems.push(
                <a
                    href={socialInfo[i]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={toolTip}
                    title={toolTip}
                    key={i}
                >
                    <img className="img-icon" alt="" src={imgSrc} />
                </a>
            );
        }

        return socialLinkItems;
    };

    showInfoIcon = (mode) => () => {
        this.setState({ isIconOver: mode });
    }

    openCoinInfo = (mode) => (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        this.setState({ isOpened: mode, isIconOver: mode });
    }

    render() {
        const { isOpened, isIconOver } = this.state;
        const {
            width,
            height,
            isLeft,
            isLeftDirection,
            value,
            defaultFiat,
            OrderEventsData,
            baseSymbol: selectedBase,
            quoteSymbol: selectedQuote,
            RouterCoin,
            getDefaultPrice,
            toggleDropdown,
        } = this.props;
        const activeCoin = isLeft ? selectedBase : selectedQuote;

        let isForceOpened = false;
        if (selectedBase === RouterCoin && isLeft) {
            isForceOpened = true;
        }

        let marketCap = 0;
        let volume24h = 0;
        for (let [key, data] of OrderEventsData) {
            if (data.Coin === activeCoin && data.Price) {
                marketCap = data.Marketcap;
                volume24h = data.Volume24h;
            }
        }

        return (
            <Wrapper
                width={width}
                height={height}
                onMouseLeave={this.openCoinInfo(false)}
                onClick={toggleDropdown}
            >
                <CoinIconWrapper isLeft={isLeftDirection}>
                    <div
                        onMouseOver={this.openCoinInfo(true)}
                        onMouseLeave={this.showInfoIcon(false)}
                        onClick={this.openCoinInfo(true)}
                    >
                        {isIconOver
                            ? <Tooltip
                                disabled={!COIN_DATA_MAP[value]}
                                arrow={true}
                                animation="shift"
                                position="left"
                                followCursor
                                theme="bct"
                                title={COIN_DATA_MAP[value] ? highlightSearchDom(COIN_DATA_MAP[value]).name : ''}
                            >
                                <InfoIcon className="info-icon-wrapper" />
                            </Tooltip>
                            : <CoinIcon
                                value={value}
                                defaultFiat={defaultFiat}
                            />
                        }
                        
                    </div>
                    <CoinNameSmall value={value} isMobile={false} defaultFiat={defaultFiat} />
                </CoinIconWrapper>
                {(isForceOpened || isOpened) && (
                    <DropdownWrapper isLeft={isLeftDirection}>
                        <InfoWrapper>
                            <div className="market-cap-info">Market Cap:
                                $<span>{formatStringForMKTCAP(getDefaultPrice(marketCap, activeCoin))}</span>
                            </div>
                            <div>24h Volume:
                                $<span>{formatStringForMKTCAP(getDefaultPrice(volume24h, activeCoin))}</span>
                            </div>
                        </InfoWrapper>
                        <div className="social-link-list">
                            {this.getSocialLinkItems()}
                        </div>
                    </DropdownWrapper>
                )}
            </Wrapper>
        );
    }
}

export default compose(
    inject(
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.INSTRUMENTS,
        STORE_KEYS.SETTINGSSTORE,
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.YOURACCOUNTSTORE]: {
                OrderEventsData,
            },
            [STORE_KEYS.INSTRUMENTS]: {
                selectedInstrumentPair: [baseSymbol, quoteSymbol],
                RouterCoin,
            },
            [STORE_KEYS.SETTINGSSTORE]: {
                getDefaultPrice,
            },
        }) => ({
            OrderEventsData,
            baseSymbol,
            quoteSymbol,
            RouterCoin,
            getDefaultPrice,
        })
    )
)(CoinWrapper);
