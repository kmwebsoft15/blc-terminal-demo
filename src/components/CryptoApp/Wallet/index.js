import React from 'react';
import QRCode from 'qrcode-react';

import {
    WalletWrapper,
    WalletContainer,
    CopyNotification
} from './Components';

import WalletBG from '../asset/img/wallet_bg.jpg';
import copyImg from '../asset/img/copied.png';

class Wallet extends React.Component {
    _copyShowTimer = null;
    
    state = {
        isCopyShowing: false,
    }

    copyToClipboard = (str) => {
        let textarea;
        let result;
      
        try {
            textarea = document.createElement('textarea');
            textarea.setAttribute('readonly', true);
            textarea.setAttribute('contenteditable', true);
            textarea.style.position = 'fixed'; // prevent scroll from jumping to the bottom when focus is set.
            textarea.style.fontSize = '16px';
            textarea.value = str;
        
            document.body.appendChild(textarea);
        
            textarea.focus();
            textarea.select();
        
            const range = document.createRange();
            range.selectNodeContents(textarea);
        
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        
            textarea.setSelectionRange(0, textarea.value.length);
            result = document.execCommand('copy');
        } catch (err) {
            console.error(err);
            result = null;
        } finally {
            document.body.removeChild(textarea);
        }
      
        if (!result) {
            return false;
        }
        return true;
    }

    onCopyAddress = (e) => {
        if(e) e.stopPropagation();

        setTimeout(() => {
            if(this.copyToClipboard(this.props.coinAddress)) {
                this.setState({ isCopyShowing: true });
                if(this._copyShowTimer) clearTimeout(this._copyShowTimer);
                this._copyShowTimer = setTimeout(() => {
                    this.setState({ isCopyShowing: false });
                }, 1000);
            }
        }, 100);
    }

    render() {
        const {
            coinAddress,
            billHeight,
        } = this.props;

        const width = billHeight * 0.36;

        return (
            <WalletWrapper isVisible={true}>
                <WalletContainer width={width}>
                    <img className="wallet-bg" src={WalletBG} alt="" />
                    <div className="wallet-data-container" onClick={() => this.props.onBack()}>
                        <div className="wallet-data-header" onClick={(e) => this.onCopyAddress(e)}>
                            VIRES IN NUMERIS
                        </div>
                        <div className="wallet-data-qr" onClick={(e) => this.onCopyAddress(e)}>
                            <QRCode
                                value={coinAddress}
                                bgColor="transparent"
                                fgColor="#000"
                            />
                        </div>
                        <div className="wallet-data-address" onClick={(e) => this.onCopyAddress(e)}>
                            {coinAddress}
                        </div>
                    </div>
                </WalletContainer>

                {this.state.isCopyShowing && (
                    <CopyNotification>
                        <img src={copyImg} alt="" />
                        <div>ADDRESS COPIED</div>
                    </CopyNotification>
                )}
            </WalletWrapper>
        );
    }
}

export default Wallet;