import { TraversalError } from "arktype";
import { defineCachedHandler } from "nitro/cache";
import { defineEventHandler, type EventHandlerRequest, type H3Event, HTTPError } from "nitro/h3";
import type { CachedEventHandlerOptions } from "nitro/types";

interface Handler<R extends EventHandlerRequest, T> {
    (event: H3Event<R>, res: T): Awaited<unknown>;
}

const createHandler = <R extends EventHandlerRequest, T>(handler: Handler<R, T>) => async (event: H3Event<R>) => {
    try {
        const res = {} as T;
        return await handler(event, res) ?? res;
    }
    catch (err) {
        if (HTTPError.isError(err)) {
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

        throw new HTTPError({
            statusCode,
            statusMessage,
            data: import.meta.dev ? data : void 0,
        });
    }
};

export function defineJEventHandler<R extends EventHandlerRequest, T = {}>(
    handler: Handler<R, T>,
) {
    return defineEventHandler(createHandler<R, T>(handler));
}

export function defineJCachedEventHandler<R extends EventHandlerRequest, T = {}>(
    handler: Handler<R, T>,
    options?: CachedEventHandlerOptions,
) {
    return defineCachedHandler(createHandler<R, T>(handler), options);
}

export function defineJThrottledEventHandler<R extends EventHandlerRequest, T = {}>(
    handler: Handler<R, T>,
    delay: number,
) {
    let timer: NodeJS.Timeout | undefined;
    function throttledHandler(this: unknown, ...args: Parameters<typeof handler>) {
        if (!timer) {
            timer = setTimeout(() => {
                timer = void 0;
            }, delay);
            return handler.apply(this, args);
        }
        throw new HTTPError({
            statusCode: 429,
        });
    }
    return defineEventHandler(createHandler<R, T>(throttledHandler));
}
