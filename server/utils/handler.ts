import type { H3Event } from "h3";
import type { CachedEventHandlerOptions } from "nitropack";

interface Handler<T> {
    (event: H3Event<Request>, res: T): Awaited<any>;
}

const createHandler = <T extends BaseResponse>(
    handler: Handler<T>
) => async (event: H3Event) => {
    try {
        const res = { error: 0 } as T;
        res.error = await handler(event, res) || 0;
        return res;
    }
    catch (err) {
        console.error(err);
        sendError(event, err);
    }
};

export const defineJEventHandler = <T extends BaseResponse>(
    handler: Handler<T>
) => defineEventHandler(createHandler<T>(handler));

export const defineJCachedEventHandler = <T extends BaseResponse>(
    handler: Handler<T>,
    options?: CachedEventHandlerOptions
) => defineCachedEventHandler(createHandler<T>(handler), options);