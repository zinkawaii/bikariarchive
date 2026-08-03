import { type } from "arktype";
import { useRuntimeConfig } from "nitro/runtime-config";

export type LoginBody = typeof schema.inferIn;

const schema = type({
  account: "0 < string <= 18",
  password: "12 <= string <= 64",
});

export default defineJThrottledEventHandler<{
  body: LoginBody;
}>(async (event) => {
  const config = useRuntimeConfig();
  const body = schema.assert(await event.req.json());

  if (
    body.account !== config.admin.account ||
    !config.admin.passwordHash.startsWith("$scrypt$") ||
    !await verifyPassword(config.admin.passwordHash, body.password)
  ) {
    throw 1;
  }

  await setUserSession(event, {
    user: {
      role: "admin",
    },
    loggedInAt: new Date(),
  });
}, 1000);
