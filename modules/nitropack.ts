import { defineNuxtModule } from "@nuxt/kit";
import { genExport } from "knitwork";

export default defineNuxtModule({
  meta: {
    name: "@bikari/nitropack",
  },
  setup(options, nuxt) {
    nuxt.hook("nitro:config", (config) => {
      const imports = config.imports ||= {};
      const virtual = config.virtual ||= {};

      // @nuxt/image > #imports
      imports.imports = [
        ...imports.imports ?? [],
        { from: "nitro/runtime-config", name: "useRuntimeConfig" },
      ];

      // @nuxtjs/robots, @nuxtjs/sitemap, nuxt-schema-org, nuxt-seo-utils, nuxt-site-config > nitropack/runtime
      virtual["nitropack/runtime"] = [
        genExport("nitro", [{ name: "definePlugin", as: "defineNitroPlugin" }]),
        genExport("nitro/app", ["getRouteRules", "useNitroApp"]),
        genExport("nitro/cache", ["defineCachedFunction"]),
        genExport("nitro/runtime-config", ["useRuntimeConfig"]),
      ].join("\n");
    });
  },
});
