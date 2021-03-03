import 'react-virtualized/styles.css';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { getClientLive, getClientTrade } from './lib/bct-ws';
import * as serviceWorker from './serviceWorker';
import telegramLogin from './lib/tg-auth';

getClientLive();
getClientTrade()
.catch(e => console.log(e.message || 'can not getClientTrade'));
// TODO refactoring: do we need this?
telegramLogin();

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
