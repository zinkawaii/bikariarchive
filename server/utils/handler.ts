import { TraversalError } from "arktype";
import { defineCachedHandler } from "nitro/cache";
import { defineEventHandler, type EventHandlerRequest, type H3Event } from "nitro/h3";
import { createError, isNuxtError } from "nuxt/server";
import type { CachedEventHandlerOptions } from "nitro/types";

interface Handler<R extends EventHandlerRequest, T> {
  (event: H3Event<R>, res: T): Awaited<unknown>;
}

const createHandler = <R extends EventHandlerRequest, T>(handler: Handler<R, T>) => async (event: H3Event<R>) => {
  try {
    const res = {} as T;
    return await handler(event as H3Event<R>, res) as T ?? res;
  }
  catch (err) {
    if (isNuxtError(err)) {
      throw err;
    }

    let status: number;
    let data: unknown;

    if (err instanceof TraversalError) {
      status = 400;
      data = err.message;
    }
    else {
      status = 500;
      data = err;
    }

    throw createError({
      status,
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
    throw createError({ status: 429 });
  }
  return defineEventHandler(createHandler<R, T>(throttledHandler));
}
