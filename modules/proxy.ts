import { defineNuxtModule } from "nuxt/kit";
import { ProxyAgent, setGlobalDispatcher } from "undici";

if (process.env.HTTPS_PROXY) {
    const dispatcher = new ProxyAgent({ uri: new URL(process.env.HTTPS_PROXY).toString() });
    setGlobalDispatcher(dispatcher);
}

export default defineNuxtModule({});