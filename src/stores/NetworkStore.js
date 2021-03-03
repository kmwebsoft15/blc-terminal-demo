import { observable, reaction } from 'mobx';
import { privateNetworkObservable, publicNetworkObservable } from '../lib/bct-ws';

class NetworkStore {
    @observable isPrivateConnected = false;
    @observable isPublicConnected = false;
    @observable isMarketConnected = false;
    isPVSubscribed = false;
    isPBSubscribed = false;
    pVHandler = null;
    pBHandler = null;
    allowedDelay = 5000;

    constructor(settingsStore) {
        if (!this.isPVSubscribed) {
            privateNetworkObservable.subscribe({
                next: (networkDataEvent) => {
                    if (this.isPVSubscribed && networkDataEvent) {
                        clearTimeout(this.pVHandler);
                        if (networkDataEvent.privateSocket) {
                            this.isPrivateConnected = true;
                        } else {
                            this.pVHandler = setTimeout(() => {
                                this.isPrivateConnected = false;
                            }, this.allowedDelay);
                        }
                    }
                },
            });
            this.isPVSubscribed = true;
        }

        if (!this.isPBSubscribed) {
            publicNetworkObservable.subscribe({
                next: (networkDataEvent) => {
                    if (this.isPBSubscribed && networkDataEvent) {
                        clearTimeout(this.pBHandler);
                        if (networkDataEvent.publicSocket) {
                            this.isPublicConnected = true;
                        } else {
                            this.pBHandler = setTimeout(() => {
                                this.isPublicConnected = false;
                            }, this.allowedDelay);
                        }
                    }
                },
            });
            this.isPBSubscribed = true;
        }

        const isLoggedIn = localStorage.getItem('signedin') === 'true';
        if (!isLoggedIn) {
            this.isPrivateConnected = true;
        }

        reaction(
            () => settingsStore.isArbitrageMode,
            (isArbitrageMode) => {
                if (isArbitrageMode) {
                    this.allowedDelay = 100;
                } else {
                    this.allowedDelay = 5000;
                }
            }
        );
    }
}

export default (settingsStore) => {
    const store = new NetworkStore(settingsStore);
    return store;
};
