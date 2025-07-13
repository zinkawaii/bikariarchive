/// <reference types="@kikiutils/nuxt-session" />

export interface BaseResponse {
    error: number;
}

declare module "@kikiutils/nuxt-session" {
    interface H3EventContextSession {
        uid: number;
        identity: number;
    }
}
