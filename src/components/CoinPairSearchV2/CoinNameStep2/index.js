import React from 'react';

const CoinNameStep2 = ({ value, defaultFiat, onClick }) => {
    if (value === 'USDT') {
        if (defaultFiat !== 'USD') {
            value = defaultFiat;
        }
    }
    return (
        <div className="exch-dropdown__title" onClick={onClick}>
            <span>{value}</span><br/>
        </div>
    );
};

export default CoinNameStep2;