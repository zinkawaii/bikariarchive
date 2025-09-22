import type { H3Event } from "h3";

export interface Session {
    uid?: number;
    identity?: number;
}

export function readSession(event: H3Event) {
    const config = useRuntimeConfig();
    return useSession<Session>(event, {
        maxAge: 86400 * 30,
        password: config.session.password,
    });
}
