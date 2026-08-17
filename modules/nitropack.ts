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

      // @nuxt/image, nuxt-auth-utils > #imports
      imports.imports = [
        ...imports.imports ?? [],
        { from: "h3", name: "createError" },
        { from: "nitro/runtime-config", name: "useRuntimeConfig" },
      ];

      // nuxt-auth-utils > nitropack/runtime
      virtual["nitropack/runtime"] = genExport("nitro", [
        { name: "definePlugin", as: "defineNitroPlugin" },
      ]);
    });
  },
});
