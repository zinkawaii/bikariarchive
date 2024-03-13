import { defineNuxtModule } from "nuxt/kit";
import article from "./lib/article";
import entry from "./lib/entry";

export default defineNuxtModule({
    meta: {
        name: "@bikari/process"
    },
    async setup(options, nuxt) {
        await article.build();
        await entry.build();

        if (nuxt.options.dev) {
            article.watch();
        }
    }
});