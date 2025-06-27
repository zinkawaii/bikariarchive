import { TraversalError } from "arktype";
import type { H3Event } from "h3";
import type { CachedEventHandlerOptions } from "nitropack";
import type { BaseResponse } from "../types";

interface Handler<T> {
    (event: H3Event<Request>, res: T): Awaited<any>;
}

const createHandler = <T extends BaseResponse>(
    handler: Handler<T>,
) => async (event: H3Event) => {
    try {
        const res = { error: 0 } as T;
        res.error = await handler(event, res) || 0;
        return res;
    }
    catch (err) {
        let status: number;
        let data: unknown;

        if (err instanceof TraversalError) {
            status = 400;
            data = err.message;
        }
        else if (isError(err)) {
            status = err.statusCode;
            data = err.data;
        }
        else {
            status = 500;
            data = err;
        }

        console.error(err);
        sendError(event, createError({
            status,
            data: import.meta.dev ? data : void 0,
        }));
    }

    //防止类型推断返回空值
    return {} as T;
};

export const defineJEventHandler = <T extends BaseResponse>(
    handler: Handler<T>,
) => defineEventHandler(createHandler<T>(handler));

export const defineJCachedEventHandler = <T extends BaseResponse>(
    handler: Handler<T>,
    options?: CachedEventHandlerOptions,
) => defineCachedEventHandler(createHandler<T>(handler), options);

export const defineJThrottledEventHandler = <T extends BaseResponse>(
    handler: Handler<T>,
    delay: number,
) => {
    let timer: NodeJS.Timeout | undefined;
    function throttledHandler(this: unknown, ...args: Parameters<typeof handler>) {
        if (!timer) {
            timer = setTimeout(() => {
                timer = void 0;
            }, delay);
            return handler.apply(this, args);
        }
        throw createError({
            statusCode: 429,
        });
    }
    return defineEventHandler(createHandler<T>(throttledHandler));
};
