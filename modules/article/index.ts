import { cp } from "node:fs/promises";
import { addPlugin, addServerPlugin, createResolver, defineNuxtModule } from "nuxt/kit";
import { article, entry, update } from "../../packages/article/src";
import { buildSearch } from "./search";

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

        const disposables: (() => Promise<unknown>)[] = [];
        for (const processor of [article, entry, update]) {
            await processor.build();
            if (nuxt.options.dev) {
                disposables.push(processor.watch());
            }
        }
        await buildSearch();

        nuxt.hook("close", async () => {
            await Promise.all(disposables.map((dispose) => dispose()));
        });

        nuxt.hook("nitro:build:public-assets", async () => {
            const source = resolve("../../.data");
            const target = resolve("../../.netlify/functions-internal/server/.data");
            await cp(source, target, {
                recursive: true,
            });
        });
    },
});
