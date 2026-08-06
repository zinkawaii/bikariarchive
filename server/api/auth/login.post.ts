import { type } from "arktype";
import { HTTPError } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";

export type PostLoginBody = typeof schema.inferIn;

const schema = type({
  account: "0 < string <= 18",
  password: "12 <= string <= 64",
});

export default defineJThrottledEventHandler<{
  body: PostLoginBody;
}>(async (event) => {
  const config = useRuntimeConfig();
  const body = schema.assert(await event.req.json());

  // 账号
  if (body.account !== config.admin.account) {
    throw HTTPError.status(401);
  }

  // 明文密码
  if (config.admin.password !== "<!-- ??? -->") {
    if (body.password !== config.admin.password) {
      throw HTTPError.status(401);
    }
  }
  // 哈希密码
  else if (
    !config.admin.passwordHash.startsWith("$scrypt$") ||
    !await verifyPassword(config.admin.passwordHash, body.password)
  ) {
    throw HTTPError.status(401);
  }

  await setUserSession(event, {
    user: {
      role: "admin",
    },
    loggedInAt: new Date(),
  });
}, 1500);
