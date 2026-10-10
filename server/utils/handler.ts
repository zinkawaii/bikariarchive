import { defineHandler, type EventHandler, type EventHandlerRequest } from "nitro/h3";
import { createError } from "nuxt/server";

export function defineJThrottledHandler<R extends EventHandlerRequest, T = {}>(
  handler: EventHandler<R, T>,
  delay: number,
) {
  let timer: NodeJS.Timeout | undefined;

  return defineHandler((...args: Parameters<typeof handler>) => {
    if (!timer) {
      timer = setTimeout(() => {
        timer = void 0;
      }, delay);
      return handler(...args);
    }
    throw createError({ status: 429 });
  });
}
