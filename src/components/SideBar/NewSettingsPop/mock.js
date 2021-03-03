export const currencies = [
    'USD',
    'EUR',
    'JPY',
    'GBP',
    'RUB',
    'CNY',
    'TRY',
    'INR',
    'PLN',
    'AUD',
    'CAD',
    'KRW',
    'BRL',
    'SGD',
    'HKD',
    'IDR',
    'UAH',
    'THB',
    'CHF',
    'CZK',
    'NZD',
    'NGN',
    'MXN',
    'DKK',
    'NOK',
    'CLP',
    'ARS',
    'COP',
    'PHP',
    'ILS',
    'ZAR',
    'MYR',
    'HUF',
    'SEK',
    'ISK',
    'DZD',
    'GEL',
    'BDT',
    'ZWL',
    'CVE',
    'DOP',
    'CDF',
    'GYD',
    'SOS',
    'AFN',
    'SCR',
    'XCD',
    'UZS',
    'UGX',
    'XOF',
    'KHR',
    'GNF',
    'ANG',
    'HRK',
    'BBD',
    'RON',
    'BND',
    'SRD',
    'FJD',
    'GMD',
    'TOP',
    'EGP',
    'TND',
    'KES',
    'MZN',
    'VUV',
    'AED',
    'KWD',
    'HTG',
    'OMR',
    'AOA',
    'TJS',
    'KMF',
    'GTQ',
    'ERN',
    'NIO',
    'MKD',
    'STD',
    'KGS',
    'AMD',
    'AWG',
    'FKP',
    'UYU',
    'LBP',
    'QAR',
    'IQD',
    'VEF',
    'VND',
    'BMD',
    'PKR',
    'NPR',
    'RSD',
    'SVC',
    'TZS',
    'LSL',
    'SDG',
    'YER',
    'SHP',
    'PGK',
    'MDL',
    'KPW',
    'HNL',
    'SLL',
    'BWP',
    'ZMW',
    'BZD',
    'MWK',
    'GIP',
    'LRD',
    'XPF',
    'BIF',
    'MVR',
    'TTD',
    'LAK',
    'PAB',
    'LYD',
    'SYP',
    'MRO',
    'PYG',
    'AZN',
    'BHD',
    'XAF',
    'WST',
    'ALL',
    'KYD',
    'JOD',
    'RWF',
    'MUR',
    'MMK',
    'LKR',
    'TWD',
    'SSP',
    'BYN',
    'NAD',
    'BGN',
    'BTN',
    'IRR',
    'MOP',
    'KZT',
    'SZL',
    'DJF',
    'CUP',
    'MGA',
    'JMD',
    'XAG',
    'GGP',
    'CLF',
    'XDR',
    'CNH',
    'JEP',
    'XPT',
    'IMP',
    'CUC'
];

export const margins = [
    'No Leverage',
    'Leverage 2X',
    'Leverage 3X',
    'Leverage 4X',
    'Leverage 5X',
    'Leverage 6X',
    'Leverage 7X',
    'Leverage 8X',
    'Leverage 9X',
    'Leverage 10X'
];

export const accessLevels = [
    'Level 1',
    'Level 2',
    'Level 3',
    'Level 4'
];

export const defaultCurrencies = [
    'Fiat',
    'Crypto'
];

export const swaps = [
    'Swap',
    'Convert'
];

export const c1s = [
    'All Coins',
    'My Coins'
];

export const c2s = [
    'USDT'
];

export const autoFlips = [
    'Auto Flip',
    'Disabled'
];

export const sliders = [
    'Best Execution',
    'Arbitrage(1 year back testing)'
];

let timers = [];
for(let i = 0; i <= 1000; i += 10) {
    timers.push(i);
}
export const timerList = timers;

export const timerAfterList = [
    'After 2 transactions',
    'After 1 transaction'
];