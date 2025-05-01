import type { H3Event } from "h3";

export function identityValidate(event: H3Event, identity: number) {
    const { session } = event.context;

    if ((session.identity || 0) < identity) {
        throw createError({
            status: 403,
        });
    }
}

export function myselfValidate(event: H3Event, uid: number) {
    const { session } = event.context;

    if (session.uid !== uid && (session.identity || 0) < 9) {
        throw createError({
            status: 403,
        });
    }
}
