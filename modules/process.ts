import { defineNuxtModule } from "nuxt/kit";
import { article, entry } from "@bikari/process";

export default defineNuxtModule({
    meta: {
        name: "@bikari/process"
    },
    async setup(options, nuxt) {
        await article.build();
        await entry.build();

        if (nuxt.options.dev) {
            article.watch();
            entry.watch();
        }
    }
});