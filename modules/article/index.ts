import { article, entry, update } from "@bikari/article";
import { addPlugin, addServerPlugin, createResolver, defineNuxtModule } from "nuxt/kit";

export default defineNuxtModule({
    meta: {
        name: "@bikari/article",
    },
    async setup(options, nuxt) {
        const { resolve } = createResolver(import.meta.url);

        addPlugin({
            src: resolve("runtime/client"),
        });

        addServerPlugin(resolve("runtime/server"));

        await article.build();
        await entry.build();
        await update.build();

        if (nuxt.options.dev) {
            article.watch();
            entry.watch();
            update.watch();
        }
    },
});
