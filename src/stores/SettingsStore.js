import { action, observable, reaction } from 'mobx';
import debounce from 'lodash/debounce';

import {
    GetSettingsRequest,
    UpdateSettingsRequest
} from '../lib/bct-ws';
import { languages } from '../lib/translations/languages';
import { capitalizeFirstLetter } from '../utils';
import { mockCountries } from '../mock/countries';
import { currencyList } from '../components-generic/CurrencyDropdown/currencies';

export const autoConvertOptions = {
    Off: 'Off',
    Partial: 'Partial',
    All: 'All',
};

class SettingsStore {
    @observable isRealTrading = false;
    @observable portfolioIncludesBct = false;
    @observable isGoogle2FA = false;
    @observable isEmail2FA = false;
    @observable isArbitrageMode = false;
    @observable privateVpn = false;
    @observable isShortSell = false;
    @observable tradingHistory = false;
    @observable accessLevel = 'Level 1';
    @observable language = '';

    @observable defaultFiat = '';
    @observable defaultFiatSymbol = '';
    @observable currentFiatPrice = 1;
    @observable defaultCrypto = '';
    @observable defaultCryptoSymbol = '';
    @observable defaultCryptoPrice = 0;
    @observable isDefaultCrypto = false;

    @observable defaultTelegram = '';
    @observable defaultURL = '';
    @observable referredBy = 'shaunmacdonald';
    @observable referCount = 0;
    @observable affiliateLink = '';
    @observable countries = [];
    @observable currencies = [];
    @observable historyData = [];
    @observable price = 1;

    @observable defaultCryptoAmount = 0.33;
    @observable marginTrading = 0;
    @observable autoPaybackBct = false;

    @observable isExporting = false;

    @observable isAutoConvert = autoConvertOptions.Off;
    @observable swap = 'Convert';
    @observable c1 = 'All Coins';
    @observable c2 = 'USDT';
    @observable autoFlip = 'Auto Flip';
    @observable slider = 'Best Execution';
    @observable timer = 30;
    @observable timerAfter = 'After 2 transactions';

    @observable tradeColStatus = 'open';
    @observable sidebarStatus = 'open';

    @observable withdrawAddress = '';
    @observable defaultForex = '';

    isLoggedIn = false;
    PortfolioData = null;
    isHistoryUpdate = false;

    constructor(telegramStore, yourAccountStore) {
        this.isLoggedIn = localStorage.getItem('authToken');

        reaction(
            () => telegramStore.isLoggedIn,
            (isLoggedIn) => {
                this.isLoggedIn = isLoggedIn;
                if (this.isLoggedIn) {
                    this.setShortSellWith(false);
                    this.setArbitrageModeWith(false);

                    // Get settings from backend after login
                    this.getSettingsFromWs();
                }
            }
        );

        reaction(
            () => yourAccountStore.PortfolioData,
            (PortfolioData) => {
                this.PortfolioData = PortfolioData;
                this.updateDefaultCryptoPrice();
            }
        );

        const language = (window.navigator.languages && window.navigator.languages[0] || window.navigator.language).toLowerCase();
        languages.forEach(lang => {
            if (language === (lang.code || lang.key)) {
                this.language = lang.value;
            }
        });
        if (!this.language) {
            this.language = 'English';
        }

        // Load LocalStorage first
        this.loadLocalStorage();

        // Get settings from backend when app starts
        if (this.isLoggedIn) {
            this.getSettingsFromWs();
        }

        this.mustConditions();

        this.fetchPrice();

        setInterval(this.fetchPrice, 2 * 60 * 60 * 1000);
    }

    updateDefaultCryptoPrice() {
        if (this.PortfolioData) {
            for (let i = 0; i < this.PortfolioData.length; i++) {
                if (this.PortfolioData[i] && this.PortfolioData[i].Name === this.defaultCrypto) {
                    this.defaultCryptoSymbol = this.PortfolioData[i].Coin.replace('F:', '');
                    this.defaultCryptoPrice = this.PortfolioData[i].Price || 0;
                    break;
                }
            }
        }
    }

