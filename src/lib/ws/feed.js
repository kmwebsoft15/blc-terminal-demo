import {
    switchMap, filter, map, tap, retry, finalize
} from 'rxjs/operators';
import { never } from 'rxjs';
import { getMarketConnection } from './ws-connection';

const changeBehavior = (cmd, kind, unsubscribe) => connection => {
    if (!connection) return never();

    connection.ws.send(JSON.stringify(cmd));

    return connection.messages.pipe(
        filter(x => x.event === kind),
        map(x => x.data)
    );
};

export const getOrderBookBreakdowns = ({
    symbol, levels, throttleMs, exchanges,
}) => {
    return getMarketConnection().pipe(
        switchMap(
            changeBehavior(
                {
                    breakdownRequest: {
                        symbols: [symbol],
                        levels,
                        throttleMs,
                        exchanges,
                    },
                },
                'breakdown',
                { breakdownUnsubscribe: {} }
            )
        ),
        tap(null, console.warn),
        retry()
    );
};

export const getOrderBookDataFeed = ({
    symbol,
    levels,
    throttleMs,
    min,
    max,
    exchanges,
}) => {
    return getMarketConnection().pipe(
        switchMap(
            changeBehavior(
                {
                    marketDataRequest: {
                        symbols: [symbol],
                        levels,
                        throttleMs,
                        min,
                        max,
                        exchanges,
                    },
                },
                'orderBook',
                { marketDataUnsubscribe: {} }
            )
        ),
        tap(null, console.warn),
        retry()
    );
};
