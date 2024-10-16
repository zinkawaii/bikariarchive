import { defineNuxtModule } from "nuxt/kit";
import { ProxyAgent, setGlobalDispatcher } from "undici";

const dispatcher = new ProxyAgent({ uri: new URL(process.env.HTTPS_PROXY).toString() });
setGlobalDispatcher(dispatcher);

export default defineNuxtModule({});