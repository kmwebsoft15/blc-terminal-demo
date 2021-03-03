import React from 'react';
import { Wrapper } from './Components';
import TopMenu from './TopMenu';
import MainContent from './MainTable';

class TradingViewAdv extends React.Component {

    state = {
        selectedCurrencies: '',
        selectedExchanges: '',
        selectedTotalCurrency: ''
    }

    toggle = (arr, obj) => {
        arr.includes(obj) ? arr.splice(arr.indexOf(obj), 1) : arr.push(obj);
        return arr
    }

    handleCurrencyChange = currency => {
        // it needs to select multi currencies in the future
        // const { selectedCurrencies } = this.state
        // const selected = currency === 'All currencies' ? [] : this.toggle(selectedCurrencies, currency)
        this.setState({ selectedCurrencies: currency === 'All currencies' ? '' : currency })
    }
    handleExchangeChange = exchange => {
        // it needs to select multi currencies in the future
        // const { selectedExchanges } = this.state
        // const selected = exchange === 'All exchanges' ? [] : this.toggle(selectedExchanges, exchange)
        this.setState({ selectedExchanges:  exchange === 'All exchanges' ? '' : exchange })
    }
    handleTotalCurrencyChange = currency => {
        this.setState({ selectedTotalCurrency: currency })
    }
    render() {
        const { selectedCurrencies, selectedExchanges, selectedTotalCurrency } = this.state
        return (
            <Wrapper>
                <TopMenu
                    selectedCurrencies={selectedCurrencies}
                    selectedExchanges={selectedExchanges}
                    selectedTotalCurrency={selectedTotalCurrency}
                    onCurrencyChange={this.handleCurrencyChange}
                    onExchangeChange={this.handleExchangeChange}
                    onTotalCurrencyChange={this.handleTotalCurrencyChange}
                />
                <MainContent
                    selectedCurrencies={selectedCurrencies}
                    selectedExchanges={selectedExchanges}
                    selectedTotalCurrency={selectedTotalCurrency}
                />
            </Wrapper>
        );
    }
};

export default TradingViewAdv;

