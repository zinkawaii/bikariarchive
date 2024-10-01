import { ZodError } from "zod";
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
        if (err instanceof ZodError) {
            sendError(event, createError({
                status: 400,
                data: import.meta.dev ? err.issues : void 0
            }));
        }
        else {
            console.error(err);
            sendError(event, err);
        }
    }
};

export const defineJEventHandler = <T extends BaseResponse>(
    handler: Handler<T>
) => defineEventHandler(createHandler<T>(handler));

export const defineJCachedEventHandler = <T extends BaseResponse>(
    handler: Handler<T>,
    options?: CachedEventHandlerOptions
) => defineCachedEventHandler(createHandler<T>(handler), options);

export const defineJThrottledEventHandler = <T extends BaseResponse>(
    handler: Handler<T>,
    delay: number
) => {
    let timer: NodeJS.Timeout;
    function throttledHandler(this: unknown, ...args: Parameters<typeof handler>) {
        if (!timer) {
            timer = setTimeout(() => {
                timer = null;
            }, delay);
            return handler.apply(this, args);
        }
        throw createError({
            statusCode: 429
        });
    }
    return defineEventHandler(createHandler<T>(throttledHandler));
};