import { type H3Event, useSession } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";

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
