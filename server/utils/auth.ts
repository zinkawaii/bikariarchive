import { createError, type RequestEvent } from "nuxt/server";

export async function validateIdentity(event: RequestEvent) {
  const session = await getUserSession(event);

  if (session.user?.role !== "admin") {
    throw createError({ status: 403 });
  }
}
