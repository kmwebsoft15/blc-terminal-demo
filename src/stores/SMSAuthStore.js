import React from 'react';
import decode from 'jwt-decode';
import { action, observable } from 'mobx';
import Cookies from 'universal-cookie';
import {
    requestDeviceToken,
    requestAuthenticationCode,
    confirmAuthenticationCode,
    refreshSecurityToken
} from '../lib/sms-auth';
import { isTokenExpired, refreshToken } from '../utils';

class SMSAuthStore {
    @observable price = 0;
    @observable isLoggedIn = false;
    @observable isVerified = false;
    @observable loggedInUser = null;
    deviceToken = '';

    constructor(snackbar) {
        this.snackbar = snackbar;
        this.deviceToken = localStorage.getItem('deviceToken') || '';
        const phoneNumber = localStorage.getItem('phoneNumber');
        const authClientId = localStorage.getItem('authClientId');
        const authToken = localStorage.getItem('authToken');

        if (phoneNumber && authClientId && authToken) {
            this.loggedInUser = {
                phoneNumber,
                authClientId,
                authToken,
            };
            this.isLoggedIn = true;
        } else {
            this.loggedInUser = null;
            this.isLoggedIn = false;
        }

        if (this.deviceToken === '' || isTokenExpired(this.deviceToken)) {
            requestDeviceToken()
                .then(data => {
                    this.deviceToken = data.ok.deviceToken;
                    localStorage.setItem('deviceToken', this.deviceToken);
                })
                .catch(err => {
                    console.log('[requestDeviceToken failed]', err);
                    this.deviceToken = '';
                    this.showSnackMsg('Device Token generation is failed.');
                });
        }
        refreshToken();
    }


    @action.bound requestAuthCode(phoneNumber) {
        this.isVerified = false;
        return new Promise((resolve, reject) => {
            if (this.deviceToken === '') {
                this.showSnackMsg('Device Token is invalid');
                reject(new Error('Device Token is invalid'));
            } else {
                requestAuthenticationCode(this.deviceToken, phoneNumber)
                    .then(data => {
                        localStorage.setItem('phoneNumber', phoneNumber || '');
                        // console.log('requestAuthenticationCode: ', data);
                        this.showSnackMsg(data.message);
                        resolve(true);
                    })
                    .catch(err => {
                        console.log('[requestAuthenticationCode failed]', err);
                        this.showSnackMsg('SMS request is failed.');
                        reject(err);
                    });
            }
        });
    }

    @action.bound confirmAuthCode(securityCode) {
        return new Promise((resolve, reject) => {
            if (this.deviceToken === '') {
                this.showSnackMsg('Device Token is invalid.');
                reject(new Error('Device Token is invalid.'));
            } else if (securityCode === '') {
                this.showSnackMsg('SecurityCode is invalid.');
                reject(new Error('SecurityCode is invalid.'));
            } else {
                confirmAuthenticationCode(this.deviceToken, securityCode)
                    .then(data => {
                        this.isLoggedIn = true;
                        this.isVerified = true;
                        const token = data.ok.sessionToken;
                        const payload = decode(token);

                        const phoneNumber = localStorage.getItem('phoneNumber');
                        const authClientId = payload.sub;

                        localStorage.setItem('authClientId', payload.sub || '');
                        localStorage.setItem('authToken', token);
                        localStorage.setItem('signedin', true);
                        const cookies = new Cookies();
                        cookies.set('phoneNumber', localStorage.getItem('phoneNumber'), { path: '/' });
                        this.showSnackMsg('Verification is success.');
                        this.deviceToken = localStorage.getItem('deviceToken') || '';

                        if (phoneNumber && authClientId && token) {
                            this.loggedInUser = {
                                phoneNumber,
                                authClientId,
                                token,
                            };
                            this.isLoggedIn = true;
                        } else {
                            this.loggedInUser = null;
                            this.isLoggedIn = false;
                        }
                        resolve(true);
                    })
                    .catch(err => {
                        console.log('[confirmAuthenticationCode failed]', err);
                        this.showSnackMsg('Code confirmation is failed.');
                        reject(new Error('Code confirmation is failed.'));
                    });
            }
        });
    }

    @action.bound refreshSecurityToken() {
        return new Promise((resolve, reject) => {
            if (this.deviceToken === '') {
                this.showSnackMsg('Device Token is invalid.');
                reject(new Error('Device Token is invalid.'));
            } else {
                refreshSecurityToken(this.deviceToken)
                    .then(data => {
                        const token = data.ok.sessionToken;
                        const payload = decode(token);

                        localStorage.setItem('authClientId', payload.sub || '');
                        localStorage.setItem('authToken', token);
                        resolve(true);
                    })
                    .catch(err => {
                        console.log('[refreshSecurityToken failed]', err);
                        this.showSnackMsg('Refresh request is failed.');
                        reject(new Error('Refresh request is failed.'));
                    });
            }
        });
    }

    @action.bound showSnackMsg(msg) {
        this.snackbar({
            message: () => (
                <React.Fragment>
                    <span><b>{msg}</b></span>
                </React.Fragment>
            ),
        });
    }
}

export default (snackbar) => {
    const store = new SMSAuthStore(snackbar);
    return store;
};