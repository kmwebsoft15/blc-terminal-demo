import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { STORE_KEYS } from '@/stores';
import {
    ContentWrapper,
    LeftAccount,
    Main,
    MainTable,
    TableName,
    MainTableCon,
    CreateAccount,
    ExchangesWrapper,
    AccountCell,
    APICell,
    LogoWrapper,
    Logo
} from './Components';
import { Checkbox } from '@/components/WalletHeader/icons';
import ActiveTable from './ActiveTable';
import { TableData } from './data';

function MainContent(props) {
    const mockApiRenderer = (rowData) => {
        const { exchanges, setExchangeActive } = props;
        let isActive = false;
        if (exchanges && exchanges[rowData.name]) {
            isActive = exchanges[rowData.name].active;
        }

        return (
            <APICell className="api-cell">
                <Checkbox
                    size={30}
                    active={isActive}
                    onClick={() => setExchangeActive(rowData.name, !isActive)}
                />
            </APICell>
        );
    };

    const { selectedCurrencies, selectedExchanges, selectedTotalCurrency, marketExchanges } = props
    const exchages = !!selectedExchanges ? marketExchanges.filter(ex => selectedExchanges === ex.name) : marketExchanges
    const currencies = !!selectedCurrencies ? TableData.filter(cu => selectedCurrencies === cu.currency) : TableData
    return (

        <ContentWrapper>
            <TableName>
                <ActiveTable selectedTotalCurrency={selectedTotalCurrency} />
            </TableName>
            <ExchangesWrapper>
                {exchages.map((exchange, index) =>
                    <Main key={index}>
                        <LeftAccount>
                            <AccountCell className="exchange-item">
                                <LogoWrapper size={38}>
                                    <Logo src={`/img/exchange/${exchange.icon}`} alt="" />
                                </LogoWrapper>

                                <span>{exchange.name}</span>
                            </AccountCell>
                            {mockApiRenderer(exchange)}
                        </LeftAccount>
                        <MainTable>
                            {
                                currencies.map((currency, index) => (
                                    <MainTableCon key={index}>
                                        <div className="TableViewItems">
                                            <div className="currency">{currency.currency}</div>
                                            <div className="PayinImage"> </div>
                                            <div className="PayoutImage"> </div>
                                            <div className="RowNumber">{currency.Available}</div>
                                            <div className="RowNumber">{currency.Reserved}</div>
                                            <div className="RowNumber">{currency.Total}</div>
                                            <div className="RowNumber">{currency.TotalinEUR}</div>
                                        </div>
                                    </MainTableCon>

                                ))
                            }
                        </MainTable>
                    </Main>
                )}
                <CreateAccount>
                    <p className="CreateAccountCon">Create new account</p>
                </CreateAccount>
            </ExchangesWrapper>
        </ContentWrapper>

    );
}

const withStore = compose(
    inject(
        STORE_KEYS.EXCHANGESSTORE,
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.EXCHANGESSTORE]: {
                exchanges,
                marketExchanges,
                setExchangeActive,
            },
        }) => ({
            exchanges,
            marketExchanges,
            setExchangeActive,
        })
    )
);

export default withStore(MainContent);
