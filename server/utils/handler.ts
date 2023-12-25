import type { EventHandler, EventHandlerRequest } from "h3";

export const defineCustomHandler = <T extends EventHandlerRequest, D> (
    handler: EventHandler<T, D>
): EventHandler<T, D> => defineEventHandler<T>(async (event) => {
    try {
        const res = await handler(event);
        return res;
    }
    catch (err) {
        console.error(err);
        event.node.res.writeHead(err.statusCode ?? 500).end();
    }
});