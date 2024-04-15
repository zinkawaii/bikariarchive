import type { EventHandler, EventHandlerRequest } from "h3";

export const defineCustomHandler = <T extends BaseResponse> (
    handler: (event: H3Event<Request>, res: T) => Response
) => defineEventHandler(async (event) => {
    try {
        const res: T = { error: 0 };
        await handler(event, res);
        return res;
    }
    catch (err) {
        console.error(err);
        event.node.res.writeHead(err.statusCode ?? 500).end();
    }
});