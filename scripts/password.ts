// eslint-disable-next-line antfu/no-import-dist, antfu/no-import-node-modules-by-path
import { hashPassword } from "../node_modules/nuxt-auth-utils/dist/runtime/server/utils/password.js";

const hash = await hashPassword(process.argv[2]);
console.log(hash);
