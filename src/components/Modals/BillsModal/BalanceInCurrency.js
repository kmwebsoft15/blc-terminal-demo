import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import findIndex from 'lodash/findIndex';
import { inject, observer } from "mobx-react";

import { CoinIcon } from '@/components-generic/CoinIcon';
import { format2DigitString } from '@/utils';
import { STORE_KEYS } from '@/stores';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  left: 16px;
  bottom: ${props => props.chipHeight + 26 || 106}px;
  height: ${props => props.chipHeight || 80}px;
  padding: 0 12px;
  pointer-events: none;
  font-size: 60px;
  font-weight: 600;
  letter-spacing: 5px;
  z-index: 10000;
  
  &:hover {
    opacity: 0.2;
  }
`;

const BalanceInCurrency = (props) => {
    const {
      balance,
      currency,
      chipHeight,
      [STORE_KEYS.YOURACCOUNTSTORE]: yourAccountStore,
    } = props;
    
    const { portfolioData } = yourAccountStore;
    const btcIndex = findIndex(portfolioData, { Coin: 'BTC' });
    const btcPrice = portfolioData[btcIndex].Price;
    const balanceInCurrency = format2DigitString(balance * btcPrice);

    return (
      <Wrapper chipHeight={chipHeight}>
        <CoinIcon value={currency} size={60} hasMarginRight />
        {/* We only show USDT value atm */}
        {balanceInCurrency} {currency} @ {btcPrice}
      </Wrapper>
    );
}

BalanceInCurrency.defaultProps = {
  balance: 0,
  chipHeight: 70,
  currency: "USDT",
};
BalanceInCurrency.propTypes = {
  balance: PropTypes.number,
  currency: PropTypes.string,
  chipHeight: PropTypes.number,
};

export default inject(
  STORE_KEYS.YOURACCOUNTSTORE,
  STORE_KEYS.CONVERTSTORE,
)(observer(BalanceInCurrency));
