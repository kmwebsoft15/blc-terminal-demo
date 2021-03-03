/* eslint-disable no-alert */
import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components/macro';
import TelegramLoginButton from 'react-telegram-login';
import { FormattedMessage } from 'react-intl';
import { withSafeTimeout } from '@hocs/safe-timers';
import { compose } from 'recompose';

import { login as telegramLogin } from '../../lib/tg-auth/index';
import { TELEGRAM_AUTH_BOT } from '../../config/constants';
import { STORE_KEYS } from '../../stores';
import DataLoader from '../../components-generic/DataLoader';

const ButtonWrapper = styled.div`
    position: relative;
    width: ${props => props.width ? `${props.width}px` : '100%'};
    height: ${props => props.height ? `${props.height}px` : '43px'};

    .message-bar__login-demo {
        z-index: 20;
        cursor: pointer;

        position: absolute;
        left: 0;
        bottom: 0;
        background-color: ${props => props.theme.palette.telegramButton};
        pointer-events: none !important;
    }
`;

export const LoaderWrapper = styled.div.attrs({ className: 'loader' })`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999999;
    background: rgba(0, 0, 0, 0.435);
`;

const Button = styled.div`
    height: 100%;
    // margin: 8px calc(50% - 118px);
    padding: 2px;
    align-items: flex-end;
    overflow: hidden;

    > div {
        height: 100%;
    }

    iframe {
        width: 100% !important;
        max-width: 236px !important;
        height: 100% !important;
        background-color: ${props => props.theme.palette.telegramButton};
        border: none;
        border-radius: 20px;
        overflow: hidden;
        padding-top: 10px;
    }

    &:hover + .telegram-login {
        color: ${props => props.theme.palette.telegramButtonHover};

        svg {
            fill: ${props => props.theme.palette.telegramButtonHover};
        }
    }

    &:active + .telegram-login {
        background-color: ${props => props.theme.palette.telegramButtonHover};
        color: ${props => props.theme.palette.telegramAppMessageJoin} !important;

        svg {
            fill: ${props => props.theme.palette.telegramButtonHover};
        }
    }
`;

const LoginButton = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 20;
    background-color: ${props => props.isBtnLoaded ? props.theme.palette.telegramButton : props.theme.palette.clrBorder};
    border-radius: ${props => props.theme.palette.borderRadius};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: ${props => props.theme.palette.telegramAppMessageJoin};
    cursor: ${props => !props.isBtnLoaded ? "url('/img/not-allowed1.cur'), not-allowed !important" : 'pointer'};
    pointer-events: ${props => props.isBtnLoaded ? 'none !important' : ''};
`;

const Icon = styled.svg`
    width: 32px;
    height: 32px;
    fill: ${props => props.theme.palette.telegramAppMessageJoin};
    margin-right: 12px;
`;

const TelegramIcon = props => (
    <Icon viewBox="0 0 30.24 26.32" {...props}>
        <g data-name="\u0421\u043B\u043E\u0439 2">
            <path
                d="M.53 12.62l7 2.6 2.7 8.68a.82.82 0 0 0 1.3.39l3.88-3.17a1.17 1.17 0 0 1 1.42 0l7 5.09a.83.83 0 0 0 1.29-.5L30.22 1a.82.82 0 0 0-1.1-.93L.53 11.09a.82.82 0 0 0 0 1.53zm9.23 1.22l13.62-8.39a.24.24 0 0 1 .29.38L12.43 16.27a2.3 2.3 0 0 0-.72 1.4l-.39 2.83a.35.35 0 0 1-.68.05l-1.48-5.17a1.38 1.38 0 0 1 .6-1.54z"
            />
        </g>
    </Icon>
);

class TelegramLogin extends React.Component {
    state = {
        isLoading: false,
        isBtnLoaded: true,
    };

    componentDidMount() {
        this.props.setSafeTimeout(() => {
            this.setState({
                isBtnLoaded: true,
            });
        }, 5000);
    }

    handleTelegramResponse = response => {
        this.setState({ isLoading: true });
        if (this.props.setLoading) {
            this.props.setLoading(true);
        }

        // auth_date: 1432293992
        // first_name: "Alexay"
        // hash: "807e7c439248390248093244372894738924738924943242fi32894db27f2"
        // id: 329039204
        // last_name: "Kovac"
        // username: "alexaykovac"
        const user = {
            id: response.id || '',
            username: response.username || '',
            first_name: response.first_name || '',
            last_name: response.last_name || '',
        };

        telegramLogin(response)
            .then(data => {
                const {
                    [STORE_KEYS.YOURACCOUNTSTORE]: yourAccountStore,
                    [STORE_KEYS.LOWESTEXCHANGESTORE]: lowestExchangeStore,
                    [STORE_KEYS.TELEGRAMSTORE]: telegramStore,
                    [STORE_KEYS.ORDERHISTORY]: orderHistoryStore,
                    [STORE_KEYS.MODALSTORE]: modalStore,
                    setLoading,
                } = this.props;

                this.setState({ isLoading: false });
                if (setLoading) {
                    setLoading(false);
                }

                localStorage.setItem('authToken', data.token);
                localStorage.setItem('authClientId', data.ClientId);
                modalStore.onClose();
                telegramStore.initByTelegramLogin();
                orderHistoryStore.requestOrderHistory();
                yourAccountStore.requestPositionWithReply();
                lowestExchangeStore.requestOrderEvents();
                telegramStore.loginFinishWith(user);
            })
            .catch(err => {
                const { [STORE_KEYS.TELEGRAMSTORE]: telegramStore, setLoading } = this.props;

                console.error('[Telegram backend login error]', err);
                this.setState({ isLoading: false });
                if (setLoading) {
                    setLoading(false);
                }

                telegramStore.showCoinSendState('Telegram login is failed.');
            });
    };

    render() {
        const { isLoading, isBtnLoaded } = this.state;
        const { width, height, [STORE_KEYS.TELEGRAMSTORE]: { loginBtnLocation } } = this.props;

        return (
            <Fragment>
                <ButtonWrapper width={width} height={height}>
                    <Button>
                        <TelegramLoginButton
                            dataOnauth={response => {
                                this.handleTelegramResponse(response);
                            }}
                            botName={TELEGRAM_AUTH_BOT}
                        />
                    </Button>

                    <LoginButton className="telegram-login" isBtnLoaded={isBtnLoaded}>
                        {/* <TelegramIcon/> */}
                        {
                            isBtnLoaded ? (
                                <span>
                                    <FormattedMessage
                                        id="telegram.btn_login"
                                        defaultMessage="Sign Up or Log In"
                                    />
                                </span>
                            ) : (
                                <DataLoader width={40} height={40}/>
                            )
                        }
                    </LoginButton>
                </ButtonWrapper>

                {isLoading && loginBtnLocation && (
                    <LoaderWrapper>
                        <DataLoader width={100} height={100}/>
                    </LoaderWrapper>
                )}
            </Fragment>
        );
    }
}

const enhanced = compose(
    withSafeTimeout,
    inject(
        STORE_KEYS.TELEGRAMSTORE,
        STORE_KEYS.ORDERHISTORY,
        STORE_KEYS.YOURACCOUNTSTORE,
        STORE_KEYS.MODALSTORE,
        STORE_KEYS.LOWESTEXCHANGESTORE
    ),
    observer
);

export default enhanced(TelegramLogin);
