import { type H3Event, HTTPError } from "nitro/h3";

export async function validateIdentity(event: H3Event): Promise<void> {
  const session = await getUserSession(event);

  if (session.user?.role !== "admin") {
    throw new HTTPError({ statusCode: 403 });
  }
}
