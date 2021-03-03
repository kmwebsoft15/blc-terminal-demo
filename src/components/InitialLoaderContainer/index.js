import React from 'react';
import { inject, observer } from 'mobx-react';
import { withSafeTimeout } from '@hocs/safe-timers';
import { compose } from 'recompose';

import InitialLoader from '../../components-generic/InitialLoader';
import { STORE_KEYS } from '../../stores';

class InitialLoaderContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadFailed: false,
            isLoaded: false,
        };
        this.props.setSafeTimeout(this.updateLoadFailed, 30000);
    }

    setLoaded = (isLoaded) => {
        this.setState({
            isLoaded,
        });
    };

    updateLoadFailed = () => {
        const {
            isTelegramLoaded,
            isAccountStoreLoaded,
            setSafeTimeout,
        } = this.props;

        if (!isTelegramLoaded || !isAccountStoreLoaded) {
            this.setState({
                loadFailed: true,
            });

            setSafeTimeout(() => {
                this.setState({
                    isLoaded: true,
                });
            }, 300);
        }
    };

    render() {
        const {
            [STORE_KEYS.YOURACCOUNTSTORE]: yourAccountStore,
            [STORE_KEYS.TELEGRAMSTORE]: telegramStore,
            [STORE_KEYS.INSTRUMENTS]: instrumentStore,
            isMobileDevice,
        } = this.props;
        const { isLoaded : isTelegramLoaded } = telegramStore;
        const { isLoaded : isBaseQuotesLoaded } = instrumentStore;
        const { isLoaded : isAccountStoreLoaded } = yourAccountStore;
        const { loadFailed } = this.state;

        return (
            <React.Fragment>
                {
                    !isMobileDevice && !(loadFailed || (isTelegramLoaded && isBaseQuotesLoaded && isAccountStoreLoaded)) && (
                        <InitialLoader/>
                    )
                }
            </React.Fragment>
        );
    }
}

const enhanced = compose(
    withSafeTimeout,
    inject(
        STORE_KEYS.TELEGRAMSTORE,
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.INSTRUMENTS,
    ),
    observer,
);

export default enhanced(InitialLoaderContainer);
