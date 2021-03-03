import axios from 'axios';

import {
    AUTH_SERVER_URL
} from '../../config/constants';

export const requestDeviceToken = () => axios.post(`${AUTH_SERVER_URL}/api/tokens/device`)
    .then(res => res.data)
    .catch(err => Promise.reject(err));

export const requestAuthenticationCode = (deviceToken, phoneNumber) =>
    axios.post(`${AUTH_SERVER_URL}/api/sms/send-code`, {
        deviceToken,
        phoneNumber,
    })
        .then(res => res.data)
        .catch(err => Promise.reject(err));

export const confirmAuthenticationCode = (deviceToken, securityCode) =>
    axios.post(`${AUTH_SERVER_URL}/api/sms/verify`, {
        deviceToken,
        secretCode: securityCode,
    })
        .then(res => res.data)
        .catch(err => Promise.reject(err));

export const refreshSecurityToken = (deviceToken) =>
    axios.post(`${AUTH_SERVER_URL}/api/tokens/session`, {
        deviceToken,
    })
        .then(res => res.data)
        .catch(err => Promise.reject(err));

