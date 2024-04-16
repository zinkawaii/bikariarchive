import type { H3Event } from "h3";

export const defineCustomHandler = <T extends BaseResponse> (
    handler: (event: H3Event<Request>, res: T) => Promise<number | void>
) => defineEventHandler(async (event) => {
    try {
        const res = { error: 0 } as T;
        res.error = await handler(event, res) || 0;
        return res;
    }
    catch (err) {
        console.error(err);
        event.node.res.writeHead(err.statusCode ?? 500).end();
    }
});