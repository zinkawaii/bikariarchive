import { type H3Event, HTTPError } from "nitro/h3";

export async function validateIdentity(event: H3Event) {
  const session = await getUserSession(event);

  if (session.user?.role !== "admin") {
    throw HTTPError.status(403);
  }
}

export async function isIdentityAdmin(event: H3Event) {
  const session = await getUserSession(event);
  return session.user?.role === "admin";
}
