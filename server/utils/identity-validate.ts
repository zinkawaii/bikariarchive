import type { H3Event } from "h3";

export function identityValidate(event: H3Event, identity: number) {
    const { session } = event.context;

    if ((session.identity || 0) < identity) {
        throw createError({
            status: 403
        });
    }
}