import { addPlugin, addServerPlugin, addVitePlugin, createResolver, defineNuxtModule } from "nuxt/kit";
import { relative } from "pathe";
import { article, entry, update } from "../../packages/article/src";
import { buildSearch } from "./search";
import vite from "./vite";

export default defineNuxtModule({
    meta: {
        name: "@bikari/article",
    },
    async setup(options, nuxt) {
        const { resolve } = createResolver(import.meta.url);

        addPlugin({ src: resolve("runtime/client") });

        addServerPlugin(resolve("runtime/server"));

        addVitePlugin(vite);

        ((nuxt.options.typescript.tsConfig.vueCompilerOptions ??= {}).plugins ??= []).push({
            name: relative(nuxt.options.buildDir, resolve("volar.cts")),
        });

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
    },
});