    fetchPrice = async () => {
        if (process.env.NODE_ENV === 'production') {
            const url = '/price';

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    this.countries = data;

                    this.updatePrice();
                })
                .catch(console.log);
        } else {
            this.countries = mockCountries;

            this.updatePrice();
        }
    };

    updatePrice = () => {
        if (this.countries && this.countries.length > 0) {
            this.currencies = [];
            this.countries.forEach(country => {
                const currency = this.currencies.find(currency => currency.currencyCode === country.currencyCode);
                if(!currency) {
                    const item = currencyList.find(c => c.code === country.currencyCode);
                    if(item) {
                        this.currencies.push({
                            currency: country.currency,
                            currencyCode: country.currencyCode,
                            price: country.price,
                            symbol: item.symbol,
                        });
                    }
                }
            });

            if (!this.defaultFiat) {
                const language = languages.find(lang => lang.value === this.language);
                if (language) {
                    const langCode = language.code || language.key;
                    const country = this.countries.find(country => langCode === country.langCode);
                    if (country) {
                        this.defaultFiat = country.currencyCode;
                    }
                }
            }

            if (!this.defaultFiat) {
                this.defaultFiat = 'USD';
                this.defaultFiatSymbol = '$';
            }

            const country = this.countries.find(country => country.currencyCode === this.defaultFiat);
            if (country) {
                this.price = country.price;
            } else {
                this.price = 0;
            }
            // exception
            if (this.defaultFiat === 'BMD') {
                this.price = 1;
            }

            const currency = currencyList.find(c => c.code === this.defaultFiat);
            if (currency) {
                this.defaultFiatSymbol = currency.symbol;
            }
        }
    };

    mustConditions = () => {
        // Some must met conditions
        // this.setShortSellWith(false);

        if (!this.isLoggedIn) {
            this.setArbitrageModeWith(false);
        }

        if (this.isRealTrading) {
            this.setShortSellWith(false);
        }

        this.setIsDefaultCrypto(false);
    };

    getSettingsFromWs = () => {
        GetSettingsRequest()
            .then(data => {
                if (data && data.Settings) {
                    this.isRealTrading = data.Settings.realTrading != null
                        ? data.Settings.realTrading
                        : this.isRealTrading;
                    localStorage.setItem('isRealTrading', this.isRealTrading.toString());
                    this.portfolioIncludesBct = data.Settings.portfolioIncludesBct != null
                        ? data.Settings.portfolioIncludesBct
                        : this.portfolioIncludesBct;
                    localStorage.setItem('portfolioIncludesBct', this.portfolioIncludesBct.toString());
                    this.isGoogle2FA = data.Settings.isGoogle2FA != null
                        ? data.Settings.isGoogle2FA
                        : this.isGoogle2FA;
                    localStorage.setItem('isGoogle2FA', this.isGoogle2FA.toString());
                    this.isEmail2FA = data.Settings.isEmail2FA != null
                        ? data.Settings.isEmail2FA
                        : this.isEmail2FA;
                    localStorage.setItem('isEmail2FA', this.isEmail2FA.toString());
                    this.isArbitrageMode = data.Settings.arbitrageMode != null
                        ? data.Settings.arbitrageMode
                        : this.isArbitrageMode;
                    localStorage.setItem('isArbitrageMode', this.isArbitrageMode.toString());
                    this.privateVpn = data.Settings.privateVpn != null
                        ? data.Settings.privateVpn
                        : this.privateVpn;
                    localStorage.setItem('privateVpn', this.privateVpn.toString());
                    this.isShortSell = data.Settings.shortSelling != null
                        ? data.Settings.shortSelling
                        : this.isShortSell;
                    localStorage.setItem('isShortSell', this.isShortSell.toString());
                    this.tradingHistory = data.Settings.tradingHistory != null
                        ? data.Settings.tradingHistory
                        : this.tradingHistory;
                    localStorage.setItem('tradingHistory', this.tradingHistory.toString());
                    this.language = data.Settings.language != null
                        ? capitalizeFirstLetter(data.Settings.language)
                        : this.language;
                    localStorage.setItem('language', this.language.toString());
                    this.defaultFiat = data.Settings.defaultFiat != null
                        ? data.Settings.defaultFiat.toUpperCase()
                        : this.defaultFiat;
                    this.updatePrice();
                    localStorage.setItem('defaultFiat', this.defaultFiat.toString());
                    this.defaultForex = data.Settings.defaultForex != null
                        ? data.Settings.defaultForex.toUpperCase()
                        : this.defaultForex;
                    localStorage.setItem('defaultForex', this.defaultForex.toString());
                    this.defaultCrypto = data.Settings.defaultCrypto != null
                        ? data.Settings.defaultCrypto
                        : this.defaultCrypto;
                    localStorage.setItem('defaultCrypto', this.defaultCrypto.toString());
                    this.isDefaultCrypto = data.Settings.isDefaultCrypto != null
                        ? data.Settings.isDefaultCrypto
                        : this.isDefaultCrypto;
                    if (this.isDefaultCrypto) {
                        this.updateDefaultCryptoPrice();
                    }
                    localStorage.setItem('isDefaultCrypto', this.isDefaultCrypto.toString());
                    this.defaultTelegram = data.Settings.defaultTelegram != null
                        ? data.Settings.defaultTelegram
                        : this.defaultTelegram;
                    localStorage.setItem('defaultTelegram', this.defaultTelegram.toString());
                    // this.defaultURL = data.Settings.defaultURL != null
                    //     ? data.Settings.defaultURL
                    //     : this.defaultURL;
                    // localStorage.setItem('defaultURL', this.defaultURL.toString());
                    this.referredBy = data.Settings.referredBy != null
                        ? data.Settings.referredBy
                        : this.referredBy;
                    localStorage.setItem('referredBy', this.referredBy.toString());
                    this.affiliateLink = data.Settings.affiliateLink != null
                        ? data.Settings.affiliateLink
                        : this.affiliateLink;
                    localStorage.setItem('affiliateLink', this.affiliateLink.toString());
                    this.defaultCryptoAmount = data.Settings.defaultCryptoAmount != null
                        ? data.Settings.defaultCryptoAmount
                        : this.defaultCryptoAmount;
                    localStorage.setItem('defaultCryptoAmount', this.defaultCryptoAmount.toString());
                    this.marginTrading = data.Settings.marginTrading != null
                        ? data.Settings.marginTrading
                        : this.marginTrading;
                    localStorage.setItem('marginTrading', this.marginTrading.toString());
                    this.autoPaybackBct = data.Settings.autoPaybackBct != null
                        ? data.Settings.autoPaybackBct
                        : this.autoPaybackBct;
                    localStorage.setItem('autoPaybackBct', this.autoPaybackBct.toString());
                    this.isExporting = data.Settings.isExporting != null
                        ? data.Settings.isExporting
                        : this.isExporting;
                    localStorage.setItem('isExporting', this.isExporting.toString());
                    this.isAutoConvert = data.Settings.isAutoConvert != null
                        ? data.Settings.isAutoConvert
                        : this.isAutoConvert;
                    if (Object.values(autoConvertOptions).indexOf(this.isAutoConvert.toString()) === -1) {
                        if (this.isAutoConvert.toString() === 'true') {
                            this.isAutoConvert = autoConvertOptions.Partial;
                        } else {
                            this.isAutoConvert = autoConvertOptions.Off;
                        }
                    }
                    localStorage.setItem('isAutoConvert', this.isAutoConvert.toString());
                    this.timer = data.Settings.timer != null
                        ? data.Settings.timer
                        : this.timer;
                    localStorage.setItem('timer', this.timer.toString());
                    this.timerAfter = data.Settings.timerAfter != null
                        ? data.Settings.timerAfter
                        : this.timerAfter;
                    localStorage.setItem('timerAfter', this.timerAfter.toString());
                    this.tradeColStatus = data.Settings.tradeColStatus != null
                        ? data.Settings.tradeColStatus
                        : this.tradeColStatus;
                    localStorage.setItem('tradeColStatus', this.tradeColStatus.toString());
                    this.swap = data.Settings.swap != null
                        ? data.Settings.swap
                        : this.swap;
                    localStorage.setItem('swap', this.swap.toString());
                    this.c1 = data.Settings.c1 != null
                        ? data.Settings.c1
                        : this.c1;
                    localStorage.setItem('c1', this.c1.toString());
                    this.c2 = data.Settings.c2 != null
                        ? data.Settings.c2
                        : this.c2;
                    localStorage.setItem('c2', this.c2.toString());
                    this.autoFlip = data.Settings.autoFlip != null
                        ? data.Settings.autoFlip
                        : this.autoFlip;
                    localStorage.setItem('autoFlip', this.autoFlip.toString());
                    this.slider = data.Settings.slider != null
                        ? data.Settings.slider
                        : this.slider;
                    localStorage.setItem('slider', this.slider.toString());
                }

                this.mustConditions();
            })
            .catch(e => console.log('can not get settings from ws', e));
    };

    loadLocalStorage = () => {
        this.isRealTrading = localStorage.getItem('isRealTrading') === 'true';
        this.portfolioIncludesBct = localStorage.getItem('portfolioIncludesBct') === 'true';
        this.isGoogle2FA = localStorage.getItem('isGoogle2FA') === 'true';
        this.isEmail2FA = localStorage.getItem('isEmail2FA') === 'true';
        this.isArbitrageMode = localStorage.getItem('isArbitrageMode') === 'true';
        this.privateVpn = localStorage.getItem('privateVpn') === 'true';
        this.isShortSell = localStorage.getItem('isShortSell') === 'true';
        this.tradingHistory = localStorage.getItem('tradingHistory') === 'true';
        this.language = localStorage.getItem('language') || this.language;
        this.defaultFiat = localStorage.getItem('defaultFiat') || this.defaultFiat;
        this.defaultFiatSymbol = localStorage.getItem('defaultFiatSymbol') || this.defaultFiatSymbol;
        this.defaultForex = localStorage.getItem('defaultForex') || this.defaultForex;
        this.defaultCrypto = localStorage.getItem('defaultCrypto') || 'Bitcoin';
        this.isDefaultCrypto = localStorage.getItem('isDefaultCrypto') === 'true';
        if (this.isDefaultCrypto) {
            this.updateDefaultCryptoPrice();
        }
        this.defaultTelegram = localStorage.getItem('defaultTelegram') || '';
        // this.defaultURL = localStorage.getItem('defaultURL') || '';
        this.defaultURL = window.location.hostname || '';
        this.referredBy = localStorage.getItem('referredBy') || 'shaunmacdonald';
        this.affiliateLink = localStorage.getItem('affiliateLink') || '';
        this.defaultCryptoAmount = localStorage.getItem('defaultCryptoAmount') || 0.33;
        this.marginTrading = localStorage.getItem('marginTrading') || 0;
        this.autoPaybackBct = localStorage.getItem('autoPaybackBct') === 'true';
        this.isExporting = localStorage.getItem('isExporting') === 'true';
        this.isAutoConvert = localStorage.getItem('isAutoConvert') || autoConvertOptions.Partial;
        this.timer = localStorage.getItem('timer') || 30;
        this.timerAfter = localStorage.getItem('timerAfter') || 'After 2 transactions';
        this.tradeColStatus = localStorage.getItem('tradeColStatus') || 'open';
        this.swap = localStorage.getItem('swap') || 'Convert';
        this.c1 = localStorage.getItem('c1') || 'All Coins';
        this.c2 = localStorage.getItem('c2') || 'USDT';
        this.autoFlip = localStorage.getItem('autoFlip') || 'Auto Flip';
        this.slider = localStorage.getItem('slider') || 'Best Execution';

        if (Object.values(autoConvertOptions).indexOf(this.isAutoConvert) === -1) {
            this.isAutoConvert = autoConvertOptions.Partial;
        }
    };

    updateSettingsToWs = () => {
        localStorage.setItem('isRealTrading', this.isRealTrading.toString());
        localStorage.setItem('portfolioIncludesBct', this.portfolioIncludesBct.toString());
        localStorage.setItem('isGoogle2FA', this.isGoogle2FA.toString());
        localStorage.setItem('isEmail2FA', this.isEmail2FA.toString());
        localStorage.setItem('isArbitrageMode', this.isArbitrageMode.toString());
        localStorage.setItem('privateVpn', this.privateVpn.toString());
        localStorage.setItem('isShortSell', this.isShortSell.toString());
        localStorage.setItem('tradingHistory', this.tradingHistory.toString());
        localStorage.setItem('language', this.language.toString());
        localStorage.setItem('defaultFiat', this.defaultFiat.toString());
        localStorage.setItem('defaultFiatSymbol', this.defaultFiatSymbol.toString());
        localStorage.setItem('defaultForex', this.defaultForex.toString());
        localStorage.setItem('defaultCrypto', this.defaultCrypto.toString());
        localStorage.setItem('isDefaultCrypto', this.isDefaultCrypto.toString());
        localStorage.setItem('defaultTelegram', this.defaultTelegram.toString());
        localStorage.setItem('defaultURL', this.defaultURL.toString());
        localStorage.setItem('referredBy', this.referredBy.toString());
        localStorage.setItem('affiliateLink', this.affiliateLink.toString());
        localStorage.setItem('defaultCryptoAmount', this.defaultCryptoAmount.toString());
        localStorage.setItem('marginTrading', this.marginTrading.toString());
        localStorage.setItem('autoPaybackBct', this.autoPaybackBct.toString());
        localStorage.setItem('isAutoConvert', this.isAutoConvert.toString());
        localStorage.setItem('timer', this.timer.toString());
        localStorage.setItem('timerAfter', this.timerAfter.toString());
        localStorage.setItem('tradeColStatus', this.tradeColStatus.toString());
        localStorage.setItem('sidebarStatus', this.sidebarStatus.toString());
        localStorage.setItem('swap', this.swap.toString());
        localStorage.setItem('c1', this.c1.toString());
        localStorage.setItem('c2', this.c2.toString());
        localStorage.setItem('autoFlip', this.autoFlip.toString());
        localStorage.setItem('slider', this.slider.toString());

        this.updatePrice();

        if (!this.isLoggedIn) {
            // console.log('Not logged in, skipping ws update');
            return;
        }

        UpdateSettingsRequest({
            Settings: {
                realTrading: this.isRealTrading,
                portfolioIncludesBct: this.portfolioIncludesBct,
                isGoogle2FA: this.isGoogle2FA,
                isEmail2FA: this.isEmail2FA,
                arbitrageMode: this.isArbitrageMode,
                privateVpn: this.privateVpn,
                shortSelling: this.isShortSell,
                tradingHistory: this.tradingHistory,
                language: this.language,
                defaultFiat: this.defaultFiat,
                defaultCrypto: this.defaultCrypto,
                defaultForex: this.defaultForex,
                isDefaultCrypto: this.isDefaultCrypto,
                defaultTelegram: this.defaultTelegram,
                defaultURL: this.defaultURL,
                referredBy: this.defaultURL,
                affiliateLink: this.affiliateLink,
                defaultCryptoAmount: this.defaultCryptoAmount,
                marginTrading: this.marginTrading,
                autoPaybackBct: this.autoPaybackBct,
                isExporting: this.isExporting,
                isAutoConvert: this.isAutoConvert,
                timer: this.timer,
                timerAfter: this.timerAfter,
                tradeColStatus: this.tradeColStatus,
                swap: this.swap,
                c1: this.c1,
                c2: this.c2,
                autoFlip: this.autoFlip,
                slider: this.slider,
            },
        })
            .then(res => {
                // console.log('Settings updated successfully!', res);
            })
            .catch(e => console.log('Can not update settings to ws!', e));
    };

    updateSettingsToWsDebounced = debounce(this.updateSettingsToWs, 250, {
        trailing: true,
    });

    @action.bound setWithdrawAddress(withdrawAddress) {
        this.withdrawAddress = withdrawAddress;
    }

    @action.bound setShortSell() {
        this.isShortSell = !this.isShortSell;
        this.setIsAutoConvert(this.isShortSell ? autoConvertOptions.Off : autoConvertOptions.Partial);

        if (!this.isShortSell && this.isAutoConvert === autoConvertOptions.Off) {
            this.setC1('My Coins');
        }
        this.updateSettingsToWs();
    }

    @action.bound setExportTrading() {
        this.isExporting = !this.isExporting;
        this.updateSettingsToWs();
    }

    @action.bound setGoogle2FA() {
        this.isGoogle2FA = !this.isGoogle2FA;
        this.updateSettingsToWs();
    }

    @action.bound setEmail2FA() {
        this.isEmail2FA = !this.isEmail2FA;
        this.updateSettingsToWs();
    }

    @action.bound setShortSellWith(mode) {
        if (this.isShortSell !== mode) {
            this.isShortSell = mode;
            if (!this.isShortSell && this.isAutoConvert === autoConvertOptions.Off) {
                this.setC1('My Coins');
            }
            // this.setIsAutoConvert(this.isShortSell ? autoConvertOptions.Off : autoConvertOptions.Partial);
            this.updateSettingsToWs();
        }
    }

    @action.bound setArbitrageMode() {
        this.isArbitrageMode = !this.isArbitrageMode;

        // if (this.isArbitrageMode) {
        //     this.setC2('USDT');
        //     this.setSwap('Convert');
        //     this.setIsAutoConvert(autoConvertOptions.Partial);
        //     this.setShortSellWith(false);
        // } else {
        //     this.setC2('All Coins');
        //     // this.setSwap('Swap');
        //     this.setSwap('Convert');
        // }

        this.updateSettingsToWs();
    }

    @action.bound setArbitrageModeWith(mode) {
        if (this.isArbitrageMode !== mode) {
            this.isArbitrageMode = mode;

            if (this.isArbitrageMode) {
                this.setC2('USDT');
                this.setSwap('Convert');
                this.setIsAutoConvert(autoConvertOptions.Partial);
                this.setShortSellWith(false);
            } else {
                this.setC2('USDT');
                // this.setSwap('Swap');
                this.setSwap('Convert');
            }
            this.updateSettingsToWs();
        }
    }

    @action.bound setRealTrading() {
        this.isRealTrading = !this.isRealTrading;
        if (this.isRealTrading) {
            if (this.isShortSell) {
                this.setShortSell();
            }
        } else {
            this.setShortSellWith(true);
        }
        this.updateSettingsToWs();
    }

    @action.bound setDefaultCrypto(value = 'Bitcoin') {
        this.defaultCrypto = value;
        this.updateSettingsToWsDebounced();
        this.updateDefaultCryptoPrice();
    }

    @action.bound setDefaultTelegram(e) {
        this.defaultTelegram = e.target.value || '';
        this.defaultURL = this.defaultTelegram !== '' ? this.defaultTelegram + '.ucraft.net' : '';
        this.updateSettingsToWsDebounced();
    }

    @action.bound setDefaultURL(e) {
        this.defaultURL = e.target.value || '';
        this.updateSettingsToWsDebounced();
    }

    @action.bound setReferredBy(e) {
        this.referredBy = e.target.value || '';
        this.updateSettingsToWsDebounced();
    }

    @action.bound setReferCount(e) {
        this.referredBy = e.target.value || '';
        this.updateSettingsToWsDebounced();
    }

    @action.bound setPortfolioIncludesBct() {
        this.portfolioIncludesBct = !this.portfolioIncludesBct;
        this.updateSettingsToWs();
    }

    @action.bound setPrivateVpn() {
        this.privateVpn = !this.privateVpn;
        this.updateSettingsToWs();
    }

    @action.bound setAccessLevel(accessLevel) {
        this.accessLevel = accessLevel;
        this.updateSettingsToWs();
    }

    @action.bound setDefaultCurrencySetting(currency) {
        this.isDefaultCrypto = currency === 'Crypto';
        this.updateSettingsToWs();
    }

    @action.bound setLanguage(language) {
        this.language = language;
        this.updateSettingsToWs();
    }

    @action.bound setFiatCurrency(currency) {
        this.defaultFiat = currency;
        const selectedCurrency = currencyList.find(c => c.code === this.defaultFiat);
        if (selectedCurrency) {
            this.defaultFiatSymbol = selectedCurrency.symbol;
        }
        this.isDefaultCrypto = false;

        this.updateSettingsToWs();
    }

    @action.bound setDefaultForex(currency) {
        this.defaultForex = currency;

        this.updateSettingsToWs();
    }

    @action.bound setDefaultCurrency(currency, symbol, price, isDefaultCrypto) {
        this.isDefaultCrypto = isDefaultCrypto;

        if (isDefaultCrypto) {
            this.defaultCrypto = currency;
            this.defaultCryptoSymbol = symbol;
            this.defaultCryptoPrice = price;
        } else {
            this.defaultCrypto = 'Tether';
            this.defaultCryptoSymbol = 'USDT';
            this.defaultCryptoPrice = price;
            this.setFiatPrice(price);

            this.defaultFiat = currency;
            this.defaultFiatSymbol = symbol;
        }

        this.updateSettingsToWs();
    }

    @action.bound setFiatPrice(price) {
        this.currentFiatPrice = price;
    }

    @action.bound getLocalPrice(dPrice, symbol) {
        if (symbol === 'USDT') {
            return dPrice * this.price;
        }
        return dPrice;
    }

    @action.bound getDefaultPrice(usdPrice) {
        if (!this.isDefaultCrypto) {
            return usdPrice * this.price;
        }
        return this.defaultCryptoPrice !== 0 ? usdPrice / this.defaultCryptoPrice : 0;
    }

    @action.bound getLocalCurrency(symbol) {
        if (!this.isDefaultCrypto && symbol === 'USDT') {
            return this.defaultFiat;
        }
        if (this.isDefaultCrypto) {
            return this.defaultCryptoSymbol;
        }
        return symbol;
    }

    @action.bound getUSDPrice(fiatPrice) {
        if (!this.isDefaultCrypto) {
            return this.price > 0 ? (fiatPrice / this.price) : 0;
        }
        return fiatPrice;
    }

    @action.bound getCoinPrice(coin) {
        if (this.PortfolioData) {
            for (let i = 0; i < this.PortfolioData.length; i++) {
                if (this.PortfolioData[i] && this.PortfolioData[i].Coin === coin) {
                    return this.PortfolioData[i].Price || 0;
                }
            }
        }
        return 0;
    }

    getFiatPrice = (selectedFiat) => {
        const country = this.countries.find(country => country.currencyCode === selectedFiat);
        if (country) {
            return country.price;
        }
    };

    @action.bound getLocalFiatPrice(usdPrice, defaultCurrency) {
        return usdPrice * (this.getFiatPrice(defaultCurrency) || 1);
    }

    @action.bound getFiatSymbolFromName(selectedFiat) {
        const currency = currencyList.find(c => c.code === selectedFiat);
        if (currency) {
            return currency.symbol;
        }
        return '';
    }

    @action.bound setIsDefaultCrypto(isDefaultCrypto) {
        this.isDefaultCrypto = isDefaultCrypto;

        if (!isDefaultCrypto) {
            this.defaultCrypto = 'Tether';
            this.defaultCryptoSymbol = 'USDT';
            this.defaultCryptoPrice = 1;
        }
    }

    @action.bound setIsAutoConvert(mode) {
        // this.isAutoConvert = (typeof isAutoConvert === 'boolean') ? isAutoConvert : !this.isAutoConvert;
        this.isAutoConvert = mode;

        if (this.isAutoConvert !== autoConvertOptions.Off) {
            this.setShortSellWith(false);
            this.setSwap('Convert');
        } else {
            // this.setSwap('Swap');
            this.setSwap('Convert');
            if (!this.isShortSell) {
                this.setC1('My Coins');
            }
        }

        this.updateSettingsToWs();
    }

    @action.bound setTimer(value) {
        this.timer = value;
        this.updateSettingsToWs();
    }

    @action.bound setTimerAfter(value) {
        this.timerAfter = value;
        if (value === 'After 2 transactions') {
            this.setArbitrageModeWith(true);
        } else {
            this.setArbitrageModeWith(false);
        }
        this.updateSettingsToWs();
    }

    @action.bound setTradeColStatus(value) {
        this.tradeColStatus = value;
        this.updateSettingsToWs();
    }

    @action.bound setSidebarStatus(value) {
        this.sidebarStatus = value;
        this.updateSettingsToWs();
    }

    @action.bound setSwap(swap) {
        this.swap = swap;

        if (this.swap === 'Convert') {
            this.setAutoFlip('Disabled');
            // this.setSlider('Arbitrage(1 year back testing)');
        } else if (this.swap === 'Swap') {
            this.setAutoFlip('Auto Flip');
        }

        this.updateSettingsToWs();
    }

    @action.bound setC1(c1) {
        this.c1 = c1;
        this.updateSettingsToWs();
    }

    @action.bound setC2(c2) {
        this.c2 = c2;
        this.updateSettingsToWs();
    }

    @action.bound setAutoFlip(autoFlip) {
        this.autoFlip = autoFlip;
        this.updateSettingsToWs();
    }

    @action.bound setSlider(slider) {
        this.slider = slider;
        this.updateSettingsToWs();
    }

    @action.bound resetBalance() {
        this.setIsAutoConvert(autoConvertOptions.Off);
        this.setSwap('Convert');
        this.setAutoFlip('Auto Flip');
        // this.setSlider('Arbitrage(1 year back testing)');
    }

    @action.bound resetHistory() {
        // if (window.location.hostname === 'dev.bct.trade') return;
        // const phone = localStorage.getItem('phoneNumber') || '';
        // if (phone) {
        //     fetch('/services/api/orderhistory', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             phone: phone,
        //             history: '',
        //         }),
        //     })
        //         .then(() => {
        //             this.historyData = [];
        //         })
        //         .catch(err => {
        //             console.log(err);
        //             this.historyData = [];
        //         });
        // }
    }

    @action.bound orderHistory(transaction) {
        // if (window.location.hostname === 'dev.bct.trade') return;
        // const phone = localStorage.getItem('phoneNumber') || '';
        // if (phone) {
        //     this.isHistoryUpdate = true;
        //     transaction.push(this.isRealTrading);
        //     transaction.push(this.portfolioIncludesBct);
        //     transaction.push(this.isGoogle2FA);
        //     transaction.push(this.isArbitrageMode);
        //     transaction.push(this.privateVpn);
        //     transaction.push(this.isShortSell);
        //     transaction.push(this.tradingHistory);
        //     transaction.push(this.accessLevel);
        //     transaction.push(this.language);
        //     transaction.push(this.defaultFiat);
        //     transaction.push(this.defaultCrypto);
        //     transaction.push(this.isDefaultCrypto);
        //     transaction.push(this.defaultTelegram);
        //     transaction.push(this.referredBy);
        //     transaction.push(this.affiliateLink);
        //     transaction.push(this.defaultCryptoAmount);
        //     transaction.push(this.marginTrading);
        //     transaction.push(this.autoPaybackBct);
        //     transaction.push(this.isExporting);
        //     transaction.push(this.isAutoConvert);
        //     transaction.push(this.swap);
        //     transaction.push(this.c1);
        //     transaction.push(this.c2);
        //     transaction.push(this.autoFlip);
        //     transaction.push(this.slider);
        //     this.historyData.push(transaction);
        //
        //     fetch('/services/api/orderhistory', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             phone: phone,
        //             history: JSON.stringify(this.historyData),
        //         }),
        //     })
        //         .then(() => {
        //             this.isHistoryUpdate = false;
        //         })
        //         .catch(err => {
        //             console.log(err);
        //             this.isHistoryUpdate = false;
        //         });
        // }
    }

    @action.bound getOrderHistory() {
        // if (window.location.hostname === 'dev.bct.trade') return;
        // if (this.isHistoryUpdate) return;
        // const phone = localStorage.getItem('phoneNumber') || '';
        // if (phone) {
        //     fetch('/services/api/getorderhistory', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ phone: phone }),
        //     })
        //         .then(response => response.json())
        //         .then(({ history }) => {
        //             this.historyData = JSON.parse(history) || [];
        //         }).catch(err => {
        //             this.historyData = [];
        //         });
        // }
    }
}

export default (telegramStore, yourAccountStore) => new SettingsStore(telegramStore, yourAccountStore);
