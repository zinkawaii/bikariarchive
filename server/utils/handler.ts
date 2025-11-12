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
        const res = {} as T;
        const code = await handler(event, res);
        if (code !== void 0) {
            throw code;
        }
        return res;
    }
    catch (err) {
        if (isError(err)) {
            throw err;
        }

        let statusCode: number;
        let statusMessage: string | undefined;
        let data: unknown;

        if (err instanceof TraversalError) {
            statusCode = 400;
            data = err.message;
        }
        else if (typeof err === "number") {
            statusCode = 400;
            statusMessage = err.toString();
        }
        else {
            statusCode = 500;
            data = err;
        }

        throw createError({
            statusCode,
            statusMessage,
            data: import.meta.dev ? data : void 0,
        });
    }
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
