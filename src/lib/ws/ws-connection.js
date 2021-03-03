import { Observable } from 'rxjs';
import {
    publishReplay,
    refCount,
    retry,
    repeat,
    tap,
    publish
} from 'rxjs/operators';
import { WS_MARKET_URL } from '../../config/constants';

let marketConnect;

const createMarketConnection = () => {
    return Observable.create(obs => {
        const ws = new WebSocket(WS_MARKET_URL);

        ws.onclose = () => {
            obs.next(null);
            obs.complete();
        };

        const messages = Observable.create(obsM => {
            ws.onmessage = m => obsM.next(JSON.parse(m.data));
        }).pipe(
            publish(),
            refCount()
        );

        ws.onopen = () => obs.next({ ws, messages });

        return () => {
            if (ws.close) ws.close();
        };
    }).pipe(
        tap(null, console.warn),
        // retry if there is an error
        retry(),
        // repeat if connection closed intentionally (without errors)
        repeat(),
        // remember last connection
        publishReplay(1),
        // calculate subscriptions count and close subscription when latest consumer unsubscribed
        refCount()
    );
};

export const getMarketConnection = () => {
    if (!marketConnect) {
        marketConnect = createMarketConnection();
    }
    return marketConnect;
};
