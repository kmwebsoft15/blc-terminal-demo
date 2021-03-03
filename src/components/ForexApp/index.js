import React, { Component } from 'react';
import { Swipeable } from 'react-swipeable';
import PayApp from '@/components/CryptoApp';
import WalletHeader from '@/components/WalletHeader';

class ForexApp extends Component {
    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        document.title = 'Blockchain Terminal';
        document.getElementsByTagName('body')[0].style = `height: ${document.documentElement.clientHeight}px !important`;
    }

    componentWillUnmount() {
        this._isMounted = false;
        document.getElementsByTagName('body')[0].removeAttribute('style');
    }

    render() {
        return (
            <Swipeable>
                <PayApp isForexApp {...this.props} />

                <WalletHeader
                    isOrderbook
                    isSeparate
                />
            </Swipeable>
        );
    }
}

export default ForexApp;
