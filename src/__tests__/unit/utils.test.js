import {
    splitAmtOnDecimal,
    getSplittedNumber,
} from 'utils';

describe('splitAmtOnDecimal fcn works as intended', () => {
    it('fcn returns an array of length 2; each filled with strings', () => {
        expect(typeof splitAmtOnDecimal(1.454)[0]).toEqual('string');
        expect(typeof splitAmtOnDecimal(1.454)[1]).toEqual('string');
    });

    it('Splits floating number into before and after decimal', () => {
        expect(splitAmtOnDecimal(1.454)).toEqual(['1', '454']);
    });

    it('splits whole numbers into [someval, emptyString]', () => {
        expect(splitAmtOnDecimal(1.0)).toEqual(['1', '']);
    });

    it('Splits float correctly when < 1 but > 0', () => {
        expect(splitAmtOnDecimal(0.1223)).toEqual(['0', '1223']);
    });

    it('Splits float correctly when is 0', () => {
        expect(splitAmtOnDecimal(0)).toEqual(['0', '']);
        expect(splitAmtOnDecimal(0.0)).toEqual(['0', '']);
    });
});

describe('getSplittedNumber fcn works as intended', () => {
    const caseItems = [
        {
            name: 'empty priceString',
            args: {
                priceString: '',
                maxNumberOfDigits: 10,
            },
            result: {
                integerPart: '',
                fractionalPart: '',
                resultNumber: '',
                trailingZeros: '',
                leadingZeros: null,
                leadingExtraZeroes: '',
                leadingExtraHiddenZeroes: '0 000 000 000 ',
                showDecimalSeparator: false,
                decimalSeparator: '.',
            },
        },
        {
            name: 'decimal number less than 1',
            args: {
                priceString: '0.0002',
                maxNumberOfDigits: 10,
            },
            result: {
                integerPart: '0',
                fractionalPart: '0002',
                resultNumber: '0.0002',
                trailingZeros: '',
                leadingZeros: '0.000',
                leadingExtraZeroes: '',
                leadingExtraHiddenZeroes: '000 00',
                showDecimalSeparator: true,
                decimalSeparator: '.',
            },
        },
        {
            name: 'decimal number greater than 1',
            args: {
                priceString: '4.1235',
                maxNumberOfDigits: 10,
            },
            result: {
                integerPart: '4',
                fractionalPart: '1235',
                resultNumber: '4.1235',
                trailingZeros: '',
                leadingZeros: null,
                leadingExtraZeroes: '00',
                leadingExtraHiddenZeroes: '000 ',
                showDecimalSeparator: true,
                decimalSeparator: '.',
            },
        },
        {
            name: 'decimal number greater than 10',
            args: {
                priceString: '40.1235',
                maxNumberOfDigits: 10,
            },
            result: {
                integerPart: '40',
                fractionalPart: '1235',
                resultNumber: '40.1235',
                trailingZeros: '',
                leadingZeros: null,
                leadingExtraZeroes: '0',
                leadingExtraHiddenZeroes: '000 ',
                showDecimalSeparator: true,
                decimalSeparator: '.',
            },
        },
        {
            name: 'decimal number greater than 100',
            args: {
                priceString: '400.1235',
                maxNumberOfDigits: 10,
            },
            result: {
                integerPart: '400',
                fractionalPart: '1235',
                resultNumber: '400.1235',
                trailingZeros: '',
                leadingZeros: null,
                leadingExtraZeroes: '',
                leadingExtraHiddenZeroes: '000 ',
                showDecimalSeparator: true,
                decimalSeparator: '.',
            },
        },
    ];

    caseItems.map(item => {
        it(item.name, () => {
            const result = getSplittedNumber(item.args.priceString, item.args.maxNumberOfDigits);
            expect(result).toEqual(item.result);
        });
    });
})
